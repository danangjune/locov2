<?php

namespace App\Services\Pecut;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class NewsService
{
    private string $sourceUrl = 'https://kedirikota.go.id/api/berita';

    public function getIndexData(Request $request): array
    {
        $result = $this->fetchNewsItems();

        if ($result['error']) {
            return [
                'news' => [
                    'items' => [],
                    'meta' => $this->emptyPaginationMeta($request),
                ],
                'tags' => [],
                'errors' => [
                    'news' => $result['error'],
                ],
            ];
        }

        $search = trim((string) $request->query('search', ''));
        $tag = trim((string) $request->query('tag', ''));
        $page = max(1, (int) $request->query('page', 1));
        $perPage = (int) $request->query('per_page', 12);
        $perPage = max(3, min($perPage, 30));

        $items = collect($result['items']);

        $tags = $items
            ->pluck('tag')
            ->filter()
            ->unique()
            ->values()
            ->all();

        if ($search !== '') {
            $needle = Str::lower($search);

            $items = $items->filter(function ($item) use ($needle) {
                return Str::contains(Str::lower(implode(' ', [
                    $item['title'] ?? '',
                    $item['excerpt'] ?? '',
                    $item['tag'] ?? '',
                    $item['date'] ?? '',
                ])), $needle);
            });
        }

        if ($tag !== '' && $tag !== 'Semua') {
            $items = $items->filter(fn ($item) => ($item['tag'] ?? '') === $tag);
        }

        $total = $items->count();
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = min($page, $lastPage);
        $offset = ($page - 1) * $perPage;

        $pagedItems = $items
            ->slice($offset, $perPage)
            ->values()
            ->all();

        return [
            'news' => [
                'items' => $pagedItems,
                'meta' => [
                    'source' => $this->sourceUrl,
                    'total' => $total,
                    'per_page' => $perPage,
                    'current_page' => $page,
                    'last_page' => $lastPage,
                    'from' => $total > 0 ? $offset + 1 : 0,
                    'to' => min($offset + $perPage, $total),
                ],
            ],
            'tags' => $tags,
            'errors' => [
                'news' => null,
            ],
        ];
    }

    public function getShowData(Request $request, string $slug): array
    {
        $result = $this->fetchNewsItems();

        if ($result['error']) {
            return [
                'news' => null,
                'related' => [],
                'errors' => [
                    'news' => $result['error'],
                ],
            ];
        }

        $items = collect($result['items']);

        $news = $items->first(function ($item) use ($slug) {
            return (string) ($item['slug'] ?? '') === (string) $slug
                || (string) ($item['id'] ?? '') === (string) $slug;
        });

        if (! $news) {
            return [
                'news' => null,
                'related' => $items->take(3)->values()->all(),
                'errors' => [
                    'news' => 'Berita tidak ditemukan.',
                ],
            ];
        }

        $related = $items
            ->filter(fn ($item) => ($item['slug'] ?? '') !== ($news['slug'] ?? ''))
            ->sortByDesc(fn ($item) => ($item['tag'] ?? '') === ($news['tag'] ?? ''))
            ->take(3)
            ->values()
            ->all();

        return [
            'news' => $news,
            'related' => $related,
            'errors' => [
                'news' => null,
            ],
        ];
    }

    private function fetchNewsItems(): array
    {
        try {
            $response = Http::withoutVerifying()
                ->timeout(30)
                ->get($this->sourceUrl);

            if (! $response->successful()) {
                return [
                    'items' => [],
                    'error' => 'Gagal mengambil berita dari website resmi Kota Kediri.',
                    'status' => $response->status(),
                ];
            }

            $payload = json_decode($response->body());
            $rows = [];

            if (isset($payload->berita)) {
                $decoded = is_string($payload->berita)
                    ? json_decode($payload->berita)
                    : $payload->berita;

                if (is_array($decoded)) {
                    $rows = $decoded;
                }
            }

            $items = collect($rows)
                ->values()
                ->map(fn ($item, $index) => $this->mapNewsItem($item, $index))
                ->filter(fn ($item) => ! empty($item['title']))
                ->values()
                ->all();

            return [
                'items' => $items,
                'error' => null,
                'status' => 200,
            ];
        } catch (\Throwable $th) {
            return [
                'items' => [],
                'error' => config('app.debug')
                    ? $th->getMessage()
                    : 'Terjadi kesalahan saat mengambil berita resmi Kota Kediri.',
                'status' => 500,
            ];
        }
    }

    private function mapNewsItem($item, int $index): array
    {
        $id = data_get($item, 'idpost')
            ?? data_get($item, 'id')
            ?? ($index + 1);

        $title = $this->cleanText(
            data_get($item, 'judul')
            ?? data_get($item, 'title')
            ?? 'Berita Kota Kediri'
        );

        $slug = data_get($item, 'judulurl') ?: Str::slug($title);

        $description = $this->cleanText(
            data_get($item, 'deskripsi')
            ?? data_get($item, 'isi')
            ?? ''
        );

        $image = $this->normalizeImage(
            data_get($item, 'linkgambar')
            ?? data_get($item, 'gambar')
            ?? null
        );

        $dateRaw = data_get($item, 'tanggal')
            ?? data_get($item, 'tgl')
            ?? data_get($item, 'tglpost')
            ?? data_get($item, 'created_at')
            ?? null;

        return [
            'id' => $id,
            'slug' => (string) $slug,
            'title' => $title,
            'date' => $this->formatDate($dateRaw),
            'tag' => $this->cleanText(data_get($item, 'kategori') ?? 'Kota Kediri'),
            'excerpt' => $description
                ? Str::limit($description, 170)
                : Str::limit($title, 170),
            'image' => $image,
            'url' => "https://www.kedirikota.go.id/p/berita/{$id}/{$slug}",
            'content' => array_values(array_filter([
                $description ?: 'Informasi berita resmi Pemerintah Kota Kediri.',
                'Baca berita lengkap melalui tautan website resmi Pemerintah Kota Kediri.',
            ])),
        ];
    }

    private function emptyPaginationMeta(Request $request): array
    {
        $perPage = (int) $request->query('per_page', 12);
        $perPage = max(3, min($perPage, 30));

        return [
            'source' => $this->sourceUrl,
            'total' => 0,
            'per_page' => $perPage,
            'current_page' => 1,
            'last_page' => 1,
            'from' => 0,
            'to' => 0,
        ];
    }

    private function cleanText($value): string
    {
        $text = html_entity_decode((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = strip_tags($text);
        $text = preg_replace('/\s+/', ' ', $text);

        return trim($text);
    }

    private function normalizeImage(?string $url): string
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
}
