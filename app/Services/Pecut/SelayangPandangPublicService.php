<?php

namespace App\Services\Pecut;

use Illuminate\Support\Str;

class SelayangPandangPublicService
{
    public function __construct(private readonly KediriKotaApiService $api)
    {
    }

    public function getData(): array
    {
        $sekilasResponse = $this->api->getSekilas();
        $sejarahResponse = $this->api->getSejarah();

        if (! $sekilasResponse['success'] && ! $sejarahResponse['success']) {
            return $this->fallbackData($sekilasResponse['error'] ?: $sejarahResponse['error']);
        }

        $sekilas = data_get($sekilasResponse, 'payload.data.sekilas', []);
        $statistik = data_get($sekilasResponse, 'payload.data.statistik', []);
        $sejarah = data_get($sejarahResponse, 'payload.data', []);

        $sekilasTitle = $this->titleCase(data_get($sekilas, 'title') ?: 'Sekilas Kota Kediri');
        $sekilasHtml = (string) data_get($sekilas, 'deskripsi', '');
        $sekilasText = $this->cleanText($sekilasHtml);
        $sekilasImage = data_get($sekilas, 'gambar');
        $historyDescriptions = $this->mapHistory($sejarah);

        $sections = [];

        if ($sekilasText !== '') {
            $sections[] = [
                'title' => $sekilasTitle,
                'subtitle' => 'Gambaran umum Kota Kediri sebagai kota perdagangan, jasa, pendidikan, industri, sejarah, dan budaya.',
                'image' => $sekilasImage ?: null,
                'description' => $this->extractParagraphs($sekilasHtml),
            ];
        }

        if (count($historyDescriptions)) {
            $sections[] = [
                'title' => 'Sejarah Singkat Kota Kediri',
                'subtitle' => 'Jejak awal Kediri dan perkembangan sejarah yang menjadi identitas kota.',
                'image' => $sekilasImage ?: null,
                'description' => $historyDescriptions,
            ];
        }

        if (! count($sections)) {
            return $this->fallbackData($sekilasResponse['error'] ?: $sejarahResponse['error']);
        }

        $stats = $this->mapStats($statistik);

        return [
            'page' => [
                'title' => 'Selayang Pandang Kota Kediri',
                'subtitle' => 'Kota Kediri dalam satu pandang',
                'description' => $sekilasText ?: 'Ringkasan profil Kota Kediri berdasarkan data website resmi Pemerintah Kota Kediri.',
                'hero_image' => $sekilasImage ?: null,
            ],
            'sections' => $sections,
            'stats' => count($stats) ? $stats : $this->fallbackStats(),
            'errors' => [
                'sekilas' => $sekilasResponse['error'],
                'sejarah' => $sejarahResponse['error'],
            ],
        ];
    }

    private function mapStats($statistik): array
    {
        if (! is_array($statistik)) {
            return [];
        }

        return array_values(array_filter([
            $this->statItem('Kecamatan', data_get($statistik, 'kecamatan')),
            $this->statItem('Kelurahan', data_get($statistik, 'kelurahan')),
            $this->statItem('Luas Wilayah', data_get($statistik, 'luas_wilayah'), 'Ha'),
            $this->statItem('Penduduk Laki-laki', data_get($statistik, 'laki_laki'), 'jiwa'),
            $this->statItem('Penduduk Perempuan', data_get($statistik, 'perempuan'), 'jiwa'),
        ]));
    }

    private function statItem(string $label, $value, ?string $suffix = null): ?array
    {
        if ($value === null || $value === '') {
            return null;
        }

        $numeric = preg_replace('/\D+/', '', (string) $value);
        $formatted = $numeric !== ''
            ? number_format((int) $numeric, 0, ',', '.')
            : (string) $value;

        return [
            'label' => $label,
            'value' => trim($formatted . ($suffix ? ' ' . $suffix : '')),
        ];
    }

    private function mapHistory($items): array
    {
        if (! is_array($items)) {
            return [];
        }

        return collect($items)
            ->map(fn ($item) => [
                'year' => (string) data_get($item, 'tahun', ''),
                'title' => $this->cleanText(data_get($item, 'judul', 'Sejarah Kota Kediri')),
                'description' => $this->cleanText(data_get($item, 'deskripsi', '')),
                'sort' => $this->extractYearNumber(data_get($item, 'tahun')),
            ])
            ->filter(fn ($item) => $item['title'] !== '' || $item['description'] !== '')
            ->sortBy('sort')
            ->map(function ($item) {
                $prefix = trim($item['year'] . ' — ' . $item['title']);
                $body = $item['description'];

                return trim($prefix . ($body ? ': ' . $body : ''));
            })
            ->values()
            ->all();
    }

    private function extractYearNumber(?string $year): int
    {
        preg_match('/\d+/', (string) $year, $matches);

        return isset($matches[0]) ? (int) $matches[0] : 0;
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

    private function titleCase(string $value): string
    {
        $value = str_replace(['-', '_'], ' ', $value);
        $value = $this->cleanText($value);

        return $value !== '' ? Str::title($value) : 'Sekilas Kota Kediri';
    }

    private function fallbackData(?string $error = null): array
    {
        return [
            'page' => [
                'title' => 'Selayang Pandang Kota Kediri',
                'subtitle' => 'Kota Kediri dalam satu pandang',
                'description' => 'Ringkasan profil Kota Kediri yang memuat wilayah, sejarah singkat, dan arah penguatan pelayanan publik.',
                'hero_image' => null,
            ],
            'sections' => [
                [
                    'title' => 'Sekilas Kota Kediri',
                    'subtitle' => 'Profil singkat Kota Kediri',
                    'image' => '/assets/img/kediri/harmoni.jpeg',
                    'description' => [
                        'Kota Kediri dikenal sebagai pusat perdagangan, jasa, pendidikan, industri, sejarah, dan budaya di Jawa Timur.',
                    ],
                ],
                [
                    'title' => 'Sejarah Singkat Kota Kediri',
                    'subtitle' => 'Jejak sejarah Kediri',
                    'image' => '/assets/img/kediri/gunung-klotok.jpg',
                    'description' => [
                        '879 M — Awal Berdirinya Kediri: Hari Jadi Kota Kediri ditetapkan berdasarkan Prasasti Harinjing.',
                    ],
                ],
            ],
            'stats' => $this->fallbackStats(),
            'errors' => [
                'kediri' => $error,
            ],
        ];
    }

    private function fallbackStats(): array
    {
        return [
            ['label' => 'Kecamatan', 'value' => '3'],
            ['label' => 'Kelurahan', 'value' => '46'],
            ['label' => 'Luas Wilayah', 'value' => '63.404 Ha'],
        ];
    }
}
