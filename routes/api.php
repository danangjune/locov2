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
Route::prefix('caas')->group(function () {
    Route::get('/get', [EncryptionController::class, 'get'])->name('caas.get');
    Route::post('/search', [EncryptionController::class, 'search'])->name('caas.search');
});

Route::prefix('refer')->name('refer.')->group(function () {
    Route::get('/kategori', [ReferController::class, 'kategori']);
    Route::get('/urusan', [ReferController::class, 'urusan']);
});
Route::get('/apps', [AppLinkController::class, 'index']);
Route::get('/apps/random', [AppLinkController::class, 'randomSelection']);

Route::prefix('agenda')->group(function () {
    Route::get('/', [AgendaController::class, 'index']);
});

Route::get('/berita/top', [HomeController::class, 'beritaTop']);

Route::prefix('aduan')->group(function () {
    Route::get('/top', [AduanPortalController::class, 'top']);
    Route::get('/detail/{id}', [AduanPortalController::class, 'detail']);
});
