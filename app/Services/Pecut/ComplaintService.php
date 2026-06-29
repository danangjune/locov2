<?php

namespace App\Services\Pecut;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ComplaintService
{
    public function getIndexData(Request $request): array
    {
        $search = trim((string) $request->query('search', ''));
        $status = trim((string) $request->query('status', ''));
        $page = max(1, (int) $request->query('page', 1));
        $perPage = 12;

        $rows = $this->fetchAduanRows();

        if ($rows['error']) {
            return [
                'complaints' => [
                    'items' => [],
                    'meta' => $this->emptyPaginationMeta($page, $perPage),
                ],
                'stats' => [
                    'total' => 0,
                    'finished_total' => 0,
                    'process_total' => 0,
                    'open_total' => 0,
                    'with_image_total' => 0,
                ],
                'errors' => [
                    'complaints' => $rows['message'],
                ],
            ];
        }

        $collection = collect($rows['data'])
            ->filter(fn ($item) => (bool) data_get($item, 'is_aduan', false))
            ->map(fn ($item) => $this->mapComplaint($item))
            ->values();

        $stats = [
            'total' => $collection->count(),
            'finished_total' => $collection->where('isFinished', true)->count(),
            'process_total' => $collection->filter(fn ($item) => str_contains(strtolower($item['lastStatus'] ?? ''), 'proses'))->count(),
            'open_total' => $collection->where('isFinished', false)->count(),
            'with_image_total' => $collection->filter(fn ($item) => ($item['totalImages'] ?? 0) > 0)->count(),
        ];

        if ($search !== '') {
            $needle = Str::lower($search);

            $collection = $collection->filter(function ($item) use ($needle) {
                $haystack = Str::lower(implode(' ', [
                    $item['noTicket'] ?? '',
                    $item['title'] ?? '',
                    $item['description'] ?? '',
                    $item['location'] ?? '',
                    $item['lastStatus'] ?? '',
                ]));

                return str_contains($haystack, $needle);
            })->values();
        }

        if ($status !== '') {
            if ($status === 'finished') {
                $collection = $collection->where('isFinished', true)->values();
            } elseif ($status === 'open') {
                $collection = $collection->where('isFinished', false)->values();
            } else {
                $needle = Str::lower($status);
                $collection = $collection
                    ->filter(fn ($item) => str_contains(Str::lower($item['lastStatus'] ?? ''), $needle))
                    ->values();
            }
        }

        $collection = $collection
            ->sortByDesc(fn ($item) => $item['createdAt'] ?? '')
            ->values();

        $total = $collection->count();
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = min($page, $lastPage);
        $items = $collection->forPage($page, $perPage)->values()->all();

        return [
            'complaints' => [
                'items' => $items,
                'meta' => [
                    'total' => $total,
                    'per_page' => $perPage,
                    'current_page' => $page,
                    'last_page' => $lastPage,
                    'from' => $total ? (($page - 1) * $perPage) + 1 : null,
                    'to' => $total ? (($page - 1) * $perPage) + count($items) : null,
                ],
            ],
            'stats' => $stats,
            'errors' => [
                'complaints' => null,
            ],
        ];
    }

    public function getShowData(Request $request, string $slug): array
    {
        $rows = $this->fetchAduanRows();

        if ($rows['error']) {
            return [
                'complaint' => null,
                'related' => [],
                'errors' => [
                    'complaint' => $rows['message'],
                ],
            ];
        }

        $mapped = collect($rows['data'])
            ->filter(fn ($item) => (bool) data_get($item, 'is_aduan', false))
            ->map(fn ($item) => $this->mapComplaint($item, true))
            ->values();

        $complaint = $mapped->first(function ($item) use ($slug) {
            return (string) ($item['id'] ?? '') === (string) $slug
                || (string) ($item['slug'] ?? '') === (string) $slug
                || (string) ($item['noTicket'] ?? '') === (string) $slug;
        });

        if (! $complaint) {
            return [
                'complaint' => null,
                'related' => [],
                'errors' => [
                    'complaint' => 'Data aduan tidak ditemukan.',
                ],
            ];
        }

        $related = $mapped
            ->reject(fn ($item) => (string) ($item['slug'] ?? '') === (string) ($complaint['slug'] ?? ''))
            ->sortByDesc(fn ($item) => $item['createdAt'] ?? '')
            ->take(3)
            ->values()
            ->map(function ($item) {
                $item['raw'] = null;
                return $item;
            })
            ->all();

        return [
            'complaint' => $complaint,
            'related' => $related,
            'errors' => [
                'complaint' => null,
            ],
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

    private function mapComplaint($item, bool $full = false): array
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
            ->filter(fn ($historyItem) => ! empty($historyItem['created_at']))
            ->sortByDesc(fn ($historyItem) => $historyItem['created_at'])
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
            'raw' => $full ? $item : null,
        ];
    }

    private function cleanText($value): string
    {
        $text = html_entity_decode((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = strip_tags($text);
        $text = preg_replace('/\s+/', ' ', $text);

        return trim($text);
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

    private function emptyPaginationMeta(int $page, int $perPage): array
    {
        return [
            'total' => 0,
            'per_page' => $perPage,
            'current_page' => $page,
            'last_page' => 1,
            'from' => null,
            'to' => null,
        ];
    }
}
