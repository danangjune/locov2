<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppLink;
use App\Models\Urusan;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    private function _statsUrusan()
    {
        $collection = Urusan::get();
        $data = [];

        foreach ($collection as $item) {
            $data[] = [
                'id' => $item->id,
                'title' => $item->title,
                'icon_name' => $item->icon_name,
                'count' => $item->children->count(),
            ];
        }

        return $data;
    }

    public function index()
    {
        $query = AppLink::query();
        $query->where('is_active', true);
        $query->whereNotNull('url');
        $query->where('url', '!=', '');
        $query_sso = (clone $query)->where('is_sso', true)->count();
        $query_app_from = (clone $query)->where('app_from_id', 2)->count();
        $query_app_from_local = (clone $query)->where('app_from_id', 1)->count();

        $data = array(
            (object)[
                'title' => 'Active Apps',
                'count' => $query->count(),
            ],
            (object)[
                'title' => 'SSO Integration',
                'count' => $query_sso,
            ],
            (object)[
                'title' => 'Aplikasi Pusat',
                'count' => $query_app_from,
            ],
            (object)[
                'title' => 'Aplikasi Daerah',
                'count' => $query_app_from_local,
            ],
        );

        $statsUrusan = $this->_statsUrusan();

        return view('admin.dashboard.index', compact('data', 'statsUrusan'));
    }
}
