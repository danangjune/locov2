<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortalPage;
use App\Models\PortalPageSection;
use App\Services\Pecut\Admin\PortalPageManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortalPageController extends Controller
{
    public function index(Request $request, PortalPageManagementService $service)
    {
        return Inertia::render('Admin/PortalPages/Index', [
            'meta' => [
                'title' => 'Halaman Portal',
            ],
            'filter' => (object) [
                'slug' => $request->query('slug', 'about'),
            ],
            'data' => $service->getIndexData($request),
        ]);
    }

    public function updatePage(Request $request, PortalPage $page, PortalPageManagementService $service)
    {
        $service->updatePage($request, $page);

        return back()->with('success', 'Halaman portal berhasil diperbarui.');
    }

    public function storeSection(Request $request, PortalPage $page, PortalPageManagementService $service)
    {
        $service->storeSection($request, $page);

        return back()->with('success', 'Section halaman berhasil ditambahkan.');
    }

    public function updateSection(Request $request, PortalPageSection $section, PortalPageManagementService $service)
    {
        $service->updateSection($request, $section);

        return back()->with('success', 'Section halaman berhasil diperbarui.');
    }

    public function destroySection(PortalPageSection $section, PortalPageManagementService $service)
    {
        $service->destroySection($section);

        return back()->with('success', 'Section halaman berhasil dihapus.');
    }
}
