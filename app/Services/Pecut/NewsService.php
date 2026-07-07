<?php

namespace App\Services\Pecut;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsService
{
    public function __construct(private readonly KediriKotaApiService $api)
    {
    }

    public function getIndexData(Request $request): array
    {
        $search = trim((string) $request->query('search', ''));
        $tag = trim((string) $request->query('tag', ''));
        $page = max(1, (int) $request->query('page', 1));
        $perPage = (int) $request->query('per_page', 12);
        $perPage = max(3, min($perPage, 30));

        $result = $this->fetchNewsItems($page, $perPage, [
            'search' => $search,
            'tag' => $tag !== 'Semua' ? $tag : null,
        ]);

        if ($result['error']) {
            return [
                'news' => [
                    'items' => [],
                    'meta' => $this->emptyPaginationMeta($page, $perPage, $result['source'] ?? null),
                ],
                'tags' => [],
                'errors' => [
                    'news' => $result['error'],
                ],
            ];
        }

        $items = collect($result['items']);

        // API baru belum menyediakan kategori khusus. Tag tetap disediakan agar filter lama tidak error.
        $tags = $items
            ->pluck('tag')
            ->filter()
            ->unique()
            ->values()
            ->all();

        // Jika API belum mendukung pencarian/tag, filter ringan tetap dilakukan pada halaman data yang sedang diterima.
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

        $pagedItems = $items->values()->all();
        $meta = $result['meta'];

        if ($search !== '' || ($tag !== '' && $tag !== 'Semua')) {
            $meta['total'] = count($pagedItems);
            $meta['from'] = count($pagedItems) ? 1 : 0;
            $meta['to'] = count($pagedItems);
            $meta['last_page'] = 1;
            $meta['current_page'] = 1;
        }

        return [
            'news' => [
                'items' => $pagedItems,
                'meta' => $meta,
            ],
            'tags' => count($tags) ? $tags : ['Kota Kediri'],
            'errors' => [
                'news' => null,
            ],
        ];
    }

