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
            'description' => $setting->description,
            'copyright_text' => $setting->copyright_text,
            'bottom_text' => $setting->bottom_text,
            'statusenabled' => (bool) $setting->statusenabled,
        ];
    }
}
