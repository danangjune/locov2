<?php

namespace App\Services\Pecut;

use App\Models\PanduanFile;
use App\Models\PortalPage;
use App\Models\PortalPageSection;
use App\Models\PortalPageStat;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SupportPageService
{
    public function getGuideData(Request $request): array
    {
        $search = $request->query('search');

        $files = $this->getGuideFiles($search);

        return [
            'steps' => [
                [
                    'title' => 'Cari Aplikasi',
                    'description' => 'Gunakan kolom pencarian, kategori, atau filter layanan untuk menemukan aplikasi yang dibutuhkan.',
                    'icon' => 'Search',
                ],
                [
                    'title' => 'Pilih Ruang Portal',
                    'description' => 'Pilih ASN Digital atau Public Digital sesuai kebutuhan pengguna dan jenis layanan.',
                    'icon' => 'Layers3',
                ],
                [
                    'title' => 'Buka Detail Layanan',
                    'description' => 'Klik kartu aplikasi untuk melihat informasi, kategori, status akses, dan tombol menuju layanan.',
                    'icon' => 'Eye',
                ],
                [
                    'title' => 'Gunakan Bantuan',
                    'description' => 'Gunakan menu bantuan apabila membutuhkan informasi kontak, FAQ, atau panduan lanjutan.',
                    'icon' => 'HelpCircle',
                ],
            ],
            'files' => [
                'items' => $files,
                'meta' => [
                    'total' => count($files),
                ],
            ],
            'errors' => [
                'files' => null,
            ],
        ];
    }

    public function getHelpData(Request $request): array
    {
        return [
            'faqs' => [
                [
                    'question' => 'Apa itu PECUT?',
                    'answer' => 'PECUT adalah portal satu pintu layanan digital Pemerintah Kota Kediri untuk memudahkan akses aplikasi ASN dan masyarakat.',
                ],
                [
                    'question' => 'Apakah semua aplikasi sudah SSO?',
                    'answer' => 'Belum semuanya. Status aplikasi dibedakan menjadi SSO, Non SSO, dan Web Link agar integrasi dapat dilakukan bertahap.',
                ],
                [
                    'question' => 'Bagaimana cara mencari aplikasi?',
                    'answer' => 'Buka halaman Aplikasi, lalu gunakan pencarian, kategori, atau filter layanan sesuai kebutuhan.',
                ],
                [
                    'question' => 'Apa perbedaan ASN Digital dan Public Digital?',
                    'answer' => 'ASN Digital berisi layanan internal aparatur pemerintah, sedangkan Public Digital berisi layanan yang dapat diakses masyarakat umum.',
                ],
            ],
            'contacts' => [
                [
                    'label' => 'Email',
                    'value' => 'bantuan@pecut.kedirikota.go.id',
                    'icon' => 'Mail',
                ],
                [
                    'label' => 'Telepon',
                    'value' => '(0354) 000000',
                    'icon' => 'Phone',
                ],
                [
                    'label' => 'Lokasi',
                    'value' => 'Command Center Kota Kediri',
                    'icon' => 'MapPinned',
                ],
            ],
            'quick_links' => [
                [
                    'label' => 'Lihat Aplikasi',
                    'href' => '/apps',
                ],
                [
                    'label' => 'Panduan Pengguna',
                    'href' => '/guide',
                ],
                [
                    'label' => 'Info Layanan',
                    'href' => '/info',
                ],
            ],
        ];
    }

    public function getInfoData(Request $request): array
    {
        return [
            'items' => [
                [
                    'title' => 'Status Layanan',
                    'description' => 'Informasi status layanan aktif, pemeliharaan, atau gangguan sementara pada aplikasi pemerintah Kota Kediri.',
                    'icon' => 'ShieldCheck',
                    'status' => 'Aktif',
                ],
                [
                    'title' => 'Pengumuman',
                    'description' => 'Informasi resmi terkait update aplikasi, integrasi, perubahan layanan, dan agenda pengembangan portal.',
                    'icon' => 'Bell',
                    'status' => 'Informasi',
                ],
                [
                    'title' => 'Integrasi Aplikasi',
                    'description' => 'Pemetaan aplikasi SSO, Non SSO, dan Web Link untuk pengembangan integrasi layanan digital berikutnya.',
                    'icon' => 'Database',
                    'status' => 'Bertahap',
                ],
            ],
            'timeline' => [
                [
                    'title' => 'Portal public tersedia',
                    'description' => 'Halaman public PECUT mulai dimigrasikan ke React Inertia.',
                    'status' => 'Selesai',
                ],
                [
                    'title' => 'Integrasi data aplikasi',
                    'description' => 'Data aplikasi dibaca melalui Laravel Service dan dikirim ke halaman React.',
                    'status' => 'Berjalan',
                ],
                [
                    'title' => 'Penguatan SSO dan dashboard',
                    'description' => 'Penguatan integrasi login dan akses dashboard dilakukan bertahap.',
                    'status' => 'Rencana',
                ],
            ],
        ];
    }

    public function getKediriData(Request $request): array
    {
        return app(SelayangPandangPublicService::class)->getData();
    }


    public function getStaticPageData(string $slug): array
    {
        try {
            $page = PortalPage::query()
                ->with([
                    'sections' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order')->orderBy('id'),
                ])
                ->where('slug', $slug)
                ->where('statusenabled', true)
                ->first();

            if (! $page) {
                return $this->fallbackStaticPageData($slug);
            }

            $sections = $page->sections
                ->map(fn (PortalPageSection $section) => [
                    'id' => $section->id,
                    'title' => $section->title,
                    'subtitle' => $section->subtitle,
                    'image' => $section->image ? $this->makeFileUrl($section->image) : null,
                    'description' => $this->splitParagraphs($section->content),
                ])
                ->values()
                ->all();

            $fallback = $this->fallbackStaticPageData($slug);

            return [
                'page' => [
                    'id' => $page->id,
                    'slug' => $page->slug,
                    'title' => $page->title ?: $fallback['page']['title'],
                    'subtitle' => $page->subtitle ?: $fallback['page']['subtitle'],
                    'description' => $page->description ?: $fallback['page']['description'],
                    'hero_image' => $page->hero_image ? $this->makeFileUrl($page->hero_image) : null,
                ],
                'sections' => count($sections) ? $sections : $fallback['sections'],
            ];
        } catch (\Throwable $th) {
            return $this->fallbackStaticPageData($slug);
        }
    }

    private function fallbackStaticPageData(string $slug): array
    {
        $fallback = [

            'help' => [
                'page' => [
                    'slug' => 'help',
                    'title' => 'Pusat Bantuan',
                    'subtitle' => 'Bantuan penggunaan portal PECUT',
                    'description' => 'Temukan informasi bantuan penggunaan portal PECUT, cara mencari aplikasi, memahami kategori layanan, dan menghubungi pengelola layanan apabila membutuhkan pendampingan.',
                    'hero_image' => null,
                ],
                'sections' => [
                    [
                        'title' => 'Cara Menggunakan PECUT',
                        'subtitle' => 'Langkah awal menggunakan portal',
                        'image' => null,
                        'description' => [
                            'Gunakan kolom pencarian atau menu Aplikasi untuk menemukan layanan digital yang dibutuhkan.',
                            'Setiap aplikasi memiliki informasi kategori, status akses, dan tombol menuju layanan agar pengguna dapat memahami fungsi aplikasi sebelum membukanya.',
                        ],
                    ],
                    [
                        'title' => 'Bantuan Akses Layanan',
                        'subtitle' => 'Jika mengalami kendala penggunaan',
                        'image' => null,
                        'description' => [
                            'Apabila pengguna mengalami kendala ketika membuka layanan, pastikan koneksi internet berjalan baik dan alamat layanan sudah benar.',
                            'Untuk kendala lebih lanjut, pengguna dapat menghubungi kanal bantuan yang disediakan oleh pengelola layanan.',
                        ],
                    ],
                ],
            ],
            'info' => [
                'page' => [
                    'slug' => 'info',
                    'title' => 'Info Layanan',
                    'subtitle' => 'Informasi umum layanan digital Kota Kediri',
                    'description' => 'Halaman ini memuat informasi umum terkait layanan digital yang tersedia melalui portal PECUT, termasuk status layanan, pengelompokan aplikasi, serta pengembangan integrasi layanan.',
                    'hero_image' => null,
                ],
                'sections' => [
                    [
                        'title' => 'Pengelompokan Layanan',
                        'subtitle' => 'Public Digital dan ASN Digital',
                        'image' => null,
                        'description' => [
                            'Layanan digital pada PECUT dikelompokkan agar pengguna lebih mudah menemukan aplikasi sesuai kebutuhan.',
                            'Public Digital ditujukan untuk layanan masyarakat umum, sedangkan ASN Digital ditujukan untuk kebutuhan internal aparatur Pemerintah Kota Kediri.',
                        ],
                    ],
                    [
                        'title' => 'Status dan Integrasi Layanan',
                        'subtitle' => 'Informasi akses dan pengembangan layanan',
                        'image' => null,
                        'description' => [
                            'Setiap aplikasi dapat memiliki status integrasi yang berbeda, seperti SSO, Non SSO, atau Web Link.',
                            'Pengembangan integrasi dilakukan secara bertahap untuk meningkatkan kemudahan akses dan tata kelola layanan digital.',
                        ],
                    ],
                ],
            ],
            'about' => [
                'page' => [
                    'slug' => 'about',
                    'title' => 'Tentang PECUT',
                    'subtitle' => 'Portal layanan digital Kota Kediri',
                    'description' => 'PECUT adalah portal layanan digital Pemerintah Kota Kediri yang dirancang untuk memudahkan masyarakat, ASN, dan perangkat daerah dalam mengakses layanan digital secara cepat, efisien, dan terpadu.',
                    'hero_image' => null,
                ],
                'sections' => [
                    [
                        'title' => 'Portal Efisien Cepat Mudah Terpadu',
                        'subtitle' => 'Satu pintu akses layanan digital',
                        'image' => null,
                        'description' => [
                            'PECUT menjadi pintu masuk layanan digital Kota Kediri agar pengguna tidak perlu mencari aplikasi secara terpisah.',
                            'Melalui portal ini, layanan public digital dan ASN digital dapat dikelompokkan, dicari, serta diakses dengan lebih mudah.',
                        ],
                    ],
                ],
            ],
            'privasi-data' => [
                'page' => [
                    'slug' => 'privasi-data',
                    'title' => 'Privasi Data',
                    'subtitle' => 'Kebijakan perlindungan dan penggunaan data',
                    'description' => 'Halaman ini menjelaskan gambaran umum pengelolaan data pada portal PECUT sebagai bagian dari layanan digital Pemerintah Kota Kediri.',
                    'hero_image' => null,
                ],
                'sections' => [
                    [
                        'title' => 'Penggunaan Data',
                        'subtitle' => 'Data digunakan sesuai kebutuhan layanan',
                        'image' => null,
                        'description' => [
                            'Data yang diproses melalui portal digunakan untuk kebutuhan akses layanan, peningkatan kualitas layanan, pencatatan aktivitas layanan, dan pengamanan sistem.',
                            'Pengelolaan data dilakukan secara proporsional sesuai kebutuhan penyelenggaraan layanan digital.',
                        ],
                    ],
                ],
            ],
            'syarat-ketentuan' => [
                'page' => [
                    'slug' => 'syarat-ketentuan',
                    'title' => 'Syarat & Ketentuan',
                    'subtitle' => 'Ketentuan penggunaan portal PECUT',
                    'description' => 'Halaman ini memuat ketentuan umum penggunaan portal PECUT agar layanan digital dapat digunakan secara tertib, aman, dan bertanggung jawab.',
                    'hero_image' => null,
                ],
                'sections' => [
                    [
                        'title' => 'Ketentuan Penggunaan',
                        'subtitle' => 'Gunakan layanan secara benar dan bertanggung jawab',
                        'image' => null,
                        'description' => [
                            'Pengguna wajib menggunakan portal PECUT untuk kebutuhan akses layanan digital Pemerintah Kota Kediri secara benar dan tidak menyalahgunakan tautan, data, maupun fitur yang tersedia.',
                            'Setiap layanan yang terhubung dapat memiliki ketentuan masing-masing sesuai sistem penyelenggara layanan.',
                        ],
                    ],
                ],
            ],
        ];

        return $fallback[$slug] ?? $fallback['about'];
    }

    private function splitParagraphs(?string $content): array
    {
        $content = trim((string) $content);

        if ($content === '') {
            return [];
        }

        return collect(preg_split('/\R{2,}|\R/', $content))
            ->map(fn ($paragraph) => trim((string) $paragraph))
            ->filter()
            ->values()
            ->all();
    }

    private function fallbackKediriData(): array
    {
        return [
            'page' => [
                'title' => 'Selayang Pandang Kota Kediri',
                'subtitle' => 'Kota Kediri dalam satu pandang',
                'description' => 'Ringkasan profil Kota Kediri yang memuat wilayah, posisi geografis, luas kota, sejarah singkat, dan arah penguatan pelayanan publik sebagai The Service City.',
                'hero_image' => null,
            ],
            'sections' => [
                [
                    'title' => 'Profil Wilayah Kota Kediri',
                    'subtitle' => 'Letak, posisi geografis, dan pembagian wilayah administratif Kota Kediri.',
                    'image' => '/assets/img/kediri/harmoni.jpeg',
                    'description' => [
                        'Profil Wilayah — Kota Kediri merupakan salah satu pusat pelayanan, perdagangan, pendidikan, dan aktivitas masyarakat di wilayah Kediri Raya.',
                        'Posisi Geografis — Kota Kediri memiliki posisi strategis dan menjadi bagian penting dari kawasan Kediri Raya.',
                        'Luas Kota — Wilayah Kota Kediri terbagi dalam tiga kecamatan, yaitu Mojoroto, Kota, dan Pesantren.',
                    ],
                ],
                [
                    'title' => 'Sejarah Singkat Kota Kediri',
                    'subtitle' => 'Jejak panjang Kediri dari masa kerajaan, kolonial, hingga perkembangan kota otonom.',
                    'image' => '/assets/img/kediri/gunung-klotok.jpg',
                    'description' => [
                        'Kediri memiliki sejarah panjang yang menjadi bagian penting dari identitas dan perkembangan wilayahnya.',
                    ],
                ],
                [
                    'title' => 'Kediri, The Service City',
                    'subtitle' => 'Penguatan pelayanan publik, investasi, dan kemudahan akses layanan masyarakat.',
                    'image' => '/assets/img/kediri/taman-sekartaji.jpg',
                    'description' => [
                        'Kota Kediri terus memperkuat layanan publik yang mudah, cepat, responsif, dan terintegrasi.',
                    ],
                ],
            ],
            'stats' => [
                ['label' => 'Kecamatan', 'value' => '3'],
                ['label' => 'Kelurahan', 'value' => '46'],
                ['label' => 'Luas Wilayah', 'value' => '67,2 km²'],
            ],
        ];
    }

    private function getGuideFiles(?string $search = null): array
    {
        try {
            $query = PanduanFile::query()
                ->where('statusenabled', true);

            if ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('name_file', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('typefile', 'like', "%{$search}%");
                });
            }

            return $query
                ->orderBy('id', 'desc')
                ->get()
                ->map(fn ($item) => [
                    'id' => $item->id,
                    'name' => $item->name_file ?: 'File Panduan',
                    'description' => $item->description ?: 'Dokumen panduan penggunaan PECUT.',
                    'type' => $item->typefile ?: 'file',
                    'url' => $this->makeFileUrl($item->asset_file),
                ])
                ->values()
                ->all();
        } catch (\Throwable $th) {
            return [];
        }
    }

    private function makeFileUrl(?string $path): string
    {
        $path = trim((string) $path);

        if ($path === '') {
            return '#';
        }

        if (Str::startsWith($path, ['http://', 'https://', '/'])) {
            return $path;
        }

        return '/' . ltrim($path, '/');
    }
}
