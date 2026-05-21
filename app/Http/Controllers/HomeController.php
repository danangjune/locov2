<?php

namespace App\Http\Controllers;

use App\Models\AppSection;
use App\Models\Category;
use App\Models\PanduanFile;
use App\Models\Slide;
use Carbon\Carbon;
use Illuminate\Contracts\Session\Session;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    private function _sections() 
    {
        $query = AppSection::query();
        $query->with(['children.apps']);
        return $query->get();
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $slides = Slide::get();
        $categories = Category::get();
        $sections = $this->_sections();
        $berita = [];
        
        try{
            $data = Http::withoutVerifying()->timeout(60)->get('https://kedirikota.go.id/api/berita', [
                // 'page' => 1,
            ]);
            $data = json_decode($data->body());
            if(isset($data->berita)){
                $berita = json_decode($data->berita);
                // dd($berita);
            }
        } catch (\Throwable $th) {
            // $isberita=false;
        }

        return view('pages.homepage', compact('slides', 'categories', 'sections', 'berita'));
    }

    public function kediri(){
        return view('pages.kediri');
    }

    public function panduan(){
        // Get Data File Panduan
        $data = PanduanFile::where('statusenabled', true)->get();
        return view('pages.panduan', compact('data'));
    }
}
