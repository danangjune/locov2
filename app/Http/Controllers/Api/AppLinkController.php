<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppLinkResource;
use App\Models\AppLink;
use Illuminate\Http\Request;

class AppLinkController extends Controller
{
    public function index(Request $request)
    {
        $resource = AppLink::query()
            ->with(['urusan', 'category'])
            ->where('is_active', true)
            ->where('category_id', $request->query('category_id', 1))
            ->when($request->filled('urusan_id'), function ($query) use ($request) {
                $query->where('urusan_id', $request->query('urusan_id'));
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where(function ($sub) use ($request) {
                    $search = $request->query('search');
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('alias', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            // 2. Filter hanya aplikasi yang tidak memiliki anak (leaf nodes)
            ->whereDoesntHave('children')
            ->paginate(10);

        AppLinkResource::withoutWrapping();

        return AppLinkResource::collection($resource);
    }

    /**
     * Mendapatkan 6 aplikasi anak terdalam secara acak.
     * Cocok untuk section "Rekomendasi" atau "Highlight"
     */
    public function randomSelection()
    {
        $resource = AppLink::query()
            ->with(['urusan', 'category'])
            ->where('is_active', true)
            ->where('category_id', 1)
            ->whereIn('urusan_id', [1, 2, 12, 18, 20, 33])
            ->whereDoesntHave('children') // Hanya ambil leaf nodes (anak paling ujung)
            ->inRandomOrder()              // Mengacak urutan data
            ->limit(6)                     // Membatasi hanya 6 data
            ->get();

        // Pastikan wrapping dimatikan jika ingin format array langsung
        AppLinkResource::withoutWrapping();

        return AppLinkResource::collection($resource);
    }
}
