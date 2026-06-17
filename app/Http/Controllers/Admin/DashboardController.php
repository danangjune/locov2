<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Pecut\Admin\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request, DashboardService $service)
    {
        return Inertia::render('Admin/Dashboard/Index', [
            'meta' => [
                'title' => 'Dashboard Admin',
                'description' => 'Ringkasan pengelolaan Portal PECUT Kota Kediri.',
            ],
            'filter' => (object) [
                'page' => (int) $request->query('page', 1),
            ],
            'data' => $service->getDashboardData($request),
        ]);
    }
}
