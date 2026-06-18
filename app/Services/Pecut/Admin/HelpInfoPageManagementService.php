<?php

namespace App\Services\Pecut\Admin;

use App\Models\PortalPage;
use App\Models\PortalPageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class HelpInfoPageManagementService
{
    private array $managedPages = [
        'help' => [
            'label' => 'Bantuan',
            'title' => 'Pusat Bantuan',
            'subtitle' => 'Bantuan penggunaan portal PECUT',
            'description' => 'Temukan informasi bantuan penggunaan portal PECUT, cara mencari aplikasi, memahami kategori layanan, dan menghubungi pengelola layanan apabila membutuhkan pendampingan.',
            'sections' => [
                [
                    'title' => 'Cara Menggunakan PECUT',
                    'subtitle' => 'Langkah awal menggunakan portal',
                    'content' => "Gunakan kolom pencarian atau menu Aplikasi untuk menemukan layanan digital yang dibutuhkan.\n\nSetiap aplikasi memiliki informasi kategori, status akses, dan tombol menuju layanan agar pengguna dapat memahami fungsi aplikasi sebelum membukanya.",
                    'sort_order' => 1,
                ],
                [
                    'title' => 'Bantuan Akses Layanan',
                    'subtitle' => 'Jika mengalami kendala penggunaan',
                    'content' => "Apabila pengguna mengalami kendala ketika membuka layanan, pastikan koneksi internet berjalan baik dan alamat layanan sudah benar.\n\nUntuk kendala lebih lanjut, pengguna dapat menghubungi kanal bantuan yang disediakan oleh pengelola layanan.",
                    'sort_order' => 2,
                ],
            ],
        ],
        'info' => [
            'label' => 'Info Layanan',
            'title' => 'Info Layanan',
            'subtitle' => 'Informasi umum layanan digital Kota Kediri',
            'description' => 'Halaman ini memuat informasi umum terkait layanan digital yang tersedia melalui portal PECUT, termasuk status layanan, pengelompokan aplikasi, serta pengembangan integrasi layanan.',
            'sections' => [
                [
                    'title' => 'Pengelompokan Layanan',
                    'subtitle' => 'Public Digital dan ASN Digital',
                    'content' => "Layanan digital pada PECUT dikelompokkan agar pengguna lebih mudah menemukan aplikasi sesuai kebutuhan.\n\nPublic Digital ditujukan untuk layanan masyarakat umum, sedangkan ASN Digital ditujukan untuk kebutuhan internal aparatur Pemerintah Kota Kediri.",
                    'sort_order' => 1,
                ],
                [
                    'title' => 'Status dan Integrasi Layanan',
                    'subtitle' => 'Informasi akses dan pengembangan layanan',
                    'content' => "Setiap aplikasi dapat memiliki status integrasi yang berbeda, seperti SSO, Non SSO, atau Web Link.\n\nPengembangan integrasi dilakukan secara bertahap untuk meningkatkan kemudahan akses dan tata kelola layanan digital.",
                    'sort_order' => 2,
                ],
            ],
        ],
    ];

    public function getIndexData(Request $request): array
    {
        $this->ensureDefaultPages();

        $selectedSlug = $request->query('slug', 'help');

        if (! array_key_exists($selectedSlug, $this->managedPages)) {
            $selectedSlug = 'help';
        }

        $pages = PortalPage::query()
            ->with(['sections' => fn ($query) => $query->orderBy('sort_order')->orderBy('id')])
            ->whereIn('slug', array_keys($this->managedPages))
            ->orderByRaw("FIELD(slug, 'help', 'info')")
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
        $this->abortIfNotManaged($page);

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
        $this->abortIfNotManaged($page);

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
        $section->loadMissing('page');
        $this->abortIfNotManaged($section->page);

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
        $section->loadMissing('page');
        $this->abortIfNotManaged($section->page);

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

    private function abortIfNotManaged(?PortalPage $page): void
    {
        abort_unless($page && array_key_exists($page->slug, $this->managedPages), 404);
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

        return Storage::disk('public')->url($path);
    }

    private function deleteFile(?string $path): void
    {
        $path = trim((string) $path);

        if ($path === '' || Str::startsWith($path, ['http://', 'https://', '/'])) {
            return;
        }

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
