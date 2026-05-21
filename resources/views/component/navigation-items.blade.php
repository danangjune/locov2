{{-- Navbar Items --}}
<div class="collapse navbar-collapse flex-grow-0 justify-content-center" id="navbarTogglerDemo02">
    <ul class="navbar-nav mb-2 mb-lg-0">
        @foreach ($appNavigation as $item)
            <li class="nav-item px-2">
                <a 
                    href="{{ Route::has($item->route) ? route($item->route) : '/' }}" target="{{ $item->target }}"
                    @class(['nav-link fs-6 text-capitalize fw-normal', 'active' => Route::is($item->route)])
                    aria-current="page"
                >{{ $item->title }}</a>
            </li>
        @endforeach
        <li class="d-block d-sm-none nav-item px-2 text-center" style="width: 100vw">
            @guest
                <a type="button" class="btn btn-primary rounded btn-sm px-4" href="{{ route('sso.login') }}">
                    Masuk <i class="bi bi-arrow-bar-right"></i>
                </a>
            @endguest
            @auth
                <div class="d-block d-sm-none">
                    @include('component.navigation-login')
                </div>
            @endauth
        </li>
    </ul>
</div>