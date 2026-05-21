<aside class="app-sidebar">
  <div class="app-sidebar-header">
    <a href="{{ route('home') }}" class="d-flex align-items-center gap-3 text-decoration-none text-white" target="_blank" rel="noopener noreferrer">
      <img src="{{ asset('assets/img/navbar/logo-dashboard.png') }}" height="35" alt="">
    </a>
  </div>
  <div class="app-sidebar-body">
    <ul class="nav flex-column">
      @foreach ($adminNavigation as $key => $item)
        <li class="nav-item">
          @if (isset($item['children']))
            <button class="nav-link w-100 d-flex align-items-center justify-content-between" data-bs-toggle="collapse" data-bs-target="#collapse-{{ $key }}" 
              aria-expanded="{{ Request::is($item['url'].'*') }}" 
              aria-controls="collapse-{{ $key }}"
            >
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

    <div class="pattern">
      <img src="{{ asset('assets/img/pattern.png') }}" alt="">
    </div>
  </div>
</aside>
