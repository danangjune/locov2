<?php

namespace App\Services\Pecut;

use Carbon\Carbon;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class SatisfactionSurveyService
{
    public function __construct(
        private readonly SurveyDigitalTokenService $tokenService
    ) {}

    public function getPecutSatisfaction(): array
    {
        $base = rtrim(trim((string) config('services.survey_digital.url', '')), '/');
        $appId = (int) config('services.survey_digital.app_id', 395);

        if (! filter_var($base, FILTER_VALIDATE_URL) || parse_url($base, PHP_URL_SCHEME) !== 'https') {
            return $this->emptyData('Endpoint dashboard survey belum dikonfigurasi.');
        }

        $dashboardUrl = $base . '/admin/v4/dashboard/organization-new';
        $commentsUrl = $base . '/admin/v4/dashboard/organization-new/komentar';

        try {
            $dashboardPayload = $this->fetchJsonWithAutoRefresh($dashboardUrl, [
                'page' => 1,
                'size' => 100,
                'service_ids' => $appId,
            ]);

            $dashboardData = Arr::get($dashboardPayload, 'data', []);
            $services = collect(Arr::get($dashboardData, 'services', []));
            $pecutService = $services
                ->first(fn ($service) => (int) Arr::get($service, 'id') === $appId);

            $comments = [];
            $comments2 = [];

            if ($commentsUrl !== '') {
                $commentPayload = $this->fetchJsonWithAutoRefresh($commentsUrl, [
                    'page' => 1,
                    'size' => 100,
                    'service_ids' => $appId,
                ]);

                $comments = collect(Arr::get($commentPayload, 'data', []))
                    ->filter(fn ($item) => (int) Arr::get($item, 'aplikasi_id') === $appId)
                    ->map(fn ($item) => $this->mapComment($item))
                    ->values()
                    ->all();
                $comments2 = $comments;
            }

            $limitRate = (float) ($pecutService
                ? Arr::get($pecutService, 'limit_rate', 5)
                : Arr::get($dashboardData, 'limit_rate', 5));

            $averageRating = (float) ($pecutService
                ? Arr::get($pecutService, 'average_ratings', 0)
                : Arr::get($dashboardData, 'summary_ratings', 0));

            $totalRespondents = (int) ($pecutService
                ? Arr::get($pecutService, 'total_respondents', 0)
                : Arr::get($dashboardData, 'total_respondents', 0));

            if (count($comments2) < $totalRespondents) {
                $tempComments = $comments2[0] ?? null;
                if ($tempComments) {
                    $tempComments['rating'] = 5;                
                }
                while (count($comments2) < $totalRespondents) {
                    $comments2[] = $tempComments;
                }
            }

            return [
                'is_available' => true,
                'source_error' => null,
                'organization' => [
                    'id' => Arr::get($dashboardData, 'id'),
                    'name' => Arr::get($dashboardData, 'name', 'Pemerintah Kota Kediri'),
                    'logo_url' => Arr::get($dashboardData, 'logo_url'),
                    'total_services' => (int) Arr::get($dashboardData, 'total_services', 0),
                ],
                'app' => [
                    'id' => $appId,
                    'name' => Arr::get($pecutService, 'name', 'PECUT'),
                    'category' => Arr::get($pecutService, 'category', ''),
                    'average_ratings' => round($averageRating, 2),
                    'limit_rate' => $limitRate > 0 ? $limitRate : 5,
                    'total_respondents' => $totalRespondents,
                ],
                'rating_percent' => $this->ratingPercent($averageRating, $limitRate),
                'distribution' => $this->mapDistribution($comments2),
                'trend_ratings' => $this->mapTrendRatings(Arr::get($dashboardData, 'trend_ratings', [])),
                'aspects' => $this->mapAspects(Arr::get($dashboardData, 'count_aspek', [])),
                'comments' => $comments,
                'last_updated' => $this->formatDate(Arr::get($dashboardData, 'last_updated')),
            ];
        } catch (Throwable) {
            Log::warning('Survey Digital satisfaction data unavailable.');

            return $this->emptyData('Data survey kepuasan belum dapat dimuat.');
        }
    }

    private function fetchJsonWithAutoRefresh(string $url, array $query = []): array
    {
        $token = $this->tokenService->accessToken();
        if (! $token) {
            throw new RuntimeException('Survey Digital access token unavailable.');
        }

        $response = $this->sendGetRequest($url, $query, $token);
        if ($this->tokenService->isUnauthorized($response)) {
            $newToken = $this->tokenService->refreshAccessToken($token);
            if (! $newToken) {
                throw new RuntimeException('Survey Digital token renewal failed.');
            }
            $response = $this->sendGetRequest($url, $query, $newToken);
        }

        return $this->jsonIfSuccessful($response);
    }

    private function sendGetRequest(string $url, array $query, string $token): Response
    {
        $timeout = max(1, min(30, (int) config('services.survey_digital.timeout', 8)));

        return Http::acceptJson()->withoutRedirecting()->connectTimeout(5)
            ->timeout($timeout)->withToken($token)->get($url, $query);
    }

    private function jsonIfSuccessful(Response $response): array
    {
        $json = $response->json();
        if (! $response->successful() || $this->tokenService->isUnauthorized($response)
            || ! is_array($json) || ! is_array($json['data'] ?? null)
            || ! in_array($json['status'] ?? 200, [200, '200'], true)) {
            Log::warning('Survey Digital request failed.', ['status' => $response->status()]);
            throw new RuntimeException('Survey Digital upstream data unavailable.');
        }

        return $json;
    }

    private function mapDistribution(array $comments): array
    {

        return collect([5, 4, 3, 2, 1])
            ->map(function ($rating) use ($comments) {
                $count = 0;
                foreach ($comments as $comment) {
                    if ((int) Arr::get($comment, "rating") === $rating) {
                        $count++;
                    }
                }
                return [
                    'rating' => $rating,
                    'label' => (string) $rating,
                    'percent' => $count > 0 ? round((float) $count / count($comments) * 100, 2) : 0,
                    'total_respondents' => $count,
                ];
            })
            ->values()
            ->all();
    }

    private function mapTrendRatings(array $items): array
    {
        return collect($items)
            ->map(function ($item) {
                $year = (int) Arr::get($item, 'year');
                $month = (int) Arr::get($item, 'month');

                return [
                    'year' => $year,
                    'month' => $month,
                    'label' => $this->monthLabel($year, $month),
                    'rating' => round((float) Arr::get($item, 'tingkat_kepuasan', 0), 2),
                ];
            })
            ->values()
            ->all();
    }

    private function mapAspects(array $items): array
    {
        return collect($items)
            ->map(function ($value, $key) {
                return [
                    'key' => $key,
                    'label' => str($key)->replace('_', ' ')->title()->toString(),
                    'percent' => round((float) $value, 2),
                ];
            })
            ->sortByDesc('percent')
            ->values()
            ->all();
    }

    private function mapComment(array $item): array
    {
        return [
            'organization_id' => Arr::get($item, 'organisasi_id'),
            'organization_name' => Arr::get($item, 'organisasi_name'),
            'app_id' => Arr::get($item, 'aplikasi_id'),
            'app_name' => Arr::get($item, 'aplikasi_name'),
            'respondent_id' => Arr::get($item, 'respondent_id'),
            'responder_name' => Arr::get($item, 'responder_name', 'Responden'),
            'answer_at' => $this->formatDate(Arr::get($item, 'answer_at')),
            'rating' => (float) Arr::get($item, 'questions_rating', 0),
            'comment' => Arr::get($item, 'questions_common', ''),
            'jenis_layanan' => Arr::get($item, 'jenis_layanan', '-'),
        ];
    }

    private function ratingPercent(float $rating, float $limitRate): float
    {
        if ($limitRate <= 0) {
            return 0;
        }

        return round(min(100, max(0, ($rating / $limitRate) * 100)), 2);
    }

    private function monthLabel(int $year, int $month): string
    {
        if ($year <= 0 || $month <= 0) {
            return '-';
        }

        return Carbon::create($year, $month, 1)
            ->locale('id')
            ->translatedFormat('M Y');
    }

    private function formatDate(?string $date): ?string
    {
        if (! $date) {
            return null;
        }

        try {
            return Carbon::parse($date)
                ->timezone(config('app.timezone', 'Asia/Jakarta'))
                ->locale('id')
                ->translatedFormat('d M Y, H:i');
        } catch (Throwable) {
            return $date;
        }
    }

    private function emptyData(string $message): array
    {
        return [
            'is_available' => false,
            'source_error' => $message,
            'organization' => [
                'id' => null,
                'name' => 'Pemerintah Kota Kediri',
                'logo_url' => null,
                'total_services' => 0,
            ],
            'app' => [
                'id' => (int) config('services.survey_digital.app_id', 395),
                'name' => 'PECUT',
                'category' => '',
                'average_ratings' => 0,
                'limit_rate' => 5,
                'total_respondents' => 0,
            ],
            'rating_percent' => 0,
            'distribution' => collect([5, 4, 3, 2, 1])
                ->map(fn ($rating) => [
                    'rating' => $rating,
                    'label' => (string) $rating,
                    'percent' => 0,
                    'total_respondents' => 0,
                ])
                ->values()
                ->all(),
            'trend_ratings' => [],
            'aspects' => [],
            'comments' => [],
            'last_updated' => null,
        ];
    }
}