    public function getShowData(Request $request, string $slug): array
    {
        $result = $this->fetchNewsItemsForDetail($slug);

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
        $normalizedSlug = (string) $slug;
        $slugWithoutId = preg_replace('/^\d+-/', '', $normalizedSlug);
        $idFromSlug = $this->extractIdFromSlug($normalizedSlug);

        $news = $items->first(function ($item) use ($normalizedSlug, $slugWithoutId, $idFromSlug) {
            return (string) ($item['slug'] ?? '') === $normalizedSlug
                || (string) ($item['original_slug'] ?? '') === $normalizedSlug
                || (string) ($item['original_slug'] ?? '') === $slugWithoutId
                || ($idFromSlug && (string) ($item['id'] ?? '') === (string) $idFromSlug);
        });

        if (! $news) {
            return [
                'news' => null,
                'related' => $items->take(3)->values()->all(),
                'errors' => [
                    'news' => 'Berita tidak ditemukan dari API website Kota Kediri.',
                ],
            ];
        }

        $related = $items
            ->filter(fn ($item) => (string) ($item['slug'] ?? '') !== (string) ($news['slug'] ?? ''))
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

    public function getHomeItems(int $limit = 3): array
    {
        $limit = max(1, min($limit, 10));
        $result = $this->fetchNewsItems(1, $limit);

        return [
            'items' => $result['items'],
            'meta' => array_merge($result['meta'] ?? [], [
                'limit' => $limit,
            ]),
            'error' => $result['error'],
        ];
    }

    private function fetchNewsItems(int $page = 1, int $perPage = 10, array $query = []): array
    {
        $response = $this->api->getBerita($page, $perPage, $query);

        if (! $response['success']) {
            return [
                'items' => [],
                'error' => $response['error'],
                'status' => $response['status'],
                'source' => $response['source'],
                'meta' => $this->emptyPaginationMeta($page, $perPage, $response['source']),
            ];
        }

        $payload = $response['payload'];
        $rows = $this->extractRows(data_get($payload, 'berita', []));

        $items = collect($rows)
            ->values()
            ->map(fn ($item, $index) => $this->mapNewsItem($item, $index))
            ->filter(fn ($item) => ! empty($item['title']))
            ->values()
            ->all();

        $total = (int) data_get($payload, 'total', count($items));
        $currentPage = max(1, (int) data_get($payload, 'page', $page));
        $apiPerPage = max(1, (int) data_get($payload, 'per_page', $perPage));
        $lastPage = max(1, (int) data_get($payload, 'total_pages', ceil(max(1, $total) / $apiPerPage)));
        $from = $total > 0 ? (($currentPage - 1) * $apiPerPage) + 1 : 0;

        return [
            'items' => $items,
            'error' => null,
            'status' => 200,
            'source' => $response['source'],
            'meta' => [
                'source' => $response['source'],
                'total' => $total,
                'per_page' => $apiPerPage,
                'current_page' => $currentPage,
                'last_page' => $lastPage,
                'from' => $from,
                'to' => min($from + count($items) - 1, $total),
            ],
        ];
    }

    private function fetchNewsItemsForDetail(string $slug): array
    {
        $id = $this->extractIdFromSlug($slug);
        $query = [];

        if ($id) {
            $query['id'] = $id;
        } else {
            $query['search'] = preg_replace('/^\d+-/', '', $slug);
        }

        $result = $this->fetchNewsItems(1, 100, $query);

        if (! $result['error'] && count($result['items'])) {
            return $result;
        }

        // Fallback tetap ke API baru, bukan API lama. Dicoba halaman pertama 100 data terbaru.
        return $this->fetchNewsItems(1, 100);
    }

    private function mapNewsItem($item, int $index): array
    {
        $id = data_get($item, 'id') ?? ($index + 1);
        $title = $this->cleanText(data_get($item, 'judul') ?? 'Berita Kota Kediri');
        $originalSlug = (string) (data_get($item, 'slug') ?: Str::slug($title));
        $slug = $id ? ((string) $id . '-' . $originalSlug) : $originalSlug;
        $html = (string) data_get($item, 'deskripsi', '');
        $plainDescription = $this->cleanText($html);
        $paragraphs = $this->extractParagraphs($html);
        $dateRaw = data_get($item, 'tanggal') ?? data_get($item, 'created_at') ?? null;
        $dateLabel = data_get($item, 'created_at_formatted') ?: $this->formatDate($dateRaw);

        return [
            'id' => $id,
            'slug' => $slug,
            'original_slug' => $originalSlug,
            'title' => $title,
            'date' => $dateLabel,
            'published_at' => $dateRaw,
            'published_label' => $dateLabel,
            'tag' => 'Kota Kediri',
            'excerpt' => $plainDescription
                ? Str::limit($plainDescription, 170)
                : Str::limit($title, 170),
            'image' => $this->normalizeImage(data_get($item, 'images')),
            'url' => $this->buildNewsUrl($originalSlug),
            'external_url' => $this->buildNewsUrl($originalSlug),
            'detail_url' => $this->buildNewsUrl($originalSlug),
            'content' => count($paragraphs)
                ? $paragraphs
                : array_values(array_filter([$plainDescription ?: 'Informasi berita resmi Pemerintah Kota Kediri.'])),
            'views' => data_get($item, 'count_view'),
            'is_featured' => (bool) data_get($item, 'eksklusif', false),
            'raw' => null,
        ];
    }

    private function buildNewsUrl(?string $slug): ?string
    {
        $slug = trim((string) $slug);

        if ($slug === '') {
            return null;
        }

        return $this->api->baseUrl() . '/berita/' . ltrim($slug, '/');
    }

    private function emptyPaginationMeta(int $page, int $perPage, ?string $source = null): array
    {
        return [
            'source' => $source ?: $this->api->baseUrl() . '/api/berita',
            'total' => 0,
            'per_page' => $perPage,
            'current_page' => max(1, $page),
            'last_page' => 1,
            'from' => 0,
            'to' => 0,
        ];
    }

    private function extractRows($rows): array
    {
        if (is_string($rows)) {
            $decoded = json_decode($rows, true);
            return is_array($decoded) ? $decoded : [];
        }

        return is_array($rows) ? $rows : [];
    }

    private function extractIdFromSlug(string $slug): ?int
    {
        if (preg_match('/^(\d+)(?:-|$)/', $slug, $matches)) {
            return (int) $matches[1];
        }

        if (is_numeric($slug)) {
            return (int) $slug;
        }

        return null;
    }

    private function extractParagraphs(?string $html): array
    {
        $html = trim((string) $html);

        if ($html === '') {
            return [];
        }

        preg_match_all('/<p\b[^>]*>(.*?)<\/p>/is', $html, $matches);

        $paragraphs = count($matches[1]) ? $matches[1] : preg_split('/\R{2,}|\R/', $html);

        return collect($paragraphs)
            ->map(fn ($paragraph) => $this->cleanText($paragraph))
            ->filter()
            ->values()
            ->all();
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

        return $this->api->makeUrl($url)
            ?: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80';
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
