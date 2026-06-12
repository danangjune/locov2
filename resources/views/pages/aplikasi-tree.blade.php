@extends('layouts.app')
@section('content')
@push('style')
{{-- Slick --}}
<!-- Add the slick-theme.css if you want default styling -->
<!-- Add the slick-theme.css if you want default styling -->
<link rel="stylesheet" href="{{ asset('assets/jstree/themes/default/style.min.css') }}" />
<link rel="stylesheet" type="text/css" href="" />
{{-- --}}
@endpush
{{-- Search Engine --}}
<div class="banner-apk-tree-gradient">
    <div class="banner-apk-tree-pattern">
        <div class="banner-apk-tree-content">
            <div class="banner-apk-tree-content-title text-gradient">Telusuri Layanan</div>
            <div class="row justify-content-center align-items-center">
                <div class="col-md-6">
                    <div class="input-group mb-3 opacity-50">
                        <span class="input-group-text rounded-start-pill ps-4 p-3 fs-5" id="basic-addon1"><i
                                class="bi bi-search"></i></span>
                        <input id="search-layanan" type="text" class="form-control rounded-end-pill p-3 fs-5"
                            placeholder="Contoh: Suket" aria-describedby="basic-addon1">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{{-- Sidebar Apk Tree --}}
@include('component.sidemenu-apktree')
{{-- Aplikasi Tree --}}
<div class="container mb-5">
    <div class="row justify-content-center align-items-start">
        {{-- JS TREE --}}
        {{-- <div class="col-12 col-sm-4 mx-auto">
                <div class="rounded shadow p-4">
                    <div class="fs-5 fw-bold text-gradient text-start mb-3">
                        Kategori
                    </div>
                    <div id="jstree">
                        <!-- in this example the tree is populated from inline HTML -->
                        <ul>
                            <li id="0"
                                data-jstree='{"icon":"{{ asset('assets/jstree/themes/default/house.png') }}"}'>Semua
        Aplikasi</li>
        @foreach ($data as $item)
        @if (count($item->children) > 0 && ($item->parent == '0' || $item->parent == null))
        @php
        if (preg_match('/>/i', $item->name)) {
        $item->name = str_replace('>', '> ', $item->name);
        }
        @endphp
        <li id="{{ $item->id }}"
            data-jstree='{"icon":"{{ asset('assets/jstree/themes/default/folder.png') }}"}'>
            {{ strip_tags($item->name) }}
            <ul>
                @foreach ($item->children as $items)
                @php
                if (preg_match('/>/i', $items->name)) {
                $items->name = str_replace('>', '> ', $items->name);
                }
                @endphp
                <li id="{{ $items->id }}"
                    data-jstree='{"icon":"{{ asset('assets/jstree/themes/default/file.png') }}"}'>
                    {{ strip_tags($items->name) }}
                </li>
                @endforeach
            </ul>
        </li>
        @elseif (count($item->children) <= 0 && ($item->parent == '0' || $item->parent == null))
            @php
            if (preg_match('/>/i', $item->name)) {
            $item->name = str_replace('>', '> ', $item->name);
            }
            @endphp
            <li id="{{ $item->id }}"
                data-jstree='{"icon":"{{ asset('assets/jstree/themes/default/file.png') }}"}'>
                {{ strip_tags($item->name) }}
            </li>
            @endif
            @endforeach
            </ul>
    </div>
</div>
</div> --}}
{{-- List Aplikasi --}}
<div class="col-12 col-sm-12 mx-auto">
    <div class="rounded shadow p-4">
        <div class="row align-items-center justify-content-between">
            <div id="title-content" class="col-8 col-sm-6 text-start">
                <div class="fs-4 fw-bold text-gradient text-start">
                    {{ 'KEDIRI NGANGENI' }}
                </div>
                <div class="fs-6 text-secondary text-opacity-50">
                    {{ 'Semua Layanan ' . ($category_id == '1' ? 'Publik' : ($category_id == '2' ? 'Pemerintah' : 'Lainnya')) }}
                </div>
            </div>
            <div class="col-4 col-sm-6 text-end d-none">
                <a type="button" class="btn btn-primary rounded-pill btn-sm fw-bold p-2 px-3 px-sm-5"
                    href="{{ '#' }}">
                    Hirarki
                </a>
            </div>
        </div>
        <hr class="mt-1 mb-3">
        <div class="container">
            <div id="content" class="row align-items-stretch"></div>
        </div>
        <div class="container d-flex justify-content-center align-items-center">
            <input type="hidden" name="page_val" id="page_val" value="1">
            <button type="button" class="btn btn-primary" id="load-more" onclick="LoadMore()">Load More <i class="bi bi-arrow-down-square"></i></button>
        </div>
    </div>
