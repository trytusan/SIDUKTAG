<?php

use App\Http\Controllers\User\BantuanController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\KartuKeluargaController;
use App\Http\Controllers\User\PendudukController;
use App\Http\Controllers\User\PengajuanSuratController;
use App\Http\Controllers\User\PengaturanController;
use Illuminate\Support\Facades\Route;

Route::prefix('user')->name('user.')->middleware(['auth', 'user'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Onboarding
    |--------------------------------------------------------------------------
    */
    Route::prefix('onboarding')->name('onboarding.')->group(function () {
        Route::get('/', fn() => redirect()->route('user.onboarding.step-1'))->name('index');

        Route::get('/step-1', [PendudukController::class, 'step1'])->name('step-1');
        Route::post('/step-1', [PendudukController::class, 'storeStep1'])->name('step-1.store');

        Route::get('/step-2', [PendudukController::class, 'step2'])->name('step-2');
        Route::post('/step-2', [PendudukController::class, 'storeStep2'])->name('step-2.store');

        Route::get('/step-3', [PendudukController::class, 'step3'])->name('step-3');
        Route::post('/step-3', [PendudukController::class, 'storeStep3'])->name('step-3.store');
    });

    /*
    |--------------------------------------------------------------------------
    | Protected User Pages
    |--------------------------------------------------------------------------
    */
    Route::middleware(['profile.completed'])->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::prefix('pengaturan')->name('pengaturan.')->group(function () {
            Route::get('/', [PengaturanController::class, 'index'])->name('index');

            Route::get('/profil', [PendudukController::class, 'show'])->name('profil');
            Route::put('/profil', [PendudukController::class, 'update'])->name('profil.update');

            Route::get('/akun', [PengaturanController::class, 'akun'])->name('akun');
            Route::put('/akun', [PengaturanController::class, 'updateAkun'])->name('akun.update');

            Route::get('/password', [PengaturanController::class, 'password'])->name('password');
        });

        Route::prefix('kartu-keluarga')->name('kartu-keluarga.')->group(function () {
            Route::get('/', [KartuKeluargaController::class, 'index'])->name('index');
            Route::get('/{id}', [KartuKeluargaController::class, 'show'])->name('show');
        });

        Route::prefix('pengajuan-surat')->name('pengajuan-surat.')->group(function () {
            Route::get('/', [PengajuanSuratController::class, 'index'])->name('index');
            Route::get('/create', [PengajuanSuratController::class, 'create'])->name('create');
            Route::post('/', [PengajuanSuratController::class, 'store'])->name('store');
            Route::get('/{id}', [PengajuanSuratController::class, 'show'])->name('show');
            Route::get('/{id}/download', [PengajuanSuratController::class, 'download'])->name('download');
        });

        Route::prefix('bantuan')->name('bantuan.')->group(function () {
            Route::get('/', [BantuanController::class, 'index'])->name('index');
            Route::get('/create', [BantuanController::class, 'create'])->name('create');
            Route::post('/', [BantuanController::class, 'store'])->name('store');
            Route::get('/{id}', [BantuanController::class, 'show'])->name('show');
        });
    });
});