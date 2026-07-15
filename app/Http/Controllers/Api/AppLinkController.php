<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppLinkResource;
use App\Models\AppLink;
use App\Services\Pecut\Api\AppService;
use Illuminate\Http\Request;

class AppLinkController extends Controller
{
    public function index(Request $request, AppService $service)
    {
        return $service->getPaginatedApps($request);
    }

    /**
     * Mendapatkan 6 aplikasi anak terdalam secara acak.
     * Cocok untuk section "Rekomendasi" atau "Highlight"
     */
    public function popular(Request $request, AppService $service)
    {
        return $service->getPopularApps($request);
    }

    public function kategori(AppService $service)
    {
        return $service->getCategoryOptions();
    }

    public function urusan(AppService $service)
    {
        return $service->getUrusanOptions();
    }

    public function opd(AppService $service)
    {
        return $service->getOpdOptions();
    }
}
