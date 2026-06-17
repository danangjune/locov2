<?php

namespace App\Services\Pecut\Admin;

use App\Models\FooterSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FooterSettingManagementService
{
    public function getIndexData(): array
    {
        $setting = $this->getOrCreateSetting();

        return [
            'setting' => $this->mapSetting($setting),
        ];
    }

    public function update(Request $request): FooterSetting
    {
        $setting = $this->getOrCreateSetting();

        $validated = $request->validate([
            'logo' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp,svg', 'max:2048'],
            'logo_path' => ['nullable', 'string', 'max:1000'],
            'description' => ['required', 'string', 'max:2000'],
            'copyright_text' => ['nullable', 'string', 'max:255'],
            'bottom_text' => ['nullable', 'string', 'max:255'],
            'statusenabled' => ['nullable', 'boolean'],
        ]);

        $payload = [
            'description' => $validated['description'],
            'copyright_text' => $validated['copyright_text'] ?: ('© ' . date('Y') . ' PECUT Kota Kediri. Portal layanan digital satu pintu Pemerintah Kota Kediri.'),
            'bottom_text' => $validated['bottom_text'] ?: 'PECUT · Portal Efisien Cepat Mudah Terpadu',
            'statusenabled' => $request->boolean('statusenabled', true),
        ];

        if ($request->hasFile('logo')) {
            $this->deleteImage($setting->logo_path);
            $payload['logo_path'] = $this->storeLogo($request);
        } elseif (array_key_exists('logo_path', $validated) && trim((string) $validated['logo_path']) !== '') {
            $payload['logo_path'] = trim((string) $validated['logo_path']);
        }

        $setting->update($payload);

        return $setting->refresh();
    }

    public function getOrCreateSetting(): FooterSetting
    {
        return FooterSetting::query()->firstOrCreate(
            ['id' => 1],
            [
                'logo_path' => '/images/logo-pecut-full-transparan.png',
                'description' => 'PECUT adalah portal layanan digital Pemerintah Kota Kediri untuk memudahkan masyarakat, ASN, dan perangkat daerah menemukan layanan digital dalam satu pintu.',
                'copyright_text' => '© ' . date('Y') . ' PECUT Kota Kediri. Portal layanan digital satu pintu Pemerintah Kota Kediri.',
                'bottom_text' => 'PECUT · Portal Efisien Cepat Mudah Terpadu',
                'statusenabled' => true,
            ]
        );
    }

    private function mapSetting(FooterSetting $setting): array
    {
        return [
            'id' => $setting->id,
            'logo_path' => $this->normalizeImage($setting->logo_path),
            'logo_path_raw' => $setting->logo_path,
            'description' => $setting->description,
            'copyright_text' => $setting->copyright_text,
            'bottom_text' => $setting->bottom_text,
            'statusenabled' => (bool) $setting->statusenabled,
        ];
    }

    private function storeLogo(Request $request): ?string
    {
        if (! $request->hasFile('logo')) {
            return null;
        }

        $fileName = $request->file('logo')->hashName();
        $request->file('logo')->storeAs('public/footer-settings', $fileName);

        return 'storage/footer-settings/' . $fileName;
    }

    private function deleteImage(?string $image): void
    {
        $image = trim((string) $image);

        if ($image === '' || str_starts_with($image, 'http://') || str_starts_with($image, 'https://') || str_starts_with($image, '/images/')) {
            return;
        }

        $path = str_replace('storage/', 'public/', ltrim($image, '/'));

        if (Storage::exists($path)) {
            Storage::delete($path);
        }
    }

    private function normalizeImage(?string $image): ?string
    {
        $image = trim((string) $image);

        if ($image === '') {
            return null;
        }

        if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://') || str_starts_with($image, '/')) {
            return $image;
        }

        return '/' . ltrim($image, '/');
    }
}
