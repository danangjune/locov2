<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PanduanFile;
use Illuminate\Http\Request;

class PanduanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = [
            'search' => $request->query('search'),
        ];

        $query = PanduanFile::query()->where('statusenabled', true);
        if ($request->filled('search')) {
            $query->where(function ($sub) use ($filter) {
                $seach = $filter['search'];
                $sub->where('content', 'like', '%' . $seach . '%');
            });
        }

        $data = $query->paginate();

        // return response()->json($data);
        return view('admin.panduan.index', compact('filter', 'data'));
    }

    public function data_dropdown(){
        $data = [
            (object) array (
                'id' => 1,
                'text' => 'PDF'
            ),
            (object) array (
                'id' => 2,
                'text' => 'DOC'
            ),
            (object) array (
                'id' => 3,
                'text' => 'DOCX'
            ),
            (object) array (
                'id' => 4,
                'text' => 'XLS'
            ),
            (object) array (
                'id' => 5,
                'text' => 'XLSX'
            ),
            (object) array (
                'id' => 6,
                'text' => 'JPG'
            ),
            (object) array (
                'id' => 7,
                'text' => 'JPEG'
            ),
            (object) array (
                'id' => 8,
                'text' => 'PNG'
            ),
        ];
        return response()->json($data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // dd($request->all());
        // return response()->json($request->all());
        $request->validate([
            'nama_file' => 'required|string|',
            'deskripsi' => 'string|required',
            'type_file_nm' => 'string|required',
            'type_file' => 'required',
            'berkas' => 'required|file|mimes:pdf,doc,docx,dot,pptx,ppt,xlsx,xls'
        ]);

        // File Manage
        $berkas = null;
        if ($request->hasFile('berkas')) {
            $file_name = $request->file('berkas')->hashName();
            $request->file('berkas')->storeAs('public/panduan', $file_name);
            $berkas = 'storage/panduan/' . $file_name;
        }

        // Store Content Footer
        $data = PanduanFile::create([
            'name_file' => $request->nama_file,
            'description' => $request->deskripsi,
            'typefile' => strtolower($request->type_file_nm),
            'asset_file' => $berkas,
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

    public function find(Request $request){
        return response()->json(PanduanFile::find($request->id));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // return response()->json($request->all());
        $request->validate([
            'nama_file' => 'required|string|',
            'deskripsi' => 'string|required',
            'type_file_nm' => 'string|required',
            'type_file' => 'required',
            'berkas' => 'file|mimes:pdf,doc,docx,dot,pptx,ppt,xlsx,xls'
        ]);

        // File Manage
        $berkas = null;
        if ($request->hasFile('berkas')) {
            $file_name = $request->file('berkas')->hashName();
            $request->file('berkas')->storeAs('public/panduan', $file_name);
            $berkas = 'storage/panduan/' . $file_name;
        }

        // Store Panduan
        $data = PanduanFile::find($request->id);
        $data->name_file = $request->nama_file;
        $data->description = $request->deskripsi;
        $data->typefile = strtolower($request->type_file_nm);
        if(isset($berkas) || $berkas != null){
            $data->asset_file = $berkas;
        }
        $data->save();

        return response()->json(['message' => 'Update Success!']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $data = PanduanFile::find($request->id);
        $data->statusenabled = false;
        $data->save();
        return response()->json([
            'message' => 'Delete Success!',
            'data' => $data,
        ]);
    }
}
