<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\OtpController;
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

    // Autentikasi Kode OTP via Gmail SMTP
    Route::post('/api/otp/send', [OtpController::class, 'sendOtp'])->name('otp.send');
    Route::post('/api/otp/verify', [OtpController::class, 'verifyOtp'])->name('otp.verify');
    Route::post('/api/otp/reset-password', [OtpController::class, 'resetPassword'])->name('otp.reset');
});

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set', 'csrf_token' => csrf_token()]);
});

Route::get('/api/berita', function (\Illuminate\Http\Request $request) {
    $query = \App\Models\Berita::published()->latest('tanggal_publikasi')->latest('id');

    if ($request->filled('kategori') && $request->kategori !== 'Semua') {
        $query->where('kategori', $request->kategori);
    }

    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('judul', 'like', "%{$search}%")
              ->orWhere('ringkasan', 'like', "%{$search}%")
              ->orWhere('konten', 'like', "%{$search}%");
        });
    }

    $limit = $request->has('limit') ? (int) $request->limit : 12;
    $berita = $query->take($limit)->get();

    return response()->json([
        'berita' => $berita,
    ]);
});

Route::get('/api/berita/{idOrSlug}', function ($idOrSlug) {
    $berita = \App\Models\Berita::published()
        ->where(function ($q) use ($idOrSlug) {
            $q->where('slug', $idOrSlug)->orWhere('id', $idOrSlug);
        })
        ->firstOrFail();

    $berita->increment('views');

    $related = \App\Models\Berita::published()
        ->where('id', '!=', $berita->id)
        ->latest('tanggal_publikasi')
        ->take(3)
        ->get();

    return response()->json([
        'berita' => $berita,
        'related' => $related,
    ]);
});

Route::get('/api/peta', [\App\Http\Controllers\User\PetaController::class, 'index']);

Route::middleware('auth')->group(function () {
    Route::get('/api/user', function (\Illuminate\Http\Request $request) {
        $user = $request->user()->load(['penduduk.kartuKeluarga']);
        return response()->json([
            'user' => $user,
            'role' => $user->role,
            'is_profile_completed' => $user->role === 'admin' ? true : (bool) ($user->penduduk?->is_profile_completed ?? false),
        ]);
    })->name('api.user');

    Route::get('/change-password', [PasswordController::class, 'showChangePasswordForm'])->name('password.change');
    Route::post('/change-password', [PasswordController::class, 'changePassword'])->name('password.change.update');

    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});

require_once __DIR__ . '/admin.php';
require_once __DIR__ . '/user.php';
