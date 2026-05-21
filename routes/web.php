<?php

use App\Http\Controllers\Admin\AppLinkController as AdminAppLinkController;
use App\Http\Controllers\Admin\ContentFooterController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PanduanController;
use App\Http\Controllers\AppLinkController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\FooterController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\TestingController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::view('/pecut', 'pecut.index')->name('pecut.index');
// Auth Route
Auth::routes(['register' => false]);

// Pages
Route::get('/about', function () {
    return view('pages.about');
});
Route::get('/privasi-data', function () {
    return view('pages.privasi-data');
});
Route::get('/syarat-ketentuan', function () {
    return view('pages.syarat-ketentuan');
});



// Route Home
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/kediri', [HomeController::class, 'kediri'])->name('kediri');
Route::get('/panduan', [HomeController::class, 'panduan'])->name('panduan');
// Route::get('/aplikasi-tree', [HomeController::class, 'aplikasitree'])->name('aplikasitree');

// Route Footer
Route::get('/get-live-views', [FooterController::class, 'live_views'])->name('live-views');
Route::get('/survey-kepuasan/{id}', [FooterController::class, 'survey_kepuasan'])->name('survey-kepuasan');
Route::get('/load-survey-kepuasan', [FooterController::class, 'load_survey_kepuasan'])->name('load-survey-kepuasan');

// Route Layanan
Route::get('/cek-link/{category_id}', [AppLinkController::class, 'index'])->name('cek-link');
Route::get('/cek-link-detail/{id}', [AppLinkController::class, 'detail'])->name('cek-link-detail');
Route::get('/cek-link-show/{id}', [AppLinkController::class, 'show'])->name('cek-link-show');
Route::post('/cek-link-search', [AppLinkController::class, 'search'])->name('cek-link-search');

Route::get('/redirect/{id}', [AppLinkController::class, 'redirect'])->name('apps.redirect');

Route::prefix('testing')->group(function () {
    Route::get('pagination', [TestingController::class, 'pagination'])->name('testing.pagination');
});

// Route Login
Route::prefix('auth')->group(function () {
    Route::get('/login', [LoginController::class, 'loginView'])->name('sso.login');
    Route::get('/callback', [LoginController::class, 'callback'])->name('sso.callback');
});

Route::prefix('users')->group(function () {
    Route::get('/profile', [LoginController::class, 'profile'])->name('users.profile');
});

Route::prefix('admin')->middleware(['auth', 'role:1'])->group(function () {
    Route::get('/', function () {
        return to_route('admin.dashboard');
    });
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::prefix('apps')->group(function () {
        Route::put('/{id}/change-parent', [AdminAppLinkController::class, 'changeParent'])->name('admin.apps.change-parent');
    });
    Route::resource('apps', AdminAppLinkController::class)->names('admin.apps');
    Route::prefix('content-footer')->group(function () {
        Route::get('/', [ContentFooterController::class, 'index'])->name('admin.content-footer.index');
        Route::post('/store', [ContentFooterController::class, 'store'])->name('admin.content-footer.store');
        Route::post('/update', [ContentFooterController::class, 'update'])->name('admin.content-footer.update');
        Route::get('/find/{id}', [ContentFooterController::class, 'find'])->name('admin.content-footer.find');
        Route::post('/destroy', [ContentFooterController::class, 'destroy'])->name('admin.content-footer.destroy');
    });
    Route::prefix('panduan')->group(function () {
        Route::get('/', [PanduanController::class, 'index'])->name('admin.panduan.index');
        Route::post('/store', [PanduanController::class, 'store'])->name('admin.panduan.store');
        Route::post('/update', [PanduanController::class, 'update'])->name('admin.panduan.update');
        Route::get('/find/{id}', [PanduanController::class, 'find'])->name('admin.panduan.find');
        Route::post('/destroy', [PanduanController::class, 'destroy'])->name('admin.panduan.destroy');
        Route::get('/data-dropdown', [PanduanController::class, 'data_dropdown'])->name('admin.panduan.data-dropdown');
    });
});
