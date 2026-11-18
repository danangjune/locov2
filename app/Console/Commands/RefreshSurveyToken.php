<?php

namespace App\Console\Commands;

use App\Services\Pecut\SurveyDigitalTokenService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Throwable;

class RefreshSurveyToken extends Command
{
    protected $signature = 'survey:refresh-token
        {--status : Show stored expiry and status without calling the API}
        {--force : Refresh now if possible}
        {--import-env : Replace stored tokens with a fresh pair configured in .env}';

    protected $description = 'Maintain Survey Digital authentication for PECUT';

    public function handle(SurveyDigitalTokenService $service): int
    {
        try {
            if (count(array_filter([$this->option('status'), $this->option('force'), $this->option('import-env')])) > 1) {
                $this->error('Choose only one option.');
                return self::FAILURE;
            }
            if ($this->option('import-env')) {
                $service->importConfiguredTokens();
                $this->info('Configured token pair imported.');
            } elseif (! $this->option('status')) {
                if (! $service->synchronize((bool) $this->option('force'))) {
                    $this->warn('Token synchronization did not return a usable token.');
                    return self::FAILURE;
                }
            }

            $row = $service->record();
            if (! $row) {
                $this->warn('No stored Survey Digital session.');
                return self::FAILURE;
            }
            $this->line('Access expires (WIB): '.$this->formatExpiry($row->access_token_expires_at));
            $this->line('Refresh expires (WIB): '.$this->formatExpiry($row->refresh_token_expires_at));
            if ($row->last_error) {
                $this->warn('Last renewal error: '.$row->last_error);
                return self::FAILURE;
            }
            if (! $row->access_token_expires_at || $row->access_token_expires_at <= time()) {
                $this->warn('Access token expired or missing.');
                return self::FAILURE;
            }
            $this->info('Access token has remaining lifetime.');
            return self::SUCCESS;
        } catch (Throwable) {
            $this->error('Survey Digital token command failed. Check migration, APP_KEY, cache lock and configuration.');
            return self::FAILURE;
        }
    }

    private function formatExpiry(?int $expiry): string
    {
        return $expiry ? Carbon::createFromTimestamp($expiry, 'Asia/Jakarta')->format('Y-m-d H:i:s') : '-';
    }
}
