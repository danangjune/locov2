<?php

namespace App\Services\Pecut;

use App\Models\Footer;
use App\Models\FooterSetting;

class FooterContentService
{
    public function getFooterData(): array
    {
        $setting = FooterSetting::query()
            ->where('statusenabled', true)
            ->first();

        $groups = Footer::query()
            ->with(['children' => function ($query) {
                $query->where('statusenabled', true)
                    ->orderBy('idx_content')
                    ->orderBy('id');
            }])
            ->where('statusenabled', true)
            ->where(function ($query) {
                $query->where('parent', 0)
                    ->orWhereNull('parent');
            })
            ->orderBy('idx_content')
            ->orderBy('id')
            ->get()
            ->map(fn (Footer $footer) => $this->mapFooterGroup($footer))
            ->values()
            ->all();

        return [
            'logo' => $this->normalizeImage($setting?->logo_path) ?: '/images/logo-pecut-full-transparan.png',
            'description' => $setting?->description ?: 'PECUT adalah portal layanan digital Pemerintah Kota Kediri untuk memudahkan masyarakat, ASN, dan perangkat daerah menemukan layanan digital dalam satu pintu.',
            'copyright' => $setting?->copyright_text ?: ('© ' . date('Y') . ' PECUT Kota Kediri. Portal layanan digital satu pintu Pemerintah Kota Kediri.'),
            'bottom_text' => $setting?->bottom_text ?: 'PECUT · Portal Efisien Cepat Mudah Terpadu',
            'groups' => $groups,
        ];
    }

    private function mapFooterGroup(Footer $footer): array
    {
        return [
            'id' => $footer->id,
            'title' => $footer->content,
            'content' => $footer->content,
            'url' => $footer->url,
            'icon' => $footer->icon,
            'image' => $this->normalizeImage($footer->image),
            'sort_order' => $footer->idx_content,
            'children' => $footer->children
                ->map(fn (Footer $child) => $this->mapFooterItem($child))
                ->values()
                ->all(),
        ];
    }

    private function mapFooterItem(Footer $footer): array
    {
        return [
            'id' => $footer->id,
            'label' => $footer->content,
            'content' => $footer->content,
            'url' => $footer->url,
            'icon' => $footer->icon,
            'image' => $this->normalizeImage($footer->image),
            'sort_order' => $footer->idx_content,
        ];
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
