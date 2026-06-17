<?php

namespace App\Services\Pecut\Admin;

use App\Models\AppLink;
use App\Models\AppSection;
use App\Models\AppSectionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class HomeSectionManagementService
{
    public function getIndexData(Request $request): array
    {
        $search = trim((string) $request->query('search', ''));

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
            ])
            ->withCount('children');

        if (Schema::hasColumn('app_sections', 'statusenabled')) {
            $query->where('statusenabled', true);
        }

        if ($search !== '') {
            $query->where(function ($sub) use ($search) {
                $sub->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('children.apps', function ($appQuery) use ($search) {
                        $appQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('alias', 'like', "%{$search}%");
                    });
            });
        }

        if (Schema::hasColumn('app_sections', 'sort_order')) {
            $query->orderBy('sort_order');
        }

        $sections = $query->orderBy('id')
            ->get()
            ->map(fn (AppSection $section) => $this->mapSection($section))
            ->values()
            ->all();

        return [
            'stats' => $this->getStats(),
            'sections' => $sections,
            'app_options' => $this->getAppOptions(),
        ];
    }

    public function storeSection(Request $request): AppSection
    {
        $validated = $this->validateSection($request);

        return AppSection::query()->create($validated);
    }

    public function updateSection(Request $request, AppSection $section): AppSection
    {
        $validated = $this->validateSection($request);

        $section->update($validated);

        return $section;
    }

    public function destroySection(AppSection $section): void
    {
        $section->delete();
    }

    public function storeItem(Request $request, AppSection $section): AppSectionItem
    {
        $validated = $request->validate([
            'app_id' => [
                'required',
                'integer',
                Rule::exists('app_links', 'id'),
                Rule::unique('app_section_items', 'app_id')->where(fn ($query) => $query->where('section_id', $section->id)),
            ],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ], [
            'app_id.unique' => 'Aplikasi ini sudah ada pada section tersebut.',
        ]);

        $payload = [
            'section_id' => $section->id,
            'app_id' => (int) $validated['app_id'],
        ];

        if (Schema::hasColumn('app_section_items', 'sort_order')) {
            $payload['sort_order'] = (int) ($validated['sort_order'] ?? 0);
        }

        if (Schema::hasColumn('app_section_items', 'statusenabled')) {
            $payload['statusenabled'] = true;
        }

        return AppSectionItem::query()->create($payload);
    }

    public function updateItem(Request $request, AppSectionItem $item): AppSectionItem
    {
        $validated = $request->validate([
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $payload = [];

        if (Schema::hasColumn('app_section_items', 'sort_order')) {
            $payload['sort_order'] = (int) ($validated['sort_order'] ?? 0);
        }

        if ($payload) {
            $item->update($payload);
        }

        return $item;
    }

    public function destroyItem(AppSectionItem $item): void
    {
        $item->delete();
    }

    private function validateSection(Request $request): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $payload = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ];

        if (Schema::hasColumn('app_sections', 'sort_order')) {
            $payload['sort_order'] = (int) ($validated['sort_order'] ?? 0);
        }

        if (Schema::hasColumn('app_sections', 'statusenabled')) {
            $payload['statusenabled'] = true;
        }

        return $payload;
    }

    private function getStats(): array
    {
        return [
            'sections' => AppSection::query()->count(),
            'items' => AppSectionItem::query()->count(),
            'active_apps' => AppLink::query()
                ->where('is_active', true)
                ->whereDoesntHave('children')
                ->count(),
        ];
    }

    private function getAppOptions(): array
    {
        return AppLink::query()
            ->with(['urusan', 'category', 'app_from'])
            ->where('is_active', true)
            ->whereDoesntHave('children')
            ->orderBy('name')
            ->get()
            ->map(fn (AppLink $app) => $this->mapApp($app))
            ->values()
            ->all();
    }

    private function mapSection(AppSection $section): array
    {
        return [
            'id' => $section->id,
            'title' => $section->title,
            'description' => $section->description,
            'sort_order' => $section->sort_order ?? 0,
            'children_count' => $section->children_count ?? $section->children->count(),
            'children' => $section->children
                ->filter(fn (AppSectionItem $item) => $item->apps)
                ->map(fn (AppSectionItem $item) => [
                    'id' => $item->id,
                    'section_id' => $item->section_id,
                    'app_id' => $item->app_id,
                    'sort_order' => $item->sort_order ?? 0,
                    'app' => $this->mapApp($item->apps),
                ])
                ->values()
                ->all(),
        ];
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
