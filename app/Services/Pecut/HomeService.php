<?php

namespace App\Services\Pecut;

use App\Http\Resources\AppLinkResource;
use App\Models\AppLink;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use App\Services\Pecut\HomeSectionContentService;
use App\Services\Pecut\HomeSlideContentService;

class HomeService
{
    public function getHomeData(Request $request): array
    {
        $apps = $this->getApps($request);
        $news = $this->getNews(10);
        $complaints = $this->getComplaints(6);
        $slides = app(HomeSlideContentService::class)->getSlides();

        return [
            'apps' => [
                'items' => $apps['items'],
                'meta' => $apps['meta'],
            ],
            'news' => [
                'items' => $news['items'],
                'meta' => $news['meta'],
            ],
            'complaints' => [
                'items' => $complaints['items'],
                'meta' => $complaints['meta'],
            ],
            'errors' => [
                'apps' => $apps['error'],
                'news' => $news['error'],
                'complaints' => $complaints['error'],
            ],
            'home_sections' => app(HomeSectionContentService::class)->getSections(),
            'slides' => $slides,
        ];
    }

    public function getApps(Request $request): array
    {
        try {
            $search = $request->query('search');
            $categoryId = $request->query('category_id');

            $query = AppLink::query()
                ->with(['urusan', 'category', 'app_from'])
                ->where('is_active', true)
                ->whereDoesntHave('children');

            if ($categoryId) {
                $query->where('category_id', $categoryId);
            } else {
                $query->whereIn('category_id', [1, 2]);
            }

            if ($search) {
                $query->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('alias', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            }

            $apps = $query
                ->orderByDesc('visit_count')
                ->orderByDesc('is_popular')
                ->orderBy('category_id')
                ->orderBy('name')
                ->get();

            AppLinkResource::withoutWrapping();
            $items = AppLinkResource::collection($apps)->resolve($request);
            $collection = collect($items);

            return [
                'items' => $items,
                'meta' => [
                    'total' => $collection->count(),
                    'public_total' => $collection->where('category_id', 1)->count(),
                    'asn_total' => $collection->where('category_id', 2)->count(),
                ],
                'error' => null,
            ];
        } catch (\Throwable $th) {
            return [
                'items' => [],
                'meta' => [
                    'total' => 0,
                    'public_total' => 0,
                    'asn_total' => 0,
                ],
                'error' => config('app.debug') ? $th->getMessage() : 'Gagal memuat data aplikasi.',
            ];
        }
    }

    public function getNews(int $limit = 10): array
    {
        $limit = max(1, min($limit, 30));

        try {
            $response = Http::withoutVerifying()
                ->timeout(30)
                ->get('https://kedirikota.go.id/api/berita');

            if (! $response->successful()) {
                return [
                    'items' => [],
                    'meta' => [
                        'source' => 'https://kedirikota.go.id/api/berita',
                        'status' => $response->status(),
                        'total' => 0,
                        'limit' => $limit,
                    ],
                    'error' => 'Gagal mengambil berita dari website resmi Kota Kediri.',
                ];
            }

            $payload = json_decode($response->body());
            $berita = isset($payload->berita) ? json_decode($payload->berita) : [];

            $items = collect($berita)
                ->take($limit)
                ->values()
                ->map(function ($item, $index) {
                    $id = $item->idpost ?? $item->id ?? ($index + 1);
                    $title = $this->cleanText($item->judul ?? $item->title ?? 'Berita Kota Kediri');
                    $slug = $item->judulurl ?? Str::slug($title);
                    $description = $this->cleanText($item->deskripsi ?? $item->isi ?? '');
                    $image = $this->normalizeBeritaImage($item->linkgambar ?? $item->gambar ?? null);
                    $dateRaw = $item->tanggal
                        ?? $item->tgl
                        ?? $item->tglpost
                        ?? $item->created_at
                        ?? null;

                    return [
                        'id' => $id,
                        'slug' => (string) $slug,
                        'title' => $title,
                        'date' => $this->formatDate($dateRaw),
                        'tag' => $this->cleanText($item->kategori ?? 'Kota Kediri'),
                        'excerpt' => $description ? Str::limit($description, 170) : Str::limit($title, 170),
                        'image' => $image,
                        'url' => "https://www.kedirikota.go.id/p/berita/{$id}/{$slug}",
                        'content' => array_values(array_filter([
                            $description ?: 'Informasi berita resmi Pemerintah Kota Kediri.',
                            'Baca berita lengkap melalui tautan website resmi Pemerintah Kota Kediri.',
                        ])),
                    ];
                })
                ->all();

            return [
                'items' => $items,
                'meta' => [
                    'source' => 'https://kedirikota.go.id/api/berita',
                    'total' => count($items),
                    'limit' => $limit,
                ],
                'error' => null,
            ];
        } catch (\Throwable $th) {
            return [
                'items' => [],
                'meta' => [
                    'source' => 'https://kedirikota.go.id/api/berita',
                    'total' => 0,
                    'limit' => $limit,
                ],
                'error' => config('app.debug') ? $th->getMessage() : 'Terjadi kesalahan saat mengambil berita.',
            ];
        }
    }

    public function getComplaints(int $limit = 6): array
    {
        $limit = max(1, min($limit, 20));
        $rows = $this->fetchAduanRows();

        if ($rows['error']) {
            return [
                'items' => [],
                'meta' => [
                    'total' => 0,
                    'limit' => $limit,
                    'source' => 'api-aduan-list',
                    'status' => $rows['status'],
                ],
                'error' => $rows['message'],
            ];
        }

        $items = collect($rows['data'])
            ->filter(fn($item) => (bool) data_get($item, 'is_aduan', false))
            ->sortByDesc(fn($item) => data_get($item, 'created_at'))
            ->take($limit)
            ->values()
            ->map(fn($item) => $this->mapComplaint($item))
            ->values()
            ->all();

        return [
            'items' => $items,
            'meta' => [
                'total' => count($items),
                'limit' => $limit,
                'source' => 'api-aduan-list',
            ],
            'error' => null,
        ];
    }

    private function fetchAduanRows(): array
    {
        $url = config('services.aduan.api_url') . "/aduan/list-aduan";
        $appKey = config('services.aduan.appkey');

        if (! $url || ! $appKey) {
            return [
                'error' => true,
                'status' => 500,
                'message' => 'Konfigurasi API Aduan belum lengkap.',
                'data' => [],
            ];
        }

        try {
            $response = Http::withoutVerifying()
                ->timeout(30)
                ->withHeaders([
                    'Accept' => 'application/json',
                    'appkey' => $appKey,
                ])
                ->get($url);

            if (! $response->successful()) {
                return [
                    'error' => true,
                    'status' => 502,
                    'message' => 'Gagal mengambil data aduan dari API sumber.',
                    'data' => [],
                ];
            }

            $payload = $response->json();
            $data = data_get($payload, 'data', []);

            return [
                'error' => false,
                'status' => 200,
                'message' => 'OK',
                'data' => is_array($data) ? $data : [],
            ];
        } catch (\Throwable $th) {
            return [
                'error' => true,
                'status' => 500,
                'message' => config('app.debug') ? $th->getMessage() : 'Terjadi kesalahan saat mengambil data aduan.',
                'data' => [],
            ];
        }
    }

    private function mapComplaint($item): array
    {
        $history = collect(data_get($item, 'histori', []))
            ->map(function ($historyItem) {
                return [
                    'status_id' => data_get($historyItem, 'status_id'),
                    'status' => data_get($historyItem, 'status', '-'),
                    'created_at' => data_get($historyItem, 'created_at'),
                    'created_at_label' => $this->formatDateTime(data_get($historyItem, 'created_at')),
                ];
            })
            ->values()
            ->all();

        $latestHistory = collect($history)
            ->filter(fn($historyItem) => ! empty($historyItem['created_at']))
            ->sortByDesc(fn($historyItem) => $historyItem['created_at'])
            ->first();

        $lastStatus = data_get($latestHistory, 'status', data_get($item, 'last_status', '-'));
        $lastStatusAt = data_get($latestHistory, 'created_at');
        $lastStatusAtLabel = data_get($latestHistory, 'created_at_label', '-');
        $images = collect(data_get($item, 'bukti', []))->filter()->values()->all();
        $aduanText = $this->cleanText(data_get($item, 'aduan', '-'));
        $maps = data_get($item, 'maps', '');

        return [
            'id' => data_get($item, 'id'),
            'slug' => (string) (data_get($item, 'id') ?: data_get($item, 'no_ticket') ?: 'aduan'),
            'noTicket' => data_get($item, 'no_ticket', '-'),
            'name' => data_get($item, 'name', 'Aduan Warga'),
            'title' => data_get($item, 'topik', 'Aduan Warga'),
            'description' => $aduanText,
            'summary' => Str::limit($aduanText, 150),
            'location' => data_get($item, 'lokasi', '-'),
            'createdAt' => data_get($item, 'created_at'),
            'createdAtLabel' => $this->formatDateTime(data_get($item, 'created_at')),
            'maps' => $maps,
            'mapEmbed' => $this->makeMapEmbedUrl($maps),
            'channel' => data_get($item, 'kanal'),
            'skpd' => collect(data_get($item, 'skpd', []))->filter()->values()->all(),
            'history' => $history,
            'images' => $images,
            'thumbnail' => $images[0] ?? null,
            'type' => data_get($item, 'jenis_aduan', 'aduan'),
            'isAduan' => (bool) data_get($item, 'is_aduan', false),
            'totalImages' => count($images),
            'totalHistory' => count($history),
            'latestHistory' => $latestHistory ?: null,
            'lastStatus' => $lastStatus,
            'lastStatusAt' => $lastStatusAt,
            'lastStatusAtLabel' => $lastStatusAtLabel,
            'isFinished' => $this->isFinishedStatus($lastStatus),
            'raw' => null,
        ];
    }

    private function cleanText($value): string
    {
        $text = html_entity_decode((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = strip_tags($text);
        $text = preg_replace('/\s+/', ' ', $text);

        return trim($text);
    }

    private function normalizeBeritaImage(?string $url): string
    {
        $url = trim((string) $url);

        if ($url === '') {
            return 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80';
        }

        if (Str::startsWith($url, ['http://', 'https://'])) {
            return $url;
        }

        return 'https://www.kedirikota.go.id/' . ltrim($url, '/');
    }

    private function formatDate($value): string
    {
        if (! $value) {
            return '';
        }

        try {
            Carbon::setLocale('id');
            return Carbon::parse($value)->translatedFormat('d F Y');
        } catch (\Throwable $th) {
            return (string) $value;
        }
    }

    private function formatDateTime($value): string
    {
        if (! $value) {
            return '-';
        }

        try {
            Carbon::setLocale('id');
            return Carbon::parse($value)->translatedFormat('d F Y, H:i') . ' WIB';
        } catch (\Throwable $th) {
            return (string) $value;
        }
    }

    private function makeMapEmbedUrl(?string $maps): ?string
    {
        $maps = trim((string) $maps);

        if ($maps === '') {
            return null;
        }

        if (preg_match('/q=([^&]+)/', $maps, $matches)) {
            return 'https://maps.google.com/maps?q=' . $matches[1] . '&z=15&output=embed';
        }

        return null;
    }

    private function isFinishedStatus(?string $status): bool
    {
        $text = strtolower((string) $status);

        return str_contains($text, 'selesai')
            || str_contains($text, 'diselesaikan')
            || str_contains($text, 'ditutup')
            || str_contains($text, 'selesai diproses');
    }
}
