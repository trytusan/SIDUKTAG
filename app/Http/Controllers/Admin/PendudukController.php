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
    public function store(Request $request)
    {
        // 1. Validasi Terpusat
        $validated = $this->validatePenduduk($request);

        // 2. Logika Auto-Create Kartu Keluarga
        $kk = KartuKeluarga::firstOrCreate(
            ['nomor_kk' => $request->nomor_kk],
            [
                'nama_kepala_keluarga' => ($request->status_dalam_keluarga == 'Kepala Keluarga')
                    ? $request->nama_lengkap
                    : 'Belum Diatur',
                'alamat_keluarga' => $request->alamat_lengkap ?? '-',
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'jumlah_anggota' => 0,
            ]
        );

        // 3. Handle Files (Foto, Dokumen, & Akta Kematian)
        if ($request->hasFile('foto_profil')) {
            $file = $request->file('foto_profil');
            $fileName = $request->nik . '_FOTO_' . time() . '.' . $file->getClientOriginalExtension();
            $validated['foto_profil'] = $file->storeAs('foto-profil', $fileName, 'public');
        }

        if ($request->hasFile('dokumen')) {
            $file = $request->file('dokumen');
            $fileName = $request->nik . '_DOK_' . time() . '.' . $file->getClientOriginalExtension();
            $validated['dokumen_pendukung'] = $file->storeAs('dokumen-penduduk', $fileName, 'public');
        }

        if ($request->hasFile('akta_kematian')) {
            $file = $request->file('akta_kematian');
            $fileName = $request->nik . '_AKTA_MENINGGAL_' . time() . '.' . $file->getClientOriginalExtension();
            $validated['akta_kematian'] = $file->storeAs('akta-kematian', $fileName, 'public');
        }

        // 4. Bersihkan data yang tidak sesuai status kependudukan
        $status = $validated['status_kependudukan'] ?? 'Tetap';
        if ($status === 'Tetap') {
            $validated['tanggal_meninggal'] = null;
            $validated['tempat_meninggal'] = null;
            $validated['akta_kematian'] = null;
            $validated['tanggal_pindah'] = null;
            $validated['alamat_tujuan'] = null;
            $validated['daerah_asal'] = null;
            $validated['tujuan_menetap'] = null;
        } elseif ($status === 'Meninggal') {
            $validated['tanggal_pindah'] = null;
            $validated['alamat_tujuan'] = null;
            $validated['daerah_asal'] = null;
            $validated['tujuan_menetap'] = null;
        } elseif ($status === 'Pindah') {
            $validated['tanggal_meninggal'] = null;
            $validated['tempat_meninggal'] = null;
            $validated['akta_kematian'] = null;
            $validated['daerah_asal'] = null;
            $validated['tujuan_menetap'] = null;
        } elseif ($status === 'Pendatang') {
            $validated['tanggal_meninggal'] = null;
            $validated['tempat_meninggal'] = null;
            $validated['akta_kematian'] = null;
            $validated['tanggal_pindah'] = null;
            $validated['alamat_tujuan'] = null;
        }

        // 5. Set Kategori Umur & Status
        if ($request->filled('tanggal_lahir')) {
            $validated['kategori_umur'] = $this->hitungKategoriUmur($request->tanggal_lahir);
        }
        $validated['is_profile_completed'] = true;

        // 6. Simpan Penduduk
        $penduduk = Penduduk::create($validated);

        // 7. Sinkronisasi Jumlah Anggota
        $this->sinkronkanJumlahAnggota($request->nomor_kk);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Data penduduk dan KK berhasil diproses.',
                'penduduk' => $penduduk->load('kartuKeluarga'),
            ], 201);
        }

        return redirect()->route('admin.penduduk.index')->with('status', 'Data penduduk dan KK berhasil diproses.');
    }

    /**
     * Logika Update Data
     */
    public function update(Request $request, int $id)
    {
        $penduduk = Penduduk::findOrFail($id);
        $old_kk = $penduduk->nomor_kk;

        $validated = $this->validatePenduduk($request, $penduduk->id);

        // 2. Update Foto Profil
        if ($request->hasFile('foto_profil')) {
            if ($penduduk->foto_profil) {
                Storage::disk('public')->delete($penduduk->foto_profil);
            }
            $file = $request->file('foto_profil');
            $fileName = $request->nik . '_FOTO_' . time() . '.' . $file->getClientOriginalExtension();
            $validated['foto_profil'] = $file->storeAs('foto-profil', $fileName, 'public');
        }

        // 3. Update Dokumen Pendukung
        if ($request->hasFile('dokumen')) {
            if ($penduduk->dokumen_pendukung) {
                Storage::disk('public')->delete($penduduk->dokumen_pendukung);
            }
            $file = $request->file('dokumen');
            $fileName = $request->nik . '_DOK_' . time() . '.' . $file->getClientOriginalExtension();
            $validated['dokumen_pendukung'] = $file->storeAs('dokumen-penduduk', $fileName, 'public');
        }

        // 4. Update Akta Kematian
        if ($request->hasFile('akta_kematian')) {
            if ($penduduk->akta_kematian) {
                Storage::disk('public')->delete($penduduk->akta_kematian);
            }
            $file = $request->file('akta_kematian');
            $fileName = $request->nik . '_AKTA_MENINGGAL_' . time() . '.' . $file->getClientOriginalExtension();
            $validated['akta_kematian'] = $file->storeAs('akta-kematian', $fileName, 'public');
        }

        // 5. Bersihkan data yang tidak sesuai status kependudukan
        $status = $validated['status_kependudukan'] ?? 'Tetap';
        if ($status !== 'Meninggal' && $penduduk->akta_kematian) {
            Storage::disk('public')->delete($penduduk->akta_kematian);
            $validated['akta_kematian'] = null;
        }

        if ($status === 'Tetap') {
            $validated['tanggal_meninggal'] = null;
            $validated['tempat_meninggal'] = null;
            $validated['akta_kematian'] = null;
            $validated['tanggal_pindah'] = null;
            $validated['alamat_tujuan'] = null;
            $validated['daerah_asal'] = null;
            $validated['tujuan_menetap'] = null;
        } elseif ($status === 'Meninggal') {
            $validated['tanggal_pindah'] = null;
            $validated['alamat_tujuan'] = null;
            $validated['daerah_asal'] = null;
            $validated['tujuan_menetap'] = null;
        } elseif ($status === 'Pindah') {
            $validated['tanggal_meninggal'] = null;
            $validated['tempat_meninggal'] = null;
            $validated['akta_kematian'] = null;
            $validated['daerah_asal'] = null;
            $validated['tujuan_menetap'] = null;
        } elseif ($status === 'Pendatang') {
            $validated['tanggal_meninggal'] = null;
            $validated['tempat_meninggal'] = null;
            $validated['akta_kematian'] = null;
            $validated['tanggal_pindah'] = null;
            $validated['alamat_tujuan'] = null;
        }

        // Update Kategori Umur
        if ($request->filled('tanggal_lahir')) {
            $validated['kategori_umur'] = $this->hitungKategoriUmur($request->tanggal_lahir);
        }

        $penduduk->update($validated);

        // Sinkronisasi KK
        $this->sinkronkanJumlahAnggota($old_kk);
        $this->sinkronkanJumlahAnggota($request->nomor_kk);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Data penduduk berhasil diperbarui.',
                'penduduk' => $penduduk->fresh('kartuKeluarga'),
            ]);
        }

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
            'nomor_kk' => ['required', 'digits:16'],
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
            'status_kependudukan' => ['required', 'in:Tetap,Pendatang,Pindah,Meninggal'],
            'foto_profil' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'dokumen' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],

            // Kolom Kondisional Status Kependudukan
            'tanggal_meninggal' => ['required_if:status_kependudukan,Meninggal', 'nullable', 'date'],
            'tempat_meninggal' => ['required_if:status_kependudukan,Meninggal', 'nullable', 'string', 'max:255'],
            'akta_kematian' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],

            'tanggal_pindah' => ['required_if:status_kependudukan,Pindah', 'nullable', 'date'],
            'alamat_tujuan' => ['required_if:status_kependudukan,Pindah', 'nullable', 'string'],

            'daerah_asal' => ['required_if:status_kependudukan,Pendatang', 'nullable', 'string', 'max:255'],
            'tujuan_menetap' => ['required_if:status_kependudukan,Pendatang', 'nullable', 'string', 'max:255'],

            // GEOTAGGING FIELDS
            'latitude' => ['nullable', 'string', 'max:50'],
            'longitude' => ['nullable', 'string', 'max:50'],
        ], [
            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.digits' => 'NIK harus berjumlah 16 digit.',
            'nik.unique' => 'NIK sudah terdaftar di sistem.',
            'nomor_kk.required' => 'Nomor KK wajib diisi.',
            'nomor_kk.digits' => 'Nomor KK harus berjumlah 16 digit.',
            'status_kependudukan.required' => 'Status kependudukan wajib dipilih.',
            'status_kependudukan.in' => 'Status kependudukan tidak valid.',
            'tanggal_meninggal.required_if' => 'Tanggal meninggal wajib diisi untuk status Meninggal.',
            'tempat_meninggal.required_if' => 'Keterangan/tempat meninggal wajib diisi untuk status Meninggal.',
            'akta_kematian.mimes' => 'Bukti akta meninggal harus berformat JPG, JPEG, PNG, atau PDF.',
            'akta_kematian.max' => 'Ukuran berkas akta meninggal maksimal 4 MB.',
            'tanggal_pindah.required_if' => 'Tanggal pindah wajib diisi untuk status Pindah.',
            'alamat_tujuan.required_if' => 'Alamat tujuan wajib diisi untuk status Pindah.',
            'daerah_asal.required_if' => 'Daerah asal wajib diisi untuk status Pendatang.',
            'tujuan_menetap.required_if' => 'Tujuan menetap wajib diisi untuk status Pendatang.',
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
    public function index(Request $request)
    {
        // 1. Inisialisasi Query dengan Eager Loading
        $query = Penduduk::with('kartuKeluarga');

        // 2. Filter Pencarian (Nama, NIK, No KK)
        $query->when($request->filled('search'), function ($q) use ($request) {
            $search = $request->search;
            $q->where(function ($inner) use ($search) {
                $inner->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%")
                    ->orWhere('nomor_kk', 'like', "%{$search}%");
            });
        });

        // 3. Filter Dropdown
        $query->when($request->filled('jenis_kelamin'), function ($q) use ($request) {
            return $q->where('jenis_kelamin', $request->jenis_kelamin);
        });

        $query->when($request->filled('kategori_umur'), function ($q) use ($request) {
            return $q->where('kategori_umur', $request->kategori_umur);
        });

        $query->when($request->filled('status_kependudukan'), function ($q) use ($request) {
            return $q->where('status_kependudukan', $request->status_kependudukan);
        });

        $query->when($request->filled('status_perkawinan'), function ($q) use ($request) {
            return $q->where('status_perkawinan', $request->status_perkawinan);
        });

        // 4. Eksekusi dengan Pagination
        $penduduk = $query->latest()->paginate(10)->withQueryString();

        // Jika request datang dari Next.js / Axios (JSON)
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'penduduk' => $penduduk,
                'stats' => [
                    'total' => Penduduk::count(),
                    'laki' => Penduduk::where('jenis_kelamin', 'Laki-laki')->count(),
                    'perempuan' => Penduduk::where('jenis_kelamin', 'Perempuan')->count(),
                    'tetap' => Penduduk::where('status_kependudukan', 'Tetap')->count(),
                ],
            ]);
        }

        // Jika request datang dari Blade biasa
        return view('admin.penduduk.index', compact('penduduk'));
    }

    public function create(): View
    {
        return view('admin.penduduk.create');
    }
    public function show(Request $request, int $id)
    {
        $penduduk = Penduduk::with('kartuKeluarga')->findOrFail($id);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'penduduk' => $penduduk,
            ]);
        }

        return view('admin.penduduk.show', compact('penduduk'));
    }

    public function edit(Request $request, int $id)
    {
        $penduduk = Penduduk::with('kartuKeluarga')->findOrFail($id);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'penduduk' => $penduduk,
            ]);
        }

        return view('admin.penduduk.edit', compact('penduduk'));
    }
    public function destroy(Request $request, int $id)
    {
        $penduduk = Penduduk::findOrFail($id);
        $nomor_kk = $penduduk->nomor_kk;

        if ($penduduk->foto_profil) {
            Storage::disk('public')->delete($penduduk->foto_profil);
        }
        if ($penduduk->dokumen_pendukung) {
            Storage::disk('public')->delete($penduduk->dokumen_pendukung);
        }

        $penduduk->delete();
        $this->sinkronkanJumlahAnggota($nomor_kk);

        // Respon JSON jika dihapus dari Next.js modal
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Data penduduk berhasil dihapus.'
            ]);
        }

        return redirect()->route('admin.penduduk.index')->with('status', 'Data penduduk berhasil dihapus.');
    }
}