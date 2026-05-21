@extends('layouts.app')
@section('content')
    <div class="container my-5 rounded shadow py-2 py-sm-3 px-2 px-sm-3">
        <div class="fs-4 fw-bold text-dark text-start text-gradient">
            {{ 'Panduan Penggunaan' }}
        </div>
        <div class="text-secondary text-opacity-50" style="font-size: 13px">
            {{ 'Informasi Panduan Penggunaan dan Fitur pada aplikasi Pecut' }}
        </div>
        <hr class="text-secondary text-opacity-50 mt-1">
        <div class="mt-4">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link-new disabled" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                        type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Tutorial</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link-new disabled" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
                        type="button" role="tab" aria-controls="profile-tab-pane"
                        aria-selected="false">Fitur</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link-new active" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane"
                        type="button" role="tab" aria-controls="contact-tab-pane"
                        aria-selected="false">File</button>
                </li>
            </ul>
            <div class="tab-content" id="myTabContent">
                {{-- Manggil Panduan Tabs Tutorial --}}
                @include('component.panduan-tutorial')
                {{-- Manggil Panduan Tabs Fitur --}}
                @include('component.panduan-fitur')
                {{-- Manggil Panduan Tabs File --}}
                @include('component.panduan-file')
            </div>
        </div>
    </div>
@endsection
