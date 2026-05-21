@extends('layouts.app')

@section('content')
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <p class="text-muted">Sign in with your account.</p>

            <form method="POST" action="{{ route('login') }}">
              @csrf

              <div class="input-group has-validation mb-3">
                <span class="input-group-text">
                  <i class="bi bi-person"></i>
                </span>
                <div class="form-floating @error('email') is-invalid @enderror">
                  <input type="email" name="email" value="{{ old('email') }}" class="form-control @error('email') is-invalid @enderror" placeholder="" required>
                  <label>Email</label>
                </div>
                <div class="invalid-feedback">
                  @error('email')
                    <span class="fw-bold">{{ $message }}</span>
                  @enderror
                </div>
              </div>

              <div class="input-group has-validation mb-3">
                <span class="input-group-text">
                  <i class="bi bi-key"></i>
                </span>
                <div class="form-floating @error('password') is-invalid @enderror">
                  <input type="password" name="password" class="form-control @error('password') is-invalid @enderror" placeholder="" required>
                  <label>Password</label>
                </div>
                <div class="invalid-feedback">
                  @error('password')
                    <span class="fw-bold">{{ $message }}</span>
                  @enderror
                </div>
              </div>

              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                <label class="form-check-label" for="remember">
                  {{ __('Remember Me') }}
                </label>
              </div>

              <div class="d-flex align-items-center justify-content-end gap-2">
                {{-- @if (Route::has('password.request'))
                  <a class="btn btn-link" href="{{ route('password.request') }}">
                    {{ __('Forgot Your Password?') }}
                  </a>
                @endif --}}

                <a href="{{ route('sso.login') }}"
                  class="btn btn-link"
                >Login with SSO</a>
                <button type="submit" class="btn btn-primary">
                  {{ __('Login') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
@endsection
