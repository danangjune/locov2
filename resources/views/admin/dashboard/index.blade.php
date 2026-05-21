@extends('admin.layouts.app')

@section('title', 'Dashboard')

@section('content')
  <div class="app-content">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="mb-5 d-flex align-items-center gap-3">
            <div class="d-flex align-items-center justify-content-center rounded-circle bg-warning-subtle" style="width: 50px; height: 50px;">
              <i class="bi bi-lightbulb-fill fs-3 text-warning"></i>
            </div>
            <div class="d-flex flex-column">
              <p class="my-0 text-muted">Welcome back,</p>
              <h2 class="my-0 fw-bold text-primary">{{ auth()->user()->name }}</h2>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        @foreach ($data as $item)
          <div class="col-6 col-md-3">
            @include('admin.dashboard.card', [
              'title' => $item->title,
              'count' => $item->count,
            ])
          </div>
        @endforeach
      </div>

      <div class="row">
        <div class="col-12">
          <br>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <h5 class="fw-bold">Jumlah Aplikasi per Urusan</h5>
          <hr>
        </div>
        @foreach ($statsUrusan as $item)
          <div class="col-6 col-md-3">
            <div class="card mb-3 border-0 shadow-sm">
              <div class="card-body">
                <p class="text-muted">{{ $item['title'] }}</p>
                <div class="d-flex flex-wrap align-items-center justify-content-between">
                  <img src="{{ asset('assets/jstree/themes/default/'.$item['icon_name']) }}" height="20" alt="Icon">
                  <p class="my-0 fw-bold">{{ $item['count'] }}</p>
                </div>
              </div>
            </div>
          </div>
        @endforeach
      </div>
    </div>
  </div>
@endsection