<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PanduanFile;
use App\Services\Pecut\Admin\PanduanManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PanduanController extends Controller
{
    public function index(Request $request, PanduanManagementService $service): Response
    {
        return Inertia::render('Admin/Panduan/Index', [
            'meta' => [
                'title' => 'Panduan',
                'subtitle' => 'Kelola file panduan yang tampil pada halaman Panduan PECUT.',
            ],
            'filter' => (object) [
                'search' => $request->query('search'),
                'type' => $request->query('type'),
                'per_page' => (int) $request->query('per_page', 10),
            ],
            'data' => $service->getIndexData($request),
        ]);
    }

    public function store(Request $request, PanduanManagementService $service): RedirectResponse
    {
        $service->store($request);

        return back()->with('success', 'File panduan berhasil ditambahkan.');
    }

    public function update(Request $request, PanduanFile $panduan, PanduanManagementService $service): RedirectResponse
    {
        $service->update($request, $panduan);

        return back()->with('success', 'File panduan berhasil diperbarui.');
    }

    public function destroy(PanduanFile $panduan, PanduanManagementService $service): RedirectResponse
    {
        $service->destroy($panduan);

        return back()->with('success', 'File panduan berhasil dihapus.');
    }

    public function dataDropdown(PanduanManagementService $service): JsonResponse
    {
        return response()->json($service->fileTypes());
    }
}
