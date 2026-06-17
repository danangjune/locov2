<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Pecut\Admin\FooterSettingManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FooterSettingController extends Controller
{
    public function index(FooterSettingManagementService $service)
    {
        return Inertia::render('Admin/FooterSetting/Index', [
            'meta' => [
                'title' => 'Pengaturan Footer',
                'subtitle' => 'Kelola logo, deskripsi, copyright, dan teks bawah footer portal PECUT.',
            ],
            'data' => $service->getIndexData(),
        ]);
    }

    public function update(Request $request, FooterSettingManagementService $service)
    {
        $service->update($request);

        return back()->with('success', 'Pengaturan footer berhasil diperbarui.');
    }
}
