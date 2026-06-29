<?php

namespace App\Services\Pecut;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ComplaintTicketStatusService
{
    public function check(string $ticket): array
    {
        $ticket = strtoupper(trim($ticket));

        if ($ticket === '') {
            return [
                'ok' => false,
                'message' => 'Nomor tiket wajib diisi.',
            ];
        }

        $apiUrl = rtrim((string) config('services.aduan.api_url'), '/');
        $apiKey = (string) config('services.aduan.appkey');

        if ($apiUrl === '' || $apiKey === '') {
            return [
                'ok' => false,
                'message' => 'Konfigurasi API cek status aduan belum lengkap.',
            ];
        }

        try {
            $response = Http::withoutVerifying()
                ->acceptJson()
                ->withHeaders([
                    'appkey' => $apiKey,
                ])
                ->get($apiUrl . '/aduan/ticket/' . urlencode($ticket));

            if ($response->successful()) {
                $json = $response->json();
                $aduan = data_get($json, 'data') ?: $json;

                if (!is_array($aduan) || empty($aduan)) {
                    return [
                        'ok' => false,
                        'message' => 'Data aduan tidak ditemukan.',
                    ];
                }

                return [
                    'ok' => true,
                    'message' => 'Status aduan berhasil ditemukan.',
                    'data' => $this->normalize($aduan),
                ];
            }

            $message = data_get($response->json(), 'message')
                ?: 'Gagal mengambil status aduan. Kode: ' . $response->status();

            return [
                'ok' => false,
                'message' => $message,
            ];
        } catch (\Throwable $error) {
            Log::warning('HAWA status check failed', [
                'ticket' => $ticket,
                'message' => $error->getMessage(),
            ]);

            return [
                'ok' => false,
                'message' => 'Terjadi kendala saat menghubungi layanan cek status. Silakan coba beberapa saat lagi.',
            ];
        }
    }

    private function normalize(array $aduan): array
    {
        $histories = collect(data_get($aduan, 'histori', []))
            ->map(fn ($item) => [
                'id' => data_get($item, 'id'),
                'status_name' => data_get($item, 'status.nama') ?: '-',
                'status_theme' => data_get($item, 'status.theme') ?: 'primary',
                // Jangan kirim detail user internal. Untuk publik cukup nama kelompok petugasnya.
                'user_name' => $this->safeHistoryActor($item),
                'created_at' => data_get($item, 'created_at'),
                'created_at_human' => data_get($item, 'created_at_human'),
            ])
            ->values()
            ->all();

        $publicMessages = $this->normalizePublicMessages(data_get($aduan, 'detail', []));

        $latestHistory = data_get($aduan, 'latest_history');
        $latestDetail = data_get($aduan, 'latest_detail');

        return [
            'id' => data_get($aduan, 'id'),
            'ticket' => data_get($aduan, 'no_ticket'),
            // Cek status adalah halaman publik. Nama pelapor tidak perlu dikirim ke React.
            'name' => data_get($aduan, 'is_anonymouse') ? 'Pelapor Anonim' : 'Pelapor',
            'topic' => data_get($aduan, 'topik'),
            'sub_topic' => data_get($aduan, 'sub_topik'),
            'type' => data_get($aduan, 'jenis_aduan_format') ?: data_get($aduan, 'jenis_aduan'),
            'channel' => data_get($aduan, 'kanal.nama'),
            'created_at' => data_get($aduan, 'created_at'),
            'created_at_human' => data_get($aduan, 'created_at_human'),
            'location' => $this->normalizePublicLocation($aduan),
            // Alamat lengkap, koordinat, map URL, NIK, email, nomor HP, IP, user agent tidak dikirim ke publik.
            'address' => null,
            'map_url' => null,
            'response_time' => data_get($aduan, 'respon_time'),
            'skpd' => $this->normalizeSkpd(data_get($aduan, 'skpd')),
            'current_status' => [
                'name' => data_get($latestHistory, 'status.nama') ?: Arr::last($histories)['status_name'] ?? 'Status belum tersedia',
                'theme' => data_get($latestHistory, 'status.theme') ?: Arr::last($histories)['status_theme'] ?? 'primary',
                'created_at' => data_get($latestHistory, 'created_at'),
                'created_at_human' => data_get($latestHistory, 'created_at_human'),
            ],
            'report_summary' => $this->getReportSummary($publicMessages),
            'latest_update' => [
                'message' => $this->sanitizePublicText(data_get($latestDetail, 'isi')),
                'name' => $this->safeDisplayName([
                    'role' => data_get($latestDetail, 'role'),
                    'name' => data_get($latestDetail, 'name'),
                ]),
                'role' => $this->safeRoleLabel(data_get($latestDetail, 'role')),
                'created_at' => data_get($latestDetail, 'created_at'),
                'created_at_human' => data_get($latestDetail, 'created_at_human'),
            ],
            'histories' => $histories,
            // details tetap disediakan untuk kompatibilitas component lama, tetapi isinya sudah versi publik.
            'details' => $publicMessages,
            'public_messages' => $publicMessages,
        ];
    }

