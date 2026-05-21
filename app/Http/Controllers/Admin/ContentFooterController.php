<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Footer;
use Illuminate\Http\Request;

class ContentFooterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = [
            'search' => $request->query('search'),
        ];

        $query = Footer::query()->where('statusenabled', true);
        $query->with('children', 'parent');
        $query->where('parent', 0);
        if ($request->filled('search')) {
            $query->where(function ($sub) use ($filter) {
                $seach = $filter['search'];
                $sub->where('content', 'like', '%' . $seach . '%');
            });
        }

        $data = $query->paginate();

        // return response()->json($data);
        return view('admin.content-footer.index', compact('filter', 'data'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.content-footer.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'content' => 'required|string|',
            'url' => 'string|nullable',
            'icon' => 'string|nullable',
            'image' => 'nullable|image|mimes:png,jpeg,jpg'
        ]);

        // File Manage
        $image = null;
        if ($request->hasFile('image')) {
            $file_name = $request->file('image')->hashName();
            $request->file('image')->storeAs('public/footer', $file_name);
            $image = 'storage/footer/' . $file_name;
        }

        // Store Content Footer
        $idx = Footer::where('parent', $request->parent)->max('idx_content') + 1;
        $data = Footer::create([
            'content' => $request->content,
            'url' => $request->url,
            'icon' => $request->icon,
            'image' => $image,
            'parent' => $request->parent,
            'idx_content' => $idx,
            'tab_content'=> null,
        ]);

        return response()->json([
            'message' => 'Success',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function find(Request $request)
    {
        return response()->json(Footer::find($request->id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // return response()->json($request->all());
        $request->validate([
            'content' => 'required|string|',
            'url' => 'string|nullable',
            'icon' => 'string|nullable',
            'image' => 'nullable|image|mimes:png,jpeg,jpg'
        ]);

        // File Manage
        $image = null;
        if ($request->hasFile('image')) {
            $file_name = $request->file('image')->hashName();
            $request->file('image')->storeAs('public/footer', $file_name);
            $image = public_path('storage/footer/' . $file_name);
        }

        // Store Content Footer
        $data = Footer::find($request->parent);
        $data->content = $request->content;
        $data->url = $request->url;
        $data->icon = $request->icon;
        $data->idx_content = $request->idx;
        if(isset($image) || $image != null){
            $data->image = $image;
        }
        $data->save();

        return response()->json(['message' => 'Update Success!']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $data = Footer::find($request->id);
        $data->statusenabled = false;
        $data->save();
        return response()->json([
            'message' => 'Delete Success!',
            'data' => $data,
        ]);
    }
}
