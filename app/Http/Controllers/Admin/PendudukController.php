<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Penduduk;
use App\Models\KartuKeluarga;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use App\Exports\PendudukExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class PendudukController extends Controller
{
    /**
     * Export ke Excel & PDF (Tetap sama)
     */
    public function exportExcel(Request $request)
    {
        return Excel::download(new PendudukExport($request), 'data-penduduk.xlsx');
    }

    public function exportPdf(Request $request)
    {
        if ($request->has('id')) {
            $penduduk = Penduduk::findOrFail($request->id);
            $pdf = Pdf::loadView('admin.penduduk.pdf-biodata', compact('penduduk'));
            return $pdf->stream('Biodata-' . $penduduk->nama_lengkap . '.pdf');
        }

        $penduduk = Penduduk::latest()->get();
        $pdf = Pdf::loadView('admin.penduduk.pdf', compact('penduduk'));
        return $pdf->download('laporan-penduduk.pdf');
    }

    /**
     * Logika Penyimpanan Data (Store)
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. Validasi (Hapus 'exists:kartu_keluarga,nomor_kk')
        $validated = $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'digits:16', 'unique:penduduk,nik'],
            'nomor_kk' => ['required', 'digits:16'], // Hapus 'exists' agar nomor baru bisa masuk
            'tanggal_lahir' => ['nullable', 'date'],
            // ... (validasi lainnya tetap sama)
            'latitude' => ['nullable', 'string'],
            'longitude' => ['nullable', 'string'],
        ]);

        // 2. Logika Auto-Create Kartu Keluarga
        // Cek apakah KK sudah ada, jika belum maka buat baru
        // Logika Auto-Create Kartu Keluarga
        $kk = KartuKeluarga::firstOrCreate(
            ['nomor_kk' => $request->nomor_kk],
            [
                'nama_kepala_keluarga' => ($request->status_dalam_keluarga == 'Kepala Keluarga')
                    ? $request->nama_lengkap
                    : 'Belum Diatur',

                // SESUAIKAN DI SINI: Dari 'alamat' menjadi 'alamat_keluarga'
                'alamat_keluarga' => $request->alamat_lengkap ?? '-',

                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'jumlah_anggota' => 0,
            ]
        );

        // 3. Handle Files (Foto & Dokumen)
        if ($request->hasFile('foto_profil')) {
            $file = $request->file('foto_profil');

            // Ambil nama asli file
            $originalName = $file->getClientOriginalName();

            // Opsional: Tambahkan NIK agar file tidak tertimpa jika ada nama file yang sama
            $fileName = $request->nik . '_FOTO_' . $originalName;

            // Simpan file dengan nama tersebut
            $validated['foto_profil'] = $file->storeAs('foto-profil', $fileName, 'public');
        }

        // --- Bagian Handle Dokumen Pendukung ---
        if ($request->hasFile('dokumen')) {
            $file = $request->file('dokumen');

            // Ambil nama asli file
            $originalName = $file->getClientOriginalName();

            // Opsional: Tambahkan NIK agar unik
            $fileName = $request->nik . '_DOK_' . $originalName;

            $validated['dokumen_pendukung'] = $file->storeAs('dokumen-penduduk', $fileName, 'public');
        }

        // 4. Set Kategori Umur & Status
        if ($request->filled('tanggal_lahir')) {
            $validated['kategori_umur'] = $this->hitungKategoriUmur($request->tanggal_lahir);
        }
        $validated['is_profile_completed'] = true;

        // 5. Simpan Penduduk
        Penduduk::create($validated);

        // 6. Sinkronisasi Jumlah Anggota
        $this->sinkronkanJumlahAnggota($request->nomor_kk);

        return redirect()->route('admin.penduduk.index')->with('status', 'Data penduduk dan KK berhasil diproses.');
    }

    /**
     * Logika Update Data
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $penduduk = Penduduk::findOrFail($id);
        $old_kk = $penduduk->nomor_kk;

        $validated = $this->validatePenduduk($request, $penduduk->id);

        // 2. Update Foto Profil (Jika ada file baru)
        if ($request->hasFile('foto_profil')) {
            // Hapus foto lama jika ada
            if ($penduduk->foto_profil) {
                Storage::disk('public')->delete($penduduk->foto_profil);
            }

            $file = $request->file('foto_profil');
            $fileName = $request->nik . '_FOTO_' . $file->getClientOriginalName();
            $validated['foto_profil'] = $file->storeAs('foto-profil', $fileName, 'public');
        }

        // 3. Update Dokumen Pendukung (Jika ada file baru)
        if ($request->hasFile('dokumen')) {
            // Hapus dokumen lama jika ada
            if ($penduduk->dokumen_pendukung) {
                Storage::disk('public')->delete($penduduk->dokumen_pendukung);
            }

            $file = $request->file('dokumen');
            $fileName = $request->nik . '_DOK_' . $file->getClientOriginalName();
            $validated['dokumen_pendukung'] = $file->storeAs('dokumen-penduduk', $fileName, 'public');
        }

        // Update Kategori Umur
        if ($request->filled('tanggal_lahir')) {
            $validated['kategori_umur'] = $this->hitungKategoriUmur($request->tanggal_lahir);
        }

        $penduduk->update($validated);

        // Sinkronisasi KK
        $this->sinkronkanJumlahAnggota($old_kk);
        $this->sinkronkanJumlahAnggota($request->nomor_kk);

        return redirect()->route('admin.penduduk.index')->with('status', 'Data penduduk berhasil diperbarui.');
    }

    /**
     * Helper: Validasi Terpusat (Menghindari duplikasi kode)
     */
    private function validatePenduduk(Request $request, $id = null)
    {
        return $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'digits:16', 'unique:penduduk,nik,' . $id],
            'nomor_kk' => ['required', 'digits:16', 'exists:kartu_keluarga,nomor_kk'],
            'tempat_lahir' => ['nullable', 'string', 'max:100'],
            'tanggal_lahir' => ['nullable', 'date'],
            'jenis_kelamin' => ['nullable', 'in:Laki-laki,Perempuan'],
            'agama' => ['nullable', 'string', 'max:50'],
            'status_perkawinan' => ['nullable', 'string', 'max:50'],
            'pekerjaan' => ['nullable', 'string', 'max:100'],
            'pendidikan_terakhir' => ['nullable', 'string', 'max:50'],
            'nomor_telepon' => ['nullable', 'string', 'max:20'],
            'alamat_lengkap' => ['nullable', 'string'],
            'status_dalam_keluarga' => ['nullable', 'string', 'max:50'],
            'status_kependudukan' => ['nullable', 'string', 'max:50'],
            'foto_profil' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'dokumen' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],

            // GEOTAGGING FIELDS
            'latitude' => ['nullable', 'string', 'max:50'],
            'longitude' => ['nullable', 'string', 'max:50'],
        ]);
    }

    // Helper: Hitung Kategori Umur
    private function hitungKategoriUmur($tanggal_lahir): ?string
    {
        if (!$tanggal_lahir)
            return null;
        $umur = Carbon::parse($tanggal_lahir)->age;
        if ($umur <= 12)
            return 'Anak-anak';
        if ($umur <= 25)
            return 'Remaja';
        if ($umur <= 45)
            return 'Dewasa';
        return 'Lansia';
    }

    // Helper: Sinkronisasi KK
    private function sinkronkanJumlahAnggota($nomor_kk)
    {
        if (!$nomor_kk)
            return;
        $kk = KartuKeluarga::where('nomor_kk', $nomor_kk)->first();
        if ($kk) {
            $total = Penduduk::where('nomor_kk', $nomor_kk)->count();
            $kk->update(['jumlah_anggota' => $total]);
        }
    }

    // Index, Show, Edit, Destroy (Tetap sama, pastikan data Lat/Lng terambil)
    public function index(Request $request): View
    {
        // 1. Inisialisasi Query dengan Eager Loading
        $query = Penduduk::with('kartuKeluarga');

        // 2. Filter Pencarian (Nama, NIK, No KK)
        $query->when($request->search, function ($q, $search) {
            $q->where(function ($inner) use ($search) {
                $inner->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%")
                    ->orWhere('nomor_kk', 'like', "%{$search}%");
            });
        });

        // 3. Filter Dropdown (Pastikan name di select Blade sesuai dengan ini)
        $query->when($request->jenis_kelamin, function ($q, $jk) {
            return $q->where('jenis_kelamin', $jk);
        });

        $query->when($request->kategori_umur, function ($q, $kat) {
            return $q->where('kategori_umur', $kat);
        });

        $query->when($request->status_kependudukan, function ($q, $st) {
            return $q->where('status_kependudukan', $st);
        });

        $query->when($request->status_perkawinan, function ($q, $sp) {
            return $q->where('status_perkawinan', $sp);
        });

        // 4. Eksekusi dengan Pagination
        $penduduk = $query->latest()->paginate(10)->withQueryString();

        return view('admin.penduduk.index', compact('penduduk'));
    }

    public function create(): View
    {
        return view('admin.penduduk.create');
    }
    public function show(int $id): View
    {
        // Cukup ambil datanya dulu, lalu masukkan ke compact
        $penduduk = Penduduk::with('kartuKeluarga')->findOrFail($id);

        return view('admin.penduduk.show', compact('penduduk'));
    }
    public function edit(int $id): View
    {
        // Mengambil data penduduk berdasarkan ID
        $penduduk = Penduduk::findOrFail($id);

        // Mengirimkan variabel $penduduk ke view
        return view('admin.penduduk.edit', compact('penduduk'));
    }
    public function destroy(int $id): RedirectResponse
    {
        $penduduk = Penduduk::findOrFail($id);
        $nomor_kk = $penduduk->nomor_kk;
        if ($penduduk->foto_profil)
            Storage::disk('public')->delete($penduduk->foto_profil);
        if ($penduduk->dokumen_pendukung)
            Storage::disk('public')->delete($penduduk->dokumen_pendukung);
        $penduduk->delete();
        $this->sinkronkanJumlahAnggota($nomor_kk);
        return redirect()->route('admin.penduduk.index')->with('status', 'Data penduduk berhasil dihapus.');
    }
}