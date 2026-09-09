<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\KartuKeluargaExport;
use Barryvdh\DomPDF\Facade\Pdf;

class KartuKeluargaController extends Controller
{
    public function index(Request $request)
    {
        // 1. Inisialisasi query dengan hitung anggota otomatis
        $query = KartuKeluarga::withCount('anggota');

        // 2. Export Excel
        if ($request->export === 'excel') {
            return Excel::download(new KartuKeluargaExport($query), 'data-kartu-keluarga.xlsx');
        }

        // 3. Export PDF
        if ($request->export === 'pdf') {
            $data = $query->get();
            $pdf = Pdf::loadView('admin.kartu-keluarga.pdf', compact('data'));
            return $pdf->download('laporan-kartu-keluarga.pdf');
        }

        // 4. Logika Pencarian (Nomor KK atau Nama Kepala Keluarga)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_kk', 'like', "%{$search}%")
                    ->orWhere('nama_kepala_keluarga', 'like', "%{$search}%");
            });
        }

        // 5. Filter tambahan (misal RT)
        if ($request->filled('rt')) {
            $query->where('rt', $request->rt);
        }

        // 6. Eksekusi pagination
        $kartuKeluarga = $query->latest()->paginate(10)->withQueryString();

        // JIKA REQUEST DARI NEXT.JS / AXIOS -> KEMBALIKAN JSON
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'kartu_keluarga' => $kartuKeluarga,
                'stats' => [
                    'total_kk' => KartuKeluarga::count(),
                    'total_jiwa' => (int) KartuKeluarga::sum('jumlah_anggota'),
                    'rata_rata' => KartuKeluarga::count() > 0 ? round(KartuKeluarga::avg('jumlah_anggota'), 1) : 0,
                    'kk_terisi' => KartuKeluarga::where('jumlah_anggota', '>', 0)->count(),
                ],
            ]);
        }

        // JIKA BUKAN -> RENDER VIEW BLADE
        return view('admin.kartu-keluarga.index', compact('kartuKeluarga'));
    }

    public function create()
    {
        return view('admin.kartu-keluarga.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_kk' => ['required', 'digits:16', 'unique:kartu_keluarga,nomor_kk'],
            'nama_kepala_keluarga' => ['required', 'string', 'max:255'],
            'alamat_keluarga' => ['required', 'string'],
        ]);

        $validated['jumlah_anggota'] = 0;

        $kartuKeluarga = KartuKeluarga::create($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Data kartu keluarga berhasil ditambahkan.',
                'data' => $kartuKeluarga
            ], 201);
        }

        return redirect()->route('admin.kartu-keluarga.index')->with('status', 'Data kartu keluarga berhasil ditambahkan.');
    }

    public function show(Request $request, int $id)
    {
        $kartuKeluarga = KartuKeluarga::with('anggota')->findOrFail($id);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'kartuKeluarga' => $kartuKeluarga,
                'kartu_keluarga' => $kartuKeluarga,
                'data' => $kartuKeluarga,
            ]);
        }

        return view('admin.kartu-keluarga.show', compact('kartuKeluarga'));
    }

    public function edit(Request $request, int $id)
    {
        $kartuKeluarga = KartuKeluarga::findOrFail($id);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'kartuKeluarga' => $kartuKeluarga
            ]);
        }

        return view('admin.kartu-keluarga.edit', compact('kartuKeluarga'));
    }

    public function update(Request $request, int $id)
    {
        $kartuKeluarga = KartuKeluarga::findOrFail($id);

        $validated = $request->validate([
            'nomor_kk' => ['required', 'digits:16', 'unique:kartu_keluarga,nomor_kk,' . $kartuKeluarga->id],
            'nama_kepala_keluarga' => ['required', 'string', 'max:255'],
            'alamat_keluarga' => ['required', 'string'],
        ]);

        $kartuKeluarga->update($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Data kartu keluarga berhasil diperbarui.',
                'data' => $kartuKeluarga
            ]);
        }

        return redirect()->route('admin.kartu-keluarga.index')->with('status', 'Data kartu keluarga berhasil diperbarui.');
    }

    public function destroy(Request $request, int $id)
    {
        $kartuKeluarga = KartuKeluarga::findOrFail($id);
        $kartuKeluarga->delete();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Data kartu keluarga berhasil dihapus.'
            ]);
        }

        return redirect()->route('admin.kartu-keluarga.index')->with('status', 'Data kartu keluarga berhasil dihapus.');
    }
}