</div>
</div>
</div>
{{-- Script --}}
@push('script')
<script src="{{ asset('assets/jstree/jstree.min.js') }}"></script>
<script>
    // Set Variable
    var typingTimer; //timer identifier
    var doneTypingInterval = 1000; //time in ms, 5 seconds for example
    var tab_opd = false;

    // Replace Tags HTML from String
    function strip_tags(str) {
        return str != null ? str.replace(/(<([^>]+)>)/gi, ' ') : "";
    }

    // Fetch Data
    async function fetchdata(data) {
        var response = await fetch(data.url + (data.param_id ? data.param_id : ""), {
            ...data.headers,
            ...data.body,
            method: data.method.toUpperCase()
        });
        return await response.json();
    }

    // Search Engine
    function SearchEngine($this) {
        let pathArray = window.location.pathname.split('/');
        // Set Data Value
        var param = $($this).val();
        // console.log(param);
        // Get Content HTML
        var content = $('#content');
        var title_content = $('#title-content');
        // Reset Content
        content.empty();
        title_content.empty();
        $('#load-more').attr('disabled', false);
        // Get Data
        // Set Data
        var data_json = {
            url: '/cek-link-search',
            method: 'post',
            headers: {
                headers: {
                    'Content-Type': 'application/json',
                }
            },
            body: {
                body: JSON.stringify({
                    _token: "{{ csrf_token() }}",
                    param: param,
                    category_id: pathArray[2],
                })
            }
        }
        fetchdata(data_json).then(function(data) {
            // console.log(data);
            // Set Paginate Value
            if (data.per_page < data.total) {
                var pathpage = data.next_page_url?.split('=');
                page_val.val(pathpage[1]);
                $('#load-more').removeClass('d-none');
            } else {
                $('#load-more').addClass('d-none');
            }
            // Set Title Content
            title_content.append(`
                        <div class="fs-4 fw-bold text-gradient text-start">KEDIRI NGANGENI</div>
                        <div class="fs-6 text-secondary text-opacity-50">Semua Layanan ${pathArray[2]=='1'?'Publik':(pathArray[2]=='2'?'Pemerintah':'Lainnya')}</div>
                    `);
            // Set Content
            if (data.length > 0) {
                data.forEach(function(item) {
                    renderCardHtml(content, item);
                });
            } else {
                content.append(`
                            <div class="my-5 text-center">
                                <img src="/assets/img/empty-data.png"
                                    class="" alt="" height="200">
                            </div>
                        `);
            }
        });
    }

    // Redirect
    const redirectApp = async (id) => {
        const response = await fetch(`/redirect/${id}`);
        const json = await response.json();

        if (json.data.is_sso) {
            if (json.is_auth) {
                window.open(json.data.url, '_blank');
            } else {

                window.open('/auth/login', '_self');
            }
        } else {
            window.open(json.data.url, '_blank');
        }
    }

    // String Limit
    function str_limit(text, count) {
        return text.slice(0, count) + (text.length > count ? " ..." : "");
    }

    // Render Content
    function renderCardHtml(content, data) {
        content.append(`
                <div class="col-6 col-sm-2 mb-4">
                    <a href="javascript:void(0);" onclick="redirectApp(${data.id})" class="apk-list-a d-block h-100" data-bs-title="${strip_tags(data.name)}">
                        <div class="apk-list-div h-100 position-relative" style="${data.is_sso?'border-color: #1cac51 !important;':''}">
                            ${data.is_sso?`<span class="badge position-absolute top-0 end-0 me-1 ${data.app_from_id == 2 ? 'mt-4' : 'mt-1'}"
                                style="
                                    width: 40px;
                                    background: #22c55e;
                                    color: #fff;
                                    font-size: 7px;
                                    font-weight: 700;
                                    border-radius: 5px;
                                    padding: 6px 10px;
                                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                                ">SSO</span>`:``}
                            ${data.app_from_id == 2 ? `<span class="badge position-absolute top-0 end-0 me-1 mt-1"
                                style="
                                    width: 40px;
                                    background: #2563eb;
                                    color: #fff;
                                    font-size: 7px;
                                    font-weight: 700;
                                    border-radius: 5px;
                                    padding: 6px 10px;
                                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                                ">${data.app_from.name}</span>` : ``}

                            <img src="/storage/apps/${data.image}" alt="" width="85" height="85">

                            <span class="apk-list-kategori">${data?.urusan?.title ?? ''}</span>
                            <span class="apk-list-title">${strip_tags(data.name)}</span>
                            <span class="apk-list-desk">
                                ${str_limit(strip_tags(data.description), 50)}
                                ${data.description?.length > 50
                                    ? `<i class="bi bi-info-circle" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="${strip_tags(data.description)}"></i>`
                                    : ``}
                            </span>
                        </div>
                    </a>
                </div>
                `);
    }

    function jsTreeLoad(element = $('#jstree')) {
        // JSTREE Content Proses
        // 6 create an instance when the DOM is ready
        element.jstree();

        // 7 bind to events triggered on the tree
        element.on('changed.jstree', function(e, item) {
            let pathArray = window.location.pathname.split('/');
            // Menampilkan Aplikasi
            console.log('onChange', item.selected);
            // Get Content HTML
            var content = $('#content');
            var title_content = $('#title-content');
            var page_val = $('#page_val');
            // Reset Content
            content.empty();
            title_content.empty();
            $('#load-more').attr('disabled', false);
            // Get Data
            // Set Data

            // split params
            let paramsArray = String(item.selected).split('-');
            // console.log(paramsArray[0], paramsArray[1]);

            var data_json = {
                param_id: `${paramsArray[1]}?source=${paramsArray[0]}&category_id=${pathArray[2]}&page=`,
                url: '/cek-link-show/',
                method: 'get',
            }
            fetchdata(data_json).then(function(data) {
                // console.log(data);
                // Set Paginate Value
                if (data.per_page < data.total) {
                    var pathpage = data.next_page_url?.split('=');
                    page_val.val(pathpage[1]);
                    $('#load-more').removeClass('d-none');
                } else {
                    $('#load-more').addClass('d-none');
                }
                // Set Title Content
                if (paramsArray[1] == '0') {
                    title_content.append(`
                                <div class="fs-4 fw-bold text-gradient text-start">KEDIRI NGANGENI</div>
                                <div class="fs-6 text-secondary text-opacity-50">Semua Layanan ${pathArray[2]=='1'?'Public Digital':(pathArray[2]=='2'?'ASN Digital':'Lainnya')}</div>
                            `);
                    // Set Content
                    data.data?.forEach(function(item) {
                        renderCardHtml(content, item);
                    });
                } else {
                    const parentRoot = data.data[0]?.parent_root;

                    title_content.append(`
                                <div class="fs-4 fw-bold text-gradient text-start">${parentRoot.name}</div>
                                <div class="fs-6 text-secondary text-opacity-50">${parentRoot.description ?? '-'}</div>
                            `);
                    // Set Content
                    data.data.forEach(item => {
                        renderCardHtml(content, item);
                    });
                }
            });
        });
        // Load Data
        element.on('ready.jstree refresh.jstree', function(e) {
            let pathArray = window.location.pathname.split('/');

            // Get Content HTML
            var content = $('#content');
            var title_content = $('#title-content');
            var page_val = $('#page_val');
            // Reset Content
            content.empty();
            title_content.empty();
            $('#load-more').attr('disabled', false);
            // Get Data
            // Set Data
            var data_json = {
                param_id: `0?source=all&category_id=${pathArray[2]}&page=1`,
                url: '/cek-link-show/',
                method: 'get',
            }
            fetchdata(data_json).then(function(data) {
                // console.log(data);
                // Set Paginate Value
                if (data.per_page < data.total) {
                    var pathpage = data.next_page_url?.split('=');
                    page_val.val(pathpage[1]);
                    $('#load-more').removeClass('d-none');
                } else {
                    $('#load-more').addClass('d-none');
                }
                // Set Title Content
                title_content.append(`
                            <div class="fs-4 fw-bold text-gradient text-start">KEDIRI NGANGENI</div>
                            <div class="fs-6 text-secondary text-opacity-50">Semua Layanan ${pathArray[2]=='1'?'Public Digital':(pathArray[2]=='2'?'ASN Digital':'Lainnya')}</div>
                        `);
                // Set Content
                data.data.forEach(function(item) {
                    renderCardHtml(content, item);
                });
            });
        });
    }

    function switchJsTreeLoad() {
        if (tab_opd == false) {
            jsTreeLoad($('#jstreeOpd'));
            tab_opd = true;
        }
    }

    function LoadMore() {
        let pathArray = window.location.pathname.split('/');
        // Menampilkan Aplikasi
        // console.log('onChange', item.selected);
        // Get Content HTML
        var content = $('#content');
        var title_content = $('#title-content');
        var page_val = $('#page_val');
        // Reset Content
        // content.empty();
        // title_content.empty();
        // Get Data
        // Set Data
        var data_json = {
            param_id: `0?source=all&category_id=${pathArray[2]}&page=${page_val.val()}`,
            url: '/cek-link-show/',
            method: 'get',
        }
        fetchdata(data_json).then(function(data) {
            // Disable Button
            if ((data.last_page - 1) == data.current_page) {
                $('#load-more').attr('disabled', true);
            }
            // Set Paginate Value
            if (data.per_page < data.total) {
                var pathpage = data.next_page_url?.split('=');
                page_val.val(pathpage[1]);
                $('#load-more').removeClass('d-none');
            } else {
                $('#load-more').addClass('d-none');
            }
            // console.log(data);
            // Set Content
            data.data.forEach(function(item) {
                renderCardHtml(content, item);
            });
        });
    }

    // Komponen DidMount
    $(function() {
        jsTreeLoad($('#jstree'));

        //on keyup, start the countdown
        $('#search-layanan').on('input', function(e) {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(x => {
                SearchEngine(this)
            }, doneTypingInterval)
        });
        // Side Bar Menu Change Class Icon Aplikasi
        const myOffcanvas = $('#offcanvasExample');
        myOffcanvas.on('shown.bs.offcanvas', event => {
            var content = $('#icon-button-aplikasi');
            content.removeClass('bi-arrow-left-circle');
            content.addClass('bi-arrow-right-circle');
        });
        myOffcanvas.on('hidden.bs.offcanvas', event => {
            var content = $('#icon-button-aplikasi');
            content.removeClass('bi-arrow-right-circle');
            content.addClass('bi-arrow-left-circle');
        });
    });
</script>
@endpush
@endsection