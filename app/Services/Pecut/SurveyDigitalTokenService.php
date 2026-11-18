<?php

namespace App\Services\Pecut;

use App\Models\ExternalApiToken;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class SurveyDigitalTokenService
{
    private const SERVICE = 'survey_digital';
    private const LOCK = 'pecut:survey-digital:token-sync';

    public function record(): ?ExternalApiToken
    {
        return ExternalApiToken::where('service_name', self::SERVICE)->first();
    }

    // Web requests normally only read the database. Cron handles renewal.
    public function accessToken(): ?string
    {
        $row = $this->record();
        if ($row && $this->usable($row->access_token, $row->access_token_expires_at)) {
            return $row->access_token;
        }

        return $this->synchronize();
    }

    // If another process updated a rejected token, reuse its replacement.
    public function refreshAccessToken(?string $rejectedToken = null): ?string
    {
        return $this->synchronize(true, $rejectedToken);
    }

    public function synchronize(bool $force = false, ?string $rejectedToken = null): ?string
    {
        try {
            return $this->locked(function () use ($force, $rejectedToken) {
                $row = $this->record() ?? $this->initialize();
                $valid = $this->usable($row->access_token, $row->access_token_expires_at);
                $margin = max(60, min(3600, (int) config('services.survey_digital.refresh_before_seconds', 1800)));

                if ($valid && (($rejectedToken !== null && $row->access_token !== $rejectedToken)
                    || (! $force && $row->access_token_expires_at > time() + $margin))) {
                    return $row->access_token;
                }

                // Avoid public traffic repeatedly hammering an unavailable upstream.
                if ($row->last_error && $row->last_attempt_at && $row->last_attempt_at->timestamp > time() - 240) {
                    return $valid && $rejectedToken === null && $this->usable($row->access_token, $row->access_token_expires_at) ? $row->access_token : null;
                }

                $row->forceFill(['last_attempt_at' => now()])->save();
                $reason = 'refresh_missing_or_expired';

                if ($this->usable($row->refresh_token, $row->refresh_token_expires_at)) {
                    try {
                        $response = $this->post('/refresh-token', [
                            'refresh_token' => $row->refresh_token,
                        ]);
                        if ($this->successful($response)) {
                            $this->persist($row, $response->json(), false);
                            return $row->access_token;
                        }
                        if (! $this->isUnauthorized($response) && ! $this->invalidRefresh($response)) {
                            return $this->failure($row, 'refresh_http_'.$response->status(), $valid, $rejectedToken);
                        }
                        $reason = 'refresh_rejected';
                    } catch (Throwable) {
                        // No raw response, URL, exception or credentials in logs.
                        return $this->failure($row, 'refresh_request_or_response_failed', $valid, $rejectedToken);
                    }
                }

                if (! config('services.survey_digital.auto_login', false)) {
                    return $this->failure($row, $reason.'_manual_login_required', $valid, $rejectedToken);
                }

                try {
                    $path = config('services.survey_digital.login_path');
                    $username = $this->string(config('services.survey_digital.username'));
                    $password = config('services.survey_digital.password');
                    $field = config('services.survey_digital.login_username_field', 'username');
                    if (! is_string($path) || ! str_starts_with($path, '/') || str_starts_with($path, '//')
                        || ! $username || ! is_string($password) || $password === ''
                        || ! in_array($field, ['username', 'email'], true)) {
                        return $this->failure($row, 'login_configuration_incomplete', $valid, $rejectedToken);
                    }
                    $response = $this->post($path, [$field => $username, 'password' => $password]);
                    if (! $this->successful($response)) {
                        return $this->failure($row, 'login_http_'.$response->status(), $valid, $rejectedToken);
                    }
                    $this->persist($row, $response->json(), true);
                    return $row->access_token;
                } catch (Throwable) {
                    return $this->failure($row, 'login_request_or_response_failed', $valid, $rejectedToken);
                }
            });
        } catch (Throwable) {
            Log::warning('Survey Digital token synchronization unavailable.');
            return null;
        }
    }

    // Explicit recovery: replace persisted tokens with a fresh pair from .env.
    public function importConfiguredTokens(): void
    {
        $this->locked(function () {
            $access = $this->string(config('services.survey_digital.token'));
            $refresh = $this->string(config('services.survey_digital.refresh_token'));
            if (! $this->usable($access, self::expiry($access)) || ! $this->usable($refresh, self::expiry($refresh))) {
                throw new RuntimeException('Configured tokens must both have a future JWT exp.');
            }
            $row = $this->record() ?? new ExternalApiToken(['service_name' => self::SERVICE]);
            $this->savePair($row, $access, $refresh, ['last_error' => null, 'last_attempt_at' => null]);
            $this->clearLegacyCache();
        });
    }

    public static function expiry(?string $token): ?int
    {
        if (! $token || count($parts = explode('.', $token)) !== 3) {
            return null;
        }
        $decoded = base64_decode(strtr($parts[1], '-_', '+/'), true);
        if ($decoded === false) {
            return null;
        }
        $payload = json_decode($decoded, true);
        $exp = is_array($payload) ? ($payload['exp'] ?? null) : null;
        // Scheduling metadata only; the remote API validates the signature.
        return is_int($exp) && $exp > 0 ? $exp : null;
    }

    public function isUnauthorized(Response $response): bool
    {
        $json = $response->json();
        $json = is_array($json) ? $json : [];
        if ($response->status() === 401 || (in_array(Arr::get($json, 'status'), [401, '401'], true) || in_array(Arr::get($json, 'code'), [401, '401'], true))) {
            return true;
        }
        // A generic 403 is a permission error, not necessarily an expired token.
        return $this->hasTokenError($json);
    }

    private function hasTokenError(array $json): bool
    {
        $message = strtolower(($this->string(Arr::get($json, 'message')) ?? '').' '.($this->string(Arr::get($json, 'error')) ?? ''));
        foreach (['token expired', 'expired token', 'invalid token', 'token is expired', 'token is invalid', 'invalid refresh token', 'refresh token expired', 'refresh token is expired', 'refresh token is invalid', 'unauthenticated', 'unauthorized'] as $phrase) {
            if (str_contains($message, $phrase)) {
                return true;
            }
        }
        return false;
    }

    private function invalidRefresh(Response $response): bool
    {
        $json = $response->json();
        return $response->status() === 400 && is_array($json) && $this->hasTokenError($json);
    }

    private function successful(Response $response): bool
    {
        $json = $response->json();
        if (! $response->successful() || ! is_array($json) || $this->isUnauthorized($response)) {
            return false;
        }
        $status = $json['status'] ?? 200;
        return in_array($status, [200, '200'], true);
    }

    private function post(string $path, array $body): Response
    {
        $base = rtrim((string) config('services.survey_digital.url'), '/');
        if (! filter_var($base, FILTER_VALIDATE_URL) || parse_url($base, PHP_URL_SCHEME) !== 'https') {
            throw new RuntimeException('Survey Digital HTTPS URL required.');
        }
        return Http::acceptJson()->asJson()->withoutRedirecting()
            ->connectTimeout(5)->timeout(max(1, min(30, (int) config('services.survey_digital.timeout', 8))))
            ->post($base.$path, $body);
    }

    private function locked(callable $callback): mixed
    {
        // Shared DB lock for cron and web, independent of the default cache store.
        return Cache::store('database')->lock(self::LOCK, 120)->block(5, $callback);
    }

    private function initialize(): ExternalApiToken
    {
        // One-time migration of the active legacy cache, then fallback to .env.
        $access = $this->string(Cache::get('survey_digital_access_token')) ?? $this->string(config('services.survey_digital.token'));
        $refresh = $this->string(Cache::get('survey_digital_refresh_token')) ?? $this->string(config('services.survey_digital.refresh_token'));
        $row = new ExternalApiToken(['service_name' => self::SERVICE]);
        $this->savePair($row, $access, $refresh);
        $this->clearLegacyCache();
        return $row;
    }

    private function clearLegacyCache(): void
    {
        // Only after the encrypted database copy has been saved successfully.
        try {
            Cache::forget('survey_digital_access_token');
            Cache::forget('survey_digital_refresh_token');
        } catch (Throwable) {
            Log::warning('Survey Digital legacy cache cleanup failed.');
        }
    }

    private function persist(ExternalApiToken $row, array $json, bool $login): void
    {
        $access = $this->extract($json, ['data.token', 'data.access_token', 'data.accessToken', 'token', 'access_token', 'accessToken'], 'access_token_json_path');
        $refresh = $this->extract($json, ['data.refresh_token', 'data.refreshToken', 'refresh_token', 'refreshToken'], 'refresh_token_json_path');
        $refresh = $refresh ?? ($login ? null : $row->refresh_token);
        if (! $this->usable($access, self::expiry($access)) || ! $this->usable($refresh, self::expiry($refresh))) {
            throw new RuntimeException('Invalid JWT expiry in authentication response.');
        }
        // Both tokens and expiry values are updated in a single database write.
        $this->savePair($row, $access, $refresh, [
            $login ? 'last_login_at' : 'last_refresh_at' => now(),
            'last_error' => null,
        ]);
    }

    private function savePair(ExternalApiToken $row, ?string $access, ?string $refresh, array $extra = []): void
    {
        $row->forceFill(array_merge([
            'access_token' => $access,
            'refresh_token' => $refresh,
            'access_token_expires_at' => self::expiry($access),
            'refresh_token_expires_at' => self::expiry($refresh),
        ], $extra))->save();
    }

    private function failure(ExternalApiToken $row, string $reason, bool $valid, ?string $rejectedToken): ?string
    {
        $row->forceFill(['last_error' => $reason])->save();
        Log::warning('Survey Digital token renewal failed.', ['reason' => $reason]);
        return $valid && $rejectedToken === null && $this->usable($row->access_token, $row->access_token_expires_at) ? $row->access_token : null;
    }

    private function extract(array $json, array $paths, string $config): ?string
    {
        $custom = $this->string(config('services.survey_digital.'.$config));
        foreach (array_filter(array_merge([$custom], $paths)) as $path) {
            if ($token = $this->string(Arr::get($json, $path))) {
                return $token;
            }
        }
        return null;
    }

    private function usable(?string $token, ?int $expiry): bool
    {
        return $token !== null && $expiry !== null && $expiry > time();
    }

    private function string(mixed $value): ?string
    {
        return is_string($value) && trim($value) !== '' ? trim($value) : null;
    }
}
