<div class="pb-5 pt-2 bg-transparent">
  <div class="container">
    <div class="row">
      @foreach ($sections as $section)
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-header d-flex flex-column border-0 bg-light">
              <h5 class="my-2 fw-bolder text-primary-emphasis" style="font-size: 1.25rem;">{{ $section->title }}</h5>
            </div>
            <div class="card-body p-1 overflow-y-auto" style="min-height: auto; max-height: 40vh;">
              @if (count($section['children']) > 0)
                <ul class="list-group list-group-flush">
                  @foreach ($section['children'] as $item)
                    <button type="button" id="{{ $item->app_id }}" 
                      class="list-group-item list-group-item-action"
                      onclick="redirectApp(this.id)"  
                    >
                      <div class="d-flex align-items-center justify-content-between gap-3">
                        <div>
                          <h5 class="mb-2 fw-bold text-primary">{{ empty($item->apps->alias) ? $item->apps->name : $item->apps->alias }}</h5>
                          <p class="my-0 lh-2 text-muted" style="font-size: 0.9rem;">{{ empty($item->apps->description) ? '-' : $item->apps->description }}</p>
                        </div>
                        {{-- <div>
                          <i class="bi bi-arrow-right"></i>
                        </div> --}}
                      </div>
                    </button>
                  @endforeach
                </ul>
              @else
                <div class="p-3 text-center">No data available.</div>
              @endif
            </div>
          </div>
        </div>
      @endforeach
    </div>
  </div>
</div>
