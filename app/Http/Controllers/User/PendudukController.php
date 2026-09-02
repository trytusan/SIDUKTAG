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
    /**
     * Helper untuk menentukan kategori umur secara otomatis.
     */
    private function hitungKategoriUmur($tanggal_lahir): ?string
    {
        if (!$tanggal_lahir) return null;

        $umur = Carbon::parse($tanggal_lahir)->age;

        if ($umur <= 12) return 'Anak-anak';
        if ($umur <= 25) return 'Remaja';
        if ($umur <= 45) return 'Dewasa';
        return 'Lansia';
    }

    public function step1(Request $request): View
    {
        $data = session('onboarding.step1', []);
        return view('user.onboarding.step-1', compact('data'));
    }

    public function storeStep1(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'digits:16'],
            'nomor_kk' => ['required', 'digits:16'],
            'tempat_lahir' => ['nullable', 'string', 'max:100'],
            'tanggal_lahir' => ['nullable', 'date'],
            'jenis_kelamin' => ['required', 'in:Laki-laki,Perempuan'],
            'agama' => ['nullable', 'string', 'max:50'],
            'status_perkawinan' => ['nullable', 'string', 'max:50'],
            'pekerjaan' => ['nullable', 'string', 'max:100'],
            'pendidikan_terakhir' => ['nullable', 'string', 'max:50'],
        ]);

        session(['onboarding.step1' => $validated]);
        return redirect()->route('user.onboarding.step-2');
    }

    public function step2(Request $request): View
    {
        $data = session('onboarding.step2', []);
        return view('user.onboarding.step-2', compact('data'));
    }

    public function storeStep2(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'alamat' => ['required', 'string'],
            'nomor_telepon' => ['nullable', 'string', 'max:20'],
            'status_dalam_keluarga' => ['required', 'string', 'max:50'],
            'status_kependudukan' => ['nullable', 'in:Tetap,Pendatang,Pindah,Meninggal'],
        ]);

        session(['onboarding.step2' => $validated]);
        return redirect()->route('user.onboarding.step-3');
    }

    public function step3(Request $request): View
    {
        $data = session('onboarding.step3', []);
        return view('user.onboarding.step-3', compact('data'));
    }

    public function storeStep3(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'foto_profil' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'dokumen' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);

        $step1 = session('onboarding.step1', []);
        $step2 = session('onboarding.step2', []);
        $user = $request->user();

        DB::transaction(function () use ($request, $validated, $step1, $step2, $user) {
            $data = array_merge($step1, $step2);

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
            $isKepalaKeluarga = ($step2['status_dalam_keluarga'] === 'Kepala Keluarga');
            
            $kartuKeluarga = KartuKeluarga::firstOrCreate(
                ['nomor_kk' => $step1['nomor_kk']],
                [
                    'nama_kepala_keluarga' => $isKepalaKeluarga ? $step1['nama_lengkap'] : 'Belum Diatur',
                    'alamat_keluarga' => $step2['alamat'] ?? '-',
                    'jumlah_anggota' => 0
                ]
            );

            // 2. Simpan atau Update Penduduk (Relasi hasMany otomatis tersambung lewat kolom nomor_kk)
            $penduduk = Penduduk::updateOrCreate(['user_id' => $user->id], $data);

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

        return redirect()->route('user.dashboard')->with('status', 'Data diri berhasil dilengkapi.');
    }

    public function show(Request $request): View
    {
        $penduduk = $request->user()->penduduk;
        return view('user.pengaturan.profil', compact('penduduk'));
    }

    public function update(Request $request): RedirectResponse
    {
        $penduduk = $request->user()->penduduk;
        if (!$penduduk) return back()->with('error', 'Data profil tidak ditemukan.');

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

        return back()->with('status', 'Profil berhasil diperbarui.');
    }
}