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
    $candidates = [
        storage_path('app/public/' . $path),
        storage_path('app/' . $path),
        storage_path('app/private/' . $path),
        public_path('storage/' . $path),
        base_path('storage/app/public/' . $path),
        base_path('../storage/app/public/' . $path),
    ];

    foreach ($candidates as $filePath) {
        if (file_exists($filePath) && is_file($filePath)) {
            $mime = @mime_content_type($filePath) ?: 'application/octet-stream';
            return response()->file($filePath, [
                'Content-Type' => $mime,
                'Access-Control-Allow-Origin' => '*',
            ]);
        }
    }

    // Pencarian cadangan berdasarkan nama file (basename)
    $filename = basename($path);
    $searchDirs = [
        storage_path('app/public/dokumen-penduduk'),
        storage_path('app/public/foto-profil'),
        storage_path('app/public/akta-kematian'),
        storage_path('app/public'),
        storage_path('app/dokumen-penduduk'),
        storage_path('app/private/dokumen-penduduk'),
    ];

    foreach ($searchDirs as $dir) {
        $candidate = $dir . DIRECTORY_SEPARATOR . $filename;
        if (file_exists($candidate) && is_file($candidate)) {
            $mime = @mime_content_type($candidate) ?: 'application/octet-stream';
            return response()->file($candidate, [
                'Content-Type' => $mime,
                'Access-Control-Allow-Origin' => '*',
            ]);
        }
    }

    abort(404, 'Berkas dokumen tidak ditemukan di server.');
})->where('path', '.*');

// Helper pengecekan dan perbaikan direktori storage di hosting
Route::get('/debug-storage', function () {
    $storagePublic = storage_path('app/public');
    $dokumenDir = storage_path('app/public/dokumen-penduduk');
    $fotoDir = storage_path('app/public/foto-profil');
    $publicStorageSymlink = public_path('storage');

    // Buat folder publik yang dibutuhkan jika belum ada
    if (!file_exists($dokumenDir)) {
        @mkdir($dokumenDir, 0775, true);
    }
    if (!file_exists($fotoDir)) {
        @mkdir($fotoDir, 0775, true);
    }

    $filesInDokumen = file_exists($dokumenDir) ? scandir($dokumenDir) : [];
    $storageDirs = file_exists($storagePublic) ? scandir($storagePublic) : [];

    return response()->json([
        'storage_path_public' => $storagePublic,
        'storage_path_public_exists' => file_exists($storagePublic),
        'storage_path_public_writable' => is_writable($storagePublic),
        'dokumen_dir' => $dokumenDir,
        'dokumen_dir_exists' => file_exists($dokumenDir),
        'dokumen_dir_writable' => is_writable($dokumenDir),
        'files_in_dokumen_penduduk' => array_values(array_diff($filesInDokumen, ['.', '..'])),
        'folders_in_storage_public' => array_values(array_diff($storageDirs, ['.', '..'])),
        'public_storage_exists' => file_exists($publicStorageSymlink),
        'public_storage_is_link' => is_link($publicStorageSymlink),
        'public_storage_is_dir' => is_dir($publicStorageSymlink),
    ]);
});

// Helper Artisan storage:link untuk shared hosting cPanel / Hostinger tanpa akses SSH terminal
Route::get('/artisan/storage-link', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('storage:link');
        $output = \Illuminate\Support\Facades\Artisan::output();
        return response()->json([
            'status' => 'success',
            'message' => $output ?: 'Symlink storage berhasil dibuat / terhubung.',
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
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

Route::get('/api/kartu-keluarga/options', function (\Illuminate\Http\Request $request) {
    $search = $request->query('q');
    $query = \App\Models\KartuKeluarga::query()
        ->select('id', 'nomor_kk', 'nama_kepala_keluarga', 'alamat_keluarga', 'jumlah_anggota')
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

    Route::get('/change-password', [PasswordController::class, 'showChangePasswordForm'])->name('password.change');
    Route::post('/change-password', [PasswordController::class, 'changePassword'])->name('password.change.update');

    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});

require_once __DIR__ . '/admin.php';
require_once __DIR__ . '/user.php';
