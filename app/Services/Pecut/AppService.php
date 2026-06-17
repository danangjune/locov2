<?php

namespace App\Services\Pecut;

use App\Http\Resources\AppLinkResource;
use App\Models\AppLink;
use App\Models\Category;
use App\Models\Urusan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AppService
{
    public function getIndexData(Request $request): array
    {
        $apps = $this->getPaginatedApps($request);

        return [
            'stats' => $this->getStats(),
            'apps' => [
                'items' => $apps['items'],
                'meta' => $apps['meta'],
            ],
            'categories' => $this->getCategoryOptions(),
            'urusan' => $this->getUrusanOptions(),
            'errors' => [
                'apps' => $apps['error'],
            ],
        ];
    }

    public function getShowData(Request $request, string $slug): array
    {
        $id = $this->extractIdFromSlug($slug);

        $app = AppLink::query()
            ->with(['urusan', 'category', 'app_from'])
            ->where('is_active', true)
            ->findOrFail($id);

        $related = AppLink::query()
            ->with(['urusan', 'category'])
            ->where('is_active', true)
            ->whereDoesntHave('children')
            ->where('id', '!=', $app->id)
            ->where('category_id', $app->category_id)
            ->when($app->urusan_id, fn ($query) => $query->where('urusan_id', $app->urusan_id))
            ->orderByDesc('is_sso')
            ->orderBy('name')
            ->limit(4)
            ->get();

        AppLinkResource::withoutWrapping();

        return [
            'app' => AppLinkResource::make($app)->resolve($request),
            'related' => AppLinkResource::collection($related)->resolve($request),
        ];
    }

    private function getPaginatedApps(Request $request): array
    {
        try {
            $search = trim((string) $request->query('search', ''));
            $categoryId = $request->query('category_id');
            $urusanId = $request->query('urusan_id');
            $mode = $request->query('mode');
            $app_from_id = $request->query('app_from_id');
            $perPage = (int) $request->query('per_page', 12);
            $perPage = max(6, min($perPage, 48));

            $query = AppLink::query()
                ->with(['urusan', 'category', 'app_from'])
                ->where('is_active', true)
                ->whereDoesntHave('children');

            if ($categoryId && $categoryId !== 'all') {
                $query->where('category_id', $categoryId);
            } else {
                $query->whereIn('category_id', [1, 2]);
            }

            if ($urusanId && $urusanId !== 'all') {
                $query->where('urusan_id', $urusanId);
            }

            if ($mode === 'sso') {
                $query->where('is_sso', true);
            }

            if ($mode === 'link') {
                $query->where('is_sso', false);
            }

            if ($app_from_id) {
                $query->where('app_from_id', $app_from_id);
            }

            if ($search !== '') {
                $query->where(function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('alias', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('urusan', fn ($q) => $q->where('title', 'like', "%{$search}%"))
                        ->orWhereHas('category', fn ($q) => $q->where('title', 'like', "%{$search}%"));
                });
            }

            $paginator = $query
                ->orderByDesc('is_sso')
                ->orderBy('category_id')
                ->orderBy('name')
                ->paginate($perPage)
                ->withQueryString();

            AppLinkResource::withoutWrapping();
            $items = AppLinkResource::collection($paginator->getCollection())->resolve($request);

            return [
                'items' => $items,
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'from' => $paginator->firstItem(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'to' => $paginator->lastItem(),
                    'total' => $paginator->total(),
                    'has_more_pages' => $paginator->hasMorePages(),
                ],
                'error' => null,
            ];
        } catch (\Throwable $th) {
            return [
                'items' => [],
                'meta' => [
                    'current_page' => 1,
                    'from' => null,
                    'last_page' => 1,
                    'per_page' => 12,
                    'to' => null,
                    'total' => 0,
                    'has_more_pages' => false,
                ],
                'error' => config('app.debug') ? $th->getMessage() : 'Gagal memuat daftar aplikasi.',
            ];
        }
    }

    private function getStats(): array
    {
        $base = AppLink::query()
            ->where('is_active', true)
            ->whereDoesntHave('children');

        return [
            'total' => (clone $base)->whereIn('category_id', [1, 2])->count(),
            'public_total' => (clone $base)->where('category_id', 1)->count(),
            'asn_total' => (clone $base)->where('category_id', 2)->count(),
            'sso_total' => (clone $base)->where('is_sso', true)->count(),
            'link_total' => (clone $base)->where('is_sso', false)->count(),
        ];
    }

    private function getCategoryOptions(): array
    {
        $activeLeafBase = AppLink::query()
            ->where('is_active', true)
            ->whereDoesntHave('children');

        return Category::query()
            ->orderBy('id')
            ->get()
            ->map(function (Category $category) use ($activeLeafBase) {
                return [
                    'id' => $category->id,
                    'title' => $category->title,
                    'sub_title' => $category->sub_title,
                    'count' => (clone $activeLeafBase)->where('category_id', $category->id)->count(),
                ];
            })
            ->values()
            ->all();
    }

    private function getUrusanOptions(): array
    {
        $ids = AppLink::query()
            ->where('is_active', true)
            ->whereDoesntHave('children')
            ->whereNotNull('urusan_id')
            ->distinct()
            ->pluck('urusan_id');

        return Urusan::query()
            ->whereIn('id', $ids)
            ->orderBy('title')
            ->get()
            ->map(function (Urusan $urusan) {
                return [
                    'id' => $urusan->id,
                    'title' => $urusan->title,
                ];
            })
            ->values()
            ->all();
    }

    private function extractIdFromSlug(string $slug): int
    {
        if (preg_match('/^(\d+)/', $slug, $matches)) {
            return (int) $matches[1];
        }

        abort(404);
    }
}
