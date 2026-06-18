<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortalPage;
use App\Models\PortalPageSection;
use App\Services\Pecut\Admin\HelpInfoPageManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HelpInfoPageController extends Controller
{
    public function index(Request $request, HelpInfoPageManagementService $service)
    {
        return Inertia::render('Admin/HelpInfo/Index', [
            'meta' => [
                'title' => 'Bantuan & Info Layanan',
            ],
            'filter' => (object) [
                'slug' => $request->query('slug', 'help'),
            ],
            'data' => $service->getIndexData($request),
        ]);
    }

    public function updatePage(Request $request, PortalPage $page, HelpInfoPageManagementService $service)
    {
        $service->updatePage($request, $page);

        return back()->with('success', 'Halaman berhasil diperbarui.');
    }

    public function storeSection(Request $request, PortalPage $page, HelpInfoPageManagementService $service)
    {
        $service->storeSection($request, $page);

        return back()->with('success', 'Section berhasil ditambahkan.');
    }

    public function updateSection(Request $request, PortalPageSection $section, HelpInfoPageManagementService $service)
    {
        $service->updateSection($request, $section);

        return back()->with('success', 'Section berhasil diperbarui.');
    }

    public function destroySection(PortalPageSection $section, HelpInfoPageManagementService $service)
    {
        $service->destroySection($section);

        return back()->with('success', 'Section berhasil dihapus.');
    }
}
