<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Services\Pecut\AppService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppController extends Controller
{
    public function index(Request $request, AppService $service)
    {
        $search = $request->query('search');
        $categoryId = $request->query('category_id');
        $urusanId = $request->query('urusan_id');
        $mode = $request->query('mode');
        $app_from_id = $request->query('app_from_id');
        $page = (int) $request->query('page', 1);

        return Inertia::render('Apps/Index', [
            'meta' => [
                'title' => 'Daftar Aplikasi',
            ],
            'filter' => (object) [
                'search' => $search,
                'category_id' => $categoryId,
                'urusan_id' => $urusanId,
                'mode' => $mode,
                'app_from_id' => $app_from_id,
                'page' => $page,
            ],
            'data' => $service->getIndexData($request),
        ]);
    }

    public function show(Request $request, string $slug, AppService $service)
    {
        $data = $service->getShowData($request, $slug);

        return Inertia::render('Apps/Show', [
            'meta' => [
                'title' => $data['app']['name'] ?? 'Detail Aplikasi',
            ],
            'filter' => (object) [],
            'data' => $data,
        ]);
    }
}
