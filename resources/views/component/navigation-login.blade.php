{{-- Navbar Items --}}
<div class="collapse navbar-collapse flex-grow-0 justify-content-center" id="navbarTogglerDemo02">
    <ul class="navbar-nav mb-2 mb-lg-0">
        {{-- View Web --}}
        <li class="d-none d-sm-block nav-item px-2 dropdown">
            <a class="nav-link dropdown-toggle fs-6 text-capitalize fw-normal" role="button"
                data-bs-toggle="dropdown" aria-expanded="false" href="">{{ Auth::user()->name }}</a>
            <ul class="dropdown-menu">
                @auth
                    <li>
                        @if (Auth::user()->role_id==1)
                            <a type="button" class="dropdown-item d-flex align-items-center gap-3" aria-current="page"
                                href="/admin"><i class="bi bi-menu-app"></i>Dashboard</a>
                        @endif
                    </li>
                @endauth
                <li>
                    <a type="button" class="dropdown-item d-flex align-items-center gap-3" href="{{ route('logout') }}"
                        onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                        <i class="bi bi-box-arrow-in-right"></i>Logout
                    </a>
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                        @csrf
                    </form>
                </li>
            </ul>
        </li>
        {{-- View Mobile --}}
        <li class="d-block d-sm-none nav-item px-2 dropdown">
            <a class="nav-link dropdown-toggle fs-6 text-capitalize fw-normal" role="button"
                data-bs-toggle="dropdown" aria-expanded="false" href="">{{ Auth::user()->name }}</a>
            <ul class="dropdown-menu" style="width: 100vw; text-align:center;">
                @auth
                    <li>
                        @if (Auth::user()->role_id==1)
                            <a type="button" class="dropdown-item" aria-current="page"
                                href="/admin"><i class="bi bi-menu-app"></i> Dashboard</a>
                        @endif
                    </li>
                @endauth
                <li>
                    <a type="button" class="dropdown-item" href="{{ route('logout') }}"
                        onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                        <i class="bi bi-arrow-bar-left"></i> Logout
                    </a>
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                        @csrf
                    </form>
                </li>
            </ul>
        </li>
    </ul>
</div>
