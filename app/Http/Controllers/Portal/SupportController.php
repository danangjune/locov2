<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Services\Pecut\SupportPageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportController extends Controller
{
    public function guide(Request $request, SupportPageService $service)
    {
        return Inertia::render('Guide/Index', [
            'meta' => [
                'title' => 'Panduan Pengguna',
            ],
            'filter' => (object) [
                'search' => $request->query('search'),
                'page' => (int) $request->query('page', 1),
            ],
            'data' => $service->getGuideData($request),
        ]);
    }

    public function help(Request $request, SupportPageService $service)
    {
        return Inertia::render('Help/Index', [
            'meta' => [
                'title' => 'Pusat Bantuan',
            ],
            'filter' => (object) [
                'search' => $request->query('search'),
                'page' => (int) $request->query('page', 1),
            ],
            'data' => $service->getHelpData($request),
        ]);
    }

    public function info(Request $request, SupportPageService $service)
    {
        return Inertia::render('Info/Index', [
            'meta' => [
                'title' => 'Info Layanan',
            ],
            'filter' => (object) [
                'search' => $request->query('search'),
                'page' => (int) $request->query('page', 1),
            ],
            'data' => $service->getInfoData($request),
        ]);
    }

    public function kediri(Request $request, SupportPageService $service)
    {
        return Inertia::render('Kediri/Index', [
            'meta' => [
                'title' => 'Selayang Pandang Kota Kediri',
            ],
            'filter' => (object) [
                'page' => (int) $request->query('page', 1),
            ],
            'data' => $service->getKediriData($request),
        ]);
    }
}
