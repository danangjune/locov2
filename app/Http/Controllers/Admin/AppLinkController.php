<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppLink;
use App\Services\Pecut\Admin\AppManagementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AppLinkController extends Controller
{
    public function index(Request $request, AppManagementService $service)
    {
        $search = trim((string) $request->query('search', ''));
        $showAll = $request->boolean('show_all', true);
        $isSso = $request->boolean('is_sso', false);
        $isActive = $request->boolean('is_active', false);
        $appFromId = (int) $request->query('app_from_id', 1);
        $categoryId = $request->query('category_id');
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 15);

        return Inertia::render('Admin/Apps/Index', [
            'meta' => [
                'title' => 'Manajemen Aplikasi',
                'subtitle' => 'Kelola struktur aplikasi parent-child, status, SSO, kategori, dan URL layanan PECUT.',
            ],
            'filter' => (object) [
                'search' => $search,
                'show_all' => $showAll,
                'is_sso' => $isSso,
                'is_active' => $isActive,
                'app_from_id' => $appFromId,
                'category_id' => $categoryId,
                'page' => $page,
                'per_page' => $perPage,
            ],
            'data' => $service->getIndexData($request),
        ]);
    }

    public function create(Request $request, AppManagementService $service)
    {
        return Inertia::render('Admin/Apps/Create', [
            'meta' => [
                'title' => 'Tambah Aplikasi',
                'subtitle' => 'Tambahkan root aplikasi baru atau child aplikasi sesuai struktur portal.',
            ],
            'filter' => (object) [
                'parent' => (int) $request->query('parent', 0),
            ],
            'data' => $service->getCreateData($request),
        ]);
    }

    public function store(Request $request, AppManagementService $service)
    {
        $validated = $this->validatePayload($request);
        $validated['parent'] = (int) ($validated['parent'] ?? 0);
        $validated['app_from_id'] = $validated['app_from_id'] ?? 1;
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['is_sso'] = $request->boolean('is_sso', false);
        $validated['code'] = $service->generateCode($validated['parent']);

        if ($request->hasFile('image')) {
            $filename = $request->file('image')->hashName();
            $request->file('image')->storeAs('public/apps', $filename);
            $validated['image'] = $filename;
        }

        AppLink::create($validated);

        return Redirect::route('admin.apps.index')
            ->with('success', 'Aplikasi berhasil ditambahkan.');
    }

    public function show(string $id, AppManagementService $service)
    {
        return response()->json($service->getJsonApp((int) $id));
    }

    public function edit(string $id, AppManagementService $service)
    {
        return Inertia::render('Admin/Apps/Edit', [
            'meta' => [
                'title' => 'Edit Aplikasi',
                'subtitle' => 'Perbarui informasi aplikasi, URL, gambar, kategori, status, dan SSO.',
            ],
            'filter' => (object) [],
            'data' => $service->getEditData((int) $id),
        ]);
    }

    public function update(Request $request, string $id, AppManagementService $service)
    {
        $app = AppLink::query()->findOrFail($id);
        $validated = $this->validatePayload($request, true);
        $validated['parent'] = array_key_exists('parent', $validated)
            ? (int) ($validated['parent'] ?? 0)
            : (int) $app->parent;
        $validated['app_from_id'] = $validated['app_from_id'] ?? 1;
        $validated['is_active'] = $request->boolean('is_active', false);
        $validated['is_sso'] = $request->boolean('is_sso', false);

        if ($service->isInvalidParent($app->id, (int) $validated['parent'])) {
            return back()->withErrors([
                'parent' => 'Parent tidak valid. Aplikasi tidak boleh menjadi parent dari dirinya sendiri atau turunannya.',
            ]);
        }

        if ($request->hasFile('image')) {
            $this->deleteImageIfNeeded($app);

            $filename = $request->file('image')->hashName();
            $request->file('image')->storeAs('public/apps', $filename);
            $validated['image'] = $filename;
        }

        $app->update($validated);

        return Redirect::route('admin.apps.index')
            ->with('success', 'Aplikasi berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $app = AppLink::query()->withCount('children')->findOrFail($id);

        if ($app->children_count > 0) {
            return back()->withErrors([
                'delete' => 'Aplikasi ini masih memiliki child. Pindahkan atau hapus child terlebih dahulu.',
            ]);
        }

        $this->deleteImageIfNeeded($app);
        $app->forceDelete();

        return Redirect::route('admin.apps.index')
            ->with('success', 'Aplikasi berhasil dihapus.');
    }

    public function changeParent(Request $request, $id, AppManagementService $service)
    {
        $app = AppLink::query()->findOrFail($id);

        $validated = $request->validate([
            'parent' => ['required', 'integer'],
        ]);

        $newParentId = (int) $validated['parent'];

        if ($service->isInvalidParent($app->id, $newParentId)) {
            return back()->withErrors([
                'parent' => 'Parent tidak valid. Aplikasi tidak boleh dipindah ke dirinya sendiri atau turunannya.',
            ]);
        }

        $app->update([
            'parent' => $newParentId,
        ]);

        return back()->with('success', 'Parent aplikasi berhasil diubah.');
    }

    private function validatePayload(Request $request, bool $isUpdate = false): array
    {
        return $request->validate([
            'urusan_id' => ['required', 'exists:urusan,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'parent' => ['nullable', 'integer'],
            'name' => ['required', 'string', 'max:255'],
            'alias' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'url' => ['nullable', 'string', 'max:2048'],
            'icon' => ['nullable', 'string', 'max:255'],
            'image' => [$isUpdate ? 'nullable' : 'nullable', 'image', 'max:4096'],
            'is_active' => ['nullable', 'boolean'],
            'is_sso' => ['nullable', 'boolean'],
            'app_from_id' => ['nullable', 'exists:app_from,id'],
        ]);
    }

    private function deleteImageIfNeeded(AppLink $app): void
    {
        if (! $app->image) {
            return;
        }

        if (preg_match('/general/i', $app->image)) {
            return;
        }

        if (Storage::exists('public/apps/' . $app->image)) {
            Storage::delete('public/apps/' . $app->image);
        }
    }
}
