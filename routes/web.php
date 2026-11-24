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

    // Aktivasi Akun Warga Baru (Set Password Awal yang Dibuat Admin)
    Route::post('/api/auth/aktivasi-akun', [LoginController::class, 'aktivasiAkun'])->name('auth.aktivasi-akun');
});

// Autentikasi Kode OTP via Gmail SMTP (Dapat diakses Tamu maupun Pengguna yang sedang login)
Route::post('/api/otp/send', [OtpController::class, 'sendOtp'])->name('otp.send');
Route::post('/api/otp/verify', [OtpController::class, 'verifyOtp'])->name('otp.verify');
Route::post('/api/otp/reset-password', [OtpController::class, 'resetPassword'])->name('otp.reset');

// Storage Fallback Route untuk Shared Hosting (Menangani akses file foto/dokumen jika symlink storage belum terpasang)
$serveStorageFile = function ($path) {
    $path = preg_replace('#^storage/#', '', ltrim($path, '/'));
    $filename = basename($path);
    $candidates = [
        storage_path('app/public/' . $path),
        public_path('storage/' . $path),
        base_path('storage/' . $path),
        base_path('public_html/storage/' . $path),
        base_path('../public_html/storage/' . $path),
        storage_path('app/' . $path),
        storage_path('app/private/' . $path),
        isset($_SERVER['DOCUMENT_ROOT']) ? ($_SERVER['DOCUMENT_ROOT'] . '/storage/' . $path) : null,
        isset($_SERVER['DOCUMENT_ROOT']) ? ($_SERVER['DOCUMENT_ROOT'] . '/' . $path) : null,

        // Folder spesifik berdasarkan nama file
        storage_path('app/public/bantuan/' . $filename),
        storage_path('app/public/dokumen-surat/' . $filename),
        storage_path('app/public/hasil-surat/' . $filename),
        storage_path('app/public/surat/' . $filename),
        storage_path('app/public/dokumen-penduduk/' . $filename),
        storage_path('app/public/foto-profil/' . $filename),
        storage_path('app/public/akta-kematian/' . $filename),
        storage_path('app/public/formulir/' . $filename),
        storage_path('app/public/lapor-diri/' . $filename),

        public_path('storage/bantuan/' . $filename),
        public_path('storage/dokumen-surat/' . $filename),
        public_path('storage/hasil-surat/' . $filename),
        public_path('storage/surat/' . $filename),
        public_path('storage/dokumen-penduduk/' . $filename),
        public_path('storage/foto-profil/' . $filename),
        public_path('storage/akta-kematian/' . $filename),

        base_path('storage/bantuan/' . $filename),
        base_path('storage/dokumen-surat/' . $filename),
        base_path('storage/hasil-surat/' . $filename),
        base_path('storage/surat/' . $filename),
        base_path('storage/dokumen-penduduk/' . $filename),

        base_path('public_html/storage/bantuan/' . $filename),
        base_path('public_html/storage/dokumen-surat/' . $filename),
        base_path('public_html/storage/hasil-surat/' . $filename),
        base_path('public_html/storage/surat/' . $filename),
        base_path('public_html/storage/dokumen-penduduk/' . $filename),

        storage_path('app/bantuan/' . $filename),
        storage_path('app/dokumen-surat/' . $filename),
        storage_path('app/hasil-surat/' . $filename),
        storage_path('app/surat/' . $filename),
        storage_path('app/dokumen-penduduk/' . $filename),
        storage_path('app/foto-profil/' . $filename),

        isset($_SERVER['DOCUMENT_ROOT']) ? ($_SERVER['DOCUMENT_ROOT'] . '/storage/bantuan/' . $filename) : null,
        isset($_SERVER['DOCUMENT_ROOT']) ? ($_SERVER['DOCUMENT_ROOT'] . '/storage/dokumen-surat/' . $filename) : null,
        isset($_SERVER['DOCUMENT_ROOT']) ? ($_SERVER['DOCUMENT_ROOT'] . '/storage/hasil-surat/' . $filename) : null,
        isset($_SERVER['DOCUMENT_ROOT']) ? ($_SERVER['DOCUMENT_ROOT'] . '/storage/surat/' . $filename) : null,
        isset($_SERVER['DOCUMENT_ROOT']) ? ($_SERVER['DOCUMENT_ROOT'] . '/storage/dokumen-penduduk/' . $filename) : null,
    ];

    $resolveMimeAndRespond = function ($filePath) {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mimeMap = [
            'pdf' => 'application/pdf',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'doc' => 'application/msword',
        ];
        $mime = $mimeMap[$ext] ?? (@mime_content_type($filePath) ?: 'application/octet-stream');
        $disposition = in_array($ext, ['pdf', 'jpg', 'jpeg', 'png', 'webp']) ? 'inline' : 'attachment';

        return response()->file($filePath, [
            'Content-Type' => $mime,
            'Content-Disposition' => $disposition . '; filename="' . basename($filePath) . '"',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
            'Access-Control-Allow-Headers' => '*',
        ]);
    };

    foreach ($candidates as $filePath) {
        if ($filePath && file_exists($filePath) && is_file($filePath)) {
            return $resolveMimeAndRespond($filePath);
        }
    }

    // Pencarian rekursif jika belum ditemukan
    $searchRoots = [
        storage_path('app/public'),
        storage_path('app'),
        public_path('storage'),
        base_path('storage'),
    ];

    foreach ($searchRoots as $searchDir) {
        if ($searchDir && file_exists($searchDir) && is_dir($searchDir)) {
            try {
                $iterator = new RecursiveIteratorIterator(
                    new RecursiveDirectoryIterator($searchDir, RecursiveDirectoryIterator::SKIP_DOTS),
                    RecursiveIteratorIterator::SELF_FIRST
                );
                foreach ($iterator as $file) {
                    if ($file->isFile() && $file->getFilename() === $filename) {
                        return $resolveMimeAndRespond($file->getPathname());
                    }
                }
            } catch (\Throwable $e) {}
        }
    }

    abort(404, 'Berkas dokumen tidak ditemukan di server.');
};

