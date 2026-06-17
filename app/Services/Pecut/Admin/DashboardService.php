<?php

namespace App\Services\Pecut\Admin;

use App\Models\AppLink;
use App\Models\Category;
use App\Models\Urusan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DashboardService
{
    /**
     * Kode urusan Perangkat Daerah sesuai struktur data PECUT.
     */
    private const URUSAN_PERANGKAT_DAERAH = 40;

    public function getDashboardData(Request $request): array
    {
        return [
            'stats' => $this->getStats(),
            'summary' => $this->getSummary(),
            'apps_by_urusan' => $this->getAppsByUrusan(),
            'apps_by_opd' => $this->getAppsByOpd(),
            'apps_by_category' => $this->getAppsByCategory(),
            'recent_apps' => $this->getRecentApps(),
        ];
    }

    private function getStats(): array
    {
        $activeWithUrl = AppLink::query()
            ->where('is_active', true)
            ->whereNotNull('url')
            ->where('url', '!=', '');

        return [
            [
                'key' => 'active_apps',
                'title' => 'Active Apps',
                'description' => 'Aplikasi aktif dan memiliki URL',
                'count' => (clone $activeWithUrl)->count(),
                'icon' => 'Layers',
                'tone' => 'sky',
            ],
            [
                'key' => 'sso_integration',
                'title' => 'SSO Integration',
                'description' => 'Aplikasi aktif terintegrasi SSO',
                'count' => (clone $activeWithUrl)->where('is_sso', true)->count(),
                'icon' => 'ShieldCheck',
                'tone' => 'emerald',
            ],
            [
                'key' => 'central_apps',
                'title' => 'Aplikasi Pusat',
                'description' => 'Aplikasi dari pemerintah pusat',
                'count' => (clone $activeWithUrl)->where('app_from_id', 2)->count(),
                'icon' => 'Building2',
                'tone' => 'violet',
            ],
            [
                'key' => 'local_apps',
                'title' => 'Aplikasi Daerah',
                'description' => 'Aplikasi lokal Pemerintah Kota Kediri',
                'count' => (clone $activeWithUrl)->where('app_from_id', 1)->count(),
                'icon' => 'MapPinned',
                'tone' => 'amber',
            ],
        ];
    }

    private function getSummary(): array
    {
        $totalApps = AppLink::query()->count();
        $activeApps = AppLink::query()->where('is_active', true)->count();
        $inactiveApps = AppLink::query()
            ->where(function ($query) {
                $query->where('is_active', false)->orWhereNull('is_active');
            })
            ->count();
        $rootApps = AppLink::query()->where('parent', 0)->count();
        $childApps = max($totalApps - $rootApps, 0);

        return [
            'total_apps' => $totalApps,
            'active_apps' => $activeApps,
            'inactive_apps' => $inactiveApps,
            'root_apps' => $rootApps,
            'child_apps' => $childApps,
            'total_opd' => AppLink::query()
                ->where('urusan_id', self::URUSAN_PERANGKAT_DAERAH)
                ->count(),
        ];
    }

    private function getAppsByUrusan(): array
    {
        return Urusan::query()
            ->withCount([
                'children as apps_count' => function ($query) {
                    $query->where('is_active', true)
                        ->whereNotNull('url')
                        ->where('url', '!=', '');
                },
            ])
            ->orderByDesc('apps_count')
            ->orderBy('title')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'icon_name' => $item->icon_name,
                    'count' => (int) $item->apps_count,
                ];
            })
            ->values()
            ->all();
    }

    private function getAppsByOpd(): array
    {
        $opdItems = AppLink::query()
            ->with([
                'urusan',
                'category',
                'app_from',
                'parentRoot',
                'childrenRecursive',
            ])
            ->where('urusan_id', self::URUSAN_PERANGKAT_DAERAH)
            ->orderBy('name')
            ->get();

        return $opdItems
            ->map(function (AppLink $item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'alias' => $item->alias,
                    'parent_name' => $item->parentRoot?->name,
                    'category' => $item->category?->title,
                    'app_from' => $item->app_from?->title ?? $item->app_from?->name,
                    'count' => $this->countApplicationsUnderOpd($item),
                ];
            })
            ->sortByDesc('count')
            ->values()
            ->all();
    }

    private function countApplicationsUnderOpd(AppLink $opd): int
    {
        $count = 0;
        $children = $opd->childrenRecursive ?? collect();

        foreach ($children as $child) {
            /**
             * Jika child adalah Perangkat Daerah, jangan ikut dihitung sebagai aplikasi
             * dan jangan dihitung masuk ke parent OPD ini. OPD tersebut berdiri sendiri.
             */
            if ($this->isPerangkatDaerah($child)) {
                continue;
            }

            if ($this->isCountableApplication($child)) {
                $count++;
            }

            $count += $this->countNonOpdDescendants($child);
        }

        return $count;
    }

    private function countNonOpdDescendants(AppLink $item): int
    {
        $count = 0;
        $children = $item->childrenRecursive ?? collect();

        foreach ($children as $child) {
            if ($this->isPerangkatDaerah($child)) {
                continue;
            }

            if ($this->isCountableApplication($child)) {
                $count++;
            }

            $count += $this->countNonOpdDescendants($child);
        }

        return $count;
    }

    private function isPerangkatDaerah(AppLink $item): bool
    {
        return (int) $item->urusan_id === self::URUSAN_PERANGKAT_DAERAH;
    }

    private function isCountableApplication(AppLink $item): bool
    {
        return (bool) $item->is_active
            && filled($item->url)
            && ! $this->isPerangkatDaerah($item);
    }

    private function getAppsByCategory(): array
    {
        return Category::query()
            ->orderBy('id')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'title' => $category->title,
                    'subtitle' => $category->sub_title,
                    'count' => AppLink::query()
                        ->where('category_id', $category->id)
                        ->where('is_active', true)
                        ->whereNotNull('url')
                        ->where('url', '!=', '')
                        ->count(),
                ];
            })
            ->values()
            ->all();
    }

    private function getRecentApps(): array
    {
        return AppLink::query()
            ->with(['urusan', 'category', 'app_from'])
            ->latest('updated_at')
            ->limit(8)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'alias' => $item->alias,
                    'slug' => Str::slug($item->alias ?: $item->name) . '-' . $item->id,
                    'category' => $item->category?->title,
                    'urusan' => $item->urusan?->title,
                    'app_from' => $item->app_from?->title ?? $item->app_from?->name,
                    'is_active' => (bool) $item->is_active,
                    'is_sso' => (bool) $item->is_sso,
                    'updated_at' => optional($item->updated_at)->format('d/m/Y H:i'),
                ];
            })
            ->values()
            ->all();
    }
}
