<?php

namespace App\Services\Pecut\Admin;

use App\Models\PortalLogoSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LogoSettingManagementService
{
    public function getSetting(): PortalLogoSetting
    {
        return PortalLogoSetting::query()->latest('id')->first()
            ?: PortalLogoSetting::query()->create([
                'app_name' => 'PECUT',
                'alt_text' => 'PECUT Kota Kediri',
                'logo_primary_color' => '#2da8fe',
                'logo_secondary_color' => '#0158b1',
                'logo_accent_color' => '#38bdf8',
                'logo_text_color' => '#0158b1',
                'use_theme_colors' => true,
                'is_active' => true,
            ]);
    }

    public function getPageData(): array
    {
        $setting = $this->getSetting();

        return [
            'setting' => [
                'id' => $setting->id,
                'app_name' => $setting->app_name ?: 'PECUT',
                'alt_text' => $setting->alt_text ?: 'PECUT Kota Kediri',
                'logo_svg' => $this->assetUrl($setting->logo_svg),
                'logo_svg_inline' => $setting->logo_svg_inline,
                'favicon' => $this->assetUrl($setting->favicon),
                'logo_primary_color' => $setting->logo_primary_color ?: '#2da8fe',
                'logo_secondary_color' => $setting->logo_secondary_color ?: '#0158b1',
                'logo_accent_color' => $setting->logo_accent_color ?: '#38bdf8',
                'logo_text_color' => $setting->logo_text_color ?: '#0158b1',
                'use_theme_colors' => (bool) $setting->use_theme_colors,
                'is_active' => (bool) $setting->is_active,
                'updated_at' => optional($setting->updated_at)->format('d M Y H:i'),
            ],
            'defaults' => [
                'logo_svg' => '/images/logo-pecut-vector-sample.svg',
                'primary' => '#2da8fe',
                'secondary' => '#0158b1',
                'accent' => '#38bdf8',
                'text' => '#0158b1',
            ],
        ];
    }

    public function update(Request $request): PortalLogoSetting
    {
        $setting = $this->getSetting();

        $payload = [
            'app_name' => $request->input('app_name') ?: 'PECUT',
            'alt_text' => $request->input('alt_text') ?: 'PECUT Kota Kediri',
            'logo_primary_color' => $this->normalizeHex($request->input('logo_primary_color'), '#2da8fe'),
            'logo_secondary_color' => $this->normalizeHex($request->input('logo_secondary_color'), '#0158b1'),
            'logo_accent_color' => $this->normalizeHex($request->input('logo_accent_color'), '#38bdf8'),
            'logo_text_color' => $this->normalizeHex($request->input('logo_text_color'), '#0158b1'),
            'use_theme_colors' => $request->boolean('use_theme_colors'),
            'is_active' => true,
        ];

        if ($request->boolean('remove_logo_svg')) {
            $this->deleteAsset($setting->logo_svg);
            $payload['logo_svg'] = null;
            $payload['logo_svg_inline'] = null;
        }

        if ($request->hasFile('logo_svg')) {
            $this->deleteAsset($setting->logo_svg);

            $uploaded = $request->file('logo_svg');
            $rawSvg = file_get_contents($uploaded->getRealPath());
            $sanitizedSvg = $this->sanitizeSvg($rawSvg ?: '');

            $payload['logo_svg'] = $this->storeFile($request, 'logo_svg', 'svg-logo');
            $payload['logo_svg_inline'] = $sanitizedSvg;
        }

        if ($request->boolean('remove_favicon')) {
            $this->deleteAsset($setting->favicon);
            $payload['favicon'] = null;
        }

        if ($request->hasFile('favicon')) {
            $this->deleteAsset($setting->favicon);
            $payload['favicon'] = $this->storeFile($request, 'favicon', 'favicon');
        }

        $setting->update($payload);

        return $setting->refresh();
    }

    public function reset(): PortalLogoSetting
    {
        $setting = $this->getSetting();

        $this->deleteAsset($setting->logo_svg);
        $this->deleteAsset($setting->favicon);

        $setting->update([
            'app_name' => 'PECUT',
            'alt_text' => 'PECUT Kota Kediri',
            'logo_svg' => null,
            'logo_svg_inline' => null,
            'favicon' => null,
            'logo_primary_color' => '#2da8fe',
            'logo_secondary_color' => '#0158b1',
            'logo_accent_color' => '#38bdf8',
            'logo_text_color' => '#0158b1',
            'use_theme_colors' => true,
            'is_active' => true,
        ]);

        return $setting->refresh();
    }

    private function storeFile(Request $request, string $field, string $prefix): string
    {
        $file = $request->file($field);
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'svg');
        $filename = $prefix . '-' . now()->format('YmdHis') . '-' . Str::random(8) . '.' . $extension;

        return $file->storeAs('portal/logo', $filename, 'public');
    }

    private function deleteAsset(?string $path): void
    {
        $path = trim((string) $path);

        if ($path === '' || str_starts_with($path, '/') || str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return;
        }

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
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

    private function normalizeHex(?string $value, string $fallback): string
    {
        $value = trim((string) $value);

        if (preg_match('/^#[0-9a-fA-F]{6}$/', $value)) {
            return strtolower($value);
        }

        return strtolower($fallback);
    }

    private function sanitizeSvg(string $svg): string
    {
        $svg = trim($svg);

        if ($svg === '' || !str_contains(strtolower($svg), '<svg')) {
            throw ValidationException::withMessages([
                'logo_svg' => 'File SVG tidak valid.',
            ]);
        }

        // Hindari eksekusi script dari SVG upload.
        $svg = preg_replace('/<\?xml.*?\?>/is', '', $svg) ?? $svg;
        $svg = preg_replace('/<!doctype.*?>/is', '', $svg) ?? $svg;
        $svg = preg_replace('/<script\b[^>]*>.*?<\/script>/is', '', $svg) ?? $svg;
        $svg = preg_replace('/<foreignObject\b[^>]*>.*?<\/foreignObject>/is', '', $svg) ?? $svg;
        $svg = preg_replace('/<iframe\b[^>]*>.*?<\/iframe>/is', '', $svg) ?? $svg;
        $svg = preg_replace('/<object\b[^>]*>.*?<\/object>/is', '', $svg) ?? $svg;
        $svg = preg_replace('/<embed\b[^>]*>.*?<\/embed>/is', '', $svg) ?? $svg;
        $svg = preg_replace('/\son[a-z]+\s*=\s*("[^"]*"|\'[^\']*\'|[^\s>]+)/i', '', $svg) ?? $svg;
        $svg = preg_replace('/(href|xlink:href)\s*=\s*("|\')\s*javascript:[^"\']*("|\')/i', '$1="#"', $svg) ?? $svg;

        return trim($svg);
    }
}
