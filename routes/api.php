<?php

use App\Http\Controllers\Api\AgendaController;
use App\Http\Controllers\Api\AppLinkController;
use App\Http\Controllers\Api\ReferController;
use App\Http\Controllers\Auth\EncryptionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Api\AduanPortalController;

// Route CAAS BSSN
Route::middleware(['apikey'])->prefix('caas')->group(function () {
    Route::get('/get', [EncryptionController::class, 'get'])->name('caas.get');
    Route::post('/search', [EncryptionController::class, 'search'])->name('caas.search');
});

Route::middleware(['apikey'])->prefix('apps')->name('apps.')->group(function () {
    Route::get('/', [AppLinkController::class, 'index']);
    Route::get('/popular', [AppLinkController::class, 'popular']);
    Route::get('/kategori', [AppLinkController::class, 'kategori']);
    Route::get('/urusan', [AppLinkController::class, 'urusan']);
    Route::get('/opd', [AppLinkController::class, 'opd']);
});
