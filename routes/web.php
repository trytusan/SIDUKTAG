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
});

// Autentikasi Kode OTP via Gmail SMTP (Dapat diakses Tamu maupun Pengguna yang sedang login)
Route::post('/api/otp/send', [OtpController::class, 'sendOtp'])->name('otp.send');
Route::post('/api/otp/verify', [OtpController::class, 'verifyOtp'])->name('otp.verify');
Route::post('/api/otp/reset-password', [OtpController::class, 'resetPassword'])->name('otp.reset');

// Storage Fallback Route untuk Shared Hosting (Menangani akses file foto/dokumen jika symlink storage belum terpasang)
Route::get('/storage/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);
    if (!file_exists($filePath)) {
        abort(404);
    }
    return response()->file($filePath);
})->where('path', '.*');

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
        $user = $request->user();

        // Hubungkan data penduduk secara otomatis jika relasi belum terhubung
        if (!$user->penduduk) {
            $matchingPenduduk = \App\Models\Penduduk::where('user_id', $user->id)
                ->orWhere(function ($q) use ($user) {
                    $q->whereNull('user_id')->where('nama_lengkap', $user->name);
                })
                ->first();

            if ($matchingPenduduk && !$matchingPenduduk->user_id) {
                $matchingPenduduk->update(['user_id' => $user->id]);
            }
        }

        $user->load(['penduduk.kartuKeluarga']);

        return response()->json([
            'user' => $user,
            'role' => $user->role,
            'is_profile_completed' => $user->role === 'admin' ? true : (bool) ($user->penduduk?->is_profile_completed ?? false),
        ]);
    })->name('api.user');

    Route::get('/api/kartu-keluarga/options', function (\Illuminate\Http\Request $request) {
        $search = $request->query('q');
        $query = \App\Models\KartuKeluarga::query()
            ->select('nomor_kk', 'nama_kepala_keluarga', 'alamat_keluarga', 'rt', 'rw', 'jumlah_anggota')
            ->orderBy('nama_kepala_keluarga', 'asc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nomor_kk', 'like', "%{$search}%")
                  ->orWhere('nama_kepala_keluarga', 'like', "%{$search}%")
                  ->orWhere('alamat_keluarga', 'like', "%{$search}%");
            });
        }

        $options = $query->limit(200)->get();

        return response()->json([
            'kartu_keluarga' => $options,
            'options' => $options,
        ]);
    })->name('api.kartu-keluarga.options');

    Route::get('/change-password', [PasswordController::class, 'showChangePasswordForm'])->name('password.change');
    Route::post('/change-password', [PasswordController::class, 'changePassword'])->name('password.change.update');

    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});

require_once __DIR__ . '/admin.php';
require_once __DIR__ . '/user.php';
