<?php

namespace App\Services\Pecut\Admin;

use App\Models\PortalThemeSetting;
use App\Services\Pecut\ThemeContentService;

class ThemeSettingManagementService
{
    public function getPageData(): array
    {
        $setting = $this->getSetting();
        $themeContent = app(ThemeContentService::class);

        return [
            'setting' => $this->mapSetting($setting),
            'defaults' => $themeContent->defaultColors(),
            'examples' => [
                ['name' => 'Biru PECUT', 'primary_color' => '#1E6FA5', 'secondary_color' => '#15547D', 'accent_color' => '#38BDF8'],
                ['name' => 'Ungu Modern', 'primary_color' => '#6D28D9', 'secondary_color' => '#4C1D95', 'accent_color' => '#A78BFA'],
                ['name' => 'Hijau Layanan', 'primary_color' => '#059669', 'secondary_color' => '#065F46', 'accent_color' => '#34D399'],
                ['name' => 'Merah Kediri', 'primary_color' => '#DC2626', 'secondary_color' => '#991B1B', 'accent_color' => '#F87171'],
            ],
        ];
    }

    public function update(array $validated): PortalThemeSetting
    {
        $setting = $this->getSetting();

        $setting->update([
            'name' => $validated['name'] ?? 'Tema PECUT',
            'primary_color' => strtoupper($validated['primary_color']),
            'secondary_color' => strtoupper($validated['secondary_color']),
            'accent_color' => strtoupper($validated['accent_color']),
            'background_color' => strtoupper($validated['background_color']),
            'surface_color' => strtoupper($validated['surface_color']),
            'text_color' => strtoupper($validated['text_color']),
            'muted_text_color' => strtoupper($validated['muted_text_color']),
            'is_active' => true,
        ]);

        return $setting->refresh();
    }

    public function reset(): PortalThemeSetting
    {
        $setting = $this->getSetting();
        $defaults = app(ThemeContentService::class)->defaultColors();

        $setting->update(array_merge([
            'name' => 'Tema PECUT',
            'is_active' => true,
        ], $defaults));

        return $setting->refresh();
    }

    private function getSetting(): PortalThemeSetting
    {
        return PortalThemeSetting::query()->firstOrCreate(
            ['key' => 'default'],
            array_merge([
                'name' => 'Tema PECUT',
                'is_active' => true,
            ], app(ThemeContentService::class)->defaultColors())
        );
    }

    private function mapSetting(PortalThemeSetting $setting): array
    {
        return [
            'id' => $setting->id,
            'name' => $setting->name,
            'primary_color' => $setting->primary_color,
            'secondary_color' => $setting->secondary_color,
            'accent_color' => $setting->accent_color,
            'background_color' => $setting->background_color,
            'surface_color' => $setting->surface_color,
            'text_color' => $setting->text_color,
            'muted_text_color' => $setting->muted_text_color,
        ];
    }
}
