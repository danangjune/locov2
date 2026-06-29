<?php

use App\Http\Controllers\Admin\AppLinkController as AdminAppLinkController;
use App\Http\Controllers\Admin\ContentFooterController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FooterSettingController;
use App\Http\Controllers\Admin\HelpInfoPageController;
use App\Http\Controllers\Admin\HomeSectionController;
use App\Http\Controllers\Admin\HomeSlideController;
use App\Http\Controllers\Admin\LogoSettingController;
use App\Http\Controllers\Admin\PanduanController;
use App\Http\Controllers\Admin\PortalPageController;
use App\Http\Controllers\Admin\ReferenceController;
use App\Http\Controllers\Admin\SelayangPandangController;
use App\Http\Controllers\Admin\ThemeSettingController;
use App\Http\Controllers\Api\AgendaController;
use App\Http\Controllers\AppLinkController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\FooterController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Portal\AppController;
use App\Http\Controllers\Portal\ComplaintController;
use App\Http\Controllers\Portal\ComplaintStatusController;
use App\Http\Controllers\Portal\NewsController;
use App\Http\Controllers\Portal\SupportController;
use App\Http\Controllers\Portal\SurveyController;
use App\Http\Controllers\TestingController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth Route
Auth::routes(['login' => false, 'register' => false]);

/*
|--------------------------------------------------------------------------
| PECUT Public Inertia Routes - Final Order
|--------------------------------------------------------------------------
| Tempelkan ke routes/web.php dan sesuaikan dengan route auth/admin lama.
| Hapus route /test-inertia jika sudah tidak dipakai.
| Jangan taruh /apps/{slug} sebelum /apps.
| Jangan taruh route parameter terlalu umum sebelum route statis.
*/

// Route Home
Route::get('/', [HomeController::class, 'index'])->name('home');

// Route Apps
Route::get('/apps', [AppController::class, 'index'])->name('apps.index');
Route::get('/apps/{slug}', [AppController::class, 'show'])->name('apps.show');

// Route Berita
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{slug}', [NewsController::class, 'show'])->name('news.show');

// Route Agenda
Route::get('/agenda', [AgendaController::class, 'index'])->name('agenda.index');
Route::get('/agenda/{slug}', [AgendaController::class, 'show'])->name('agenda.show');

// Route Aduan
Route::get('/complaints', [ComplaintController::class, 'index'])->name('complaints.index');
Route::get('/complaints/{slug}', [ComplaintController::class, 'show'])->name('complaints.show');
Route::post('/complaints/status-check', [ComplaintController::class, 'statusCheck'])->name('complaints.status-check');

// Route Bantuan
Route::get('/guide', [SupportController::class, 'guide'])->name('guide.index');
Route::get('/help', [SupportController::class, 'help'])->name('help.index');
Route::get('/info', [SupportController::class, 'info'])->name('info.index');
Route::get('/kediri', [SupportController::class, 'kediri'])->name('kediri');

// Route Survey
Route::get('/survey-kepuasan', [SurveyController::class, 'index'])->name('survey.index');

// Route Login SSO & Profile
Route::prefix('auth')->group(function () {
    Route::get('/login', [LoginController::class, 'loginView'])->name('sso.login');
    Route::get('/callback', [LoginController::class, 'callback'])->name('sso.callback');
});
Route::prefix('users')->group(function () {
    Route::get('/profile', [LoginController::class, 'profile'])->name('users.profile');
});

// Route Portal Support
Route::get('/about', [SupportController::class, 'about'])->name('about');
Route::get('/privasi-data', [SupportController::class, 'privacy'])->name('privacy');
Route::get('/syarat-ketentuan', [SupportController::class, 'terms'])->name('terms');

