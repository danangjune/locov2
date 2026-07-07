<?php

namespace App\Services\Pecut;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class KediriKotaApiService
{
    public function getBerita(int $page = 1, int $perPage = 10, array $query = []): array
    {
        return $this->get('/api/berita', array_merge($query, [
            'page' => max(1, $page),
            'per_page' => max(1, min($perPage, 100)),
        ]));
    }

    public function getAgenda(int $page = 1, int $perPage = 50, array $query = []): array
    {
        return $this->get('/api/agenda', array_merge($query, [
            'page' => max(1, $page),
            'per_page' => max(1, min($perPage, 100)),
        ]));
    }

    public function getSekilas(): array
    {
        return $this->get('/api/tentang-kediri/sekilas');
    }

    public function getSejarah(): array
    {
        return $this->get('/api/tentang-kediri/sejarah');
    }

    public function get(string $path, array $query = []): array
    {
        $baseUrl = $this->baseUrl();
        $url = $baseUrl . '/' . ltrim($path, '/');

        if ($baseUrl === '') {
            return [
                'success' => false,
                'status' => 500,
                'source' => $url,
                'payload' => [],
                'error' => 'Konfigurasi APP_URL_KEDIRIKOTA belum tersedia.',
            ];
        }

        try {
            $response = Http::withoutVerifying()
                ->acceptJson()
                ->timeout($this->timeout())
                ->get($url, $this->cleanQuery($query));

            $payload = $response->json();

            if (! is_array($payload)) {
                $payload = [];
            }

            if (! $response->successful()) {
                return [
                    'success' => false,
                    'status' => $response->status(),
                    'source' => $url,
                    'payload' => $payload,
                    'error' => 'Gagal mengambil data dari API website Kota Kediri.',
                ];
            }

            $responseCode = (string) data_get($payload, 'responsCode', '200');

            if ($responseCode !== '200') {
                return [
                    'success' => false,
                    'status' => $response->status(),
                    'source' => $url,
                    'payload' => $payload,
                    'error' => data_get($payload, 'responsDesc') ?: 'Response API website Kota Kediri tidak berhasil.',
                ];
            }

            return [
                'success' => true,
                'status' => $response->status(),
                'source' => $url,
                'payload' => $payload,
                'error' => null,
            ];
        } catch (\Throwable $th) {
            return [
                'success' => false,
                'status' => 500,
                'source' => $url,
                'payload' => [],
                'error' => config('app.debug')
                    ? $th->getMessage()
                    : 'Terjadi kesalahan saat menghubungi API website Kota Kediri.',
            ];
        }
    }

    public function baseUrl(): string
    {
        $baseUrl = config('services.kediri_kota.base_url')
            ?: config('services.kediri_kota.url')
            ?: env('APP_URL_KEDIRIKOTA');

        return rtrim((string) $baseUrl, '/');
    }

    public function makeUrl(?string $path): ?string
    {
        $path = trim((string) $path);

        if ($path === '') {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        return $this->baseUrl() . '/' . ltrim($path, '/');
    }

    public function makeAgendaImageUrl(?string $banner): ?string
    {
        $banner = trim((string) $banner);

        if ($banner === '') {
            return null;
        }

        if (Str::startsWith($banner, ['http://', 'https://'])) {
            return $banner;
        }

        $cleanBanner = ltrim($banner, '/');

        if (Str::startsWith($cleanBanner, ['storage/', 'uploads/', 'images/'])) {
            return $this->baseUrl() . '/' . $cleanBanner;
        }

        return $this->baseUrl() . '/storage/agenda/' . $cleanBanner;
    }

    private function timeout(): int
    {
        return (int) config('services.kediri_kota.timeout', 10);
    }

    private function cleanQuery(array $query): array
    {
        return collect($query)
            ->filter(fn ($value) => $value !== null && $value !== '')
            ->all();
    }
}
