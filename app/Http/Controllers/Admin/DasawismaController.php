<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dasawisma;
use App\Models\Penduduk;
use Illuminate\Http\Request;

class DasawismaController extends Controller
{
    public function index(Request $request)
    {
        $query = Dasawisma::withCount('anggota');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_dasawisma', 'like', "%{$search}%")
                  ->orWhere('ketua_dasawisma', 'like', "%{$search}%")
                  ->orWhere('keterangan', 'like', "%{$search}%");
            });
        }

        $dasawisma = $query->orderBy('nama_dasawisma', 'asc')->paginate(10);

        $stats = [
            'total_dasawisma' => Dasawisma::count(),
            'total_warga_terpetakan' => Penduduk::whereNotNull('dasawisma_id')->count(),
            'total_warga_belum_terpetakan' => Penduduk::whereNull('dasawisma_id')->count(),
        ];

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'dasawisma' => $dasawisma,
                'stats' => $stats,
            ]);
        }

        return view('admin.dasawisma.index', compact('dasawisma', 'stats'));
    }

    public function listAll(Request $request)
    {
        $list = Dasawisma::orderBy('nama_dasawisma', 'asc')
            ->get(['id', 'nama_dasawisma', 'ketua_dasawisma']);

        return response()->json($list);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_dasawisma' => ['required', 'string', 'max:100', 'unique:dasawisma,nama_dasawisma'],
            'ketua_dasawisma' => ['nullable', 'string', 'max:150'],
            'nomor_telepon_ketua' => ['nullable', 'string', 'max:20'],
            'keterangan' => ['nullable', 'string', 'max:500'],
        ]);

        $dasawisma = Dasawisma::create($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Kelompok Dasawisma berhasil ditambahkan.',
                'data' => $dasawisma,
            ], 201);
        }

        return redirect()->route('admin.dasawisma.index')
            ->with('status', 'Kelompok Dasawisma berhasil ditambahkan.');
    }

    public function show(Request $request, int $id)
    {
        $dasawisma = Dasawisma::withCount('anggota')->findOrFail($id);

        $anggota = Penduduk::where('dasawisma_id', $id)
            ->orderBy('nomor_kk', 'asc')
            ->orderBy('nama_lengkap', 'asc')
            ->get([
                'id',
                'nama_lengkap',
                'nik',
                'nomor_kk',
                'status_dalam_keluarga',
                'jenis_kelamin',
                'pekerjaan',
                'alamat_lengkap',
                'nomor_telepon',
            ]);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'dasawisma' => $dasawisma,
                'anggota' => $anggota,
            ]);
        }

        return view('admin.dasawisma.show', compact('dasawisma', 'anggota'));
    }

    public function update(Request $request, int $id)
    {
        $dasawisma = Dasawisma::findOrFail($id);

        $validated = $request->validate([
            'nama_dasawisma' => ['required', 'string', 'max:100', 'unique:dasawisma,nama_dasawisma,' . $id],
            'ketua_dasawisma' => ['nullable', 'string', 'max:150'],
            'nomor_telepon_ketua' => ['nullable', 'string', 'max:20'],
            'keterangan' => ['nullable', 'string', 'max:500'],
        ]);

        $dasawisma->update($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Kelompok Dasawisma berhasil diperbarui.',
                'data' => $dasawisma,
            ]);
        }

        return redirect()->route('admin.dasawisma.index')
            ->with('status', 'Kelompok Dasawisma berhasil diperbarui.');
    }

    public function destroy(Request $request, int $id)
    {
        $dasawisma = Dasawisma::findOrFail($id);

        // Lepaskan seluruh warga yang terhubung ke dasawisma ini
        Penduduk::where('dasawisma_id', $id)->update(['dasawisma_id' => null]);

        $dasawisma->delete();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Kelompok Dasawisma berhasil dihapus.',
            ]);
        }

        return redirect()->route('admin.dasawisma.index')
            ->with('status', 'Kelompok Dasawisma berhasil dihapus.');
    }

    /**
     * Penetapan Massal Anggota ke Kelompok Dasawisma
     */
    public function assignAnggota(Request $request, int $id)
    {
        $dasawisma = Dasawisma::findOrFail($id);

        // Kasus: Tambahkan anggota yang dipilih
        if ($request->has('penduduk_ids') && is_array($request->penduduk_ids)) {
            $ids = array_filter($request->penduduk_ids, fn($val) => is_numeric($val));
            Penduduk::whereIn('id', $ids)->update(['dasawisma_id' => $id]);
        }

        // Kasus: Lepas satu anggota dari kelompok ini
        if ($request->filled('remove_penduduk_id')) {
            Penduduk::where('id', $request->remove_penduduk_id)
                ->where('dasawisma_id', $id)
                ->update(['dasawisma_id' => null]);
        }

        $anggotaCount = Penduduk::where('dasawisma_id', $id)->count();

        return response()->json([
            'message' => 'Anggota kelompok Dasawisma berhasil diperbarui.',
            'anggota_count' => $anggotaCount,
        ]);
    }
}
