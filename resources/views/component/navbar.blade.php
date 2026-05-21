{{-- Navbar --}}
<nav class="nav-parent">
    {{-- <div class="nav-pattern"> --}}
        <div class="container-fluid d-flex justify-content-around">
            <div class="px-2 text-center" style="flex: 1">
                <a class="navbar-brand" href="/">
                    <img src="{{ asset('assets/img/navbar/logo-dashboard.png') }}" alt="" height="40">
                </a>
            </div>
            <div class="d-block d-sm-none px-2 text-end" style="flex: 1">
                <button class="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                {{-- <div class="d-none d-sm-block">
                    @include('component.navigation-items')
                </div> --}}
            </div>
            <div class="d-none d-sm-flex px-2 text-center" style="flex: 1">
                <div class="d-none d-sm-block">
                    @include('component.navigation-items')
                </div>
                @guest
                    <div class="d-flex align-items-center">
                        <a type="button" class="btn btn-primary rounded btn-sm px-3 gap-2 ms-5" href="{{ route('sso.login') }}">
                            Masuk <i class="bi bi-arrow-bar-right"></i>
                        </a>
                    </div>
                @endguest
                @auth
                    <div class="d-none d-sm-block">
                        @include('component.navigation-login')
                    </div>
                @endauth
            </div>
        </div>
        <div class="d-block d-sm-none">
            @include('component.navigation-items')
        </div>
    {{-- </div> --}}
</nav>
