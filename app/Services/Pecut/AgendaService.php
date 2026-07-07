<?php

namespace App\Services\Pecut;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AgendaService
{
    public function __construct(private readonly KediriKotaApiService $api)
    {
    }

    public function getIndexData(Request $request): array
    {
        $result = $this->fetchAgendaItems();

        $type = trim((string) $request->query('type', 'Semua'));
        $date = $request->query('date');
        $page = max(1, (int) $request->query('page', 1));
        $perPage = (int) $request->query('per_page', 100);
        $perPage = max(6, min($perPage, 100));

        $items = collect($result['items']);

        if ($type !== '' && $type !== 'Semua') {
            $items = $items->filter(fn ($item) => ($item['type'] ?? '') === $type);
        }

        if ($date !== null && $date !== '' && is_numeric($date)) {
            $items = $items->filter(fn ($item) => (int) ($item['date'] ?? 0) === (int) $date);
        }

        $items = $items
            ->sortBy(fn ($item) => $item['sort_date'] ?? $item['start_date'] ?? '9999-12-31')
            ->values();

        $total = $items->count();
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = min($page, $lastPage);
        $offset = ($page - 1) * $perPage;

        $pagedItems = $items
            ->slice($offset, $perPage)
            ->values()
            ->all();

        $allItems = collect($result['items']);
        $firstDate = $this->firstAgendaDate($allItems);

        return [
            'agendas' => [
                'items' => $pagedItems,
                'meta' => [
                    'source' => $result['source'],
                    'total' => $total,
                    'per_page' => $perPage,
                    'current_page' => $page,
                    'last_page' => $lastPage,
                    'from' => $total > 0 ? $offset + 1 : 0,
                    'to' => min($offset + $perPage, $total),
                ],
            ],
            'stats' => [
                'total' => $allItems->count(),
                'government_total' => $allItems->where('type', 'Agenda Pemerintah')->count(),
                'public_total' => $allItems->where('type', 'Agenda Publik')->count(),
                'shown_total' => count($pagedItems),
            ],
            'calendar' => [
                'month' => $firstDate?->translatedFormat('F') ?: now()->locale('id')->translatedFormat('F'),
                'year' => $firstDate?->format('Y') ?: now()->format('Y'),
                'government_dates' => $allItems
                    ->where('type', 'Agenda Pemerintah')
                    ->pluck('date')
                    ->filter()
                    ->map(fn ($value) => (int) $value)
                    ->unique()
                    ->values()
                    ->all(),
                'public_dates' => $allItems
                    ->where('type', 'Agenda Publik')
                    ->pluck('date')
                    ->filter()
                    ->map(fn ($value) => (int) $value)
                    ->unique()
                    ->values()
                    ->all(),
            ],
            'types' => $this->agendaTypes($allItems),
            'errors' => [
                'agenda' => $result['error'],
            ],
        ];
    }

    public function getShowData(Request $request, string $slug): array
    {
        $result = $this->fetchAgendaItems();
        $items = collect($result['items']);
        $slugWithoutId = preg_replace('/^\d+-/', '', (string) $slug);
        $idFromSlug = $this->extractIdFromSlug((string) $slug);

        $agenda = $items->first(function ($item) use ($slug, $slugWithoutId, $idFromSlug) {
            return (string) ($item['slug'] ?? '') === (string) $slug
                || (string) ($item['original_slug'] ?? '') === (string) $slug
                || (string) ($item['original_slug'] ?? '') === (string) $slugWithoutId
                || ($idFromSlug && (string) ($item['id'] ?? '') === (string) $idFromSlug);
        });

        if (! $agenda) {
            return [
                'agenda' => null,
                'related' => $items->take(3)->values()->all(),
                'errors' => [
                    'agenda' => $result['error'] ?: 'Agenda tidak ditemukan dari API website Kota Kediri.',
                ],
            ];
        }

        $related = $items
            ->filter(fn ($item) => (string) ($item['slug'] ?? '') !== (string) ($agenda['slug'] ?? ''))
            ->take(3)
            ->values()
            ->all();

        return [
            'agenda' => $agenda,
            'related' => $related,
            'errors' => [
                'agenda' => $result['error'],
            ],
        ];
    }

    public function getHomeItems(int $limit = 4): array
    {
        $limit = max(1, min($limit, 10));
        $result = $this->fetchAgendaItems();
        $allItems = collect($result['items']);
        $items = $allItems
            ->sortBy(fn ($item) => $item['sort_date'] ?? $item['start_date'] ?? '9999-12-31')
            ->take($limit)
            ->values()
            ->all();
        $firstDate = $this->firstAgendaDate($allItems);

        return [
            'items' => $items,
            'calendar' => [
                'month' => $firstDate?->translatedFormat('F') ?: now()->locale('id')->translatedFormat('F'),
                'year' => $firstDate?->format('Y') ?: now()->format('Y'),
                'government_dates' => $allItems->where('type', 'Agenda Pemerintah')->pluck('date')->filter()->map(fn ($value) => (int) $value)->unique()->values()->all(),
                'public_dates' => $allItems->where('type', 'Agenda Publik')->pluck('date')->filter()->map(fn ($value) => (int) $value)->unique()->values()->all(),
            ],
            'meta' => [
                'source' => $result['source'],
                'total' => count($result['items']),
                'limit' => $limit,
            ],
            'error' => $result['error'],
        ];
    }

