<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Urusan;
use Illuminate\Http\Request;

class ReferController extends Controller
{
    public function kategori()
    {
        $resource = Category::select('id', 'title', 'sub_title')->get();

        return response()->json($resource);
    }

    public function urusan()
    {
        $resource = Urusan::select('id', 'title', 'icon_name')->get()->map(function ($row) {
            return [
                'id' => $row->id,
                'title' => $row->title,
                'icon_name' => asset("assets/jstree/themes/default/{$row->icon_name}"),
            ];
        });

        return response()->json($resource);
    }
}
