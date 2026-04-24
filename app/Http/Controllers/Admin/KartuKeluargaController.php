<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Maatwebsite\Excel\Facades\Excel; // TAMBAHKAN INI
use App\Exports\KartuKeluargaExport; // TAMBAHKAN INI
use Barryvdh\DomPDF\Facade\Pdf;

class KartuKeluargaController extends Controller
{
    public function index(Request $request): View|\Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\Response
    {

        // 1. Inisialisasi query dengan hitung anggota otomatis
        $query = KartuKeluarga::withCount('anggota');

        // Export Excel
        if ($request->export === 'excel') {
            // Kita gunakan $query agar hasil yang di-export sesuai dengan hasil pencarian/filter
            return Excel::download(new \App\Exports\KartuKeluargaExport($query), 'data-kartu-keluarga.xlsx');
        }

        // Export PDF
        if ($request->export === 'pdf') {
            $data = $query->get(); // Ambil semua data sesuai filter (tanpa pagination)
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('admin.kartu-keluarga.pdf', compact('data'));
            return $pdf->download('laporan-kartu-keluarga.pdf');
        }

        // 2. Logika Pencarian (Nomor KK atau Nama Kepala Keluarga)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_kk', 'like', "%{$search}%")
                    ->orWhere('nama_kepala_keluarga', 'like', "%{$search}%");
            });
        }

        // 3. (Opsional) Jika ingin menambah filter lain, contoh RT/RW
        if ($request->filled('rt')) {
            $query->where('rt', $request->rt);
        }

        // 4. Eksekusi pagination dengan tetap membawa query string (agar search tidak hilang saat pindah hal)
        $kartuKeluarga = $query->latest()->paginate(10)->withQueryString();

        return view('admin.kartu-keluarga.index', compact('kartuKeluarga'));
    }

    public function create(): View
    {
        return view('admin.kartu-keluarga.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nomor_kk' => ['required', 'digits:16', 'unique:kartu_keluarga,nomor_kk'],
            'nama_kepala_keluarga' => ['required', 'string', 'max:255'],
            'alamat_keluarga' => ['required', 'string'],
        ]);

        $validated['jumlah_anggota'] = 0;

        KartuKeluarga::create($validated);

        return redirect()->route('admin.kartu-keluarga.index')->with('status', 'Data kartu keluarga berhasil ditambahkan.');
    }

    public function show(int $id): View
    {
        $kartuKeluarga = KartuKeluarga::with('anggota')->findOrFail($id);

        return view('admin.kartu-keluarga.show', compact('kartuKeluarga'));
    }

    public function edit(int $id): View
    {
        $kartuKeluarga = KartuKeluarga::findOrFail($id);

        return view('admin.kartu-keluarga.edit', compact('kartuKeluarga'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $kartuKeluarga = KartuKeluarga::findOrFail($id);

        $validated = $request->validate([
            'nomor_kk' => ['required', 'digits:16', 'unique:kartu_keluarga,nomor_kk,' . $kartuKeluarga->id],
            'nama_kepala_keluarga' => ['required', 'string', 'max:255'],
            'alamat_keluarga' => ['required', 'string'],
        ]);

        $kartuKeluarga->update($validated);

        return redirect()->route('admin.kartu-keluarga.index')->with('status', 'Data kartu keluarga berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $kartuKeluarga = KartuKeluarga::findOrFail($id);
        $kartuKeluarga->delete();

        return redirect()->route('admin.kartu-keluarga.index')->with('status', 'Data kartu keluarga berhasil dihapus.');
    }
}