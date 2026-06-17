<?php

namespace App\Services\Pecut\Admin;

use App\Models\PortalPage;
use App\Models\PortalPageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PortalPageManagementService
{
    private array $managedPages = [
        'about' => [
            'label' => 'Tentang PECUT',
            'title' => 'Tentang PECUT',
            'subtitle' => 'Portal layanan digital Kota Kediri',
            'description' => 'PECUT adalah portal layanan digital Pemerintah Kota Kediri yang dirancang untuk memudahkan masyarakat, ASN, dan perangkat daerah dalam mengakses layanan digital secara cepat, efisien, dan terpadu.',
            'sections' => [
                [
                    'title' => 'Portal Efisien Cepat Mudah Terpadu',
                    'subtitle' => 'Satu pintu akses layanan digital',
                    'content' => "PECUT menjadi pintu masuk layanan digital Kota Kediri agar pengguna tidak perlu mencari aplikasi secara terpisah.\n\nMelalui portal ini, layanan public digital dan ASN digital dapat dikelompokkan, dicari, serta diakses dengan lebih mudah.",
                    'sort_order' => 1,
                ],
                [
                    'title' => 'Arah Pengembangan',
                    'subtitle' => 'Terintegrasi, mudah dicari, dan responsif',
                    'content' => "Pengembangan PECUT diarahkan untuk memperkuat integrasi layanan, kemudahan akses, dan penyajian informasi aplikasi yang lebih jelas bagi pengguna.",
                    'sort_order' => 2,
                ],
            ],
        ],
        'privasi-data' => [
            'label' => 'Privasi Data',
            'title' => 'Privasi Data',
            'subtitle' => 'Kebijakan perlindungan dan penggunaan data',
            'description' => 'Halaman ini menjelaskan gambaran umum pengelolaan data pada portal PECUT sebagai bagian dari layanan digital Pemerintah Kota Kediri.',
            'sections' => [
                [
                    'title' => 'Penggunaan Data',
                    'subtitle' => 'Data digunakan sesuai kebutuhan layanan',
                    'content' => "Data yang diproses melalui portal digunakan untuk kebutuhan akses layanan, peningkatan kualitas layanan, pencatatan aktivitas layanan, dan pengamanan sistem.\n\nPengelolaan data dilakukan secara proporsional sesuai kebutuhan penyelenggaraan layanan digital.",
                    'sort_order' => 1,
                ],
                [
                    'title' => 'Keamanan Data',
                    'subtitle' => 'Pengamanan akses dan informasi layanan',
                    'content' => "Pemerintah Kota Kediri berupaya menjaga keamanan data melalui pengaturan akses, pemantauan sistem, dan penerapan tata kelola keamanan informasi sesuai kebutuhan layanan.",
                    'sort_order' => 2,
                ],
            ],
        ],
        'syarat-ketentuan' => [
            'label' => 'Syarat & Ketentuan',
            'title' => 'Syarat & Ketentuan',
            'subtitle' => 'Ketentuan penggunaan portal PECUT',
            'description' => 'Halaman ini memuat ketentuan umum penggunaan portal PECUT agar layanan digital dapat digunakan secara tertib, aman, dan bertanggung jawab.',
            'sections' => [
                [
                    'title' => 'Ketentuan Penggunaan',
                    'subtitle' => 'Gunakan layanan secara benar dan bertanggung jawab',
                    'content' => "Pengguna wajib menggunakan portal PECUT untuk kebutuhan akses layanan digital Pemerintah Kota Kediri secara benar dan tidak menyalahgunakan tautan, data, maupun fitur yang tersedia.\n\nSetiap layanan yang terhubung dapat memiliki ketentuan masing-masing sesuai sistem penyelenggara layanan.",
                    'sort_order' => 1,
                ],
                [
                    'title' => 'Perubahan Informasi',
                    'subtitle' => 'Konten dapat diperbarui sesuai kebutuhan layanan',
                    'content' => "Informasi, tautan aplikasi, panduan, dan ketentuan pada portal dapat diperbarui sewaktu-waktu untuk menyesuaikan perkembangan layanan digital.",
                    'sort_order' => 2,
                ],
            ],
        ],
    ];

    public function getIndexData(Request $request): array
    {
        $this->ensureDefaultPages();

        $selectedSlug = $request->query('slug', 'about');

        if (! array_key_exists($selectedSlug, $this->managedPages)) {
            $selectedSlug = 'about';
        }

        $pages = PortalPage::query()
            ->with(['sections' => fn ($query) => $query->orderBy('sort_order')->orderBy('id')])
            ->whereIn('slug', array_keys($this->managedPages))
            ->orderByRaw("FIELD(slug, 'about', 'privasi-data', 'syarat-ketentuan')")
            ->get()
            ->map(fn (PortalPage $page) => $this->mapPage($page))
            ->values()
            ->all();

        $selectedPage = collect($pages)->firstWhere('slug', $selectedSlug) ?: ($pages[0] ?? null);

        return [
            'pages' => $pages,
            'selected_page' => $selectedPage,
            'managed_pages' => collect($this->managedPages)
                ->map(fn ($config, $slug) => [
                    'slug' => $slug,
                    'label' => $config['label'],
                ])
                ->values()
                ->all(),
        ];
    }

    public function updatePage(Request $request, PortalPage $page): PortalPage
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'hero_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:3072'],
            'statusenabled' => ['nullable'],
        ]);

        $payload = [
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'description' => $validated['description'] ?? null,
            'statusenabled' => $request->boolean('statusenabled', true),
        ];

        if ($request->hasFile('hero_image')) {
            $this->deleteFile($page->hero_image);
            $payload['hero_image'] = $request->file('hero_image')->store('portal-pages', 'public');
        }

        $page->update($payload);

        return $page;
    }

    public function storeSection(Request $request, PortalPage $page): PortalPageSection
    {
        $validated = $this->validateSection($request);

        $payload = $this->sectionPayload($request, $validated);
        $payload['portal_page_id'] = $page->id;

        if ($request->hasFile('image')) {
            $payload['image'] = $request->file('image')->store('portal-pages/sections', 'public');
        }

        return PortalPageSection::query()->create($payload);
    }

    public function updateSection(Request $request, PortalPageSection $section): PortalPageSection
    {
        $validated = $this->validateSection($request);

        $payload = $this->sectionPayload($request, $validated);

        if ($request->hasFile('image')) {
            $this->deleteFile($section->image);
            $payload['image'] = $request->file('image')->store('portal-pages/sections', 'public');
        }

        $section->update($payload);

        return $section;
    }

    public function destroySection(PortalPageSection $section): void
    {
        $this->deleteFile($section->image);
        $section->delete();
    }

    public function ensureDefaultPages(): void
    {
        foreach ($this->managedPages as $slug => $config) {
            $page = PortalPage::query()->firstOrCreate(
                ['slug' => $slug],
                [
                    'title' => $config['title'],
                    'subtitle' => $config['subtitle'],
                    'description' => $config['description'],
                    'statusenabled' => true,
                ]
            );

            if ($page->sections()->count() === 0) {
                foreach ($config['sections'] as $section) {
                    $page->sections()->create([
                        'title' => $section['title'],
                        'subtitle' => $section['subtitle'],
                        'content' => $section['content'],
                        'sort_order' => $section['sort_order'],
                        'is_active' => true,
                    ]);
                }
            }
        }
    }

    private function validateSection(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:3072'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable'],
        ]);
    }

    private function sectionPayload(Request $request, array $validated): array
    {
        return [
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'content' => $validated['content'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $request->boolean('is_active', true),
        ];
    }

    private function mapPage(PortalPage $page): array
    {
        return [
            'id' => $page->id,
            'slug' => $page->slug,
            'label' => $this->managedPages[$page->slug]['label'] ?? $page->title,
            'title' => $page->title,
            'subtitle' => $page->subtitle,
            'description' => $page->description,
            'hero_image' => $this->fileUrl($page->hero_image),
            'statusenabled' => (bool) $page->statusenabled,
            'sections' => $page->sections
                ->map(fn (PortalPageSection $section) => [
                    'id' => $section->id,
                    'title' => $section->title,
                    'subtitle' => $section->subtitle,
                    'content' => $section->content,
                    'image' => $this->fileUrl($section->image),
                    'sort_order' => $section->sort_order,
                    'is_active' => (bool) $section->is_active,
                ])
                ->values()
                ->all(),
        ];
    }

    private function fileUrl(?string $path): ?string
    {
        $path = trim((string) $path);

        if ($path === '') {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', '/'])) {
            return $path;
        }

        return Storage::url($path);
    }

    private function deleteFile(?string $path): void
    {
        $path = trim((string) $path);

        if ($path === '' || Str::startsWith($path, ['http://', 'https://', '/'])) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
