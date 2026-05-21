<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    {{--
    <meta http-equiv="X-UA-Compatible" content="ie=edge"> --}}
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=9" />
    <title>{{ config('app.name') }}</title>
    <link rel="icon" href="/assets/img/logo/logo-pemkotkediri.png" type="image/icon type">
    {{-- Slick --}}
    @stack('style')
    @vite(['resources/sass/app.scss', 'resources/js/app.js'])
</head>
{{-- Google Analytics --}}
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-7MNZYWZHCD"></script>
<script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', 'G-7MNZYWZHCD');
</script>

<body>
    {{-- Navbar --}}
    @include('component.navbar')
    {{-- Content --}}
    <div class="main-content">
        @yield('content')
    </div>
    {{-- Footer --}}
    @include('component.footer')
    {{-- Javascript --}}
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    {{-- Tooltip --}}
    <script>
        $(function() {
            $("body").tooltip({
                selector: '[data-bs-toggle="tooltip"]'
            });
        });
    </script>
    {{-- Swal --}}
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    @stack('script')
    <script>
        (function(d){
          var s = d.createElement("script");
          /* uncomment the following line to override default position*/
          /* s.setAttribute("data-position", 3);*/
          /* uncomment the following line to override default size (values: small, large)*/
          /* s.setAttribute("data-size", "small");*/
          /* uncomment the following line to override default language (e.g., fr, de, es, he, nl, etc.)*/
          /* s.setAttribute("data-language", "language");*/
          /* uncomment the following line to override color set via widget (e.g., #053f67)*/
          s.setAttribute("data-color", "#1e6fa5");
          /* uncomment the following line to override type set via widget (1=person, 2=chair, 3=eye, 4=text)*/
          /* s.setAttribute("data-type", "1");*/
          /* s.setAttribute("data-statement_text:", "Our Accessibility Statement");*/
          /* s.setAttribute("data-statement_url", "http://www.example.com/accessibility")";*/
          /* uncomment the following line to override support on mobile devices*/
          /* s.setAttribute("data-mobile", true);*/
          /* uncomment the following line to set custom trigger action for accessibility menu*/
          /* s.setAttribute("data-trigger", "triggerId")*/
          s.setAttribute("data-account", "FCl1e8LsIe");
          s.setAttribute("src", "https://cdn.userway.org/widget.js");
          (d.body || d.head).appendChild(s);
        })(document)
    </script>
    <noscript>Please ensure Javascript is enabled for purposes of <a href="https://userway.org">website
            accessibility</a></noscript>
</body>

</html>