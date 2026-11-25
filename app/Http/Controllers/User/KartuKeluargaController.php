<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use App\Models\Penduduk;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class KartuKeluargaController extends Controller
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

    private function mirrorFile(?string $relativePath): void
    {
        if (!$relativePath) return;

        $sourceCandidates = [
            storage_path('app/public/' . $relativePath),
            public_path('storage/' . $relativePath),
            storage_path('app/' . $relativePath),
            base_path('storage/' . $relativePath),
        ];

        $source = null;
        foreach ($sourceCandidates as $cand) {
            if (file_exists($cand) && is_file($cand)) {
                $source = $cand;
                break;
            }
        }

        if (!$source) return;

        $destinations = [
            public_path('storage/' . $relativePath),
            base_path('storage/' . $relativePath),
            storage_path('app/public/' . $relativePath),
            base_path('public_html/storage/' . $relativePath),
            isset($_SERVER['DOCUMENT_ROOT']) ? ($_SERVER['DOCUMENT_ROOT'] . '/storage/' . $relativePath) : null,
        ];

        foreach ($destinations as $dest) {
            if (!$dest || $source === $dest) continue;
            $destDir = dirname($dest);
            if (!file_exists($destDir)) {
                @mkdir($destDir, 0775, true);
            }
            @copy($source, $dest);
        }
    }

    private function sinkronkanJumlahAnggota($nomor_kk)
    {
        if (!$nomor_kk) return;
        $kk = KartuKeluarga::where('nomor_kk', $nomor_kk)->first();
        if ($kk) {
            $total = Penduduk::where('nomor_kk', $nomor_kk)->count();
            $kk->update(['jumlah_anggota' => $total]);
        }
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $penduduk = $user->penduduk?->load('dasawisma');
        $nomorKk = $penduduk?->nomor_kk;

        // Eager load relasi anggota keluarga dan dasawisma jika nomor KK tersedia
        $kartuKeluarga = null;
        if ($nomorKk) {
            $kartuKeluarga = KartuKeluarga::with(['dasawisma', 'anggota' => function ($query) {
                $query->orderByRaw("CASE WHEN status_dalam_keluarga = 'Kepala Keluarga' THEN 1 ELSE 2 END")
                      ->orderBy('tanggal_lahir', 'asc');
            }])->where('nomor_kk', $nomorKk)->first();
        }

        $isKepalaKeluarga = ($penduduk && $penduduk->status_dalam_keluarga === 'Kepala Keluarga');

        // Response JSON untuk Next.js / Axios
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'kartuKeluarga' => $kartuKeluarga,
                'kartu_keluarga' => $kartuKeluarga,
                'data' => $kartuKeluarga,
                'penduduk' => $penduduk,
                'is_kepala_keluarga' => $isKepalaKeluarga,
            ]);
        }

        return view('user.kartu-keluarga.index', compact('kartuKeluarga', 'penduduk', 'isKepalaKeluarga'));
    }

    public function storeAnggota(Request $request)
    {
        $user = $request->user();
        $kepala = $user->penduduk;

        if (!$kepala || $kepala->status_dalam_keluarga !== 'Kepala Keluarga') {
            return response()->json([
                'message' => 'Hanya Kepala Keluarga yang berwenang menambahkan anggota keluarga.'
            ], 403);
        }

        $nomorKk = $kepala->nomor_kk;
        if (!$nomorKk) {
            return response()->json([
                'message' => 'Nomor Kartu Keluarga Anda belum tercatat di sistem. Hubungi administrator Lingkungan Saba.'
            ], 422);
        }

        $kartuKeluarga = KartuKeluarga::where('nomor_kk', $nomorKk)->first();
        if (!$kartuKeluarga) {
            return response()->json([
                'message' => 'Data Kartu Keluarga induk tidak ditemukan.'
            ], 404);
        }

        $validated = $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'digits:16', 'unique:penduduk,nik'],
            'status_dalam_keluarga' => [
                'required',
                'string',
                'in:Istri,Suami,Anak,Menantu,Cucu,Orang Tua,Mertua,Famili Lain,Pembantu,Lainnya'
            ],
            'jenis_kelamin' => ['required', 'in:Laki-laki,Perempuan'],
            'tempat_lahir' => ['nullable', 'string', 'max:100'],
            'tanggal_lahir' => ['required', 'date'],
            'agama' => ['nullable', 'string', 'max:50'],
            'status_perkawinan' => ['nullable', 'string', 'max:50'],
            'pekerjaan' => ['nullable', 'string', 'max:100'],
            'pendidikan_terakhir' => ['nullable', 'string', 'max:50'],
            'nomor_telepon' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'status_kependudukan' => ['nullable', 'in:Tetap,Pendatang,Pendatang Sementara'],
            'foto_profil' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'dokumen_ktp' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],
        ], [
            'nik.required' => 'NIK wajib diisi.',
            'nik.digits' => 'NIK harus 16 digit angka.',
            'nik.unique' => 'NIK ini sudah terdaftar dalam sistem kependudukan.',
            'nama_lengkap.required' => 'Nama lengkap anggota keluarga wajib diisi.',
            'status_dalam_keluarga.required' => 'Hubungan dalam keluarga wajib dipilih.',
            'status_dalam_keluarga.in' => 'Peran Kepala Keluarga tidak dapat ditambahkan ganda.',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
            'tanggal_lahir.required' => 'Tanggal lahir wajib diisi.',
        ]);

        // Upload berkas jika ada
        if ($request->hasFile('foto_profil')) {
            $file = $request->file('foto_profil');
            $fileName = $validated['nik'] . '_FOTO_' . time() . '.' . $file->getClientOriginalExtension();
            $validated['foto_profil'] = $file->storeAs('foto-profil', $fileName, 'public');
            $this->mirrorFile($validated['foto_profil']);
        }

        if ($request->hasFile('dokumen_ktp')) {
            $file = $request->file('dokumen_ktp');
            $fileName = $validated['nik'] . '_KTP_' . time() . '.' . $file->getClientOriginalExtension();
            $validated['dokumen_pendukung'] = $file->storeAs('dokumen-penduduk', $fileName, 'public');
            $this->mirrorFile($validated['dokumen_pendukung']);
        } elseif ($kepala->dokumen_pendukung) {
            // Berkas KK diwariskan dari Kepala Keluarga
            $validated['dokumen_pendukung'] = $kepala->dokumen_pendukung;
        }

        // Kunci No KK, Alamat, Geotagging mengikuti Kepala Keluarga
        $validated['nomor_kk'] = $nomorKk;
        $validated['alamat_lengkap'] = $kepala->alamat_lengkap ?? $kartuKeluarga->alamat_keluarga;
        $validated['latitude'] = $kepala->latitude;
        $validated['longitude'] = $kepala->longitude;
        $validated['status_kependudukan'] = $validated['status_kependudukan'] ?? ($kepala->status_kependudukan ?? 'Tetap');
        $validated['kategori_umur'] = $this->hitungKategoriUmur($validated['tanggal_lahir']);
        $validated['is_profile_completed'] = true;

        // Buat akun user otomatis untuk anggota keluarga (Integrasi dengan Tahap 1)
        $userEmail = !empty($validated['email']) ? trim(strtolower($validated['email'])) : ($validated['nik'] . '@sidulisa.id');
        $newUser = User::where('email', $userEmail)->first();
        if (!$newUser) {
            $newUser = User::create([
                'name' => $validated['nama_lengkap'],
                'email' => $userEmail,
                'password' => Hash::make(Str::random(32)),
                'telepon' => $validated['nomor_telepon'] ?? null,
                'role' => 'user',
                'is_active' => true,
                'must_set_password' => true,
            ]);
        }
        $validated['user_id'] = $newUser->id;

        // Audit Trail (Pencatatan Didaftarkan oleh Kepala Keluarga)
        $kepalaName = $kepala->nama_lengkap;
        $validated['created_by_name'] = $kepalaName . ' (Kepala Keluarga)';
        $validated['created_by_role'] = 'kepala_keluarga';
        $validated['updated_by_name'] = $kepalaName . ' (Kepala Keluarga)';
        $validated['updated_by_role'] = 'kepala_keluarga';
        $validated['last_modified_source'] = 'Kepala Keluarga (' . $kepalaName . ')';
        $validated['last_modified_at'] = now();

        // Simpan penduduk
        $anggota = Penduduk::create($validated);

        // Sinkronisasi jumlah anggota KK
        $this->sinkronkanJumlahAnggota($nomorKk);

        return response()->json([
            'message' => 'Anggota keluarga berhasil ditambahkan ke Kartu Keluarga Anda!',
            'data' => $anggota,
        ], 201);
    }

    public function destroyAnggota(Request $request, int $id)
    {
        $user = $request->user();
        $kepala = $user->penduduk;

        if (!$kepala || $kepala->status_dalam_keluarga !== 'Kepala Keluarga') {
            return response()->json([
                'message' => 'Hanya Kepala Keluarga yang berwenang mengelola anggota keluarga.'
            ], 403);
        }

        $anggota = Penduduk::findOrFail($id);

        if ($anggota->nomor_kk !== $kepala->nomor_kk) {
            return response()->json([
                'message' => 'Anggota ini tidak terdaftar dalam Kartu Keluarga Anda.'
            ], 403);
        }

        if ($anggota->id === $kepala->id) {
            return response()->json([
                'message' => 'Kepala Keluarga tidak dapat menghapus dirinya sendiri dari daftar anggota.'
            ], 422);
        }

        $nomorKk = $anggota->nomor_kk;

        if ($anggota->foto_profil) {
            Storage::disk('public')->delete($anggota->foto_profil);
        }
        if ($anggota->dokumen_pendukung && $anggota->dokumen_pendukung !== $kepala->dokumen_pendukung) {
            Storage::disk('public')->delete($anggota->dokumen_pendukung);
        }

        $anggota->delete();
        $this->sinkronkanJumlahAnggota($nomorKk);

        return response()->json([
            'message' => 'Anggota keluarga berhasil dihapus dari Kartu Keluarga.'
        ]);
    }

    public function show(Request $request, int $id)
    {
        $user = $request->user();
        $penduduk = $user->penduduk?->load('dasawisma');
        $kartuKeluarga = KartuKeluarga::with('anggota')->findOrFail($id);

        if ($penduduk && $kartuKeluarga->nomor_kk !== $penduduk->nomor_kk) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Anda tidak memiliki akses ke data keluarga ini.'
                ], 403);
            }
            abort(403, 'Anda tidak memiliki akses ke data keluarga ini.');
        }

        $isKepalaKeluarga = ($penduduk && $penduduk->status_dalam_keluarga === 'Kepala Keluarga');

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'kartuKeluarga' => $kartuKeluarga,
                'kartu_keluarga' => $kartuKeluarga,
                'data' => $kartuKeluarga,
                'penduduk' => $penduduk,
                'is_kepala_keluarga' => $isKepalaKeluarga,
            ]);
        }

        return view('user.kartu-keluarga.show', compact('kartuKeluarga', 'penduduk', 'isKepalaKeluarga'));
    }
}
