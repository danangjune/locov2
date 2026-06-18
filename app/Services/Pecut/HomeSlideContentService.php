<?php

namespace App\Services\Pecut;

use App\Models\Slide;
use Illuminate\Support\Str;

class HomeSlideContentService
{
    public function getSlides(): array
    {
        $slides = Slide::query()
            ->where('statusenabled', true)
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Slide $slide) => $this->mapSlide($slide))
            ->values()
            ->all();

        return count($slides) ? $slides : $this->fallbackSlides();
    }

    private function mapSlide(Slide $slide): array
    {
        return [
            'id' => $slide->id,
            'title' => $slide->title,
            'subtitle' => $slide->subtitle,
            'body' => $slide->body,
            'url' => $slide->url,
            'button_label' => $slide->button_label ?: 'Jelajahi Aplikasi',
            'secondary_label' => $slide->secondary_label ?: null,
            'secondary_url' => $slide->secondary_url ?: null,
            'image' => $this->normalizeImage($slide->image),
        ];
    }

    private function normalizeImage(?string $image): ?string
    {
        $image = trim((string) $image);

        if ($image === '') {
            return null;
        }

        if (Str::startsWith($image, ['http://', 'https://', '/'])) {
            return $image;
        }

        if (Str::startsWith($image, 'storage/')) {
            return '/' . $image;
        }

        return '/storage/slides/' . ltrim($image, '/');
    }

    private function fallbackSlides(): array
    {
        return [[
            'id' => 'default',
            'title' => 'Semua Aplikasi Pemerintah Kota Kediri Dalam Satu Portal',
            'subtitle' => 'Portal satu pintu layanan digital Kota Kediri',
            'body' => 'PECUT menghubungkan layanan ASN Digital dan Public Digital agar masyarakat, ASN, dan perangkat daerah dapat menemukan aplikasi, layanan, berita, serta agenda kota dengan cepat.',
            'url' => '/apps',
            'button_label' => 'Jelajahi Aplikasi',
            'secondary_label' => 'Panduan Pengguna',
            'secondary_url' => '/guide',
            'image' => null,
        ]];
    }
}