// Route Admin
Route::prefix('admin')->middleware(['auth', 'role:1'])->group(function () {
    // Route Dashboard
    Route::get('/', function () {
        return to_route('admin.dashboard');
    });
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Route Apps
    Route::prefix('apps')->group(function () {
        Route::put('/{id}/change-parent', [AdminAppLinkController::class, 'changeParent'])->name('admin.apps.change-parent');
    });
    Route::resource('apps', AdminAppLinkController::class)->names('admin.apps');

    // Route Content Footer
    Route::prefix('content-footer')->name('content-footer.')->group(function () {
        Route::get('/', [ContentFooterController::class, 'index'])->name('index');
        Route::post('/', [ContentFooterController::class, 'store'])->name('store');
        Route::put('/{footer}', [ContentFooterController::class, 'update'])->name('update'); // gunakan _method=put dari Inertia form
        Route::delete('/{footer}', [ContentFooterController::class, 'destroy'])->name('destroy');

        // Legacy helper kalau masih ada script lama yang memanggil find.
        Route::get('/find/{id}', [ContentFooterController::class, 'find'])->name('find');
    });

    // Route Footer Setting
    Route::get('/footer-setting', [FooterSettingController::class, 'index'])->name('admin.footer-setting.index');
    Route::post('/footer-setting', [FooterSettingController::class, 'update'])->name('admin.footer-setting.update');

    // Route Panduan
    Route::prefix('panduan')->name('admin.panduan.')->group(function () {
        Route::get('/', [PanduanController::class, 'index'])->name('index');
        Route::post('/', [PanduanController::class, 'store'])->name('store');
        Route::get('/data-dropdown', [PanduanController::class, 'dataDropdown'])->name('data-dropdown');
        Route::put('/{panduan}', [PanduanController::class, 'update'])->name('update');
        Route::delete('/{panduan}', [PanduanController::class, 'destroy'])->name('destroy');
    });

    // Route Selayang Pandang
    Route::prefix('selayang-pandang')->name('admin.selayang-pandang.')->group(function () {
        Route::get('/', [SelayangPandangController::class, 'index'])->name('index');

        Route::put('/page', [SelayangPandangController::class, 'updatePage'])->name('page.update');

        Route::post('/sections', [SelayangPandangController::class, 'storeSection'])->name('sections.store');
        Route::put('/sections/{section}', [SelayangPandangController::class, 'updateSection'])->name('sections.update');
        Route::delete('/sections/{section}', [SelayangPandangController::class, 'destroySection'])->name('sections.destroy');

        Route::post('/stats', [SelayangPandangController::class, 'storeStat'])->name('stats.store');
        Route::put('/stats/{stat}', [SelayangPandangController::class, 'updateStat'])->name('stats.update');
        Route::delete('/stats/{stat}', [SelayangPandangController::class, 'destroyStat'])->name('stats.destroy');
    });

    // Route Portal Pages
    Route::prefix('portal-pages')->name('admin.portal-pages.')->group(function () {
        Route::get('/', [PortalPageController::class, 'index'])->name('index');

        Route::put('/{page}', [PortalPageController::class, 'updatePage'])->name('page.update');

        Route::post('/{page}/sections', [PortalPageController::class, 'storeSection'])->name('sections.store');
        Route::put('/sections/{section}', [PortalPageController::class, 'updateSection'])->name('sections.update');
        Route::delete('/sections/{section}', [PortalPageController::class, 'destroySection'])->name('sections.destroy');
    });

    // Route References
    Route::prefix('references')->name('admin.references.')->group(function () {
        Route::get('/', [ReferenceController::class, 'index'])->name('index');

        Route::post('/categories', [ReferenceController::class, 'storeCategory'])->name('categories.store');
        Route::put('/categories/{category}', [ReferenceController::class, 'updateCategory'])->name('categories.update');
        Route::delete('/categories/{category}', [ReferenceController::class, 'destroyCategory'])->name('categories.destroy');

        Route::post('/urusan', [ReferenceController::class, 'storeUrusan'])->name('urusan.store');
        Route::put('/urusan/{urusan}', [ReferenceController::class, 'updateUrusan'])->name('urusan.update');
        Route::delete('/urusan/{urusan}', [ReferenceController::class, 'destroyUrusan'])->name('urusan.destroy');

        Route::post('/app-from', [ReferenceController::class, 'storeAppFrom'])->name('app-from.store');
        Route::put('/app-from/{appFrom}', [ReferenceController::class, 'updateAppFrom'])->name('app-from.update');
        Route::delete('/app-from/{appFrom}', [ReferenceController::class, 'destroyAppFrom'])->name('app-from.destroy');
    });

    // Route Home Sections
    Route::prefix('home-sections')->name('admin.home-sections.')->group(function () {
        Route::get('/', [HomeSectionController::class, 'index'])->name('index');

        Route::post('/sections', [HomeSectionController::class, 'storeSection'])->name('sections.store');
        Route::put('/sections/{section}', [HomeSectionController::class, 'updateSection'])->name('sections.update');
        Route::delete('/sections/{section}', [HomeSectionController::class, 'destroySection'])->name('sections.destroy');

        Route::post('/sections/{section}/items', [HomeSectionController::class, 'storeItem'])->name('items.store');
        Route::put('/items/{item}', [HomeSectionController::class, 'updateItem'])->name('items.update');
        Route::delete('/items/{item}', [HomeSectionController::class, 'destroyItem'])->name('items.destroy');
    });

    // Route Home Slides
    Route::prefix('home-slides')->name('admin.home-slides.')->group(function () {
        Route::get('/', [HomeSlideController::class, 'index'])->name('index');
        Route::post('/', [HomeSlideController::class, 'store'])->name('store');
        Route::put('/{slide}', [HomeSlideController::class, 'update'])->name('update');
        Route::delete('/{slide}', [HomeSlideController::class, 'destroy'])->name('destroy');
    });

    // Route Help Info
    Route::prefix('help-info')->name('admin.help-info.')->group(function () {
        Route::get('/', [HelpInfoPageController::class, 'index'])->name('index');

        Route::put('/{page}', [HelpInfoPageController::class, 'updatePage'])->name('page.update');

        Route::post('/{page}/sections', [HelpInfoPageController::class, 'storeSection'])->name('sections.store');
        Route::put('/sections/{section}', [HelpInfoPageController::class, 'updateSection'])->name('sections.update');
        Route::delete('/sections/{section}', [HelpInfoPageController::class, 'destroySection'])->name('sections.destroy');
    });

    // Route Theme Setting
    Route::prefix('theme-setting')->name('admin.theme-setting.')->group(function () {
        Route::get('/', [ThemeSettingController::class, 'index'])->name('index');
        Route::put('/', [ThemeSettingController::class, 'update'])->name('update');
        Route::post('/reset', [ThemeSettingController::class, 'reset'])->name('reset');
    });

    // Route Logo Setting
    Route::prefix('logo-setting')->name('admin.logo-setting.')->group(function () {
        Route::get('/', [LogoSettingController::class, 'index'])->name('index');
        Route::post('/', [LogoSettingController::class, 'update'])->name('update');
        Route::post('/reset', [LogoSettingController::class, 'reset'])->name('reset');
    });
});

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