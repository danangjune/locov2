@extends('layouts.app')
@section('content')
@push('style')
{{-- Slick --}}
<!-- Add the slick-theme.css if you want default styling -->
<link rel="stylesheet" type="text/css" href="https:////cdn.jsdelivr.net/gh/kenwheeler/slick@1.8.1/slick/slick.css" />
<!-- Add the slick-theme.css if you want default styling -->
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/gh/kenwheeler/slick@1.8.1/slick/slick-theme.css" />
{{-- --}}
@endpush
{{-- Content Layanan --}}
<div class="content-layanan-parent">
    <div class="content-layanan-title">KEDIRI NGANGENI</div>
    <div class="content-layanan-description">Telusuri semua layanan digital di Kota Kediri</div>
    <div class="content-layanan-content-parent">
        <div class="content-layanan-content-div">
            {{-- Jenis Layanan --}}
            <div class="content-layanan-content-jnslyn">
                @foreach ($categories as $key => $item)
                <div class="layanan-div {{ count($categories)-1==$key?"rounded-end-3":"" }} {{ $key==0?"rounded-start-3":"" }}" id="div-{{ $item->id }}" data-bs-toggle="tooltip" data-bs-title="{{ $item->sub_title }}">
                    <a href="javascript:void(0)" id="{{ $item->id }}" onclick="SetClass(null, this.id)" style="text-decoration: none;">
                        <div class="clc-jnslyn-title">{!! $item->title_html !!}</div>
                    </a>
                </div>
                @endforeach
            </div>
            {{-- Form Input --}}
            <div class="content-layanan-content-frminpt">
                <input type="search" class="form-control form-control-lg text-center bg-secondary-subtle" list="datalistOptions" id="src-aplikasi" placeholder="Telusuri layanan Public Digital...">
                <span class="input-group-text fs-6 bg-secondary-subtle"><i class="bi bi-search"></i></span>
            </div>
            {{-- Slide Slick --}}
            <div class="container-fluid mt-4">
                <div class="smart-slik"></div>
            </div>
            {{-- Button List Aplikasi Selengkapnya --}}
            <input type="hidden" name="get_category_id">
            <button onclick="GoTo()" target="" class="btn btn-primary mt-4">Lihat Selengkapnya <i class="bi bi-arrow-right"></i></button>
        </div>
    </div>
</div>

{{-- Banner Pecut Baru --}}
{{-- <div class="banner-parent">
        <div class="banner-layer-1">
            <div class="banner-layer-1-content">
                PECUT Kota Kediri
            </div>
        </div>
        <div class="banner-layer-2">
            <div class="banner-layer-2-content-1">
                PECUT
            </div>
            <div class="banner-layer-2-content-2">
                PORTAL EFISIEN CEPAT MUDAH TERPADU
            </div>
            <div class="banner-layer-2-content-2 mt-3 d-none d-sm-block" style="font-size: 0.8rem !important">
                Website layanan PECUT Kota Kediri adalah portal digital yang menyediakan akses cepat, mudah, dan terpadu ke berbagai layanan pemerintahan Kota Kediri untuk meningkatkan efisiensi dan kemudahan bagi masyarakat.
            </div>
        </div>
    </div> --}}

{{-- Banner Title --}}
{{-- <div class="banner-title" style="background-image: url('{{ asset('assets/img/bg-banner.png') }}');">
<div class="banner-title-parent">
    <div class="banner-title-title">PECUT</div>
    <div class="banner-title-subtitle">PORTAL EFISIEN CEPAT MUDAH TERPADU</div>
    <div class="banner-title-description">Website layanan PECUT Kota Kediri adalah portal digital yang menyediakan akses cepat, mudah, dan terpadu ke berbagai layanan pemerintahan Kota Kediri untuk meningkatkan efisiensi dan kemudahan bagi masyarakat.</div>
</div>
</div> --}}

@include('pages.homepage_section_app')
@include('pages.homepage_agenda')

