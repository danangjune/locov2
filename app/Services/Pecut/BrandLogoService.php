<?php

namespace App\Services\Pecut;

use App\Models\PortalLogoSetting;
use Illuminate\Support\Facades\Storage;

class BrandLogoService
{
    public function getLogoData(): array
    {
        $setting = PortalLogoSetting::query()
            ->where('is_active', true)
            ->latest('id')
            ->first();

        $useThemeColors = (bool) ($setting?->use_theme_colors ?? true);

        return [
            'app_name' => $setting?->app_name ?: 'PECUT',
            'alt_text' => $setting?->alt_text ?: 'PECUT Kota Kediri',

            // Legacy image fallback. Dipakai kalau SVG belum diupload.
            'header_logo' => $this->assetUrl($setting?->header_logo) ?: '/images/logo-pecut-full.png',
            'footer_logo' => $this->assetUrl($setting?->footer_logo) ?: $this->assetUrl($setting?->header_logo) ?: '/images/logo-pecut-full.png',
            'icon_logo' => $this->assetUrl($setting?->icon_logo) ?: '/images/logo-pecut-icon.png',
            'favicon' => $this->assetUrl($setting?->favicon) ?: null,

            // SVG dynamic logo.
            'logo_svg' => $this->assetUrl($setting?->logo_svg),
            'logo_svg_inline' => $setting?->logo_svg_inline,
            'use_theme_colors' => $useThemeColors,
            'colors' => [
                'primary' => $useThemeColors ? 'var(--theme-primary)' : ($setting?->logo_primary_color ?: '#2da8fe'),
                'secondary' => $useThemeColors ? 'var(--theme-secondary)' : ($setting?->logo_secondary_color ?: '#0158b1'),
                'accent' => $useThemeColors ? 'var(--theme-accent)' : ($setting?->logo_accent_color ?: '#38bdf8'),
                'text' => $useThemeColors ? 'var(--theme-secondary)' : ($setting?->logo_text_color ?: '#0158b1'),
            ],
            'custom_colors' => [
                'primary' => $setting?->logo_primary_color ?: '#2da8fe',
                'secondary' => $setting?->logo_secondary_color ?: '#0158b1',
                'accent' => $setting?->logo_accent_color ?: '#38bdf8',
                'text' => $setting?->logo_text_color ?: '#0158b1',
            ],
            'updated_at' => $setting?->updated_at?->timestamp,
        ];
    }

    private function assetUrl(?string $path): ?string
    {
        $path = trim((string) $path);

        if ($path === '') {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://') || str_starts_with($path, '/')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
