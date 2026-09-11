<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BantuanPenerima;
use App\Models\Bantuan;
use App\Models\Penduduk;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class BantuanController extends Controller
{
    public function index(Request $request)
    {
        // 1. Query dasar dengan Eager Loading relasi penduduk dan bantuan
        $query = BantuanPenerima::with(['bantuan', 'penduduk']);

        // 2. Pencarian Nama Lengkap, NIK, atau Nama Program
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('penduduk', function ($p) use ($search) {
                    $p->where('nama_lengkap', 'like', "%{$search}%")
                      ->orWhere('nik', 'like', "%{$search}%");
                })->orWhereHas('bantuan', function ($b) use ($search) {
                    $b->where('nama_program', 'like', "%{$search}%");
                });
            });
        }

        // 3. Filter Jenis Bantuan
        if ($request->filled('jenis')) {
            $jenis = $request->jenis;
            $query->whereHas('bantuan', function ($sub) use ($jenis) {
                $sub->where('jenis_bantuan', $jenis);
            });
        }

        // 4. Filter Status Penerima
        if ($request->filled('status')) {
            $query->where('status_penerima', $request->status);
        }

        // Filter Status Verifikasi
        if ($request->filled('status_verifikasi')) {
            $query->where('status_verifikasi', $request->status_verifikasi);
        }

        // 5. Filter Tanggal Menerima
        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal_menerima', $request->tanggal);
        }

        // Export Excel
        if ($request->export === 'excel') {
            return Excel::download(new \App\Exports\BantuanExport($query->get()), 'Laporan-Penerima-Bantuan.xlsx');
        }

        // Export PDF
        if ($request->export === 'pdf') {
            $data = $query->get();
            $pdf = Pdf::loadView('admin.bantuan.pdf', compact('data'))->setPaper('a4', 'landscape');
            return $pdf->download('Laporan-Bantuan.pdf');
        }

        // 6. Eksekusi Pagination
        $bantuan = $query->latest()->paginate(10)->withQueryString();

        // Ambil daftar program untuk dropdown filter
        $listProgram = Bantuan::select('jenis_bantuan')
            ->distinct()
            ->whereNotNull('jenis_bantuan')
            ->get();

        // RESPONSE JSON UNTUK NEXT.JS
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'bantuan' => $bantuan,
                'listProgram' => $listProgram,
                'stats' => [
                    'total_penerima' => BantuanPenerima::count(),
                    'diterima' => BantuanPenerima::whereIn('status_penerima', ['Diterima', 'Selesai', 'Disalurkan'])->count(),
                    'menunggu' => BantuanPenerima::whereIn('status_penerima', ['Menunggu', 'Pending', 'Diproses'])->count(),
                    'disetujui' => BantuanPenerima::where('status_penerima', 'Diterima')->count(),
                    'selesai' => BantuanPenerima::where('status_penerima', 'Selesai')->count(),
                    'menunggu' => BantuanPenerima::where('status_penerima', 'Menunggu')->count(),
                    'total_program' => Bantuan::where('status_bantuan', 'Aktif')->count(),
                ],
            ]);
        }

        // RESPONSE VIEW UNTUK BLADE
        return view('admin.bantuan.index', compact('bantuan', 'listProgram'));
    }

    public function getProgramsByType(Request $request)
    {
        $jenis = $request->query('type');

        $programs = Bantuan::where('jenis_bantuan', $jenis)
            ->where('status_bantuan', 'Aktif')
            ->select('id', 'nama_program')
            ->get();

        return response()->json($programs);
    }

    public function create(Request $request)
    {
        $listPenduduk = Penduduk::orderBy('nama_lengkap', 'asc')
            ->get(['id', 'nama_lengkap', 'nik']);

        $listJenis = Bantuan::select('jenis_bantuan')
            ->distinct()
            ->whereNotNull('jenis_bantuan')
            ->pluck('jenis_bantuan');

        $listProgram = Bantuan::where('status_bantuan', 'Aktif')
            ->get(['id', 'nama_program', 'jenis_bantuan']);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'penduduk' => $listPenduduk,
                'jenis_bantuan' => $listJenis,
                'program' => $listProgram,
            ]);
        }

        $listPendudukMap = $listPenduduk->mapWithKeys(fn($item) => [$item->id => $item->nik . ' - ' . $item->nama_lengkap])
            ->prepend('Pilih Warga', '');

        $listJenisMap = $listJenis->mapWithKeys(fn($j) => [$j => $j])
            ->prepend('Pilih jenis bantuan', '');

        return view('admin.bantuan.create', ['listPenduduk' => $listPendudukMap, 'listJenis' => $listJenisMap]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'penduduk_id' => ['required', 'exists:penduduk,id'],
            'bantuan_id' => ['required', 'exists:bantuan,id'],
            'status_penerima' => ['required', 'in:Menunggu,Diterima,Ditolak,Selesai'],
            'status_verifikasi' => ['nullable', 'string'],
            'tanggal_verifikasi' => ['nullable', 'date'],
            'tanggal_menerima' => ['nullable', 'date'],
            'catatan' => ['nullable', 'string'],
            'catatan_operator' => ['nullable', 'string'],
        ]);

        // Otomasi tanggal jika disetujui / selesai
        if ($validated['status_penerima'] === 'Diterima' && empty($validated['status_verifikasi'])) {
            $validated['status_verifikasi'] = 'Terverifikasi';
        }
        if (($validated['status_verifikasi'] ?? '') === 'Terverifikasi' && empty($validated['tanggal_verifikasi'])) {
            $validated['tanggal_verifikasi'] = now()->toDateString();
        }
        if ($validated['status_penerima'] === 'Selesai' && empty($validated['tanggal_menerima'])) {
            $validated['tanggal_menerima'] = now()->toDateString();
        }

        $penerima = BantuanPenerima::create($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Pengajuan bantuan berhasil dicatat.',
                'data' => $penerima
            ], 201);
        }

        return redirect()->route('admin.bantuan.index')
            ->with('status', 'Pengajuan bantuan berhasil dicatat.');
    }

    public function show(Request $request, $id)
    {
        $bantuan = BantuanPenerima::with(['bantuan', 'penduduk'])->findOrFail($id);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'bantuan' => $bantuan
            ]);
        }

        return view('admin.bantuan.show', compact('bantuan'));
    }

    public function edit(Request $request, $id)
    {
        $bantuan = BantuanPenerima::with(['bantuan', 'penduduk'])->findOrFail($id);

        $listPenduduk = Penduduk::orderBy('nama_lengkap', 'asc')
            ->get(['id', 'nama_lengkap', 'nik']);

        $listJenis = Bantuan::distinct()->whereNotNull('jenis_bantuan')
            ->pluck('jenis_bantuan');

        $listProgramTerpilih = Bantuan::where('jenis_bantuan', optional($bantuan->bantuan)->jenis_bantuan)
            ->get(['id', 'nama_program']);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'bantuan' => $bantuan,
                'penduduk' => $listPenduduk,
                'jenis_bantuan' => $listJenis,
                'program' => $listProgramTerpilih,
            ]);
        }

        $listPendudukMap = $listPenduduk->mapWithKeys(fn($item) => [$item->id => $item->nik . ' - ' . $item->nama_lengkap])
            ->prepend('Pilih Warga', '');

        $listJenisMap = $listJenis->mapWithKeys(fn($j) => [$j => $j])
            ->prepend('Pilih jenis bantuan', '');

        $listProgramMap = $listProgramTerpilih->pluck('nama_program', 'id');

        return view('admin.bantuan.edit', [
            'bantuan' => $bantuan,
            'listPenduduk' => $listPendudukMap,
            'listJenis' => $listJenisMap,
            'listProgramTerpilih' => $listProgramMap,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $bantuan = BantuanPenerima::findOrFail($id);

        $validated = $request->validate([
            'penduduk_id' => ['required', 'exists:penduduk,id'],
            'bantuan_id' => ['required', 'exists:bantuan,id'],
            'status_penerima' => ['required', 'in:Menunggu,Diterima,Ditolak,Selesai'],
            'status_verifikasi' => ['nullable', 'string'],
            'tanggal_verifikasi' => ['nullable', 'date'],
            'tanggal_menerima' => ['nullable', 'date'],
            'catatan' => ['nullable', 'string'],
            'catatan_operator' => ['nullable', 'string'],
        ]);

        // Otomasi tanggal jika disetujui / selesai
        if ($validated['status_penerima'] === 'Diterima' && empty($validated['status_verifikasi'])) {
            $validated['status_verifikasi'] = 'Terverifikasi';
        }
        if (($validated['status_verifikasi'] ?? '') === 'Terverifikasi' && empty($validated['tanggal_verifikasi'])) {
            $validated['tanggal_verifikasi'] = now()->toDateString();
        }
        if ($validated['status_penerima'] === 'Selesai' && empty($validated['tanggal_menerima'])) {
            $validated['tanggal_menerima'] = now()->toDateString();
        }

        $bantuan->update($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Data pengajuan bantuan berhasil diperbarui.',
                'data' => $bantuan
            ]);
        }

        return redirect()->route('admin.bantuan.index')
            ->with('status', 'Data pengajuan bantuan berhasil diperbarui.');
    }

    public function destroy(Request $request, int $id)
    {
        // HAPUS DARI MODEL BantuanPenerima (BUKAN Bantuan)
        $penerima = BantuanPenerima::findOrFail($id);
        $penerima->delete();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Data penerima bantuan berhasil dihapus.'
            ]);
        }

        return redirect()->route('admin.bantuan.index')->with('status', 'Data penerima bantuan berhasil dihapus.');
    }
}