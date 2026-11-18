<?php

namespace Tests\Feature;

use App\Models\ExternalApiToken;
use App\Services\Pecut\SatisfactionSurveyService;
use App\Services\Pecut\SurveyDigitalTokenService;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SurveyDigitalTokenTest extends TestCase
{
    private const BASE = 'https://survey.example.test';

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'app.key' => 'base64:'.base64_encode(str_repeat('T', 32)),
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
            'cache.default' => 'array',
            'cache.stores.database.connection' => 'sqlite',
            'cache.stores.database.lock_connection' => 'sqlite',
            'services.survey_digital.url' => self::BASE,
            'services.survey_digital.auto_login' => false,
            'services.survey_digital.refresh_before_seconds' => 1800,
            'services.survey_digital.token' => null,
            'services.survey_digital.refresh_token' => null,
        ]);
        DB::purge('sqlite');
        foreach (['0001_01_01_000001_create_cache_table.php', '2026_11_18_000001_create_external_api_tokens_table.php'] as $file) {
            (require database_path('migrations/'.$file))->up();
        }
        Http::preventStrayRequests();
    }

    private function token(int $seconds, string $id): string
    {
        $payload = rtrim(strtr(base64_encode(json_encode(['exp' => time() + $seconds, 'jti' => $id])), '+/', '-_'), '=');
        return 'eyJhbGciOiJIUzI1NiJ9.'.$payload.'.test-signature';
    }

    private function seed(int $seconds = 3600, int $refreshSeconds = 604800): array
    {
        $access = $this->token($seconds, 'old-access');
        $refresh = $this->token($refreshSeconds, 'old-refresh');
        ExternalApiToken::create([
            'service_name' => 'survey_digital', 'access_token' => $access, 'refresh_token' => $refresh,
            'access_token_expires_at' => SurveyDigitalTokenService::expiry($access),
            'refresh_token_expires_at' => SurveyDigitalTokenService::expiry($refresh),
        ]);
        return [$access, $refresh];
    }

    public function test_import_legacy_cache_and_skip_healthy_token(): void
    {
        $access = $this->token(3600, 'legacy-access');
        $refresh = $this->token(604800, 'legacy-refresh');
        Cache::put('survey_digital_access_token', $access);
        Cache::put('survey_digital_refresh_token', $refresh);
        Http::fake();
        $service = app(SurveyDigitalTokenService::class);
        $this->assertSame($access, $service->synchronize());
        $this->assertSame($refresh, $service->record()->refresh_token);
        $this->assertNotSame($access, DB::table('external_api_tokens')->value('access_token'));
        $this->assertArrayNotHasKey('access_token', $service->record()->toArray());
        $this->assertFalse(Cache::has('survey_digital_access_token'));
        $this->assertFalse(Cache::has('survey_digital_refresh_token'));
        Http::assertNothingSent();
    }

    public function test_refresh_before_expiry_and_persist_rotated_pair(): void
    {
        [$old, $refresh] = $this->seed(600);
        $new = $this->token(86400, 'new-access');
        $rotated = $this->token(604800, 'new-refresh');
        Http::fake([self::BASE.'/refresh-token' => Http::response(['status' => 200, 'data' => ['token' => $new, 'refresh_token' => $rotated]])]);
        $service = app(SurveyDigitalTokenService::class);
        $this->assertSame($new, $service->synchronize());
        $this->assertSame($rotated, $service->record()->refresh_token);
        $this->assertSame($new, $service->refreshAccessToken($old));
        Http::assertSent(fn ($request) => $request->method() === 'POST' && $request['refresh_token'] === $refresh);
        Http::assertSentCount(1);
    }

    public function test_refresh_without_rotation_preserves_refresh_token(): void
    {
        [, $refresh] = $this->seed(-60);
        $new = $this->token(86400, 'new-access');
        Http::fake([self::BASE.'/refresh-token' => Http::response(['data' => ['token' => $new]])]);
        $service = app(SurveyDigitalTokenService::class);
        $this->assertSame($new, $service->accessToken());
        $this->assertSame($refresh, $service->record()->refresh_token);
    }

    public function test_transient_failure_keeps_old_valid_token_and_throttles_retry(): void
    {
        [$old, $refresh] = $this->seed(600);
        config(['services.survey_digital.auto_login' => true]);
        Http::fake([self::BASE.'/refresh-token' => Http::response(['message' => 'outage'], 503)]);
        $service = app(SurveyDigitalTokenService::class);
        $this->assertSame($old, $service->synchronize());
        $this->assertSame($old, $service->synchronize());
        $this->assertSame($refresh, $service->record()->refresh_token);
        $this->assertSame('refresh_http_503', $service->record()->last_error);
        Http::assertSentCount(1);
    }

    public function test_expired_refresh_requires_manual_login_by_default(): void
    {
        $this->seed(-60, -60);
        Http::fake();
        $service = app(SurveyDigitalTokenService::class);
        $this->assertNull($service->synchronize());
        $this->assertStringContainsString('manual_login_required', $service->record()->last_error);
        Http::assertNothingSent();
    }

    public function test_optional_login_uses_configured_contract(): void
    {
        $this->seed(-60, -60);
        config([
            'services.survey_digital.auto_login' => true, 'services.survey_digital.login_path' => '/login',
            'services.survey_digital.username' => 'integration-test', 'services.survey_digital.password' => 'test-only',
            'services.survey_digital.login_username_field' => 'username',
        ]);
        $new = $this->token(86400, 'login-access');
        $refresh = $this->token(604800, 'login-refresh');
        Http::fake([self::BASE.'/login' => Http::response(['status' => 200, 'data' => ['token' => $new, 'refresh_token' => $refresh]])]);
        $service = app(SurveyDigitalTokenService::class);
        $this->assertSame($new, $service->synchronize());
        $this->assertNotNull($service->record()->last_login_at);
        Http::assertSentCount(1);
    }

    public function test_status_command_does_not_call_api(): void
    {
        $this->seed();
        Http::fake();
        $this->assertSame(0, Artisan::call('survey:refresh-token', ['--status' => true]));
        Http::assertNothingSent();
    }

    public function test_permission_error_is_not_retried_as_expiry(): void
    {
        $this->seed();
        Http::fake([self::BASE.'/*' => Http::response(['status' => 403, 'message' => 'forbidden'], 403)]);
        $data = app(SatisfactionSurveyService::class)->getPecutSatisfaction();
        $this->assertFalse($data['is_available']);
        Http::assertSentCount(1);
    }

    public function test_unauthorized_request_refreshes_and_retries_once(): void
    {
        $this->seed();
        $new = $this->token(86400, 'new-access');
        Http::fakeSequence()->push(['status' => 401], 401)
            ->push(['data' => ['token' => $new]])
            ->push(['status' => 401], 401);
        $data = app(SatisfactionSurveyService::class)->getPecutSatisfaction();
        $this->assertFalse($data['is_available']);
        Http::assertSentCount(3);
    }
}
