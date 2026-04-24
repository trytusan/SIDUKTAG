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
     * Export ke Excel.
     */
    public function exportExcel(Request $request)
    {
        return Excel::download(new PendudukExport($request), 'data-penduduk.xlsx');
    }

    /**
     * Export ke PDF (Biodata Tunggal atau Laporan Kolektif).
     */
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
     * Helper: Hitung kategori umur secara otomatis.
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

    /**
     * Helper: Sinkronisasi jumlah anggota di tabel Kartu Keluarga.
     */
    private function sinkronkanJumlahAnggota($nomor_kk)
    {
        if (!$nomor_kk) return;
        
        $kk = KartuKeluarga::where('nomor_kk', $nomor_kk)->first();
        if ($kk) {
            $total = Penduduk::where('nomor_kk', $nomor_kk)->count();
            $kk->update(['jumlah_anggota' => $total]);
        }
    }

    public function index(Request $request): View
    {
        $query = Penduduk::with('kartuKeluarga');

        // Filter Pencarian
        $query->when($request->search, function ($q, $search) {
            $q->where(function ($inner) use ($search) {
                $inner->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%")
                    ->orWhere('nomor_kk', 'like', "%{$search}%");
            });
        });

        // Filter Lainnya
        $query->when($request->jenis_kelamin, fn($q, $jk) => $q->where('jenis_kelamin', $jk));
        $query->when($request->kategori_umur, fn($q, $kat) => $q->where('kategori_umur', $kat));
        $query->when($request->status_kependudukan, fn($q, $st) => $q->where('status_kependudukan', $st));

        $penduduk = $query->latest()->paginate(10)->withQueryString();

        return view('admin.penduduk.index', compact('penduduk'));
    }

    public function create(): View
    {
        return view('admin.penduduk.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_lengkap'          => ['required', 'string', 'max:255'],
            'nik'                   => ['required', 'digits:16', 'unique:penduduk,nik'],
            'nomor_kk'              => ['required', 'digits:16', 'exists:kartu_keluarga,nomor_kk'],
            'tempat_lahir'          => ['nullable', 'string', 'max:100'],
            'tanggal_lahir'         => ['nullable', 'date'],
            'jenis_kelamin'         => ['nullable', 'in:Laki-laki,Perempuan'],
            'agama'                 => ['nullable', 'string', 'max:50'],
            'status_perkawinan'     => ['nullable', 'string', 'max:50'],
            'pekerjaan'             => ['nullable', 'string', 'max:100'],
            'pendidikan_terakhir'   => ['nullable', 'string', 'max:50'],
            'nomor_telepon'         => ['nullable', 'string', 'max:20'],
            'alamat_lengkap'        => ['nullable', 'string'],
            'status_dalam_keluarga' => ['nullable', 'string', 'max:50'],
            'status_kependudukan'   => ['nullable', 'string', 'max:50'],
            'foto_profil'           => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'dokumen'               => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],
        ]);

        // Handle Foto Profil
        if ($request->hasFile('foto_profil')) {
            $file = $request->file('foto_profil');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $validated['foto_profil'] = $file->storeAs('foto-profil', $fileName, 'public');
        }

        // Handle Dokumen Pendukung
        if ($request->hasFile('dokumen')) {
            $file = $request->file('dokumen');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $validated['dokumen_pendukung'] = $file->storeAs('dokumen-penduduk', $fileName, 'public');
        }

        // Kategori Umur Otomatis
        if ($request->filled('tanggal_lahir')) {
            $validated['kategori_umur'] = $this->hitungKategoriUmur($request->tanggal_lahir);
        }

        $validated['is_profile_completed'] = true;

        Penduduk::create($validated);

        // Sinkronisasi Jumlah Anggota KK
        $this->sinkronkanJumlahAnggota($request->nomor_kk);

        return redirect()->route('admin.penduduk.index')->with('status', 'Data penduduk berhasil ditambahkan.');
    }

    public function show(int $id): View
    {
        $penduduk = Penduduk::with('kartuKeluarga')->findOrFail($id);
        return view('admin.penduduk.show', compact('penduduk'));
    }

    public function edit(int $id): View
    {
        $penduduk = Penduduk::findOrFail($id);
        return view('admin.penduduk.edit', compact('penduduk'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $penduduk = Penduduk::findOrFail($id);
        $old_kk = $penduduk->nomor_kk;

        $validated = $request->validate([
            'nama_lengkap'          => ['required', 'string', 'max:255'],
            'nik'                   => ['required', 'digits:16', 'unique:penduduk,nik,' . $penduduk->id],
            'nomor_kk'              => ['required', 'digits:16', 'exists:kartu_keluarga,nomor_kk'],
            'tempat_lahir'          => ['nullable', 'string', 'max:100'],
            'tanggal_lahir'         => ['nullable', 'date'],
            'jenis_kelamin'         => ['nullable', 'in:Laki-laki,Perempuan'],
            'agama'                 => ['nullable', 'string', 'max:50'],
            'status_perkawinan'     => ['nullable', 'string', 'max:50'],
            'pekerjaan'             => ['nullable', 'string', 'max:100'],
            'pendidikan_terakhir'   => ['nullable', 'string', 'max:50'],
            'nomor_telepon'         => ['nullable', 'string', 'max:20'],
            'alamat_lengkap'        => ['nullable', 'string'],
            'status_dalam_keluarga' => ['nullable', 'string', 'max:50'],
            'status_kependudukan'   => ['nullable', 'string', 'max:50'],
            'foto_profil'           => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'dokumen'               => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],
        ]);

        // Update Foto Profil
        if ($request->hasFile('foto_profil')) {
            if ($penduduk->foto_profil) Storage::disk('public')->delete($penduduk->foto_profil);
            
            $file = $request->file('foto_profil');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $validated['foto_profil'] = $file->storeAs('foto-profil', $fileName, 'public');
        }

        // Update Dokumen Pendukung
        if ($request->hasFile('dokumen')) {
            if ($penduduk->dokumen_pendukung) Storage::disk('public')->delete($penduduk->dokumen_pendukung);
            
            $file = $request->file('dokumen');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $validated['dokumen_pendukung'] = $file->storeAs('dokumen-penduduk', $fileName, 'public');
        }

        // Update Kategori Umur
        if ($request->filled('tanggal_lahir')) {
            $validated['kategori_umur'] = $this->hitungKategoriUmur($request->tanggal_lahir);
        }

        $penduduk->update($validated);

        // Sinkronisasi KK (Jika pindah KK, dua-duanya diupdate)
        $this->sinkronkanJumlahAnggota($old_kk);
        $this->sinkronkanJumlahAnggota($request->nomor_kk);

        return redirect()->route('admin.penduduk.index')->with('status', 'Data penduduk berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $penduduk = Penduduk::findOrFail($id);
        $nomor_kk = $penduduk->nomor_kk;

        // Hapus file fisik dari storage
        if ($penduduk->foto_profil) Storage::disk('public')->delete($penduduk->foto_profil);
        if ($penduduk->dokumen_pendukung) Storage::disk('public')->delete($penduduk->dokumen_pendukung);

        $penduduk->delete();

        // Update jumlah anggota di KK
        $this->sinkronkanJumlahAnggota($nomor_kk);

        return redirect()->route('admin.penduduk.index')->with('status', 'Data penduduk berhasil dihapus.');
    }
}