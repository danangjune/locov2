<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Pagination\LengthAwarePaginator;

class AppLinkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = [
            'search' => $request->query('search'),
            'is_sso' => $request->boolean('is_sso', false),
            'is_active' => $request->boolean('is_active', false),
            'app_from_id' => intval($request->query('app_from_id', 1)),
            'show_all' => $request->boolean('show_all', true),
            'isJson' => $request->boolean('is_json', false),
        ];

        $query = AppLink::query()
            ->with([
                'childrenRecursive',
                'childrenRecursive.urusan',
                'childrenRecursive.app_from',
            ])
            ->where('parent', 0);

        // ambil semua root dulu
        $collection = $query->get();

        // bersihkan tree
        $cleaned = $this->cleanChildren($collection, $filter);

        // sisakan root yang memang masih relevan
        $cleaned = $cleaned->filter(function ($row) use ($filter) {
            return $this->matchesFilter($row, $filter)
                || $row->childrenRecursive->count() > 0;
        })->values();

        // paginate manual setelah dibersihkan
        $perPage = 15;
        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $currentItems = $cleaned->slice(($currentPage - 1) * $perPage, $perPage)->values();

        $data = new LengthAwarePaginator(
            $currentItems,
            $cleaned->count(),
            $perPage,
            $currentPage,
            [
                'path' => request()->url(),
                'query' => request()->query(),
            ]
        );

        if ($filter['isJson']) {
            return response()->json([
                'filter' => $filter,
                'data' => $data,
            ]);
        }

        return view('admin.apps.index', compact('filter', 'data'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $data = new AppLink();

        return view('admin.apps.forms', compact('data'));
    }

    private function _generateCode($parent): string
    {
        $count = AppLink::where('parent', $parent)->count();

        return $parent . '.' . $count + 1;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'urusan_id' => ['required'],
            'category_id' => ['required'],
            'parent' => ['nullable'],
            'name' => ['required'],
            'alias' => ['nullable'],
            'description' => ['nullable'],
            'url' => ['nullable'],
            'icon' => ['nullable', 'string'],
            'image' => ['nullable', 'image'],
            'is_active' => ['nullable', 'boolean'],
            'is_sso' => ['nullable', 'boolean'],
            'app_from_id' => ['nullable'],
        ]);

        $validated['parent'] = $validated['parent'] ?? '0';

        $validated['code'] = $this->_generateCode($validated['parent']);

        if ($request->hasFile('image')) {
            $filename = $request->file('image')->hashName();
            $request->file('image')->storeAs('public/apps', $filename);
            $validated['image'] = $filename;
        }

        AppLink::create($validated);

        return response()->json(['message' => 'Data created successfully.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = AppLink::with(['urusan', 'category', 'parentRoot.category'])->findOrFail($id);

        return response()->json($data);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $data = AppLink::findOrFail($id);

        return view('admin.apps.forms', compact('data'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $old = AppLink::findOrFail($id);

        $validated = $request->validate([
            'urusan_id' => ['required'],
            'category_id' => ['required'],
            'name' => ['required'],
            'alias' => ['nullable'],
            'description' => ['nullable'],
            'url' => ['nullable'],
            'icon' => ['nullable', 'string'],
            'image' => ['nullable', 'image'],
            'is_active' => ['nullable', 'boolean'],
            'is_sso' => ['nullable', 'boolean'],
            'app_from_id' => ['nullable'],
        ]);

        if ($request->hasFile('image')) {
            if (!is_null($old->image) && Storage::exists('public/apps/' . $old->image)) {
                if(!preg_match('/general/i', $old->image)) {
                    Storage::delete('public/apps/' . $old->image);
                }
            }
            $filename = $request->file('image')->hashName();
            $request->file('image')->storeAs('public/apps', $filename);
            $validated['image'] = $filename;
        }

        $old->update($validated);

        return response()->json(['message' => 'Data updated successfully.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = AppLink::withTrashed()->findOrFail($id);
        if (!is_null($data->image) && Storage::exists('public/apps/' . $data->image)) {
            Storage::delete('public/apps/' . $data->image);
        }
        $data->forceDelete();

        return response()->json(['message' => 'Data deleted successfully.']);
    }

    public function changeParent(Request $request, $id)
    {
        $data = AppLink::findOrFail($id);

        $validated = $request->validate([
            'parent' => ['required'],
        ]);

        $data->update($validated);

        return response()->json(['message' => 'Data parent berhasil diubah.']);
    }

    private function cleanChildren($items, $filter)
    {
        return $items->map(function ($item) use ($filter) {

            if ($item->childrenRecursive) {
                $item->childrenRecursive = $this->cleanChildren(
                    collect($item->childrenRecursive),
                    $filter
                );
            }

            if ($this->matchesFilter($item, $filter)) {
                return $item;
            }

            if ($item->childrenRecursive && $item->childrenRecursive->count() > 0) {
                return $item;
            }

            return null;

        })->filter()->values();
    }

    private function matchesFilter($item, $filter)
    {
        $matchApp = true;
        $matchActive = true;
        $matchSso = true;
        $matchSearch = true;

        if (!$filter['show_all']) {
            $matchApp = $item->app_from_id == $filter['app_from_id'];

            $matchActive = $filter['is_active']
                ? (bool) $item->is_active === true
                : true;

            $matchSso = $filter['is_sso']
                ? (bool) $item->is_sso === true
                : true;
        }

        if (!empty($filter['search'])) {
            $search = strtolower($filter['search']);

            $matchSearch =
                str_contains(strtolower($item->name ?? ''), $search) ||
                str_contains(strtolower($item->alias ?? ''), $search) ||
                str_contains(strtolower($item->description ?? ''), $search);
        }

        return $matchApp && $matchActive && $matchSso && $matchSearch;
    }
}
