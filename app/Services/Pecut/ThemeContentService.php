<?php

namespace App\Services\Pecut;

use App\Models\PortalThemeSetting;

class ThemeContentService
{
    public function getThemeData(): array
    {
        $setting = PortalThemeSetting::query()
            ->where('is_active', true)
            ->orderBy('id')
            ->first();

        if (!$setting) {
            $setting = $this->createDefaultSetting();
        }

        return $this->mapTheme($setting);
    }

    public function defaultColors(): array
    {
        return [
            'primary_color' => '#1E6FA5',
            'secondary_color' => '#15547D',
            'accent_color' => '#38BDF8',
            'background_color' => '#F8FAFC',
            'surface_color' => '#FFFFFF',
            'text_color' => '#0F172A',
            'muted_text_color' => '#64748B',
        ];
    }

    private function createDefaultSetting(): PortalThemeSetting
    {
        return PortalThemeSetting::query()->firstOrCreate(
            ['key' => 'default'],
            array_merge([
                'name' => 'Tema PECUT',
                'is_active' => true,
            ], $this->defaultColors())
        );
    }

    private function mapTheme(PortalThemeSetting $setting): array
    {
        $colors = array_merge($this->defaultColors(), [
            'primary_color' => $this->validHex($setting->primary_color, '#1E6FA5'),
            'secondary_color' => $this->validHex($setting->secondary_color, '#15547D'),
            'accent_color' => $this->validHex($setting->accent_color, '#38BDF8'),
            'background_color' => $this->validHex($setting->background_color, '#F8FAFC'),
            'surface_color' => $this->validHex($setting->surface_color, '#FFFFFF'),
            'text_color' => $this->validHex($setting->text_color, '#0F172A'),
            'muted_text_color' => $this->validHex($setting->muted_text_color, '#64748B'),
        ]);

        return [
            'id' => $setting->id,
            'name' => $setting->name ?: 'Tema PECUT',
            'colors' => $colors,
            'css' => [
                '--theme-primary' => $colors['primary_color'],
                '--theme-secondary' => $colors['secondary_color'],
                '--theme-accent' => $colors['accent_color'],
                '--theme-background' => $colors['background_color'],
                '--theme-surface' => $colors['surface_color'],
                '--theme-text' => $colors['text_color'],
                '--theme-muted' => $colors['muted_text_color'],
            ],
        ];
    }

    private function validHex(?string $value, string $fallback): string
    {
        $value = trim((string) $value);

        if (preg_match('/^#[0-9A-Fa-f]{6}$/', $value)) {
            return strtoupper($value);
        }

        return strtoupper($fallback);
    }
}
