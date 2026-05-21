@extends('admin.layouts.app')

@section('title', 'Form')

@section('content')
  <div class="app-content">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card border-0">
            <div class="card-header d-block d-md-flex align-items-center justify-content-between py-3 bg-white">
              <h5 class="mb-3 my-md-0 fw-bold">Form Layanan &amp; Aplikasi</h5>
            </div>
            <div class="card-body">
              <form action="{{ route('admin.apps.store') }}" method="POST">
                @csrf
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <input type="text" name="code" placeholder=""
                        class="form-control @error('code') is-invalid @enderror"
                        value="{{ old('code', $data['code']) }}"
                      >
                      <label>Code</label>
                      @error('code')
                        <div class="invalid-feedback">{{ $message }}</div>
                      @enderror
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <input type="text" name="name" placeholder=""
                        class="form-control @error('name') is-invalid @enderror"
                        value="{{ old('name', $data['name']) }}"
                      >
                      <label>Nama Aplikasi</label>
                      @error('name')
                        <div class="invalid-feedback">{{ $message }}</div>
                      @enderror
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <input type="text" name="alias" placeholder=""
                        class="form-control @error('alias') is-invalid @enderror"
                        value="{{ old('alias', $data['alias']) }}"
                      >
                      <label>Alias</label>
                      @error('alias')
                        <div class="invalid-feedback">{{ $message }}</div>
                      @enderror
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <input type="text" name="url" placeholder=""
                        class="form-control @error('url') is-invalid @enderror"
                        value="{{ old('url', $data['url']) }}"
                      >
                      <label>URL</label>
                      @error('url')
                        <div class="invalid-feedback">{{ $message }}</div>
                      @enderror
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-floating mb-3">
                      <textarea name="description" class="form-control @error('description') is-invalid @enderror" placeholder=""
                        style="min-height: 100px;"
                      >{{ old('description', $data['description']) }}</textarea>
                      <label for="floatingTextarea">Deskripsi Aplikasi</label>
                      @error('description')
                        <div class="invalid-feedback">{{ $message }}</div>
                      @enderror
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-floating mb-3">
                      <select name="category_id" class="form-select @error('category_id') is-invalid @enderror">
                        <option value="">Pilih Kategori</option>
                        @foreach ($categories as $item)
                          <option value="{{ $item->id }}" @selected(old('category_id', $data['category_id']) == $item['id'])>{{ $item->title }}</option>
                        @endforeach
                      </select>
                      <label>Pilih Kategori</label>
                      @error('category_id')
                        <div class="invalid-feedback">{{ $message }}</div>
                      @enderror
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <input type="text" name="icon" placeholder=""
                        class="form-control @error('icon') is-invalid @enderror"
                        value="{{ old('icon', $data['icon']) }}"
                      >
                      <label>Icon</label>
                      @error('icon')
                        <div class="invalid-feedback">{{ $message }}</div>
                      @enderror
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-floating mb-3">
                      <input type="file" name="image" class="form-control @error('image') is-invalid @enderror" placeholder="">
                      <label>Image</label>
                      @error('image')
                        <div class="invalid-feedback">{{ $message }}</div>
                      @enderror
                    </div>
                  </div>

                  <div class="col-12">
                    <hr>
                  </div>

                  <div class="col-12">
                    <div class="d-flex justify-content-end gap-2">
                      <a href="{{ route('admin.apps.index') }}" class="btn btn-light">Back</a>
                      <button type="submit" class="btn btn-primary px-4 d-flex align-items-center gap-2">
                        <span>Create</span>
                        <i class="bi bi-check"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
@endsection