    private function fetchAgendaItems(): array
    {
        $response = $this->api->getAgenda(1, 100);

        if (! $response['success']) {
            return [
                'items' => [],
                'error' => $response['error'],
                'source' => $response['source'],
            ];
        }

        $rows = $this->extractRows(data_get($response['payload'], 'agenda', []));

        $items = collect($rows)
            ->values()
            ->map(fn ($item, $index) => $this->mapAgendaItem($item, $index))
            ->filter(fn ($item) => ! empty($item['title']))
            ->values()
            ->all();

        return [
            'items' => $items,
            'error' => null,
            'source' => $response['source'],
        ];
    }

    private function mapAgendaItem($item, int $index): array
    {
        $id = data_get($item, 'id') ?? ($index + 1);
        $title = $this->cleanText(data_get($item, 'judul_acara') ?? 'Agenda Kota Kediri');
        $originalSlug = Str::slug($title ?: ('agenda-' . $id));
        $slug = $id ? ((string) $id . '-' . $originalSlug) : $originalSlug;
        $startDate = $this->parseDate(data_get($item, 'tanggal_mulai')) ?: now();
        $endDate = $this->parseDate(data_get($item, 'tanggal_selesai'));
        $html = (string) data_get($item, 'deskripsi', '');
        $description = $this->cleanText($html ?: 'Informasi agenda Pemerintah Kota Kediri.');

        return [
            'id' => $id,
            'slug' => $slug,
            'original_slug' => $originalSlug,
            'title' => $title,
            'date' => (int) $startDate->format('j'),
            'fullDate' => $this->formatDateRange($startDate, $endDate, data_get($item, 'tanggal_mulai_formatted'), data_get($item, 'tanggal_selesai_formatted')),
            'month' => $startDate->translatedFormat('F'),
            'year' => $startDate->format('Y'),
            'time' => 'Sepanjang hari',
            'type' => 'Agenda Publik',
            'location' => $this->cleanText(data_get($item, 'lokasi_acara') ?? 'Kota Kediri'),
            'maps_url' => $this->normalizeMapUrl(data_get($item, 'maps_lokasi')),
            'image' => $this->normalizeImage(data_get($item, 'banner')),
            'url' => $this->buildAgendaUrl($id),
            'detail_url' => $this->buildAgendaUrl($id),
            'external_url' => $this->buildAgendaUrl($id),
            'description' => $description,
            'excerpt' => Str::limit($description, 160),
            'content' => $description,
            'content_html' => $html,
            'start_date' => data_get($item, 'tanggal_mulai'),
            'end_date' => data_get($item, 'tanggal_selesai'),
            'start_label' => data_get($item, 'tanggal_mulai_formatted') ?: $startDate->translatedFormat('d F Y'),
            'end_label' => $endDate ? (data_get($item, 'tanggal_selesai_formatted') ?: $endDate->translatedFormat('d F Y')) : null,
            'sort_date' => $startDate->format('Y-m-d'),
            'is_active' => (int) data_get($item, 'status_enabled', 1) === 1,
            'raw' => null,
        ];
    }


    private function buildAgendaUrl($id): ?string
    {
        $id = trim((string) $id);

        if ($id === '') {
            return null;
        }

        return rtrim(config('services.kediri_kota.base_url'), '/')
            . '/agenda/'
            . ltrim($id, '/');
    }

    private function agendaTypes($items): array
    {
        $types = $items->pluck('type')->filter()->unique()->values()->all();

        return array_values(array_unique(array_merge(['Semua'], $types)));
    }

    private function firstAgendaDate($items): ?Carbon
    {
        $first = $items
            ->pluck('start_date')
            ->filter()
            ->sort()
            ->first();

        return $first ? $this->parseDate($first) : null;
    }

    private function parseDate($value): ?Carbon
    {
        try {
            Carbon::setLocale('id');

            if ($value) {
                return Carbon::parse($value);
            }
        } catch (\Throwable $th) {
            return null;
        }

        return null;
    }

    private function formatDateRange(Carbon $startDate, ?Carbon $endDate, ?string $startLabel = null, ?string $endLabel = null): string
    {
        $startText = $startLabel ?: $startDate->translatedFormat('d F Y');

        if (! $endDate || $endDate->lt($startDate) || $endDate->isSameDay($startDate)) {
            return $startText;
        }

        $endText = $endLabel ?: $endDate->translatedFormat('d F Y');

        return $startText . ' - ' . $endText;
    }

    private function normalizeImage(?string $banner): string
    {
        return $this->api->makeAgendaImageUrl($banner)
            ?: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';
    }

    private function normalizeMapUrl($url): ?string
    {
        $url = trim((string) $url);

        if ($url === '' || $url === '#') {
            return null;
        }

        return $url;
    }

    private function extractRows($rows): array
    {
        if (is_string($rows)) {
            $decoded = json_decode($rows, true);
            return is_array($decoded) ? $decoded : [];
        }

        return is_array($rows) ? $rows : [];
    }

    private function cleanText($value): string
    {
        $text = html_entity_decode((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = strip_tags($text);
        $text = preg_replace('/\s+/', ' ', $text);

        return trim($text);
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
}
