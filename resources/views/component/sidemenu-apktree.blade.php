{{-- Hide Menu Bar JS Tree --}}
{{-- JS TREE --}}
<div  data-bs-config='{"backdrop":false, "scroll":true, "keyboard":true}' class="apk-sidemenu-parent offcanvas-start" tabindex="-1" id="offcanvasExample" style="z-index:1">
  <div class="d-flex align-items-center position-relative">
    <div class="apk-sidemenu-filetree">
      <ul class="mb-3 nav nav-pills" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link rounded-4 active" id="pills-urusan-tab" data-bs-toggle="pill" data-bs-target="#pills-urusan" type="button" role="tab" aria-controls="pills-urusan" aria-selected="true">Urusan</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link rounded-4" id="pills-opd-tab" data-bs-toggle="pill" data-bs-target="#pills-opd" type="button" role="tab" aria-controls="pills-opd" aria-selected="false" onclick="switchJsTreeLoad()">Perangkat Daerah</button>
        </li>
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div class="tab-pane fade show active" id="pills-urusan" role="tabpanel" aria-labelledby="pills-urusan-tab" tabindex="0">
          <div id="jstree" class="overflow-auto" style="height: 60vh;">
            <ul>
              <li id="all-0" data-jstree='{"icon":"{{ asset('assets/jstree/themes/default/house.png') }}"}'>
                Semua Aplikasi
              </li>
              @foreach ($urusan as $item)
                @if (count($item->children) > 0)
                  @php
                    if (preg_match('/>/i', $item->title)) {
                      $item->title = str_replace('>', '> ', $item->title);
                    }
                  @endphp
                  <li 
                    id="urusan-{{ $item->id }}"
                    data-jstree='{"icon":"{{ asset('assets/jstree/themes/default/'.$item->icon_name) }}"}'
                  >
                    {{ strip_tags($item->title) }}
                    <ul>
                        @foreach ($item->children as $items)
                          @php
                            if (preg_match('/>/i', $items->name)) {
                              $items->name = str_replace('>', '> ', $items->name);
                            }
                          @endphp
                          <li 
                            id="app-{{ $items->id }}"
                            data-jstree='{"icon":"{{ asset('assets/jstree/themes/default/icon-chevron-right.png') }}"}'
                          >
                            {{ strip_tags($items->name) }}
                          </li>
                        @endforeach
                    </ul>
                  </li>
                @elseif (count($item->children) <= 0)
                  @php
                    if (preg_match('/>/i', $item->title)) {
                      $item->title = str_replace('>', '> ', $item->title);
                    }
                  @endphp
                  <li 
                    id="urusan-{{ $item->id }}"
                    data-jstree='{"icon":"{{ asset('assets/jstree/themes/default/'.$item->icon_name) }}"}'
                  >
                    {{ strip_tags($item->title) }}
                  </li>
                @endif
              @endforeach
            </ul>
          </div>
        </div>
        <div class="tab-pane fade" id="pills-opd" role="tabpanel" aria-labelledby="pills-opd-tab" tabindex="0">
          <div id="jstreeOpd" class="overflow-auto" style="height: 60vh;">
            <ul>
              <li id="all-0" data-jstree='{"icon":"{{ asset('assets/jstree/themes/default/house.png') }}"}'>
                Semua OPD
              </li>
              @foreach ($opds as $item)
                @if (count($item->children) > 0)
                  @php
                    if (preg_match('/>/i', $item->title)) {
                      $item->title = str_replace('>', '> ', $item->title);
                    }
                  @endphp
                  <li 
                    id="parent-{{ $item->id }}"
                    data-jstree='{"icon":"{{ asset('assets/jstree/themes/default/'.$item->icon_name) }}"}'
                  >
                    {{ strip_tags($item->title) }}
                    <ul>
                        @foreach ($item->children as $items)
                          @php
                            if (preg_match('/>/i', $items->name)) {
                              $items->name = str_replace('>', '> ', $items->name);
                            }
                          @endphp
                          <li 
                            id="app-{{ $items->id }}"
                            data-jstree='{"icon":"{{ asset('assets/jstree/themes/default/icon-chevron-right.png') }}"}'
                          >
                            {{ strip_tags($items->name) }}
                          </li>
                        @endforeach
                    </ul>
                  </li>
                @elseif (count($item->children) <= 0)
                  @php
                    if (preg_match('/>/i', $item->title)) {
                      $item->title = str_replace('>', '> ', $item->title);
                    }
                  @endphp
                  <li 
                    id="app-{{ $item->id }}"
                    data-jstree='{"icon":"{{ asset('assets/jstree/themes/default/'.$item->icon_name) }}"}'
                  >
                    {{ strip_tags($item->title) }}
                  </li>
                @endif
              @endforeach
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="apk-sidemenu-filebutton">
      <a href="#offcanvasExample" class="apk-sidemenu-button" data-bs-toggle="offcanvas" aria-controls="offcanvasExample">
        <div class="text-center d-flex align-items-center gap-2 fw-bold">
          <span>Aplikasi</span>
          <i class="bi bi-arrow-left-circle fw-bold" id="icon-button-aplikasi"></i>
        </div>
      </a>
    </div>
  </div>
</div>
