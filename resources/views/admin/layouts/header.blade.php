<header class="app-header shadow bg-white">
  <div class="d-flex align-items-center gap-2">
    <button class="btn btn-link d-flex d-md-none" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
      <i class="bi bi-three-dots"></i>
    </button>
    <h5 class="my-0 d-flex d-md-none fw-bold">{{ $setting->app_name }}</h5>
  </div>
  <div class="d-flex align-items-center">
    <div class="dropdown">
      <button class="btn btn-link dropdown-toggle d-flex align-items-center gap-2 text-decoration-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <div style="width: 10px; height: 10px;" class="rounded-circle bg-success blink"></div>
        <p class="my-0">{{ Auth::user()->name }}</p>
      </button>
      <ul class="dropdown-menu">
        <li>
          <a type="button" class="dropdown-item d-flex align-items-center gap-3" href="{{ route('logout') }}"
            onclick="event.preventDefault(); document.getElementById('logout-form').submit();"
          >
            <i class="bi bi-power"></i>
            <span>Logout</span>
          </a>
          <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
            @csrf
          </form>
        </li>
      </ul>
    </div>
  </div>
</header>

<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-header bg-primary">
    <img src="{{ asset('assets/img/navbar/logo-dashboard.png') }}" height="35" alt="Logo">
    <button type="button" class="btn-close text-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <ul class="nav flex-column">
      @foreach ($adminNavigation as $key => $item)
        <li class="nav-item">
          @if (isset($item['children']))
            <button class="nav-link w-100 d-flex align-items-center justify-content-between" data-bs-toggle="collapse" data-bs-target="#collapse-{{ $key }}" aria-expanded="false" aria-controls="collapse-{{ $key }}">
              <div class="d-flex align-items-center gap-3">
                <i class="bi {{ $item['icon'] }}"></i>
                <span>{{ $item['title'] }}</span>
              </div>
              <i class="bi bi-chevron-down nav-arrow"></i>
            </button>
            <ul class="nav flex-column small collapse" id="collapse-{{ $key }}">
              @foreach ($item['children'] as $child)
                <li class="nav-item">
                  <a href="{{ url($child['url']) }}" class="nav-link">{{ $child['title'] }}</a>
                </li>
              @endforeach
            </ul>
          @else
            <a href="{{ Route::has($item['route']) ? route($item['route']) : '' }}" 
              @class([
                'nav-link d-flex align-items-center gap-3', 
                'active' => Request::is($item['url'].'*')
              ])
            >
              <i class="bi {{ $item['icon'] }}"></i>
              <span>{{ $item['title'] }}</span>
            </a>
          @endif
        </li>
      @endforeach
    </ul>
  </div>
</div>
