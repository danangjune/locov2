<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slide;
use App\Services\Pecut\Admin\HomeSlideManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeSlideController extends Controller
{
    public function index(Request $request, HomeSlideManagementService $service)
    {
        return Inertia::render('Admin/HomeSlides/Index', [
            'meta' => [
                'title' => 'Slide Beranda',
            ],
            'filter' => (object) [
                'search' => $request->query('search'),
                'status' => $request->query('status'),
            ],
            'data' => $service->getIndexData($request),
        ]);
    }

    public function store(Request $request, HomeSlideManagementService $service)
    {
        $service->store($request);

        return back()->with('success', 'Slide beranda berhasil ditambahkan.');
    }

    public function update(Request $request, Slide $slide, HomeSlideManagementService $service)
    {
        $service->update($request, $slide);

        return back()->with('success', 'Slide beranda berhasil diperbarui.');
    }

    public function destroy(Slide $slide, HomeSlideManagementService $service)
    {
        $service->destroy($slide);

        return back()->with('success', 'Slide beranda berhasil dihapus.');
    }
}
