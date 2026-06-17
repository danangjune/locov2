<?php

namespace App\Services\Pecut;

use App\Models\AppLink;
use App\Models\AppSection;
use App\Models\AppSectionItem;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class HomeSectionContentService
{
    public function getSections(): array
    {
        $query = AppSection::query()
            ->with([
                'children' => function ($query) {
                    $query->with(['apps.urusan', 'apps.category', 'apps.app_from']);

                    if (Schema::hasColumn('app_section_items', 'statusenabled')) {
                        $query->where('statusenabled', true);
                    }

                    if (Schema::hasColumn('app_section_items', 'sort_order')) {
                        $query->orderBy('sort_order');
                    }

                    $query->orderBy('id');
                },
            ]);

        if (Schema::hasColumn('app_sections', 'statusenabled')) {
            $query->where('statusenabled', true);
        }

        if (Schema::hasColumn('app_sections', 'sort_order')) {
            $query->orderBy('sort_order');
        }

        return $query->orderBy('id')
            ->get()
            ->map(fn (AppSection $section) => [
                'id' => $section->id,
                'title' => $section->title,
                'description' => $section->description,
                'items' => $section->children
                    ->filter(fn (AppSectionItem $item) => $item->apps && $item->apps->is_active)
                    ->map(fn (AppSectionItem $item) => $this->mapApp($item->apps))
                    ->values()
                    ->all(),
            ])
            ->filter(fn (array $section) => count($section['items']) > 0)
            ->values()
            ->all();
    }

    private function mapApp(AppLink $app): array
    {
        return [
            'id' => $app->id,
            'name' => $app->name,
            'alias' => $app->alias,
            'title' => $app->alias ?: $app->name,
            'description' => $app->description,
            'url' => $app->url,
            'icon' => $app->icon,
            'image' => $this->normalizeImage($app->image),
            'slug' => $app->id . '-' . Str::slug($app->alias ?: $app->name),
            'is_sso' => (bool) $app->is_sso,
            'category' => [
                'id' => $app->category?->id,
                'title' => $app->category?->title,
            ],
            'urusan' => [
                'id' => $app->urusan?->id,
                'title' => $app->urusan?->title,
            ],
            'app_from' => [
                'id' => $app->app_from?->id,
                'name' => $app->app_from?->name,
            ],
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

        return '/storage/apps/' . ltrim($image, '/');
    }
}
