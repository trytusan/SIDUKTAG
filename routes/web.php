<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/', [LoginController::class, 'showLoginForm'])->name('home');

    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login'])->name('login.store');

    Route::get('/register', [RegisterController::class, 'showRegisterForm'])->name('register');
    Route::post('/register', [RegisterController::class, 'register'])->name('register.store');

    Route::get('/forgot-password', [PasswordController::class, 'showForgotForm'])->name('password.request');
    Route::post('/forgot-password', [PasswordController::class, 'sendResetLink'])->name('password.email');

    Route::get('/reset-password/{token}', [PasswordController::class, 'showResetForm'])->name('password.reset');
    Route::post('/reset-password', [PasswordController::class, 'reset'])->name('password.update');
});

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set', 'csrf_token' => csrf_token()]);
});

Route::middleware('auth')->group(function () {
    Route::get('/api/user', function (\Illuminate\Http\Request $request) {
        $user = $request->user()->load(['penduduk.kartuKeluarga']);
        return response()->json([
            'user' => $user,
            'role' => $user->role,
            'is_profile_completed' => (bool) ($user->penduduk?->is_profile_completed ?? false),
        ]);
    })->name('api.user');

    Route::get('/change-password', [PasswordController::class, 'showChangePasswordForm'])->name('password.change');
    Route::post('/change-password', [PasswordController::class, 'changePassword'])->name('password.change.update');

    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});

require_once __DIR__ . '/admin.php';
require_once __DIR__ . '/user.php';
