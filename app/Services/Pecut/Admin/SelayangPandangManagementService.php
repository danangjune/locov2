<?php

namespace App\Services\Pecut\Admin;

use App\Models\PortalPage;
use App\Models\PortalPageSection;
use App\Models\PortalPageStat;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SelayangPandangManagementService
{
    public function getIndexData(): array
    {
        $page = $this->ensurePage();

        $page->load([
            'sections' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order')->orderBy('id'),
            'stats' => fn ($query) => $query->where('is_active', true)->orderBy('sort_order')->orderBy('id'),
        ]);

        return [
            'page' => $this->mapPage($page),
            'sections' => $page->sections->map(fn (PortalPageSection $section) => $this->mapSection($section))->values()->all(),
            'stats' => $page->stats->map(fn (PortalPageStat $stat) => $this->mapStat($stat))->values()->all(),
        ];
    }

    public function updatePage(Request $request): PortalPage
    {
        $page = $this->ensurePage();

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'hero_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'remove_hero_image' => ['nullable', 'boolean'],
        ], [
            'title.required' => 'Judul halaman wajib diisi.',
            'hero_image.image' => 'File hero harus berupa gambar.',
            'hero_image.mimes' => 'Format gambar harus png, jpg, jpeg, atau webp.',
            'hero_image.max' => 'Ukuran gambar maksimal 4 MB.',
        ]);

        $payload = [
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'description' => $validated['description'] ?? null,
            'statusenabled' => true,
        ];

        if ($request->boolean('remove_hero_image')) {
            $this->deleteFile($page->hero_image);
            $payload['hero_image'] = null;
        }

        if ($request->hasFile('hero_image')) {
            $this->deleteFile($page->hero_image);
            $payload['hero_image'] = $this->storeImage($request->file('hero_image'));
        }

        $page->update($payload);

        return $page->refresh();
    }

    public function storeSection(Request $request): PortalPageSection
    {
        $page = $this->ensurePage();
        $validated = $this->validateSection($request, true);

        return PortalPageSection::query()->create([
            'portal_page_id' => $page->id,
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'content' => $validated['content'] ?? null,
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
            'image' => $request->hasFile('image') ? $this->storeImage($request->file('image')) : null,
            'is_active' => true,
        ]);
    }

    public function updateSection(Request $request, PortalPageSection $section): PortalPageSection
    {
        $validated = $this->validateSection($request, false);

        $payload = [
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'content' => $validated['content'] ?? null,
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
            'is_active' => true,
        ];

        if ($request->boolean('remove_image')) {
            $this->deleteFile($section->image);
            $payload['image'] = null;
        }

        if ($request->hasFile('image')) {
            $this->deleteFile($section->image);
            $payload['image'] = $this->storeImage($request->file('image'));
        }

        $section->update($payload);

        return $section->refresh();
    }

    public function destroySection(PortalPageSection $section): void
    {
        $section->update([
            'is_active' => false,
        ]);
    }

    public function storeStat(Request $request): PortalPageStat
    {
        $page = $this->ensurePage();
        $validated = $this->validateStat($request);

        return PortalPageStat::query()->create([
            'portal_page_id' => $page->id,
            'label' => $validated['label'],
            'value' => $validated['value'],
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
            'is_active' => true,
        ]);
    }

    public function updateStat(Request $request, PortalPageStat $stat): PortalPageStat
    {
        $validated = $this->validateStat($request);

        $stat->update([
            'label' => $validated['label'],
            'value' => $validated['value'],
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
            'is_active' => true,
        ]);

        return $stat->refresh();
    }

    public function destroyStat(PortalPageStat $stat): void
    {
        $stat->update([
            'is_active' => false,
        ]);
    }

    private function validateSection(Request $request, bool $imageRequired = false): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string', 'max:15000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'image' => [$imageRequired ? 'nullable' : 'nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:4096'],
            'remove_image' => ['nullable', 'boolean'],
        ], [
            'title.required' => 'Judul bagian wajib diisi.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format gambar harus png, jpg, jpeg, atau webp.',
            'image.max' => 'Ukuran gambar maksimal 4 MB.',
        ]);
    }

    private function validateStat(Request $request): array
    {
        return $request->validate([
            'label' => ['required', 'string', 'max:100'],
            'value' => ['required', 'string', 'max:100'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ], [
            'label.required' => 'Label statistik wajib diisi.',
            'value.required' => 'Nilai statistik wajib diisi.',
        ]);
    }

    private function ensurePage(): PortalPage
    {
        $page = PortalPage::query()->firstOrCreate(
            ['slug' => 'kediri'],
            [
                'title' => 'Selayang Pandang Kota Kediri',
                'subtitle' => 'Kota Kediri dalam satu pandang',
                'description' => 'Ringkasan profil Kota Kediri yang memuat wilayah, posisi geografis, luas kota, sejarah singkat, dan arah penguatan pelayanan publik sebagai KEDIRI NGANGENI.',
                'statusenabled' => true,
            ]
        );

        if ($page->sections()->count() === 0) {
            foreach ($this->defaultSections() as $section) {
                $page->sections()->create($section);
            }
        }

        if ($page->stats()->count() === 0) {
            foreach ($this->defaultStats() as $stat) {
                $page->stats()->create($stat);
            }
        }

        return $page;
    }

    private function mapPage(PortalPage $page): array
    {
        return [
            'id' => $page->id,
            'slug' => $page->slug,
            'title' => $page->title,
            'subtitle' => $page->subtitle,
            'description' => $page->description,
            'hero_image' => $this->makeFileUrl($page->hero_image),
            'raw_hero_image' => $page->hero_image,
            'updated_at' => optional($page->updated_at)->format('d-m-Y H:i'),
        ];
    }

    private function mapSection(PortalPageSection $section): array
    {
        return [
            'id' => $section->id,
            'title' => $section->title,
            'subtitle' => $section->subtitle,
            'content' => $section->content,
            'image' => $this->makeFileUrl($section->image),
            'raw_image' => $section->image,
            'sort_order' => $section->sort_order,
            'updated_at' => optional($section->updated_at)->format('d-m-Y H:i'),
        ];
    }

    private function mapStat(PortalPageStat $stat): array
    {
        return [
            'id' => $stat->id,
            'label' => $stat->label,
            'value' => $stat->value,
            'sort_order' => $stat->sort_order,
            'updated_at' => optional($stat->updated_at)->format('d-m-Y H:i'),
        ];
    }

    private function storeImage(?UploadedFile $file): ?string
    {
        if (! $file) {
            return null;
        }

        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension());
        $filename = now()->format('YmdHis') . '-' . Str::random(20) . '.' . $extension;

        $file->storeAs('public/portal-pages', $filename);

        return 'storage/portal-pages/' . $filename;
    }

    private function deleteFile(?string $path): void
    {
        $path = trim((string) $path);

        if ($path === '' || Str::startsWith($path, ['http://', 'https://', '/assets/'])) {
            return;
        }

        $relativePath = Str::after($path, 'storage/');

        if ($relativePath !== $path && Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }

    private function makeFileUrl(?string $path): ?string
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

    private function defaultSections(): array
    {
        return [
            [
                'title' => 'Profil Wilayah Kota Kediri',
                'subtitle' => 'Letak, posisi geografis, dan pembagian wilayah administratif Kota Kediri.',
                'image' => '/assets/img/kediri/harmoni.jpeg',
                'content' => "Profil Wilayah — Kota Kediri merupakan salah satu pusat pelayanan, perdagangan, pendidikan, dan aktivitas masyarakat di wilayah Kediri Raya.\n\nPosisi Geografis — Kota Kediri memiliki posisi strategis dan menjadi bagian penting dari kawasan Kediri Raya.\n\nLuas Kota — Wilayah Kota Kediri terbagi dalam tiga kecamatan, yaitu Mojoroto, Kota, dan Pesantren.",
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Sejarah Singkat Kota Kediri',
                'subtitle' => 'Jejak panjang Kediri dari masa kerajaan, kolonial, hingga perkembangan kota otonom.',
                'image' => '/assets/img/kediri/gunung-klotok.jpg',
                'content' => 'Kediri memiliki sejarah panjang yang menjadi bagian penting dari identitas dan perkembangan wilayahnya.',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Kediri, KEDIRI NGANGENI',
                'subtitle' => 'Penguatan pelayanan publik, investasi, dan kemudahan akses layanan masyarakat.',
                'image' => '/assets/img/kediri/taman-sekartaji.jpg',
                'content' => 'Kota Kediri terus memperkuat layanan publik yang mudah, cepat, responsif, dan terintegrasi.',
                'sort_order' => 3,
                'is_active' => true,
            ],
        ];
    }

    private function defaultStats(): array
    {
        return [
            ['label' => 'Kecamatan', 'value' => '3', 'sort_order' => 1, 'is_active' => true],
            ['label' => 'Kelurahan', 'value' => '46', 'sort_order' => 2, 'is_active' => true],
            ['label' => 'Luas Wilayah', 'value' => '67,2 km²', 'sort_order' => 3, 'is_active' => true],
        ];
    }
}
