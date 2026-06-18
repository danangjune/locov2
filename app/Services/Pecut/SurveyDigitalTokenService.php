<?php

namespace App\Services\Pecut;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class SurveyDigitalTokenService
{
    private string $accessTokenKey = 'survey_digital_access_token';
    private string $refreshTokenKey = 'survey_digital_refresh_token';

    public function accessToken(): ?string
    {
        $token = Cache::get($this->accessTokenKey)
            ?: config('services.survey_digital.token');

        return $this->blankToNull($token);
    }

    public function refreshToken(): ?string
    {
        $token = Cache::get($this->refreshTokenKey)
            ?: config('services.survey_digital.refresh_token');

        return $this->blankToNull($token);
    }

    public function refreshAccessToken(): ?string
    {
        $refreshUrl = $this->blankToNull(config('services.survey_digital.url')) . '/refresh-token';
        $refreshToken = $this->refreshToken();

        if (! $refreshUrl || ! $refreshToken) {
            Log::warning('Survey Digital refresh token skipped: refresh URL or token is empty.');
            return null;
        }

        try {
            $timeout = (int) config('services.survey_digital.timeout', 8);
            $refreshTokenField = config('services.survey_digital.refresh_token_field', 'refresh_token');

            $response = Http::timeout($timeout)
                ->acceptJson()
                ->post($refreshUrl, [
                    $refreshTokenField => $refreshToken,
                ]);

            if (! $response->successful()) {
                Log::warning('Survey Digital refresh token failed.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return null;
            }

            $json = $response->json() ?: [];

            $newAccessToken = $this->extractAccessToken($json);
            $newRefreshToken = $this->extractRefreshToken($json);

            if (! $newAccessToken) {
                Log::warning('Survey Digital refresh token response has no access token.', [
                    'body' => $json,
                ]);

                return null;
            }

            Cache::forever($this->accessTokenKey, $newAccessToken);

            if ($newRefreshToken) {
                Cache::forever($this->refreshTokenKey, $newRefreshToken);
            }

            return $newAccessToken;
        } catch (Throwable $exception) {
            Log::error('Survey Digital refresh token exception.', [
                'message' => $exception->getMessage(),
            ]);

            return null;
        }
    }

    public function isUnauthorized(Response $response): bool
    {
        if (in_array($response->status(), [401, 403], true)) {
            return true;
        }

        $json = $response->json() ?: [];

        $status = (int) Arr::get($json, 'status');
        $code = (int) Arr::get($json, 'code');
        $message = strtolower((string) Arr::get($json, 'message'));
        $error = strtolower((string) Arr::get($json, 'error'));

        return in_array($status, [401, 403], true)
            || in_array($code, [401, 403], true)
            || str_contains($message, 'token expired')
            || str_contains($message, 'expired token')
            || str_contains($message, 'invalid token')
            || str_contains($message, 'unauthorized')
            || str_contains($message, 'unauthenticated')
            || str_contains($error, 'token expired')
            || str_contains($error, 'invalid token')
            || str_contains($error, 'unauthorized');
    }

    public function forgetCachedTokens(): void
    {
        Cache::forget($this->accessTokenKey);
        Cache::forget($this->refreshTokenKey);
    }

    private function extractAccessToken(array $json): ?string
    {
        $configuredPath = $this->blankToNull(config('services.survey_digital.access_token_json_path'));

        $paths = array_filter([
            $configuredPath,
            'data.access_token',
            'data.token',
            'data.accessToken',
            'access_token',
            'token',
            'accessToken',
        ]);

        foreach ($paths as $path) {
            $token = $this->blankToNull(Arr::get($json, $path));

            if ($token) {
                return $token;
            }
        }

        return null;
    }

    private function extractRefreshToken(array $json): ?string
    {
        $configuredPath = $this->blankToNull(config('services.survey_digital.refresh_token_json_path'));

        $paths = array_filter([
            $configuredPath,
            'data.refresh_token',
            'data.refreshToken',
            'refresh_token',
            'refreshToken',
        ]);

        foreach ($paths as $path) {
            $token = $this->blankToNull(Arr::get($json, $path));

            if ($token) {
                return $token;
            }
        }

        return null;
    }

    private function blankToNull(mixed $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }
}
