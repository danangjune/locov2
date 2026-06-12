<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class LoginController extends Controller
{
    use AuthenticatesUsers;

    /**
     * Default redirect setelah login manual Laravel.
     * Untuk portal baru, arahkan ke root React Inertia.
     *
     * @var string
     */
    protected $redirectTo = '/';

    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function loginView(Request $request)
    {
        /**
         * Header React mengirim ?redirect=/path agar setelah SSO user kembali
         * ke halaman yang sedang dibuka. Kita hanya izinkan redirect internal
         * yang diawali '/', supaya tidak jadi open redirect.
         */
        $redirect = $request->query('redirect', '/');

        if (is_string($redirect) && Str::startsWith($redirect, '/')) {
            $request->session()->put('url.intended', $redirect);
        } else {
            $request->session()->put('url.intended', '/');
        }

        $this->_logoutFromSSOServer();

        $request->session()->put('state', $state = Str::random(40));

        $query = http_build_query([
            'client_id' => env('OAUTH_CLIENT_ID'),
            'redirect_uri' => env('APP_URL') . '/auth/callback',
            'response_type' => 'code',
            'scope' => 'view-user',
            'state' => $state,
        ]);

        return redirect(env('APP_URL_SSO') . '/oauth/authorize?' . $query);
    }

    public function callback(Request $request)
    {
        $state = $request->session()->pull('state');

        /**
         * Kalau state tidak cocok, jangan lanjutkan proses token.
         * Ini menjaga flow OAuth tetap aman.
         */
        if (! $state || $state !== $request->query('state')) {
            return redirect('/')->with('error', 'Sesi login tidak valid. Silakan coba masuk kembali.');
        }

        $response = Http::withoutVerifying()->asForm()->post(env('APP_URL_SPLP') . '/oauth/token', [
            'grant_type' => 'authorization_code',
            'client_id' => env('OAUTH_CLIENT_ID'),
            'client_secret' => env('OAUTH_CLIENT_SECRET'),
            'redirect_uri' => env('APP_URL') . '/auth/callback',
            'code' => $request->code,
        ]);

        if (! $response->successful()) {
            return redirect('/')->with('error', 'Gagal mengambil token SSO. Silakan coba lagi.');
        }

        $request->session()->put($response->json());

        return redirect()->route('users.profile');
    }

    public function profile(Request $request)
    {
        $accessToken = $request->session()->get('access_token');

        if (! $accessToken) {
            return redirect('/')->with('error', 'Token login tidak ditemukan. Silakan masuk kembali.');
        }

        $response = Http::withoutVerifying()->withHeaders([
            'auth' => 'Bearer ' . $accessToken,
        ])->get(env('APP_URL_SPLP') . '/api/user');

        if (! $response->successful()) {
            return redirect('/')->with('error', 'Gagal mengambil profil pengguna dari SSO.');
        }

        $userArray = $response->json();

        try {
            $name = $userArray['name'];
            $email = $userArray['email'];
            $nik = $userArray['nik'] ?? null;
            $nip = $userArray['nip'] ?? null;
            $roleId = $userArray['role_id'] ?? null;
            $isVerified = $userArray['is_verified'] ?? false;
        } catch (\Throwable $th) {
            return redirect('/')->with('error', 'Format profil SSO tidak valid. Silakan coba lagi.');
        }

        $user = User::where('email', $email)->first();

        if (! $user) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'nik' => $nik,
                'nip' => $nip,
                'role_id' => $roleId,
                'is_verified' => $isVerified,
                'password' => Hash::make('kedirikota'),
            ]);
        } else {
            /**
             * Sinkronkan data dasar dari SSO jika user sudah ada.
             * Kolom yang tidak ada di tabel akan aman jika memang fillable/model mendukung.
             */
            $user->forceFill([
                'name' => $name,
                'nik' => $nik,
                'nip' => $nip,
                'role_id' => $roleId,
                'is_verified' => $isVerified,
            ])->save();
        }

        Auth::login($user);

        /**
         * Kembali ke halaman asal, bukan lagi route pecut.index.
         */
        return redirect()->intended('/');
    }

    private function _logoutFromSSOServer()
    {
        $accessToken = session()->get('access_token');

        if (! $accessToken) {
            return null;
        }

        try {
            $response = Http::withoutVerifying()->withHeaders([
                'auth' => 'Bearer ' . $accessToken,
            ])->get(env('APP_URL_SPLP') . '/api/logmeout');

            return $response;
        } catch (\Throwable $th) {
            return null;
        }
    }

    public function logout(Request $request)
    {
        $response = $this->_logoutFromSSOServer();
        
        $this->guard()->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($response = $this->loggedOut($request)) {
            return $response;
        }

        return $request->wantsJson()
            ? new JsonResponse([], 204)
            : redirect('/');
    }

    protected function sendLoginResponse(Request $request)
    {
        $request->session()->regenerate();
        $this->clearLoginAttempts($request);

        if ($response = $this->authenticated($request, $this->guard()->user())) {
            return $response;
        }

        return $request->wantsJson()
            ? new JsonResponse([], 204)
            : redirect()->intended('/');
    }
}
