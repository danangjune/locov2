<?php

namespace App\Http\Controllers;

use App\Models\PanduanFile;
use App\Services\Pecut\HomeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request, HomeService $service)
    {
        $search = $request->query('search');
        $categoryId = $request->query('category_id');
        $page = (int) $request->query('page', 1);

        return Inertia::render('Home/Index', [
            'meta' => [
                'title' => 'PECUT Kota Kediri',
            ],
            'filter' => (object) [
                'search' => $search,
                'category_id' => $categoryId,
                'page' => $page,
            ],
            'data' => $service->getHomeData($request),
        ]);
    }

    public function beritaTop(Request $request, HomeService $service)
    {
        $limit = (int) $request->query('limit', 10);
        $result = $service->getNews($limit);

        if ($result['error']) {
            return response()->json([
                'message' => $result['error'],
                'data' => [],
                'meta' => $result['meta'],
            ], 502);
        }

        return response()->json([
            'data' => $result['items'],
            'meta' => $result['meta'],
        ]);
    }

    public function kediri()
    {
        return view('pages.kediri');
    }

    public function panduan()
    {
        $data = PanduanFile::where('statusenabled', true)->get();

        return view('pages.panduan', compact('data'));
    }
}
