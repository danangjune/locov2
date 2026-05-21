<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>@yield('title') - {{ config('app.name') }}</title>
  @stack('style')
  @vite('resources/sass/app.scss')
  {{-- Toastr --}}
  <link rel="stylesheet" href="{{ asset('assets/toastr/build/toastr.min.css') }}">
  @stack('styles')
</head>
<body>
  @include('admin.layouts.header')
  @include('admin.layouts.sidebar')
  <main class="app-content-wrapper">
    @yield('content')
    @include('admin.layouts.footer')
  </main>

  <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
  
  @vite('resources/js/app.js')
  {{-- Toastr --}}
  <script src="{{ asset('assets/toastr/build/toastr.min.js') }}"></script>
  {{-- Swal --}}
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  @stack('scripts')
</body>
</html>