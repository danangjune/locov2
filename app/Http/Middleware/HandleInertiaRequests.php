<?php

namespace App\Http\Middleware;

use App\Services\Pecut\BrandLogoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Middleware;
use App\Services\Pecut\FooterContentService;
use App\Services\Pecut\ThemeContentService;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'nik' => $user->nik ?? null,
                    'nip' => $user->nip ?? null,
                    'role_id' => $user->role_id ?? null,
                    'is_verified' => (bool) ($user->is_verified ?? false),
                    'is_asn' => $user->nip ? true : false,
                ] : null,
            ],

            'routes' => [
                'home' => Route::has('home') ? route('home', [], false) : '/',
                'sso_login' => Route::has('sso.login') ? route('sso.login', [], false) : '/auth/login',
                'logout' => Route::has('logout') ? route('logout', [], false) : '/logout',
                'admin_dashboard' => Route::has('admin.dashboard') ? route('admin.dashboard', [], false) : '/admin/dashboard',
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
            ],

            'footer' => fn () => app(FooterContentService::class)->getFooterData(),

            'theme' => fn () => app(ThemeContentService::class)->getThemeData(),

            'brandLogo' => fn () => app(BrandLogoService::class)->getLogoData(),
        ]);
    }
}
