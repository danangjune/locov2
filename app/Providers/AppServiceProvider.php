<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Footer;
use App\Models\SurveyKepuasan;
use App\Models\Urusan;
use App\Providers\Session\CustomSessionHandler;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Session\Session;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session as FacadesSession;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Manager;
use Illuminate\Support\ServiceProvider;
use Psy\Readline\Hoa\Console;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    private function _appNavigation() 
    {
        return array(
            (object)['title' => 'Beranda', 'route' => 'home', 'target' => ''],
            (object)['title' => 'Kediri', 'route' => 'kediri', 'target' => ''],
            (object)['title' => 'Panduan', 'route' => 'panduan', 'target' => ''],
            // (object)['title' => 'Kontak', 'route' => 'kontak', 'target' => ''],
        );
    }

    private function _adminNavigation() 
    {
        return array(
            ['title' => 'Dashboard', 'route' => 'admin.dashboard', 'url' => 'admin/dashboard', 'icon' => 'bi-speedometer2'],
            ['title' => 'Apps', 'route' => 'admin.apps.index', 'url' => 'admin/apps', 'icon' => 'bi-app-indicator'],
            ['title' => 'Content Footer', 'route' => 'admin.content-footer.index', 'url' => 'admin/content-footer', 'icon' => 'bi-back'],
            ['title' => 'Panduan', 'route' => 'admin.panduan.index', 'url' => 'admin/panduan', 'icon' => 'bi-journal-text'],
            // ['title' => 'Master', 'route' => 'admin.master.index', 'url' => '/admin/master', 'icon' => 'bi-rocket',
            //     'children' => array(
            //         ['title' => 'Users', 'url' => 'admin/master/users'],
            //         ['title' => 'Apps', 'url' => 'admin/master/apps'],
            //     ),
            // ],
        );
    }

    private function _appFooter() 
    {
        $data = Footer::with('children')->get();
        // dd(response()->json($data));
        // Survey
        $survey_kepuasan = SurveyKepuasan::where('status_enabled', true)
            ->where('nama_aplikasi', 'pecut')
            ->get();
        $total_survey = count($survey_kepuasan);
        $nilai_survey = [];
        $sp = 0; $p = 0; $cp = 0; $tp = 0;
        foreach ($survey_kepuasan as $key => $value) {
            if($value->skor == 1){
                $tp ++;
            }elseif($value->skor == 2){
                $cp ++;
            }elseif($value->skor == 3){
                $p ++;
            }elseif($value->skor == 4){
                $sp ++;
            }
        }
        $nilai_survey = [
            'sp' => $sp>0?round($sp/$total_survey*100):0,
            'p' => $p>0?round($p/$total_survey*100):0, 
            'cp' => $cp>0?round($cp/$total_survey*100):0, 
            'tp' => $tp>0?round($tp/$total_survey*100):0
        ];
        return ['data' => $data, 'nilai_survey' => $nilai_survey];
    }

    private function _TotalView() 
    {
        $data = DB::table('viewers')->count();
        // dd(response()->json($data));
        return $data;
    }

    private function _LiveView() 
    {
        $data = DB::table('sessions')->count();
        // dd(response()->json($data));
        return $data;
    }

    private function _categories() 
    {
        return Category::get();
    }

    private function _urusan() 
    {
        return Urusan::get();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Set Data for Universal Use
        if (! app()->runningInConsole()) {
            Paginator::defaultView('vendor.pagination.bootstrap-5');
            
            View::share('setting', (object)[
                'app_name' => 'Pecut',
                'app_description' => 'Portal Efisien Cepat Mudah Terpadu',
                'agency_name' => 'Pemerintah Kota Kediri',
                'company_name' => 'Dinas Komunikasi dan Informatika Kota Kediri',
            ]);
            View::share('appNavigation', $this->_appNavigation());
            View::share('appFooter', $this->_appFooter());
            View::share('appTView', $this->_TotalView());
            View::share('appLiveView', $this->_LiveView());
            View::share('adminNavigation', $this->_adminNavigation());
            View::share('categories', $this->_categories());
            View::share('urusan', $this->_urusan());
        }
        // Set Custom Session Handler
        $connection = $this->app['config']['session.connection'];
        $table = $this->app['config']['session.table'];
        $lifetime = $this->app['config']['session.lifetime'];
        
        // dd($connection, $table);
        $this->app['session']->extend('database', function($app) use ($connection, $table, $lifetime){
            return new CustomSessionHandler(
                $this->app['db']->connection($connection),
                $table, $lifetime, $app
            );
        });
    }
}