Route::get('/storage/{path}', $serveStorageFile)->where('path', '.*');
Route::get('/api/storage-file/{path}', $serveStorageFile)->where('path', '.*');

// Auto-sync storage: otomatis menyalin semua berkas dari storage/app/public ke folder publik
$syncStorageHandler = function () {
    $srcRoot = storage_path('app/public');
    $destTargets = [
        public_path('storage'),
        base_path('storage'),
        base_path('public_html/storage'),
        isset($_SERVER['DOCUMENT_ROOT']) ? ($_SERVER['DOCUMENT_ROOT'] . '/storage') : null,
    ];

    $syncDir = function ($src, $dest) use (&$syncDir) {
        if (!file_exists($dest)) {
            @mkdir($dest, 0775, true);
        }
        $items = @scandir($src) ?: [];
        $count = 0;
        foreach ($items as $item) {
            if ($item === '.' || $item === '..' || $item === '.gitignore') continue;
            $srcPath = $src . DIRECTORY_SEPARATOR . $item;
            $destPath = $dest . DIRECTORY_SEPARATOR . $item;
            if (is_dir($srcPath)) {
                if ($item !== 'app' && $item !== 'framework' && $item !== 'logs') {
                    $count += $syncDir($srcPath, $destPath);
                }
            } elseif (is_file($srcPath)) {
                @copy($srcPath, $destPath);
                $count++;
            }
        }
        return $count;
    };

    $totalCopied = 0;
    $syncedTo = [];
    foreach ($destTargets as $destRoot) {
        if ($destRoot && $destRoot !== $srcRoot) {
            $copied = $syncDir($srcRoot, $destRoot);
            $totalCopied += $copied;
            $syncedTo[] = $destRoot;
        }
    }

    return response()->json([
        'status' => 'success',
        'message' => "Berhasil menyinkronkan {$totalCopied} berkas ke folder storage publik.",
        'source' => $srcRoot,
        'destinations' => array_values(array_unique(array_filter($syncedTo))),
    ]);
};
Route::get('/sync-storage', $syncStorageHandler);
Route::get('/sync_storage', $syncStorageHandler);

// Helper pengecekan dan perbaikan direktori storage di hosting
$debugStorageHandler = function () {
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
        'public_path' => public_path(),
        'base_path' => base_path(),
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? null,
        'public_storage_exists' => file_exists($publicStorageSymlink),
        'public_storage_is_link' => is_link($publicStorageSymlink),
        'public_storage_is_dir' => is_dir($publicStorageSymlink),
    ]);
};
Route::get('/debug-storage', $debugStorageHandler);
Route::get('/debug_storage', $debugStorageHandler);

// Helper Artisan storage:link untuk shared hosting cPanel / Hostinger tanpa akses SSH terminal
$storageLinkHandler = function () {
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
};
Route::get('/artisan/storage-link', $storageLinkHandler);
Route::get('/artisan/storage_link', $storageLinkHandler);

// Helper Artisan migrate untuk shared hosting cPanel / Hostinger / browser
Route::get('/artisan/migrate', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        $output = \Illuminate\Support\Facades\Artisan::output();
        return response()->json([
            'status' => 'success',
            'message' => $output ?: 'Migrasi database berhasil dijalankan.',
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
