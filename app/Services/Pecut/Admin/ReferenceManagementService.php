<?php

namespace App\Services\Pecut\Admin;

use App\Models\AppFrom;
use App\Models\AppLink;
use App\Models\Category;
use App\Models\Urusan;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReferenceManagementService
{
    public function getIndexData(Request $request): array
    {
        $search = trim((string) $request->query('search', ''));

        $categories = Category::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('sub_title', 'like', "%{$search}%")
                        ->orWhere('icon', 'like', "%{$search}%");
                });
            })
            ->orderBy('id')
            ->get()
            ->map(fn (Category $category) => $this->mapCategory($category))
            ->values()
            ->all();

        $urusan = Urusan::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('icon_name', 'like', "%{$search}%");
                });
            })
            ->withCount(['children as apps_count'])
            ->orderBy('title')
            ->get()
            ->map(fn (Urusan $urusan) => $this->mapUrusan($urusan))
            ->values()
            ->all();

        $appFrom = AppFrom::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->get()
            ->map(fn (AppFrom $appFrom) => $this->mapAppFrom($appFrom))
            ->values()
            ->all();

        return [
            'categories' => $categories,
            'urusan' => $urusan,
            'app_from' => $appFrom,
            'stats' => [
                'categories' => Category::count(),
                'urusan' => Urusan::count(),
                'app_from' => AppFrom::count(),
                'apps' => AppLink::count(),
            ],
        ];
    }

    public function storeCategory(Request $request): Category
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'sub_title' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:100'],
        ]);

        return Category::create([
            'title' => $validated['title'],
            'sub_title' => $validated['sub_title'] ?? '',
            'icon' => $validated['icon'] ?? null,
        ]);
    }

    public function updateCategory(Request $request, Category $category): Category
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'sub_title' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:100'],
        ]);

        $category->update([
            'title' => $validated['title'],
            'sub_title' => $validated['sub_title'] ?? '',
            'icon' => $validated['icon'] ?? null,
        ]);

        return $category;
    }

    public function destroyCategory(Category $category): void
    {
        $used = AppLink::query()->where('category_id', $category->id)->exists();

        if ($used) {
            throw ValidationException::withMessages([
                'delete' => 'Kategori tidak bisa dihapus karena masih digunakan oleh aplikasi.',
            ]);
        }

        $category->delete();
    }

    public function storeUrusan(Request $request): Urusan
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'icon_name' => ['nullable', 'string', 'max:100'],
        ]);

        return Urusan::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'icon_name' => $validated['icon_name'] ?? null,
        ]);
    }

    public function updateUrusan(Request $request, Urusan $urusan): Urusan
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'icon_name' => ['nullable', 'string', 'max:100'],
        ]);

        $urusan->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'icon_name' => $validated['icon_name'] ?? null,
        ]);

        return $urusan;
    }

    public function destroyUrusan(Urusan $urusan): void
    {
        $used = AppLink::query()->where('urusan_id', $urusan->id)->exists();

        if ($used) {
            throw ValidationException::withMessages([
                'delete' => 'Urusan tidak bisa dihapus karena masih digunakan oleh aplikasi.',
            ]);
        }

        $urusan->delete();
    }

    public function storeAppFrom(Request $request): AppFrom
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        return AppFrom::create([
            'name' => $validated['name'],
        ]);
    }

    public function updateAppFrom(Request $request, AppFrom $appFrom): AppFrom
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $appFrom->update([
            'name' => $validated['name'],
        ]);

        return $appFrom;
    }

    public function destroyAppFrom(AppFrom $appFrom): void
    {
        $used = AppLink::query()->where('app_from_id', $appFrom->id)->exists();

        if ($used) {
            throw ValidationException::withMessages([
                'delete' => 'Sumber aplikasi tidak bisa dihapus karena masih digunakan oleh aplikasi.',
            ]);
        }

        $appFrom->delete();
    }

    private function mapCategory(Category $category): array
    {
        return [
            'id' => $category->id,
            'title' => $category->title,
            'sub_title' => $category->sub_title,
            'icon' => $category->icon,
            'apps_count' => AppLink::query()->where('category_id', $category->id)->count(),
            'created_at' => optional($category->created_at)->format('d-m-Y H:i'),
        ];
    }

    private function mapUrusan(Urusan $urusan): array
    {
        return [
            'id' => $urusan->id,
            'title' => $urusan->title,
            'description' => $urusan->description,
            'icon_name' => $urusan->icon_name,
            'apps_count' => (int) ($urusan->apps_count ?? 0),
            'created_at' => optional($urusan->created_at)->format('d-m-Y H:i'),
        ];
    }

    private function mapAppFrom(AppFrom $appFrom): array
    {
        return [
            'id' => $appFrom->id,
            'name' => $appFrom->name,
            'apps_count' => AppLink::query()->where('app_from_id', $appFrom->id)->count(),
            'created_at' => optional($appFrom->created_at)->format('d-m-Y H:i'),
        ];
    }
}