    private function normalizePublicMessages(mixed $details): array
    {
        return collect(is_array($details) ? $details : [])
            ->map(function ($item) {
                $role = strtolower((string) data_get($item, 'role'));
                $message = $this->sanitizePublicText(data_get($item, 'isi'));

                $attachments = collect(data_get($item, 'bukti', []))
                    // Untuk publik, bukti dari pelapor/warga tidak ditampilkan otomatis.
                    // Bukti dari OPD/petugas biasanya adalah dokumentasi tindak lanjut.
                    ->filter(fn () => $role !== 'warga')
                    ->map(fn ($file) => [
                        'id' => data_get($file, 'id'),
                        'name' => $this->sanitizePublicText(data_get($file, 'orgin_name') ?: data_get($file, 'name') ?: 'Bukti tindak lanjut'),
                        'extension' => data_get($file, 'extension'),
                        'path' => config('services.aduan.base_url') . $this->normalizePath(data_get($file, 'path')),
                    ])
                    ->filter(fn ($file) => filled($file['path']))
                    ->values()
                    ->all();

                return [
                    'id' => data_get($item, 'id'),
                    'message' => $message,
                    'message_limit' => $this->sanitizePublicText(data_get($item, 'isi_limit')),
                    'name' => $this->safeDisplayName($item),
                    'role' => $this->safeRoleLabel($role),
                    'role_key' => $role,
                    'created_at' => data_get($item, 'created_at'),
                    'created_at_human' => data_get($item, 'created_at_human'),
                    'attachments' => $attachments,
                ];
            })
            ->filter(fn ($item) => filled($item['message']) || count($item['attachments']) > 0)
            ->values()
            ->all();
    }

    private function getReportSummary(array $publicMessages): ?string
    {
        $citizenMessage = collect($publicMessages)
            ->first(fn ($item) => ($item['role_key'] ?? '') === 'warga');

        return data_get($citizenMessage, 'message');
    }

    private function sanitizePublicText(?string $text): string
    {
        $text = trim((string) $text);

        if ($text === '') {
            return '';
        }

        // Sensor NIK 16 digit.
        $text = preg_replace('/\b\d{16}\b/', '****************', $text) ?: $text;

        // Sensor nomor HP Indonesia dengan pemisah umum.
        $text = preg_replace('/\b(?:\+?62|0)8[\d\s\-\.]{7,16}\b/', '08**********', $text) ?: $text;

        // Sensor email.
        $text = preg_replace('/[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}/i', '[email disembunyikan]', $text) ?: $text;

        return Str::limit($text, 900, '...');
    }

    private function safeDisplayName(array $item): string
    {
        $role = strtolower((string) data_get($item, 'role'));

        return match ($role) {
            'warga' => 'Pelapor',
            'skpd' => 'Petugas OPD',
            'pool' => 'Petugas Aduan',
            'admin' => 'Admin Aduan',
            default => 'Petugas',
        };
    }

    private function safeRoleLabel(?string $role): string
    {
        $role = strtolower((string) $role);

        return match ($role) {
            'warga' => 'Pelapor',
            'skpd' => 'OPD',
            'pool' => 'Petugas',
            'admin' => 'Admin',
            default => 'Petugas',
        };
    }

    private function safeHistoryActor(array $item): ?string
    {
        $role = strtolower((string) data_get($item, 'user.role'));

        if ($role === '') {
            return null;
        }

        return $this->safeRoleLabel($role);
    }

    private function normalizePublicLocation(array $aduan): ?string
    {
        if (filled(data_get($aduan, 'full_location'))) {
            return data_get($aduan, 'full_location');
        }

        $kelurahan = data_get($aduan, 'nama_kelurahan');
        $kecamatan = data_get($aduan, 'nama_kecamatan');

        return collect([$kelurahan, $kecamatan ? 'Kecamatan ' . Str::title(Str::lower($kecamatan)) : null])
            ->filter()
            ->join(', ') ?: null;
    }

    private function normalizeSkpd(mixed $skpd): array
    {
        if (is_array($skpd)) {
            return collect($skpd)
                ->map(fn ($item) => is_array($item) ? data_get($item, 'label') : $item)
                ->filter()
                ->values()
                ->all();
        }

        if (filled($skpd)) {
            return [(string) $skpd];
        }

        return [];
    }

    private function normalizePath(?string $path): ?string
    {
        $path = trim((string) $path);

        if ($path === '') {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', '/'])) {
            return $path;
        }

        return '/' . ltrim($path, '/');
    }

    private function safeLogPayload(array $payload): array
    {
        return Arr::except($payload, [
            'nik',
            'email',
            'phone_number',
            'address',
            'alamat_pelapor',
            'latitude',
            'longitude',
            'ip_address',
            'user_agent',
            'user',
            'google2fa_secret',
        ]);
    }
}
