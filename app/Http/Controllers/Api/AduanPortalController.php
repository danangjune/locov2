<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AduanPortalController extends Controller
{
    public function top(Request $request)
    {
        $limit = (int) $request->query('limit', 6);
        $limit = max(1, min($limit, 20));

        $rows = $this->fetchAduanRows();

        if ($rows['error']) {
            return response()->json([
                'message' => $rows['message'],
                'data' => [],
            ], $rows['status']);
        }

        $items = collect($rows['data'])
            ->filter(fn($item) => (bool) data_get($item, 'is_aduan', false))
            ->sortByDesc(fn($item) => data_get($item, 'created_at'))
            ->take($limit)
            ->values()
            ->map(fn($item) => $this->mapAduanItem($item))
            ->values();

        return response()->json([
            'data' => $items,
            'meta' => [
                'total' => $items->count(),
                'limit' => $limit,
                'source' => 'api-aduan-list',
            ],
        ]);
    }

    public function detail($id)
    {
        $rows = $this->fetchAduanRows();

        if ($rows['error']) {
            return response()->json([
                'message' => $rows['message'],
                'data' => null,
            ], $rows['status']);
        }

        $item = collect($rows['data'])
            ->first(function ($row) use ($id) {
                return (string) data_get($row, 'id') === (string) $id
                    || (string) data_get($row, 'no_ticket') === (string) $id;
            });

        if (! $item) {
            return response()->json([
                'message' => 'Data aduan tidak ditemukan.',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'data' => $this->mapAduanItem($item, true),
        ]);
    }

    private function fetchAduanRows(): array
    {
        $url = config('services.aduan.url');
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

            if (! is_array($data)) {
                $data = [];
            }

            return [
                'error' => false,
                'status' => 200,
                'message' => 'OK',
                'data' => $data,
            ];
        } catch (\Throwable $th) {
            return [
                'error' => true,
                'status' => 500,
                'message' => config('app.debug')
                    ? $th->getMessage()
                    : 'Terjadi kesalahan saat mengambil data aduan.',
                'data' => [],
            ];
        }
    }

    private function mapAduanItem($item, bool $full = false): array
    {
        $histori = collect(data_get($item, 'histori', []))
            ->map(function ($history) {
                return [
                    'status_id' => data_get($history, 'status_id'),
                    'status' => data_get($history, 'status', '-'),
                    'created_at' => data_get($history, 'created_at'),
                    'created_at_label' => $this->formatDateTime(data_get($history, 'created_at')),
                ];
            })
            ->values()
            ->all();

        $bukti = collect(data_get($item, 'bukti', []))
            ->filter()
            ->values()
            ->all();

        $maps = data_get($item, 'maps', '');

        return [
            'id' => data_get($item, 'id'),
            'slug' => (string) data_get($item, 'id'),
            'no_ticket' => data_get($item, 'no_ticket', '-'),
            'name' => data_get($item, 'name', 'Aduan Warga'),
            'aduan' => $this->cleanText(data_get($item, 'aduan', '-')),
            'summary' => Str::limit($this->cleanText(data_get($item, 'aduan', '-')), 150),
            'lokasi' => data_get($item, 'lokasi', '-'),
            'created_at' => data_get($item, 'created_at'),
            'created_at_label' => $this->formatDateTime(data_get($item, 'created_at')),
            'topik' => data_get($item, 'topik', 'Aduan Warga'),
            'maps' => $maps,
            'map_embed' => $this->makeMapEmbedUrl($maps),
            'kanal' => data_get($item, 'kanal'),
            'skpd' => collect(data_get($item, 'skpd', []))->filter()->values()->all(),
            'histori' => $histori,
            'bukti' => $bukti,
            'thumbnail' => $bukti[0] ?? null,
            'jenis_aduan' => data_get($item, 'jenis_aduan', 'aduan'),
            'is_aduan' => (bool) data_get($item, 'is_aduan', false),
            'total_bukti' => count($bukti),
            'total_histori' => count($histori),
            'last_status' => count($histori)
                ? data_get($histori[count($histori) - 1], 'status')
                : '-',
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
}
