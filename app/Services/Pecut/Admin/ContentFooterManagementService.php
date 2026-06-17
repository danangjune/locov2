<?php

namespace App\Services\Pecut\Admin;

use App\Models\Footer;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ContentFooterManagementService
{
    public function getIndexData(Request $request): array
    {
        $search = trim((string) $request->query('search', ''));
        $page = max(1, (int) $request->query('page', 1));
        $perPage = max(5, min((int) $request->query('per_page', 10), 50));

        $roots = Footer::query()
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
            ->get();

        $filtered = $this->filterTree($roots, $search)->values();
        $paginated = $this->paginateCollection($filtered, $page, $perPage, $request->url(), $request->query());

        return [
            'stats' => $this->getStats(),
            'footers' => [
                'items' => $paginated->items(),
                'meta' => [
                    'current_page' => $paginated->currentPage(),
                    'last_page' => $paginated->lastPage(),
                    'per_page' => $paginated->perPage(),
                    'total' => $paginated->total(),
                    'from' => $paginated->firstItem(),
                    'to' => $paginated->lastItem(),
                    'links' => $paginated->linkCollection()->toArray(),
                ],
            ],
            'parent_options' => $this->getParentOptions(),
        ];
    }

    public function getNextSortOrder(?int $parent): int
    {
        $parent = $parent ?: 0;

        return ((int) Footer::query()
            ->where('statusenabled', true)
            ->where('parent', $parent)
            ->max('idx_content')) + 1;
    }

    private function getStats(): array
    {
        $active = Footer::query()->where('statusenabled', true);

        return [
            'total' => (clone $active)->count(),
            'group_total' => (clone $active)
                ->where(function ($query) {
                    $query->where('parent', 0)->orWhereNull('parent');
                })
                ->count(),
            'content_total' => (clone $active)
                ->whereNotNull('parent')
                ->where('parent', '!=', 0)
                ->count(),
            'with_url_total' => (clone $active)
                ->whereNotNull('url')
                ->where('url', '!=', '')
                ->count(),
            'with_image_total' => (clone $active)
                ->whereNotNull('image')
                ->where('image', '!=', '')
                ->count(),
        ];
    }

    private function getParentOptions(): array
    {
        return Footer::query()
            ->where('statusenabled', true)
            ->where(function ($query) {
                $query->where('parent', 0)->orWhereNull('parent');
            })
            ->orderBy('idx_content')
            ->orderBy('content')
            ->get()
            ->map(fn (Footer $footer) => [
                'id' => $footer->id,
                'content' => $footer->content,
                'idx_content' => $footer->idx_content,
            ])
            ->values()
            ->all();
    }

    private function filterTree(Collection $roots, string $search): Collection
    {
        if ($search === '') {
            return $roots->map(fn (Footer $root) => $this->mapFooter($root));
        }

        return $roots
            ->map(function (Footer $root) use ($search) {
                $rootMatch = $this->matchesSearch($root, $search);
                $children = $root->children
                    ->filter(fn (Footer $child) => $this->matchesSearch($child, $search))
                    ->values();

                if (! $rootMatch && $children->isEmpty()) {
                    return null;
                }

                $mapped = $this->mapFooter($root);
                $mapped['children'] = ($rootMatch ? $root->children : $children)
                    ->map(fn (Footer $child) => $this->mapFooter($child, false))
                    ->values()
                    ->all();

                return $mapped;
            })
            ->filter()
            ->values();
    }

    private function matchesSearch(Footer $footer, string $search): bool
    {
        $haystack = strtolower(implode(' ', array_filter([
            $footer->content,
            $footer->url,
            $footer->icon,
            $footer->image,
        ])));

        return str_contains($haystack, strtolower($search));
    }

    private function mapFooter(Footer $footer, bool $includeChildren = true): array
    {
        return [
            'id' => $footer->id,
            'content' => $footer->content,
            'url' => $footer->url,
            'icon' => $footer->icon,
            'image' => $this->normalizeImage($footer->image),
            'image_raw' => $footer->image,
            'parent' => (int) ($footer->parent ?: 0),
            'idx_content' => $footer->idx_content,
            'tab_content' => $footer->tab_content,
            'statusenabled' => (bool) $footer->statusenabled,
            'type' => ($footer->parent ?: 0) === 0 ? 'group' : 'content',
            'children' => $includeChildren
                ? $footer->children->map(fn (Footer $child) => $this->mapFooter($child, false))->values()->all()
                : [],
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

    private function paginateCollection(Collection $items, int $page, int $perPage, string $path, array $query): LengthAwarePaginator
    {
        $total = $items->count();
        $slice = $items->slice(($page - 1) * $perPage, $perPage)->values();

        return new LengthAwarePaginator(
            $slice,
            $total,
            $perPage,
            $page,
            [
                'path' => $path,
                'query' => $query,
            ]
        );
    }
}
