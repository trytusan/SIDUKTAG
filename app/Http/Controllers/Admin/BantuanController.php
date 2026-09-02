<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BantuanPenerima;
use App\Models\Bantuan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Maatwebsite\Excel\Facades\Excel; // Pastikan library terinstall
use Barryvdh\DomPDF\Facade\Pdf;      // Pastikan library terinstall
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BantuanController extends Controller
{
    public function index(Request $request): View|BinaryFileResponse|Response
    {
        // 1. Gunakan model BantuanPenerima sebagai query dasar
        // Gunakan with() untuk eager loading agar tidak berat saat memanggil relasi
        $query = BantuanPenerima::with(['bantuan', 'penduduk'])
            ->whereHas('penduduk', function ($q) use ($request) {
                if ($request->filled('search')) {
                    $q->where('nama', 'like', "%{$request->search}%")
                        ->orWhere('nik', 'like', "%{$request->search}%");
                }
            })
            ->when($request->filled('jenis'), function ($q) use ($request) {
                // Filter berdasarkan jenis di tabel relasi 'bantuan'
                $q->whereHas('bantuan', function ($sub) use ($request) {
                    $sub->where('jenis_bantuan', $request->jenis);
                });
            })
            ->when($request->filled('status'), function ($q) use ($request) {
                // Filter status pengajuan/penerima
                $q->where('status_penerima', $request->status);
            })
            ->when($request->filled('tanggal'), function ($q) use ($request) {
                $q->whereDate('tanggal_menerima', $request->tanggal);
            });

        // 2. Logika Ekspor (Tetap dipertahankan dengan data relasi)
        if ($request->export === 'excel') {
            return Excel::download(new \App\Exports\BantuanExport($query->get()), 'Laporan-Penerima-Bantuan.xlsx');
        }

        if ($request->export === 'pdf') {
            $data = $query->get();
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('admin.bantuan.pdf', compact('data'))
                ->setPaper('a4', 'landscape');

            // Ini mengembalikan Illuminate\Http\Response
            return $pdf->download('Laporan-Bantuan.pdf');
        }

        // 3. Data untuk View
        $bantuan = $query->latest()->paginate(10)->withQueryString();

        // Ambil daftar jenis dari master Bantuan untuk filter dropdown
        $listProgram = Bantuan::select('jenis_bantuan')
            ->distinct()
            ->whereNotNull('jenis_bantuan')
            ->get();

        return view('admin.bantuan.index', compact('bantuan', 'listProgram'));
    }

    public function getProgramsByType(Request $request)
    {
        // Kita ambil jenis bantuan dari parameter 'type'
        $jenis = $request->query('type');

        $programs = \App\Models\Bantuan::where('jenis_bantuan', $jenis)
            ->where('status_bantuan', 'Aktif')
            ->select('id', 'nama_program')
            ->get();

        return response()->json($programs);
    }

    public function create(): View
    {
        // 1. Ambil semua warga (sesuaikan 'nama_lengkap' dengan kolom di tabel Anda)
        $listPenduduk = \App\Models\Penduduk::orderBy('nama_lengkap', 'asc')
            ->get()
            ->mapWithKeys(function ($item) {
                // Gunakan $item->nama_lengkap di sini juga
                return [$item->id => $item->nik . ' - ' . $item->nama_lengkap];
            })
            ->prepend('Pilih Warga', '');

        // 2. Ambil Jenis Bantuan secara dinamis
        $listJenis = \App\Models\Bantuan::select('jenis_bantuan')
            ->distinct()
            ->whereNotNull('jenis_bantuan')
            ->pluck('jenis_bantuan', 'jenis_bantuan')
            ->prepend('Pilih jenis bantuan', '');

        return view('admin.bantuan.create', compact('listPenduduk', 'listJenis'));
    }

    public function store(Request $request): RedirectResponse
    {
        // Validasi disesuaikan dengan tabel bantuan_penerima
        $validated = $request->validate([
            'penduduk_id' => ['required', 'exists:penduduk,id'],
            'bantuan_id' => ['required', 'exists:bantuan,id'],
            'status_penerima' => ['required', 'in:Menunggu,Diterima,Ditolak,Selesai'],
            'tanggal_menerima' => ['nullable', 'date'],
            'catatan' => ['nullable', 'string'],
        ]);

        // Simpan ke tabel bantuan_penerima (Transaksi Pengajuan)
        \App\Models\BantuanPenerima::create($validated);

        return redirect()->route('admin.bantuan.index')
            ->with('status', 'Pengajuan bantuan berhasil dicatat.');
    }

    public function show($id)
    {
        // Pastikan menggunakan with agar relasi 'bantuan' ikut terbawa
        $bantuan = \App\Models\BantuanPenerima::with(['bantuan', 'penduduk'])->findOrFail($id);

        return view('admin.bantuan.show', compact('bantuan'));
    }

    public function edit(int $id): View
    {
        $bantuan = \App\Models\BantuanPenerima::with('bantuan')->findOrFail($id);

        $listPenduduk = \App\Models\Penduduk::orderBy('nama_lengkap', 'asc')
            ->get()
            ->mapWithKeys(fn($item) => [$item->id => $item->nik . ' - ' . $item->nama_lengkap])
            ->prepend('Pilih Warga', '');

        $listJenis = \App\Models\Bantuan::distinct()->whereNotNull('jenis_bantuan')
            ->pluck('jenis_bantuan', 'jenis_bantuan')
            ->prepend('Pilih jenis bantuan', '');

        // AMBIL DAFTAR PROGRAM BERDASARKAN JENIS YANG SUDAH TERPILIH
        $listProgramTerpilih = \App\Models\Bantuan::where('jenis_bantuan', $bantuan->bantuan->jenis_bantuan)
            ->pluck('nama_program', 'id');

        return view('admin.bantuan.edit', compact('bantuan', 'listPenduduk', 'listJenis', 'listProgramTerpilih'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        // 1. Cari data di tabel BantuanPenerima
        $bantuan = \App\Models\BantuanPenerima::findOrFail($id);

        // 2. Validasi sesuai field yang ada di form pengajuan
        $validated = $request->validate([
            'penduduk_id' => ['required', 'exists:penduduk,id'],
            'bantuan_id' => ['required', 'exists:bantuan,id'],
            'status_penerima' => ['required', 'in:Menunggu,Diterima,Ditolak,Selesai'],
            'tanggal_menerima' => ['nullable', 'date'],
            'catatan' => ['nullable', 'string'],
        ]);

        // 3. Update data pengajuan
        $bantuan->update($validated);

        return redirect()->route('admin.bantuan.index')
            ->with('status', 'Data pengajuan bantuan berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        Bantuan::destroy($id);
        return redirect()->route('admin.bantuan.index')->with('status', 'Program bantuan berhasil dihapus.');
    }
}