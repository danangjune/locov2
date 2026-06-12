<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Services\Pecut\AgendaService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgendaController extends Controller
{
    public function index(Request $request, AgendaService $service)
    {
        $type = $request->query('type');
        $date = $request->query('date');
        $periode = $request->query('periode', 3);
        $page = (int) $request->query('page', 1);

        return Inertia::render('Agenda/Index', [
            'meta' => [
                'title' => 'Agenda Kota Kediri',
            ],
            'filter' => (object) [
                'type' => $type,
                'date' => $date,
                'periode' => $periode,
                'page' => $page,
            ],
            'data' => $service->getIndexData($request),
        ]);
    }

    public function show(Request $request, string $slug, AgendaService $service)
    {
        $data = $service->getShowData($request, $slug);

        return Inertia::render('Agenda/Show', [
            'meta' => [
                'title' => $data['agenda']['title'] ?? 'Detail Agenda',
            ],
            'filter' => (object) [],
            'data' => $data,
        ]);
    }
}