{{-- Carousel --}}
<div class="banner-gradient pb-5">
    <div class="banner-pattern">
        <div class="container position-relative pt-5">
            <div class="d-flex flex-column align-items-start text-end">
                <h1 class="my-0 fw-bold">10 Berita Teratas</h1>
                <h4 class="my-0 fw-bold text-primary">Kota Kediri</h4>
            </div>
        </div>
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                @foreach ($berita as $key => $slide)
                <button type="button" data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to="{{ $key }}" @class(['active'=> $key == 0])
                    aria-current="{{ $key == 0 ? true : false }}" aria-label="Slide {{ $key++ }}"></button>
                @endforeach
            </div>
            <div class="carousel-inner">
                @foreach ($berita as $key => $slide)
                <div @class(['carousel-item', 'active'=> $key == 0])>
                    {{-- Website --}}
                    <div class="d-none d-sm-flex container">
                        <div class="row align-items-center">
                            <div class="col-12 col-sm-6 p-3">
                                <h4 class="fw-bold fs-5"><b>{{ $slide->judul }}</b></h4>
                                @php
                                $deskripsi = preg_replace("/<img[^>]+\>/i", "", $slide->deskripsi);
                                    @endphp
                                    <p class="fw-medium fs-6">{!! Str::limit($deskripsi, 520) !!}</p>
                                    <a href="https://www.kedirikota.go.id/p/berita/{{ $slide->idpost }}/{{ $slide->judulurl }}" class="btn btn-outline-primary rounded-pill btn-sm"
                                        target="_blank">
                                        <div class="d-flex align-items-center gap-2">
                                            <span>Selanjutnya</span>
                                            <i class="bi bi-arrow-right-circle"></i>
                                        </div>
                                    </a>
                            </div>
                            <div class="col-12 col-sm-6 p-3">
                                <img src="{{ $slide->linkgambar }}" class="rounded-4 shadow object-fit-cover" style="width: 100% !important; height: 20rem !important;"
                                    alt="...">
                            </div>
                        </div>
                    </div>
                    {{-- Mobile --}}
                    <div class="d-flex d-sm-none flex-column container p-4">
                        <div class="d-flex justify-content-center mb-4 mt-4 px-3">
                            <img src="{{ $slide->linkgambar }}" class="rounded shadow object-fit-cover" style="height: 250px;"
                                alt="...">
                        </div>
                        <h4 class="fw-bold fs-5 text-center"><b>{{ $slide->judul }}</b></h4>
                        @php
                        $deskripsi = preg_replace("/<img[^>]+\>/i", "", $slide->deskripsi);
                            @endphp
                            <p class="fw-medium fs-6">{!! Str::limit($deskripsi, 300) !!}</p>
                            <div class="d-flex justify-content-center">
                                <a href="https://www.kedirikota.go.id/p/berita/{{ $slide->idpost }}/{{ $slide->judulurl }}" class="btn btn-outline-primary rounded-pill btn-sm"
                                    target="_blank">
                                    <div class="text-center gap-2">
                                        <span>Selanjutnya</span>
                                        <i class="bi bi-arrow-right-circle"></i>
                                    </div>
                                </a>
                            </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </div>
</div>
{{-- Modal --}}
@include('modal.homepage-modal')
{{-- Script --}}
@push('script')
<script type="text/javascript" src="//cdn.jsdelivr.net/gh/kenwheeler/slick@1.8.1/slick/slick.min.js"></script>
{{-- Slick Control --}}
<script type="text/javascript">
    // Set Variable
    var category; //set category layanan
    var limit = 50;
    var typingTimer; //timer identifier
    var doneTypingInterval = 1000; //time in ms, 5 seconds for example

    // Slick Element Setting
    $('.smart-slik').slick({
        slidesToShow: 5,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            }
        }]
    });

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

    // String Limit
    function str_limit(text, count) {
        return text.slice(0, count) + (text.length > count ? " ..." : "");
    }

    function renderCardHtml(content, data) {
        const html = `
                    <div class="smart-items">
                        <a href="javascript:void(0);" onclick="redirectApp(${data.id})" class="smart-a" data-bs-title="${strip_tags(data.urusan?.title)}">
                            ${data.is_sso?`<div class="smart-div">`:`<div class="smart-div">`}
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
                                <img src="/storage/apps/${data.image}"
                                    class="" alt="" width="100"
                                    height="100">
                                <span class="apk-list-kategori mb-0">${!!data?.parent_root ? data.parent_root.name : data.urusan?.title}</span>
                                <h5 class="smart-h mt-0">${strip_tags(data.name)}</h5>
                            </div>
                        </a>
                    </div>
                `;

        content.slick('slickAdd', html);
    }

    // Search Engine
    function SearchEngine($this, category_id, is_search) {
        // Set Data Value
        var param = $this != null ? $($this).val() : '';
        // console.log(param);
        category = category_id;
        // Get Content HTML
        var content = $('.smart-slik');
        // Reset Content
        content.slick('removeSlide', null, null, true);
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
                    limit: limit,
                    category_id: category_id,
                })
            }
        }
        fetchdata(data_json).then(function(data) {
            console.log(data);
            if (data.length > 0) {
                data.forEach(item => {
                    renderCardHtml(content, item);
                });
            } else {
                var html = `
                            <div class="text-center">
                                <img src="/assets/img/empty-data.png"
                                    class="" alt="" height="150">
                            </div>
                        `
                // Add Slick
                content.slick('slickAdd', html);
            }
        });
    }

    // Set Background Clas Layanan
    function SetClass($this, category_id) {
        // Set Class Background
        $('#div-' + category).removeClass("bg-primary-subtle");
        $('#div-' + category_id).addClass("bg-primary-subtle");
        $('[name="get_category_id"]').val(category_id);
        // Show Data
        SearchEngine($this, category_id, false);

        $('[type="search"]').attr('placeholder', category_id > 1 ? 'Telusuri layanan ASN Digital...' : 'Telusuri layanan Public Digital...');
    }

    // Set Value Button Selengkapnya
    function GoTo() {
        // Set Value
        window.location.href = "/cek-link/" + $('[name="get_category_id"]').val();
    }

    // Set Redirect
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

    // Komponen DidMount
    $(function() {
        // on keyup, start the countdown
        $('#src-aplikasi').on('input', function(e) {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(x => {
                SearchEngine(this, category, true)
            }, doneTypingInterval)
        });
        // Load Data with click function
        $('#1').click();
    });
</script>
@endpush
@endsection