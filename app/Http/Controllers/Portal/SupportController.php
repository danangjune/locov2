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
        return $this->staticPage($request, $service, 'help', 'Pusat Bantuan');
    }

    public function info(Request $request, SupportPageService $service)
    {
        return $this->staticPage($request, $service, 'info', 'Info Layanan');
    }

    public function kediri(Request $request, SupportPageService $service)
    {
        $data = $service->getKediriData($request);

        return Inertia::render('Kediri/Index', [
            'meta' => [
                'title' => $data['page']['title'] ?? 'Selayang Pandang Kota Kediri',
            ],
            'filter' => (object) [
                'page' => (int) $request->query('page', 1),
            ],
            'data' => $data,
        ]);
    }

    public function about(Request $request, SupportPageService $service)
    {
        return $this->staticPage($request, $service, 'about', 'Tentang PECUT');
    }

    public function privacy(Request $request, SupportPageService $service)
    {
        return $this->staticPage($request, $service, 'privasi-data', 'Privasi Data');
    }

    public function terms(Request $request, SupportPageService $service)
    {
        return $this->staticPage($request, $service, 'syarat-ketentuan', 'Syarat & Ketentuan');
    }

    private function staticPage(Request $request, SupportPageService $service, string $slug, string $fallbackTitle)
    {
        $data = $service->getStaticPageData($slug);

        return Inertia::render('StaticPage/Show', [
            'meta' => [
                'title' => $data['page']['title'] ?? $fallbackTitle,
            ],
            'filter' => (object) [
                'page' => (int) $request->query('page', 1),
            ],
            'data' => $data,
        ]);
    }
}
