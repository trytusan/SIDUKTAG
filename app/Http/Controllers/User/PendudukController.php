<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use App\Models\Penduduk;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Illuminate\Support\Facades\Storage;

class PendudukController extends Controller
{
    private function hitungKategoriUmur($tanggal_lahir): ?string
    {
        if (!$tanggal_lahir) return null;

        $umur = Carbon::parse($tanggal_lahir)->age;

        if ($umur <= 12) return 'Anak-anak';
        if ($umur <= 25) return 'Remaja';
        if ($umur <= 45) return 'Dewasa';
        return 'Lansia';
    }

    public function step1(Request $request)
    {
        $data = session('onboarding.step1', []);
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['data' => $data]);
        }
        return view('user.onboarding.step-1', compact('data'));
    }

    public function storeStep1(Request $request)
    {
        $rules = [
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'digits:16'],
            'status_dalam_keluarga' => ['required', 'string', 'max:50'],
            'nomor_kk' => ['required', 'digits:16'],
            'tempat_lahir' => ['nullable', 'string', 'max:100'],
            'tanggal_lahir' => ['nullable', 'date'],
            'jenis_kelamin' => ['required', 'in:Laki-laki,Perempuan'],
            'agama' => ['nullable', 'string', 'max:50'],
            'status_perkawinan' => ['nullable', 'string', 'max:50'],
            'pekerjaan' => ['nullable', 'string', 'max:100'],
            'pendidikan_terakhir' => ['nullable', 'string', 'max:50'],
        ];

        // Jika bukan Kepala Keluarga, No KK harus sudah ada di tabel kartu_keluarga
        if ($request->status_dalam_keluarga !== 'Kepala Keluarga') {
            $rules['nomor_kk'][] = 'exists:kartu_keluarga,nomor_kk';
        }

        $messages = [
            'nomor_kk.exists' => 'Nomor Kartu Keluarga (KK) belum terdaftar di sistem desa. Untuk status anggota keluarga, Nomor KK harus sudah didaftarkan terlebih dahulu oleh Kepala Keluarga.',
            'status_dalam_keluarga.required' => 'Status hubungan dalam keluarga wajib dipilih.',
        ];

        $validated = $request->validate($rules, $messages);

        session(['onboarding.step1' => $validated]);
        if ($request->hasSession()) {
            $request->session()->save();
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Langkah 1 berhasil disimpan.']);
        }

        return redirect()->route('user.onboarding.step-2');
    }

    public function step2(Request $request)
    {
        $data = session('onboarding.step2', []);
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['data' => $data]);
        }
        return view('user.onboarding.step-2', compact('data'));
    }

    public function storeStep2(Request $request)
    {
        $validated = $request->validate([
            'alamat' => ['required', 'string'],
            'nomor_telepon' => ['nullable', 'string', 'max:20'],
            'status_dalam_keluarga' => ['nullable', 'string', 'max:50'],
            'status_kependudukan' => ['nullable', 'in:Tetap,Pendatang,Pendatang Sementara,Pindah,Meninggal'],
            'tanggal_masuk' => ['nullable', 'date', 'required_if:status_kependudukan,Pendatang Sementara'],
            'masa_berlaku' => ['nullable', 'date', 'required_if:status_kependudukan,Pendatang Sementara'],
            'nomor_surat_tanda_lapor' => ['nullable', 'string', 'max:100'],
            'daerah_asal' => ['nullable', 'string', 'max:255', 'required_if:status_kependudukan,Pendatang Sementara,Pendatang'],
            'tujuan_menetap' => ['nullable', 'string', 'max:255', 'required_if:status_kependudukan,Pendatang Sementara,Pendatang'],
        ]);

        if (empty($validated['status_dalam_keluarga'])) {
            $validated['status_dalam_keluarga'] = session('onboarding.step1.status_dalam_keluarga', 'Kepala Keluarga');
        }

        session(['onboarding.step2' => $validated]);
        if ($request->hasSession()) {
            $request->session()->save();
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'Langkah 2 berhasil disimpan.']);
        }

        return redirect()->route('user.onboarding.step-3');
    }

    public function step3(Request $request)
    {
        $data = session('onboarding.step3', []);
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['data' => $data]);
        }
        return view('user.onboarding.step-3', compact('data'));
    }

    public function storeStep3(Request $request)
    {
        $validated = $request->validate([
            'foto_profil' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'dokumen' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        $step1 = session('onboarding.step1', []);
        $step2 = session('onboarding.step2', []);

        // Fallback: Jika session di hosting kosong, ambil dari data JSON step1 & step2 yang dikirim via FormData oleh frontend
        if (empty($step1) && $request->filled('step1')) {
            $raw1 = $request->input('step1');
            $step1 = is_array($raw1) ? $raw1 : (json_decode($raw1, true) ?: []);
        }
        if (empty($step2) && $request->filled('step2')) {
            $raw2 = $request->input('step2');
            $step2 = is_array($raw2) ? $raw2 : (json_decode($raw2, true) ?: []);
        }

        if (empty($step1) || empty($step1['nomor_kk']) || empty($step1['nama_lengkap'])) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Data Langkah 1 belum ditemukan atau sesi pendaftaran berakhir. Silakan kembali ke Langkah 1 dan isi data pokok Anda.',
                    'errors' => ['step1' => ['Data Langkah 1 wajib dilengkapi.']]
                ], 422);
            }
            return redirect()->route('user.onboarding.step-1')->with('error', 'Silakan lengkapi Langkah 1 terlebih dahulu.');
        }

        $user = $request->user();

        DB::transaction(function () use ($request, $validated, $step1, $step2, $user) {
            $data = array_merge($step1, $step2);

            $statusDalamKeluarga = $step1['status_dalam_keluarga'] ?? $step2['status_dalam_keluarga'] ?? 'Kepala Keluarga';
            $data['status_dalam_keluarga'] = $statusDalamKeluarga;
            $data['user_id'] = $user->id;
            $data['alamat_lengkap'] = $step2['alamat'] ?? null;
            $data['kategori_umur'] = $this->hitungKategoriUmur($step1['tanggal_lahir'] ?? null);
            $data['status_kependudukan'] = $step2['status_kependudukan'] ?? 'Tetap';
            $data['latitude'] = $validated['latitude'] ?? null;
            $data['longitude'] = $validated['longitude'] ?? null;
            $data['is_profile_completed'] = true;

            if ($request->hasFile('foto_profil')) {
                $data['foto_profil'] = $request->file('foto_profil')->store('foto-profil', 'public');
            }

            if ($request->hasFile('dokumen')) {
                $data['dokumen_pendukung'] = $request->file('dokumen')->store('dokumen-penduduk', 'public');
            }

            // 1. Logika OTOMATISASI KARTU KELUARGA (Agar pendaftaran tidak error jika KK belum ada)
            $isKepalaKeluarga = ($statusDalamKeluarga === 'Kepala Keluarga');
            
            $kartuKeluarga = KartuKeluarga::firstOrCreate(
                ['nomor_kk' => $step1['nomor_kk']],
                [
                    'nama_kepala_keluarga' => $isKepalaKeluarga ? $step1['nama_lengkap'] : 'Belum Diatur',
                    'alamat_keluarga' => $step2['alamat'] ?? '-',
                    'jumlah_anggota' => 0
                ]
            );

            // 2. Simpan atau Update Penduduk (Cek user_id atau NIK agar tidak melanggar unique constraint)
            $penduduk = Penduduk::where('user_id', $user->id)
                ->orWhere('nik', $data['nik'])
                ->first();

            if ($penduduk) {
                $penduduk->update($data);
            } else {
                $penduduk = Penduduk::create($data);
            }

            // 3. Update info KK jika dia adalah Kepala Keluarga
            if ($isKepalaKeluarga) {
                $kartuKeluarga->update([
                    'nama_kepala_keluarga' => $penduduk->nama_lengkap,
                    'alamat_keluarga' => $penduduk->alamat_lengkap ?? $kartuKeluarga->alamat_keluarga,
                ]);
            }

            // 4. Update jumlah anggota KK secara real-time
            $kartuKeluarga->update(['jumlah_anggota' => Penduduk::where('nomor_kk', $kartuKeluarga->nomor_kk)->count()]);
        });

        session()->forget(['onboarding.step1', 'onboarding.step2', 'onboarding.step3']);

        $mailError = null;
        if ($user && $user->email && !$user->email_verified_at) {
            try {
                $otp = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
                \App\Models\EmailOtp::where('user_id', $user->id)->orWhere('email', $user->email)->delete();
                \App\Models\EmailOtp::create([
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'otp' => $otp,
                    'expires_at' => \Carbon\Carbon::now()->addMinutes(10),
                    'attempts' => 0,
                ]);
                \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\SendOtpMail($otp, $user->name ?? 'Warga'));
            } catch (\Throwable $e) {
                $mailError = $e->getMessage();
                \Illuminate\Support\Facades\Log::error('Gagal kirim OTP verifikasi onboarding: ' . $e->getMessage());
            }
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => $mailError ? "Data diri disimpan, namun pengiriman email OTP mengalami kendala: {$mailError}" : 'Data diri berhasil dilengkapi. Silakan verifikasi kode OTP yang dikirim ke email Anda.',
                'user' => $user->fresh(['penduduk']),
                'requires_otp' => !$user->email_verified_at,
                'email' => $user->email,
                'mail_error' => $mailError,
            ]);
        }

        return redirect()->route('user.dashboard')->with('status', 'Data diri berhasil dilengkapi.');
    }

    public function show(Request $request)
    {
        $user = $request->user() ?: auth()->user();
        $penduduk = $user?->penduduk;

        // Auto-link penduduk jika relasi belum tersambung
        if (!$penduduk && $user) {
            $penduduk = Penduduk::where('user_id', $user->id)
                ->orWhere(function ($q) use ($user) {
                    $q->whereNull('user_id')->where('nama_lengkap', $user->name);
                })
                ->first();

            if ($penduduk && !$penduduk->user_id) {
                $penduduk->update(['user_id' => $user->id]);
            }
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'penduduk' => $penduduk ? $penduduk->load('kartuKeluarga') : null,
                'user' => $user,
            ]);
        }
        return view('user.pengaturan.profil', compact('penduduk'));
    }

    public function update(Request $request)
    {
        $user = $request->user() ?: auth()->user();
        $penduduk = $user?->penduduk ?? Penduduk::where('user_id', $user?->id)->first();
        if (!$penduduk && $user) {
            $penduduk = Penduduk::whereNull('user_id')
                ->where('nama_lengkap', $user->name)
                ->first();
            if ($penduduk) {
                $penduduk->update(['user_id' => $user->id]);
            }
        }

        if (!$penduduk) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Data profil kependudukan belum terhubung. Silakan lengkapi data pokok terlebih dahulu.'], 404);
            }
            return back()->with('error', 'Data profil tidak ditemukan.');
        }

        $validated = $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'tempat_lahir' => ['nullable', 'string', 'max:100'],
            'tanggal_lahir' => ['nullable', 'date'],
            'jenis_kelamin' => ['nullable', 'in:Laki-laki,Perempuan'],
            'agama' => ['nullable', 'string', 'max:50'],
            'status_perkawinan' => ['nullable', 'string', 'max:50'],
            'pekerjaan' => ['nullable', 'string', 'max:100'],
            'pendidikan_terakhir' => ['nullable', 'string', 'max:50'],
            'nomor_telepon' => ['nullable', 'string', 'max:20'],
            'alamat_lengkap' => ['nullable', 'string'],
            'foto_profil' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($request->hasFile('foto_profil')) {
            // Hapus foto lama jika ada
            if ($penduduk->foto_profil) Storage::disk('public')->delete($penduduk->foto_profil);
            $validated['foto_profil'] = $request->file('foto_profil')->store('foto-profil', 'public');
        }

        if (isset($validated['tanggal_lahir'])) {
            $validated['kategori_umur'] = $this->hitungKategoriUmur($validated['tanggal_lahir']);
        }

        $penduduk->update($validated);

        // Update info di tabel KK jika dia adalah kepala keluarga
        if ($penduduk->nomor_kk && $penduduk->status_dalam_keluarga === 'Kepala Keluarga') {
            KartuKeluarga::where('nomor_kk', $penduduk->nomor_kk)->update([
                'nama_kepala_keluarga' => $penduduk->nama_lengkap,
                'alamat_keluarga' => $penduduk->alamat_lengkap
            ]);
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Profil berhasil diperbarui.',
                'penduduk' => $penduduk->fresh(),
            ]);
        }

        return back()->with('status', 'Profil berhasil diperbarui.');
    }
}