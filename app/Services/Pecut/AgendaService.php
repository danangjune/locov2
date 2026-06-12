<?php

namespace App\Services\Pecut;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AgendaService
{
    public function getIndexData(Request $request): array
    {
        $result = $this->fetchAgendaItems($request);

        $type = trim((string) $request->query('type', 'Semua'));
        $date = $request->query('date');
        $page = max(1, (int) $request->query('page', 1));
        $perPage = (int) $request->query('per_page', 12);
        $perPage = max(6, min($perPage, 36));

        $items = collect($result['items']);

        if ($type !== '' && $type !== 'Semua') {
            $items = $items->filter(fn ($item) => ($item['type'] ?? '') === $type);
        }

        if ($date !== null && $date !== '' && is_numeric($date)) {
            $items = $items->filter(fn ($item) => (int) ($item['date'] ?? 0) === (int) $date);
        }

        $items = $items
            ->sortBy(fn ($item) => sprintf('%02d %s', (int) ($item['date'] ?? 99), $item['time'] ?? ''));

        $total = $items->count();
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = min($page, $lastPage);
        $offset = ($page - 1) * $perPage;

        $pagedItems = $items
            ->slice($offset, $perPage)
            ->values()
            ->all();

        $allItems = collect($result['items']);

        $month = $allItems->pluck('month')->filter()->first() ?: 'Mei';
        $year = $allItems->pluck('year')->filter()->first() ?: '2026';

        return [
            'agendas' => [
                'items' => $pagedItems,
                'meta' => [
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
                'month' => $month,
                'year' => $year,
                'government_dates' => $allItems
                    ->where('type', 'Agenda Pemerintah')
                    ->pluck('date')
                    ->filter()
                    ->unique()
                    ->values()
                    ->all(),
                'public_dates' => $allItems
                    ->where('type', 'Agenda Publik')
                    ->pluck('date')
                    ->filter()
                    ->unique()
                    ->values()
                    ->all(),
            ],
            'types' => ['Semua', 'Agenda Pemerintah', 'Agenda Publik'],
            'errors' => [
                'agenda' => $result['error'],
            ],
        ];
    }

    public function getShowData(Request $request, string $slug): array
    {
        $result = $this->fetchAgendaItems($request);
        $items = collect($result['items']);

        $agenda = $items->first(function ($item) use ($slug) {
            return (string) ($item['slug'] ?? '') === (string) $slug
                || (string) ($item['id'] ?? '') === (string) $slug;
        });

        if (! $agenda) {
            return [
                'agenda' => null,
                'related' => $items->take(3)->values()->all(),
                'errors' => [
                    'agenda' => $result['error'] ?: 'Agenda tidak ditemukan.',
                ],
            ];
        }

        $related = $items
            ->filter(fn ($item) => ($item['slug'] ?? '') !== ($agenda['slug'] ?? ''))
            ->sortByDesc(fn ($item) => ($item['type'] ?? '') === ($agenda['type'] ?? ''))
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

    private function fetchAgendaItems(Request $request): array
    {
        $endpoint = rtrim((string) env('APP_URL_SIMALIK'), '/') . '/api/get_agenda';
        $periode = $request->query('periode', 3);

        if (! env('APP_URL_SIMALIK')) {
            return [
                'items' => $this->fallbackAgendaItems(),
                'error' => null,
                'source' => 'fallback',
            ];
        }

        try {
            $response = Http::withoutVerifying()
                ->timeout(20)
                ->get($endpoint, [
                    'id' => $periode,
                ]);

            if (! $response->successful()) {
                return [
                    'items' => $this->fallbackAgendaItems(),
                    'error' => 'Gagal mengambil agenda dari API SIMALIK. Data fallback ditampilkan sementara.',
                    'source' => $endpoint,
                ];
            }

            $payload = $response->json();
            $rows = $this->extractRows($payload);

            if (! count($rows)) {
                return [
                    'items' => $this->fallbackAgendaItems(),
                    'error' => null,
                    'source' => $endpoint,
                ];
            }

            $items = collect($rows)
                ->values()
                ->map(fn ($item, $index) => $this->mapAgendaItem($item, $index))
                ->filter(fn ($item) => ! empty($item['title']))
                ->values()
                ->all();

            return [
                'items' => $items,
                'error' => null,
                'source' => $endpoint,
            ];
        } catch (\Throwable $th) {
            return [
                'items' => $this->fallbackAgendaItems(),
                'error' => config('app.debug')
                    ? $th->getMessage()
                    : 'Terjadi kesalahan saat mengambil data agenda. Data fallback ditampilkan sementara.',
                'source' => $endpoint,
            ];
        }
    }

    private function extractRows($payload): array
    {
        if (is_array($payload) && array_is_list($payload)) {
            return $payload;
        }

        foreach (['data', 'agenda', 'agendas', 'result', 'results'] as $key) {
            $rows = data_get($payload, $key);

            if (is_array($rows)) {
                return $rows;
            }
        }

        return [];
    }

    private function mapAgendaItem($item, int $index): array
    {
        $title = $this->cleanText(
            data_get($item, 'title')
            ?? data_get($item, 'judul')
            ?? data_get($item, 'nama')
            ?? data_get($item, 'nama_agenda')
            ?? 'Agenda Kota Kediri'
        );

        $dateRaw = data_get($item, 'date')
            ?? data_get($item, 'tanggal')
            ?? data_get($item, 'tgl')
            ?? data_get($item, 'start')
            ?? data_get($item, 'created_at');

        $date = $this->parseDate($dateRaw);

        $typeRaw = $this->cleanText(
            data_get($item, 'type')
            ?? data_get($item, 'jenis')
            ?? data_get($item, 'kategori')
            ?? data_get($item, 'category')
            ?? 'Agenda Pemerintah'
        );

        $type = Str::contains(Str::lower($typeRaw), ['publik', 'masyarakat', 'umum'])
            ? 'Agenda Publik'
            : 'Agenda Pemerintah';

        $time = $this->cleanText(
            data_get($item, 'time')
            ?? data_get($item, 'jam')
            ?? data_get($item, 'waktu')
            ?? data_get($item, 'start_time')
            ?? '09.00 WIB'
        );

        if ($time !== '' && ! Str::contains(Str::lower($time), 'wib')) {
            $time .= ' WIB';
        }

        $description = $this->cleanText(
            data_get($item, 'description')
            ?? data_get($item, 'deskripsi')
            ?? data_get($item, 'isi')
            ?? data_get($item, 'keterangan')
            ?? 'Informasi agenda Pemerintah Kota Kediri.'
        );

        $image = $this->normalizeImage(
            data_get($item, 'image')
            ?? data_get($item, 'gambar')
            ?? data_get($item, 'thumbnail')
            ?? null,
            $type
        );

        $slug = data_get($item, 'slug')
            ?? data_get($item, 'judulurl')
            ?? Str::slug($title);

        return [
            'id' => data_get($item, 'id') ?? data_get($item, 'id_agenda') ?? ($index + 1),
            'slug' => (string) $slug,
            'title' => $title,
            'date' => (int) $date->format('j'),
            'fullDate' => $date->translatedFormat('d F Y'),
            'month' => $date->translatedFormat('F'),
            'year' => $date->format('Y'),
            'time' => $time ?: '09.00 WIB',
            'type' => $type,
            'location' => $this->cleanText(
                data_get($item, 'location')
                ?? data_get($item, 'lokasi')
                ?? data_get($item, 'tempat')
                ?? 'Kota Kediri'
            ),
            'image' => $image,
            'description' => $description,
            'raw' => null,
        ];
    }

    private function parseDate($value): Carbon
    {
        try {
            Carbon::setLocale('id');

            if (is_numeric($value) && (int) $value >= 1 && (int) $value <= 31) {
                return Carbon::create(2026, 5, (int) $value);
            }

            if ($value) {
                return Carbon::parse($value);
            }
        } catch (\Throwable $th) {
            // fallback below
        }

        return Carbon::create(2026, 5, 1);
    }

    private function cleanText($value): string
    {
        $text = html_entity_decode((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = strip_tags($text);
        $text = preg_replace('/\s+/', ' ', $text);

        return trim($text);
    }

    private function normalizeImage(?string $url, string $type): string
    {
        $url = trim((string) $url);

        if ($url !== '' && Str::startsWith($url, ['http://', 'https://'])) {
            return $url;
        }

        if ($url !== '') {
            return rtrim((string) env('APP_URL_SIMALIK'), '/') . '/' . ltrim($url, '/');
        }

        return $type === 'Agenda Publik'
            ? 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
            : 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80';
    }

    private function fallbackAgendaItems(): array
    {
        return [
            [
                'id' => 1,
                'slug' => 'rapat-koordinasi-integrasi-aplikasi-opd',
                'title' => 'Rapat Koordinasi Integrasi Aplikasi OPD',
                'date' => 22,
                'fullDate' => '22 Mei 2026',
                'month' => 'Mei',
                'year' => '2026',
                'time' => '09.00 WIB',
                'type' => 'Agenda Pemerintah',
                'location' => 'Ruang Joyoboyo',
                'image' => 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
                'description' => 'Rapat koordinasi untuk memetakan aplikasi perangkat daerah, status integrasi SSO, dan kebutuhan pengelolaan data portal.',
            ],
            [
                'id' => 2,
                'slug' => 'pelatihan-admin-portal-pecut',
                'title' => 'Pelatihan Admin Portal PECUT',
                'date' => 27,
                'fullDate' => '27 Mei 2026',
                'month' => 'Mei',
                'year' => '2026',
                'time' => '13.00 WIB',
                'type' => 'Agenda Pemerintah',
                'location' => 'Command Center',
                'image' => 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
                'description' => 'Pelatihan pengelolaan data aplikasi, berita, agenda, dan kategori layanan untuk admin perangkat daerah.',
            ],
            [
                'id' => 3,
                'slug' => 'forum-evaluasi-spbe-kota-kediri',
                'title' => 'Forum Evaluasi SPBE Kota Kediri',
                'date' => 30,
                'fullDate' => '30 Mei 2026',
                'month' => 'Mei',
                'year' => '2026',
                'time' => '08.30 WIB',
                'type' => 'Agenda Pemerintah',
                'location' => 'Balai Kota Kediri',
                'image' => 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
                'description' => 'Forum evaluasi tata kelola layanan digital dan rencana peningkatan kematangan SPBE di lingkungan Pemerintah Kota Kediri.',
            ],
            [
                'id' => 4,
                'slug' => 'sosialisasi-layanan-digital-untuk-masyarakat',
                'title' => 'Sosialisasi Layanan Digital untuk Masyarakat',
                'date' => 24,
                'fullDate' => '24 Mei 2026',
                'month' => 'Mei',
                'year' => '2026',
                'time' => '08.30 WIB',
                'type' => 'Agenda Publik',
                'location' => 'Balai Kota Kediri',
                'image' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
                'description' => 'Sosialisasi penggunaan layanan digital Pemerintah Kota Kediri untuk masyarakat umum.',
            ],
            [
                'id' => 5,
                'slug' => 'festival-umkm-kota-kediri',
                'title' => 'Festival UMKM Kota Kediri',
                'date' => 25,
                'fullDate' => '25 Mei 2026',
                'month' => 'Mei',
                'year' => '2026',
                'time' => '15.00 WIB',
                'type' => 'Agenda Publik',
                'location' => 'Taman Sekartaji',
                'image' => 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
                'description' => 'Kegiatan promosi produk UMKM lokal sekaligus pengenalan katalog digital UMKM Kota Kediri.',
            ],
            [
                'id' => 6,
                'slug' => 'pelayanan-publik-keliling',
                'title' => 'Pelayanan Publik Keliling',
                'date' => 28,
                'fullDate' => '28 Mei 2026',
                'month' => 'Mei',
                'year' => '2026',
                'time' => '09.00 WIB',
                'type' => 'Agenda Publik',
                'location' => 'Alun-Alun Kediri',
                'image' => 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80',
                'description' => 'Layanan administrasi, informasi publik, dan konsultasi layanan digital yang hadir lebih dekat ke masyarakat.',
            ],
        ];
    }
}
