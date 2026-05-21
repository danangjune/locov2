<?php

namespace App\Http\Controllers;

use App\Models\AppLink;
use App\Models\Urusan;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Psy\Readline\Hoa\Console;
use stdClass;
use Illuminate\Support\Str;

class AppLinkController extends Controller
{
    // Pagination Proses
    private function _makePaginate($items, $perPage = 5, $page = null)
    {
        $page = $page ?: (Paginator::resolveCurrentPage() ?: 1);
        $total = count($items);
        $currentpage = $page;
        $offset = ($currentpage * $perPage) - $perPage;
        $itemstoshow = array_slice($items, $offset, $perPage);
        return new LengthAwarePaginator($itemstoshow, $total, $perPage);
    }
    // Proses Recursive
    public function recurse($items, $collection, $field)
    {
        if (count($items) > 0) {
            foreach ($items as $item => $value) {
                if (count($value->{$field}) > 0) {
                    $collection = $this->recurse($value->{$field}, $collection, $field);
                } else {
                    array_push($collection, $value);
                }
            }
            return $collection;
        }
        return $collection;
    }

    private function _makeItRecursive($items, $collection)
    {
        if (count($items) > 0) {
            foreach ($items as $item => $value) {
                if (count($value['childrenRecursive']) > 0) {
                    $collection = $this->_makeItRecursive($value['childrenRecursive'], $collection);
                } else {
                    array_push($collection, $value);
                }
            }
            return $collection;
        }
        return $collection;
    }

    private function _getUrusanTreeByApps($categoryId)
    {
        $query = Urusan::query();
        $query->with(['children' => function ($sub) use ($categoryId) {
            $sub->where('category_id', $categoryId);
        }, 'children.childrenRecursive']);
        $query->where('id', '!=', 40);
        $collection = $query->get();

        $filtered = collect($collection)->filter(function ($row) {
            return count($row['children']) > 0;
        })->values();

        return $filtered;
    }

    // Show Index
    public function index(Request $request, $category_id)
    {
        $urusan = $this->_getUrusanTreeByApps($category_id);

        $collectionOpds = Urusan::with('children.childrenRecursive')->where('id', 40)->get();
        $opds = [];
        foreach ($collectionOpds as $row) {
            foreach ($row['children'] as $child) {
                $opds[] = (object)[
                    'id_urusan' => $row['id'],
                    'id' => $child['id'],
                    'title' => $child['name'],
                    'description' => null,
                    'icon_name' => 'icon-chevron-right.png',
                    'children' => $child['children'],
                ];
            }
        }

        // return response()->json($opds);

        $query = AppLink::query();
        $query->with(['children', 'urusan', 'app_from']);
        $query->where('is_active', true);

        if ($category_id != 'all') {
            $query->where('category_id', $category_id);
        }

        $data = $query->get();
        // $dataresult = [];
        // foreach ($data as $key => $value) {
        //     $dataresult = $this->recurse($value->children, $dataresult, 'children');
        // }
        // $paginate = $this->_makePaginate($dataresult,10,$request->page);
        // return response()->json($paginate);
        return view('pages.aplikasi-tree', compact('urusan', 'opds', 'data', 'category_id'));
    }

    // Detail Aplikasi
    public function detail($id)
    {
        $data = AppLink::with('children')
            ->where('is_active', true)
            ->find($id);

        return response()->json($data);
    }

    // Show Aplikasi
    public function show(Request $request, $id)
    {
        $source = $request->query('source');
        $categoryId = $request->query('category_id');

        // with manggil relasinya
        $query = AppLink::query();
        $query->with(['childrenRecursive.urusan', 'childrenRecursive.app_from']);
        $query->where('parent', 0);
        $data = $query->get();

        $dataresult = [];
        foreach ($data as $key => $value) {
            $dataresult = $this->_makeItRecursive($value['childrenRecursive'], $dataresult);
        }

        if ($source == 'parent') {
            $filtered = collect($dataresult)->filter(function (AppLink $item) use ($request, $categoryId, $id, $source) {
                return
                    $item->is_active == true &&
                    $item->category_id == $categoryId &&
                    $item->parent == $id &&
                    (
                        str_contains(strtolower($item->name), strtolower($request->input('param'))) ||
                        str_contains(strtolower($item->alias), strtolower($request->input('param'))) ||
                        str_contains(strtolower($item->description), strtolower($request->input('param')))
                    );
            });
        } else {
            $filtered = collect($dataresult)->filter(function (AppLink $item) use ($request, $categoryId, $id, $source) {
                return
                    $item->is_active == true &&
                    $item->category_id == $categoryId &&
                    ((int)$id != 0 ?
                        ($source == 'app' ? $item->id == $id : $item->urusan_id == $id)
                        : true
                    ) &&
                    (
                        str_contains(strtolower($item->name), strtolower($request->input('param'))) ||
                        str_contains(strtolower($item->alias), strtolower($request->input('param'))) ||
                        str_contains(strtolower($item->description), strtolower($request->input('param')))
                    );
            });
        }

        $paginate = $this->_makePaginate($filtered->sortBy('is_sso', SORT_REGULAR, true)->toArray(), 12, $request->page);

        return response()->json($paginate);
    }

    // Search Aplikasi
    public function search(Request $request)
    {
        // with manggil relasinya
        $query = AppLink::query();
        $query->with('childrenRecursive');
        $query->where('parent', 0);

        $data = $query->take(intval($request->input('limit') ?? 50))->get();

        $dataresult = [];
        foreach ($data as $key => $value) {
            $dataresult = $this->_makeItRecursive($value['childrenRecursive'], $dataresult);
        }

        $filtered = collect($dataresult)->filter(function (AppLink $item) use ($request) {
            return
                $item->is_active == true &&
                $item->category_id == $request->input('category_id') &&
                (
                    str_contains(strtolower($item->name), strtolower($request->input('param'))) ||
                    str_contains(strtolower($item->alias), strtolower($request->input('param'))) ||
                    str_contains(strtolower($item->description), strtolower($request->input('param')))
                );
        })->sortBy('is_sso', SORT_REGULAR, true);

        return response()->json($filtered->values());
    }

    public function redirect($id)
    {
        $apps = AppLink::findOrFail($id);

        return response()->json([
            'is_auth' => Auth::check(),
            'data' => $apps,
        ]);
    }
}
