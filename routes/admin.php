<?php

use App\Http\Controllers\Admin\BantuanController;
use App\Http\Controllers\Admin\JenisBantuanController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\KartuKeluargaController;
use App\Http\Controllers\Admin\JenisSuratController;
use App\Http\Controllers\Admin\PendudukController;
use App\Http\Controllers\Admin\PengajuanSuratController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Admin\WilayahController;
use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\PetaController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('penduduk')->name('penduduk.')->group(function () {
        Route::get('/', [PendudukController::class, 'index'])->name('index');
        Route::get('/create', [PendudukController::class, 'create'])->name('create');
        Route::post('/', [PendudukController::class, 'store'])->name('store');
        Route::get('/{id}', [PendudukController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [PendudukController::class, 'edit'])->name('edit');
        Route::put('/{id}', [PendudukController::class, 'update'])->name('update');
        Route::delete('/{id}', [PendudukController::class, 'destroy'])->name('destroy');
        Route::get('/export/excel', [PendudukController::class, 'exportExcel'])->name('export.excel');
        Route::get('/export/pdf', [PendudukController::class, 'exportPdf'])->name('export.pdf');
    });

    Route::prefix('kartu-keluarga')->name('kartu-keluarga.')->group(function () {
        Route::get('/', [KartuKeluargaController::class, 'index'])->name('index');
        Route::get('/create', [KartuKeluargaController::class, 'create'])->name('create');
        Route::post('/', [KartuKeluargaController::class, 'store'])->name('store');
        Route::get('/{id}', [KartuKeluargaController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [KartuKeluargaController::class, 'edit'])->name('edit');
        Route::put('/{id}', [KartuKeluargaController::class, 'update'])->name('update');
        Route::delete('/{id}', [KartuKeluargaController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('pengajuan-surat')->name('pengajuan-surat.')->group(function () {
        Route::get('/', [PengajuanSuratController::class, 'index'])->name('index');
        Route::get('/create', [PengajuanSuratController::class, 'create'])->name('create');
        Route::post('/', [PengajuanSuratController::class, 'store'])->name('store');
        Route::get('/{id}', [PengajuanSuratController::class, 'show'])->name('show');
        Route::get('/{id}/verifikasi', [PengajuanSuratController::class, 'verifikasi'])->name('verifikasi');
        Route::put('/{id}/verifikasi', [PengajuanSuratController::class, 'updateVerifikasi'])->name('verifikasi.update');
        Route::get('/{id}/cetak', [PengajuanSuratController::class, 'cetak'])->name('cetak');
        Route::delete('/{id}', [PengajuanSuratController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('jenis-bantuan')->name('jenis-bantuan.')->group(function () {
        Route::get('/', [JenisBantuanController::class, 'index'])->name('index');
        Route::get('/create', [JenisBantuanController::class, 'create'])->name('create');
        Route::post('/', [JenisBantuanController::class, 'store'])->name('store');
        Route::get('/{id}', [JenisBantuanController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [JenisBantuanController::class, 'edit'])->name('edit');
        Route::put('/{id}', [JenisBantuanController::class, 'update'])->name('update');
        Route::delete('/{id}', [JenisBantuanController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('bantuan')->name('bantuan.')->group(function () {
        Route::get('/', [BantuanController::class, 'index'])->name('index');
        Route::get('/create', [BantuanController::class, 'create'])->name('create');
        Route::post('/', [BantuanController::class, 'store'])->name('store');
        Route::get('/get-programs-by-type', [BantuanController::class, 'getProgramsByType'])->name('get-programs');
        Route::get('/{id}', [BantuanController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [BantuanController::class, 'edit'])->name('edit');
        Route::put('/{id}', [BantuanController::class, 'update'])->name('update');
        Route::delete('/{id}', [BantuanController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('pengaturan')->name('pengaturan.')->group(function () {
        Route::get('/', [PengaturanController::class, 'index'])->name('index');
        Route::get('/profil', [PengaturanController::class, 'profil'])->name('profil');
        Route::match(['put', 'post'], '/profil', [PengaturanController::class, 'updateProfil'])->name('profil.update');
        Route::get('/akun', [PengaturanController::class, 'akun'])->name('akun');
        Route::match(['put', 'post'], '/akun', [PengaturanController::class, 'updateAkun'])->name('akun.update');
        Route::get('/password', [PengaturanController::class, 'password'])->name('password');
        Route::match(['put', 'post'], '/password', [PengaturanController::class, 'updatePassword'])->name('password.update');
    });

    Route::prefix('jenis-surat')->name('jenis-surat.')->group(function () {
        Route::get('/', [JenisSuratController::class, 'index'])->name('index');
        Route::get('/create', [JenisSuratController::class, 'create'])->name('create');
        Route::post('/', [JenisSuratController::class, 'store'])->name('store');
        Route::get('/{id}', [JenisSuratController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [JenisSuratController::class, 'edit'])->name('edit');
        Route::put('/{id}', [JenisSuratController::class, 'update'])->name('update');
        Route::delete('/{id}', [JenisSuratController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('wilayah')->name('wilayah.')->group(function () {
        Route::get('/', [WilayahController::class, 'index'])->name('index');
        Route::post('/', [WilayahController::class, 'store'])->name('store');
        Route::get('/{id}', [WilayahController::class, 'show'])->name('show');
        Route::put('/{id}', [WilayahController::class, 'update'])->name('update');
        Route::delete('/{id}', [WilayahController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('berita')->name('berita.')->group(function () {
        Route::get('/', [BeritaController::class, 'index'])->name('index');
        Route::post('/', [BeritaController::class, 'store'])->name('store');
        Route::get('/{id}', [BeritaController::class, 'show'])->name('show');
        Route::put('/{id}', [BeritaController::class, 'update'])->name('update');
        Route::delete('/{id}', [BeritaController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('peta')->name('peta.')->group(function () {
        Route::get('/', [PetaController::class, 'index'])->name('index');
        Route::get('/data', [PetaController::class, 'data'])->name('data');
    });
});