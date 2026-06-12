<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Services\Pecut\ComplaintService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    public function index(Request $request, ComplaintService $service)
    {
        $search = $request->query('search');
        $status = $request->query('status');
        $page = (int) $request->query('page', 1);

        return Inertia::render('Complaints/Index', [
            'meta' => [
                'title' => 'Aduan Warga',
            ],
            'filter' => (object) [
                'search' => $search,
                'status' => $status,
                'page' => $page,
            ],
            'data' => $service->getIndexData($request),
        ]);
    }

    public function show(Request $request, string $slug, ComplaintService $service)
    {
        $data = $service->getShowData($request, $slug);

        if (! $data['complaint']) {
            abort(404, 'Data aduan tidak ditemukan.');
        }

        return Inertia::render('Complaints/Show', [
            'meta' => [
                'title' => $data['complaint']['title'] ?? 'Detail Aduan',
            ],
            'filter' => (object) [],
            'data' => $data,
        ]);
    }
}
