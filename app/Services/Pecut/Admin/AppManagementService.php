<?php

namespace App\Services\Pecut\Admin;

use App\Models\AppFrom;
use App\Models\AppLink;
use App\Models\Category;
use App\Models\Urusan;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class AppManagementService
{
    public function getIndexData(Request $request): array
    {
        $filter = $this->getFilter($request);
        $tree = $this->getFilteredTree($request, $filter);

        return [
            'stats' => $this->getStats(),
            'apps' => [
                'items' => $tree['items'],
                'meta' => $tree['meta'],
            ],
            'options' => $this->getOptions(),
            'parent_options' => $this->getParentOptions(),
        ];
    }

    public function getCreateData(Request $request): array
    {
        $parentId = (int) $request->query('parent', 0);
        $parent = $parentId > 0
            ? AppLink::query()->with(['category', 'urusan', 'app_from'])->find($parentId)
            : null;

        return [
            'app' => null,
            'parent' => $parent ? $this->mapApp($parent, false) : null,
            'options' => $this->getOptions(),
            'parent_options' => $this->getParentOptions(),
            'defaults' => [
                'parent' => $parentId,
                'category_id' => $parent?->category_id,
                'urusan_id' => $parent?->urusan_id,
                'app_from_id' => $parent?->app_from_id ?: 1,
                'is_active' => true,
                'is_sso' => false,
                'is_popular' => false,
            ],
        ];
    }

    public function getEditData(int $id): array
    {
        $app = AppLink::query()
            ->with(['category', 'urusan', 'app_from', 'parentRoot.category', 'parentRoot.urusan'])
            ->findOrFail($id);

        return [
            'app' => $this->mapApp($app, false),
            'parent' => $app->parentRoot ? $this->mapApp($app->parentRoot, false) : null,
            'options' => $this->getOptions(),
            'parent_options' => $this->getParentOptions($app->id),
            'defaults' => [],
        ];
    }

    public function getJsonApp(int $id): array
    {
        $app = AppLink::query()
            ->with(['category', 'urusan', 'app_from', 'parentRoot.category'])
            ->findOrFail($id);

        return $this->mapApp($app, false);
    }

    public function isInvalidParent(int $appId, int $newParentId): bool
    {
        if ($newParentId <= 0) {
            return false;
        }

        if ($newParentId === $appId) {
            return true;
        }

        $current = AppLink::query()->find($newParentId);

        while ($current) {
            if ((int) $current->id === $appId) {
                return true;
            }

            if ((int) $current->parent <= 0) {
                return false;
            }

            $current = AppLink::query()->find((int) $current->parent);
        }

        return false;
    }

    public function generateCode(int $parent): string
    {
        $count = AppLink::query()->where('parent', $parent)->count();

        return $parent . '.' . ($count + 1);
    }

    private function getFilter(Request $request): array
    {
        return [
            'search' => trim((string) $request->query('search', '')),
            'is_sso' => $request->boolean('is_sso', false),
            'is_active' => $request->boolean('is_active', false),
            'app_from_id' => (int) $request->query('app_from_id', 1),
            'category_id' => $request->query('category_id'),
            'show_all' => $request->boolean('show_all', true),
            'page' => max(1, (int) $request->query('page', 1)),
            'per_page' => max(5, min((int) $request->query('per_page', 15), 50)),
        ];
    }

    private function getFilteredTree(Request $request, array $filter): array
    {
        $roots = AppLink::query()
            ->with([
                'category',
                'urusan',
                'app_from',
                'childrenRecursive.category',
                'childrenRecursive.urusan',
                'childrenRecursive.app_from',
            ])
            ->where('parent', 0)
            ->orderBy('category_id')
            ->orderBy('name')
            ->get();

        $cleaned = $this->cleanChildren($roots, $filter)
            ->filter(function (AppLink $row) use ($filter) {
                return $this->matchesFilter($row, $filter)
                    || $row->childrenRecursive->count() > 0;
            })
            ->values();

        $paginator = $this->paginateRootTree($cleaned, $request, $filter);

        return [
            'items' => collect($paginator->items())
                ->map(fn(AppLink $item) => $this->mapApp($item))
                ->values()
                ->all(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'from' => $paginator->firstItem(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'to' => $paginator->lastItem(),
                'total' => $paginator->total(),
                'has_more_pages' => $paginator->hasMorePages(),
            ],
        ];
    }

    private function paginateRootTree(Collection $items, Request $request, array $filter): LengthAwarePaginator
    {
        $page = $filter['page'];
        $perPage = $filter['per_page'];

        $currentItems = $items
            ->slice(($page - 1) * $perPage, $perPage)
            ->values();

        return new LengthAwarePaginator(
            $currentItems,
            $items->count(),
            $perPage,
            $page,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
        );
    }

    private function cleanChildren(Collection $items, array $filter): Collection
    {
        return $items
            ->map(function (AppLink $item) use ($filter) {
                if ($item->childrenRecursive) {
                    $item->childrenRecursive = $this->cleanChildren(
                        collect($item->childrenRecursive),
                        $filter
                    );
                }

                if ($this->matchesFilter($item, $filter)) {
                    return $item;
                }

                if ($item->childrenRecursive && $item->childrenRecursive->count() > 0) {
                    return $item;
                }

                return null;
            })
            ->filter()
            ->values();
    }

    private function matchesFilter(AppLink $item, array $filter): bool
    {
        $matchAppFrom = true;
        $matchActive = true;
        $matchSso = true;
        $matchSearch = true;
        $matchCategory = true;

        if (! $filter['show_all']) {
            $matchAppFrom = (int) $item->app_from_id === (int) $filter['app_from_id'];

            $matchActive = $filter['is_active']
                ? (bool) $item->is_active === true
                : true;

            $matchSso = $filter['is_sso']
                ? (bool) $item->is_sso === true
                : true;
        }

        if (! empty($filter['category_id']) && $filter['category_id'] !== 'all') {
            $matchCategory = (int) $item->category_id === (int) $filter['category_id'];
        }

        if ($filter['search'] !== '') {
            $search = Str::lower($filter['search']);

            $matchSearch = Str::contains(Str::lower($item->name ?? ''), $search)
                || Str::contains(Str::lower($item->alias ?? ''), $search)
                || Str::contains(Str::lower($item->description ?? ''), $search)
                || Str::contains(Str::lower($item->url ?? ''), $search)
                || Str::contains(Str::lower($item->urusan?->title ?? ''), $search)
                || Str::contains(Str::lower($item->category?->title ?? ''), $search);
        }

        return $matchAppFrom && $matchActive && $matchSso && $matchSearch && $matchCategory;
    }

    private function getStats(): array
    {
        return [
            'total' => AppLink::query()->count(),
            'root_total' => AppLink::query()->where('parent', 0)->count(),
            'active_total' => AppLink::query()->where('is_active', true)->count(),
            'inactive_total' => AppLink::query()
                ->where(function ($query) {
                    $query->where('is_active', false)->orWhereNull('is_active');
                })
                ->count(),
            'sso_total' => AppLink::query()->where('is_sso', true)->count(),
            'with_url_total' => AppLink::query()
                ->whereNotNull('url')
                ->where('url', '!=', '')
                ->count(),
        ];
    }

    private function getOptions(): array
    {
        return [
            'categories' => Category::query()
                ->orderBy('id')
                ->get(['id', 'title', 'sub_title'])
                ->map(fn(Category $item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'sub_title' => $item->sub_title,
                ])
                ->values()
                ->all(),
            'urusan' => Urusan::query()
                ->orderBy('title')
                ->get(['id', 'title', 'icon_name'])
                ->map(fn(Urusan $item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'icon_name' => $item->icon_name,
                ])
                ->values()
                ->all(),
            'app_from' => AppFrom::query()
                ->orderBy('id')
                ->get(['id', 'name'])
                ->map(fn(AppFrom $item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                ])
                ->values()
                ->all(),
        ];
    }

    private function getParentOptions(?int $excludeId = null): array
    {
        return AppLink::query()
            ->with(['category', 'urusan'])
            ->when($excludeId, fn($query) => $query->where('id', '!=', $excludeId))
            ->orderBy('name')
            ->get()
            ->filter(function (AppLink $item) use ($excludeId) {
                if (! $excludeId) {
                    return true;
                }

                return ! $this->isInvalidParent($excludeId, (int) $item->id);
            })
            ->map(fn(AppLink $item) => [
                'id' => $item->id,
                'name' => $item->name,
                'alias' => $item->alias,
                'category' => $item->category?->title,
                'urusan' => $item->urusan?->title,
                'parent' => (int) $item->parent,
            ])
            ->values()
            ->all();
    }

    private function mapApp(AppLink $app, bool $withChildren = true): array
    {
        $children = $withChildren && $app->childrenRecursive
            ? collect($app->childrenRecursive)
            ->map(fn(AppLink $child) => $this->mapApp($child))
            ->values()
            ->all()
            : [];

        return [
            'id' => $app->id,
            'parent' => (int) $app->parent,
            'code' => $app->code,
            'name' => $app->name,
            'alias' => $app->alias,
            'description' => $app->description,
            'url' => $app->url,
            'icon' => $app->icon,
            'image' => $app->image,
            'image_url' => $app->image ? asset('storage/apps/' . $app->image) : null,
            'is_active' => (bool) $app->is_active,
            'is_sso' => (bool) $app->is_sso,
            'is_popular' => (bool) $app->is_popular,
            'category_id' => $app->category_id,
            'urusan_id' => $app->urusan_id,
            'app_from_id' => $app->app_from_id,
            'category' => $app->category ? [
                'id' => $app->category->id,
                'title' => $app->category->title,
                'sub_title' => $app->category->sub_title,
            ] : null,
            'urusan' => $app->urusan ? [
                'id' => $app->urusan->id,
                'title' => $app->urusan->title,
                'icon_name' => $app->urusan->icon_name,
            ] : null,
            'app_from' => $app->app_from ? [
                'id' => $app->app_from->id,
                'name' => $app->app_from->name,
            ] : null,
            'parent_root' => $app->parentRoot ? [
                'id' => $app->parentRoot->id,
                'name' => $app->parentRoot->name,
            ] : null,
            'children' => $children,
            'children_count' => count($children),
            'created_at' => optional($app->created_at)->format('d-m-Y H:i'),
            'updated_at' => optional($app->updated_at)->format('d-m-Y H:i'),
        ];
    }
}
