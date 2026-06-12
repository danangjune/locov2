<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Services\Pecut\NewsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function index(Request $request, NewsService $service)
    {
        $search = $request->query('search');
        $tag = $request->query('tag');
        $page = (int) $request->query('page', 1);

        return Inertia::render('News/Index', [
            'meta' => [
                'title' => 'Berita Terkini',
            ],
            'filter' => (object) [
                'search' => $search,
                'tag' => $tag,
                'page' => $page,
            ],
            'data' => $service->getIndexData($request),
        ]);
    }

    public function show(Request $request, string $slug, NewsService $service)
    {
        $data = $service->getShowData($request, $slug);

        return Inertia::render('News/Show', [
            'meta' => [
                'title' => $data['news']['title'] ?? 'Detail Berita',
            ],
            'filter' => (object) [],
            'data' => $data,
        ]);
    }
}
