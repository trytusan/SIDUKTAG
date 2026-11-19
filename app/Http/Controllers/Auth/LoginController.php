<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Penduduk;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;

class LoginController extends Controller
{
    public function showLoginForm(): View
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string'],
            'password' => ['nullable', 'string'],
        ], [
            'email.required' => 'NIK atau Email wajib diisi.',
        ]);

        $identity = trim(strtolower($request->input('email')));
        $password = (string) $request->input('password', '');
        $remember = $request->boolean('remember');

        // 1. Cari user berdasarkan Email atau NIK (melalui relasi penduduk)
        $user = User::where('email', $identity)
            ->orWhereHas('penduduk', function ($q) use ($identity) {
                $q->where('nik', $identity);
            })
            ->first();

        // 2. Jika user belum ada di tabel users, cek apakah NIK sudah ada di tabel penduduk
        if (!$user) {
            $pendudukTanpaUser = Penduduk::where('nik', $identity)->first();
            if ($pendudukTanpaUser) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'status' => 'NEEDS_PASSWORD_SETUP',
                        'message' => 'Data Anda telah terdaftar di sistem Lingkungan Saba namun belum memiliki password. Silakan verifikasi identitas dan buat password Anda.',
                        'nik' => $pendudukTanpaUser->nik,
                        'nama' => $pendudukTanpaUser->nama_lengkap,
                        'redirect' => '/aktivasi-akun?nik=' . urlencode($pendudukTanpaUser->nik),
                    ], 200);
                }

                return redirect('/aktivasi-akun?nik=' . urlencode($pendudukTanpaUser->nik))
                    ->with('status', 'Silakan verifikasi identitas untuk membuat password akun Anda.');
            }
        }

        // 3. Jika user terdaftar oleh admin dan belum memiliki password
        if ($user && $user->must_set_password) {
            $penduduk = $user->penduduk;
            $nikWarga = $penduduk?->nik ?? $identity;

            if ($request->expectsJson()) {
                return response()->json([
                    'status' => 'NEEDS_PASSWORD_SETUP',
                    'message' => 'Akun Anda telah didaftarkan oleh Operator Lingkungan Saba namun belum memiliki password. Silakan verifikasi identitas dan buat password baru Anda.',
                    'nik' => $nikWarga,
                    'nama' => $user->name,
                    'redirect' => '/aktivasi-akun?nik=' . urlencode($nikWarga),
                ], 200);
            }

            return redirect('/aktivasi-akun?nik=' . urlencode($nikWarga))
                ->with('status', 'Silakan verifikasi data dan buat kata sandi baru akun Anda.');
        }

        // 4. Proses Otentikasi Normal (Menggunakan email akun)
        if (empty($password)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Password wajib diisi.',
                    'errors' => ['password' => ['Password wajib diisi.']],
                ], 422);
            }
            return back()->withErrors(['password' => 'Password wajib diisi.'])->withInput($request->only('email'));
        }

        $loginEmail = $user ? $user->email : $identity;
        if (!Auth::attempt(['email' => $loginEmail, 'password' => $password], $remember)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'NIK / Email atau password salah.',
                    'errors' => ['email' => ['NIK / Email atau password salah.']],
                ], 422);
            }

            return back()
                ->withErrors([
                    'email' => 'NIK / Email atau password salah.',
                ])
                ->withInput($request->only('email'));
        }

        $request->session()->regenerate();

        $loggedInUser = Auth::user();

        if (!$loggedInUser->is_active) {
            Auth::logout();

            if ($request->expectsJson()) {
                return response()->json(['message' => 'Akun Anda tidak aktif.'], 403);
            }

            return redirect()
                ->route('login')
                ->with('error', 'Akun Anda tidak aktif.');
        }

        $redirectPath = '/admin/dashboard';
        if ($loggedInUser->role === 'user') {
            $isCompleted = $loggedInUser->penduduk && $loggedInUser->penduduk->is_profile_completed;
            $redirectPath = $isCompleted ? '/user/dashboard' : '/user/onboarding/step-1';
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Login berhasil.',
                'user' => $loggedInUser,
                'role' => $loggedInUser->role,
                'is_profile_completed' => $loggedInUser->role === 'admin' ? true : (bool) ($loggedInUser->penduduk?->is_profile_completed ?? false),
                'redirect' => $redirectPath,
            ]);
        }

        if ($loggedInUser->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        if ($loggedInUser->role === 'user') {
            if (!$loggedInUser->penduduk || !$loggedInUser->penduduk->is_profile_completed) {
                return redirect()->route('user.onboarding.step-1');
            }

            return redirect()->route('user.dashboard');
        }

        Auth::logout();

        return redirect()
            ->route('login')
            ->with('error', 'Role akun tidak dikenali.');
    }

    /**
     * Aktivasi akun warga yang dibuatkan oleh Admin (Set Password Pertama Kali)
     */
    public function aktivasiAkun(Request $request)
    {
        $validated = $request->validate([
            'nik' => ['required', 'digits:16'],
            'tanggal_lahir' => ['required', 'date'],
            'nomor_kk' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'nik.required' => 'NIK wajib diisi.',
            'nik.digits' => 'NIK harus berjumlah 16 digit.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi untuk verifikasi identitas.',
            'nomor_kk.required' => 'Nomor KK wajib diisi untuk konfirmasi keamanan.',
            'password.required' => 'Password baru wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $penduduk = Penduduk::where('nik', $validated['nik'])->first();
        if (!$penduduk) {
            return response()->json([
                'message' => 'Data NIK tidak ditemukan dalam sistem kependudukan Lingkungan Saba.',
                'errors' => ['nik' => ['NIK tidak terdaftar di sistem. Hubungi administrator bila belum didaftarkan.']]
            ], 404);
        }

        // Verifikasi kesesuaian tanggal lahir
        $tglInput = Carbon::parse($validated['tanggal_lahir'])->format('Y-m-d');
        $tglDb = $penduduk->tanggal_lahir ? Carbon::parse($penduduk->tanggal_lahir)->format('Y-m-d') : null;
        if ($tglDb && $tglInput !== $tglDb) {
            return response()->json([
                'message' => 'Tanggal lahir tidak sesuai dengan data identitas terdaftar.',
                'errors' => ['tanggal_lahir' => ['Tanggal lahir tidak cocok dengan data NIK Anda.']]
            ], 422);
        }

        // Verifikasi kesesuaian Nomor KK (bisa 4 digit terakhir atau nomor KK lengkap)
        $kkInput = trim($validated['nomor_kk']);
        $kkDb = trim($penduduk->nomor_kk ?? '');
        $isKkValid = ($kkInput === $kkDb) || (strlen($kkInput) === 4 && str_ends_with($kkDb, $kkInput));
        if ($kkDb && !$isKkValid) {
            return response()->json([
                'message' => 'Nomor Kartu Keluarga tidak sesuai dengan data terdaftar.',
                'errors' => ['nomor_kk' => ['Nomor KK tidak cocok dengan data keluarga Anda.']]
            ], 422);
        }

        // Ambil atau buatkan user jika belum ada
        $user = $penduduk->user;
        if (!$user) {
            $userEmail = $penduduk->nik . '@sidulisa.id';
            $user = User::where('email', $userEmail)->first();
            if (!$user) {
                $user = User::create([
                    'name' => $penduduk->nama_lengkap,
                    'email' => $userEmail,
                    'password' => Hash::make($validated['password']),
                    'telepon' => $penduduk->nomor_telepon,
                    'role' => 'user',
                    'is_active' => true,
                    'must_set_password' => false,
                ]);
            } else {
                $user->update([
                    'password' => Hash::make($validated['password']),
                    'must_set_password' => false,
                    'is_active' => true,
                ]);
            }
            $penduduk->update(['user_id' => $user->id, 'is_profile_completed' => true]);
        } else {
            $user->update([
                'password' => Hash::make($validated['password']),
                'must_set_password' => false,
                'is_active' => true,
            ]);
            $penduduk->update(['is_profile_completed' => true]);
        }

        Auth::login($user, true);
        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return response()->json([
            'message' => 'Akun berhasil diaktifkan! Selamat datang di SIDULISA.',
            'user' => $user,
            'role' => $user->role,
            'is_profile_completed' => true,
            'redirect' => '/user/dashboard',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Logout berhasil.']);
        }

        return redirect()->route('login');
    }
}