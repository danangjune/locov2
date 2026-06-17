<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortalPageSection;
use App\Models\PortalPageStat;
use App\Services\Pecut\Admin\SelayangPandangManagementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SelayangPandangController extends Controller
{
    public function index(SelayangPandangManagementService $service): Response
    {
        return Inertia::render('Admin/SelayangPandang/Index', [
            'meta' => [
                'title' => 'Selayang Pandang',
                'subtitle' => 'Kelola konten halaman Selayang Pandang Kota Kediri yang tampil di portal publik.',
            ],
            'data' => $service->getIndexData(),
        ]);
    }

    public function updatePage(Request $request, SelayangPandangManagementService $service): RedirectResponse
    {
        $service->updatePage($request);

        return back()->with('success', 'Informasi utama Selayang Pandang berhasil diperbarui.');
    }

    public function storeSection(Request $request, SelayangPandangManagementService $service): RedirectResponse
    {
        $service->storeSection($request);

        return back()->with('success', 'Bagian Selayang Pandang berhasil ditambahkan.');
    }

    public function updateSection(Request $request, PortalPageSection $section, SelayangPandangManagementService $service): RedirectResponse
    {
        $service->updateSection($request, $section);

        return back()->with('success', 'Bagian Selayang Pandang berhasil diperbarui.');
    }

    public function destroySection(PortalPageSection $section, SelayangPandangManagementService $service): RedirectResponse
    {
        $service->destroySection($section);

        return back()->with('success', 'Bagian Selayang Pandang berhasil dihapus.');
    }

    public function storeStat(Request $request, SelayangPandangManagementService $service): RedirectResponse
    {
        $service->storeStat($request);

        return back()->with('success', 'Statistik Selayang Pandang berhasil ditambahkan.');
    }

    public function updateStat(Request $request, PortalPageStat $stat, SelayangPandangManagementService $service): RedirectResponse
    {
        $service->updateStat($request, $stat);

        return back()->with('success', 'Statistik Selayang Pandang berhasil diperbarui.');
    }

    public function destroyStat(PortalPageStat $stat, SelayangPandangManagementService $service): RedirectResponse
    {
        $service->destroyStat($stat);

        return back()->with('success', 'Statistik Selayang Pandang berhasil dihapus.');
    }
}
