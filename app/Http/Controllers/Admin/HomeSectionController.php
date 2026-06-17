<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppSection;
use App\Models\AppSectionItem;
use App\Services\Pecut\Admin\HomeSectionManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeSectionController extends Controller
{
    public function index(Request $request, HomeSectionManagementService $service)
    {
        return Inertia::render('Admin/HomeSections/Index', [
            'meta' => [
                'title' => 'Section Beranda',
            ],
            'filter' => (object) [
                'search' => $request->query('search'),
            ],
            'data' => $service->getIndexData($request),
        ]);
    }

    public function storeSection(Request $request, HomeSectionManagementService $service)
    {
        $service->storeSection($request);

        return back()->with('success', 'Section beranda berhasil ditambahkan.');
    }

    public function updateSection(Request $request, AppSection $section, HomeSectionManagementService $service)
    {
        $service->updateSection($request, $section);

        return back()->with('success', 'Section beranda berhasil diperbarui.');
    }

    public function destroySection(AppSection $section, HomeSectionManagementService $service)
    {
        $service->destroySection($section);

        return back()->with('success', 'Section beranda berhasil dihapus.');
    }

    public function storeItem(Request $request, AppSection $section, HomeSectionManagementService $service)
    {
        $service->storeItem($request, $section);

        return back()->with('success', 'Aplikasi berhasil ditambahkan ke section.');
    }

    public function updateItem(Request $request, AppSectionItem $item, HomeSectionManagementService $service)
    {
        $service->updateItem($request, $item);

        return back()->with('success', 'Urutan aplikasi berhasil diperbarui.');
    }

    public function destroyItem(AppSectionItem $item, HomeSectionManagementService $service)
    {
        $service->destroyItem($item);

        return back()->with('success', 'Aplikasi berhasil dihapus dari section.');
    }
}
