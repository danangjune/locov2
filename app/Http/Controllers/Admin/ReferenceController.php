<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppFrom;
use App\Models\Category;
use App\Models\Urusan;
use App\Services\Pecut\Admin\ReferenceManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReferenceController extends Controller
{
    public function index(Request $request, ReferenceManagementService $service)
    {
        return Inertia::render('Admin/References/Index', [
            'meta' => [
                'title' => 'Master Referensi',
            ],
            'filter' => (object) [
                'tab' => $request->query('tab', 'categories'),
                'search' => $request->query('search'),
            ],
            'data' => $service->getIndexData($request),
        ]);
    }

    public function storeCategory(Request $request, ReferenceManagementService $service)
    {
        $service->storeCategory($request);

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function updateCategory(Request $request, Category $category, ReferenceManagementService $service)
    {
        $service->updateCategory($request, $category);

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroyCategory(Category $category, ReferenceManagementService $service)
    {
        $service->destroyCategory($category);

        return back()->with('success', 'Kategori berhasil dihapus.');
    }

    public function storeUrusan(Request $request, ReferenceManagementService $service)
    {
        $service->storeUrusan($request);

        return back()->with('success', 'Urusan berhasil ditambahkan.');
    }

    public function updateUrusan(Request $request, Urusan $urusan, ReferenceManagementService $service)
    {
        $service->updateUrusan($request, $urusan);

        return back()->with('success', 'Urusan berhasil diperbarui.');
    }

    public function destroyUrusan(Urusan $urusan, ReferenceManagementService $service)
    {
        $service->destroyUrusan($urusan);

        return back()->with('success', 'Urusan berhasil dihapus.');
    }

    public function storeAppFrom(Request $request, ReferenceManagementService $service)
    {
        $service->storeAppFrom($request);

        return back()->with('success', 'Sumber aplikasi berhasil ditambahkan.');
    }

    public function updateAppFrom(Request $request, AppFrom $appFrom, ReferenceManagementService $service)
    {
        $service->updateAppFrom($request, $appFrom);

        return back()->with('success', 'Sumber aplikasi berhasil diperbarui.');
    }

    public function destroyAppFrom(AppFrom $appFrom, ReferenceManagementService $service)
    {
        $service->destroyAppFrom($appFrom);

        return back()->with('success', 'Sumber aplikasi berhasil dihapus.');
    }
}
