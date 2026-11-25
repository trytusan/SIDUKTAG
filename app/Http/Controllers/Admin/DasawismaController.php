<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dasawisma;
use App\Models\KartuKeluarga;
use App\Models\Penduduk;
use Illuminate\Http\Request;

class DasawismaController extends Controller
{
    public function index(Request $request)
    {
        $query = Dasawisma::withCount(['keluarga', 'anggota']);

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
            'total_kk_terpetakan' => KartuKeluarga::whereNotNull('dasawisma_id')->count(),
            'total_kk_belum_terpetakan' => KartuKeluarga::whereNull('dasawisma_id')->count(),
            'total_kk_banjar' => KartuKeluarga::count(),
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
        $list = Dasawisma::withCount(['keluarga', 'anggota'])
            ->orderBy('nama_dasawisma', 'asc')
            ->get(['id', 'nama_dasawisma', 'ketua_dasawisma', 'nomor_telepon_ketua']);

        return response()->json($list);
    }

    /**
     * Mengambil daftar Kartu Keluarga yang belum terdaftar di Dasawisma mana pun
     */
    public function availableKeluarga(Request $request)
    {
        $query = KartuKeluarga::withCount('anggota')
            ->whereNull('dasawisma_id');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_kk', 'like', "%{$search}%")
                  ->orWhere('nama_kepala_keluarga', 'like', "%{$search}%")
                  ->orWhere('alamat_keluarga', 'like', "%{$search}%");
            });
        }

        $keluarga = $query->orderBy('nama_kepala_keluarga', 'asc')->get([
            'id',
            'nomor_kk',
            'nama_kepala_keluarga',
            'alamat_keluarga',
            'jumlah_anggota',
        ]);

        return response()->json($keluarga);
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
        $dasawisma = Dasawisma::withCount(['keluarga', 'anggota'])->findOrFail($id);

        // Ambil daftar KK yang tergabung dalam Dasawisma ini beserta seluruh anggota keluarganya
        $keluarga = KartuKeluarga::with(['anggota' => function ($q) {
            $q->select([
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
        }])
        ->where('dasawisma_id', $id)
        ->orderBy('nama_kepala_keluarga', 'asc')
        ->get();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'dasawisma' => $dasawisma,
                'keluarga' => $keluarga,
            ]);
        }

        return view('admin.dasawisma.show', compact('dasawisma', 'keluarga'));
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

        // Lepaskan seluruh Kartu Keluarga dan anggota warga yang terhubung ke dasawisma ini
        KartuKeluarga::where('dasawisma_id', $id)->update(['dasawisma_id' => null]);
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
     * Penetapan Massal Kartu Keluarga (KK) ke Kelompok Dasawisma
     */
    public function assignKeluarga(Request $request, int $id)
    {
        $dasawisma = Dasawisma::findOrFail($id);

        // Kasus: Tambahkan Kartu Keluarga yang dipilih
        if ($request->has('kartu_keluarga_ids') && is_array($request->kartu_keluarga_ids)) {
            $ids = array_filter($request->kartu_keluarga_ids, fn($val) => is_numeric($val));
            $listKK = KartuKeluarga::whereIn('id', $ids)->get();

            foreach ($listKK as $kk) {
                $kk->update(['dasawisma_id' => $id]);
                // Otomatis sinkronkan seluruh anggota keluarga di KK tersebut
                Penduduk::where('nomor_kk', $kk->nomor_kk)->update(['dasawisma_id' => $id]);
            }
        }

        // Kasus: Lepas satu Kartu Keluarga dari kelompok ini
        if ($request->filled('remove_kartu_keluarga_id')) {
            $kk = KartuKeluarga::where('id', $request->remove_kartu_keluarga_id)
                ->where('dasawisma_id', $id)
                ->first();

            if ($kk) {
                $kk->update(['dasawisma_id' => null]);
                // Otomatis lepaskan seluruh anggota keluarga di KK tersebut
                Penduduk::where('nomor_kk', $kk->nomor_kk)->update(['dasawisma_id' => null]);
            }
        }

        // Kompatibilitas mundur: jika masih ada request penduduk_ids langsung
        if ($request->has('penduduk_ids') && is_array($request->penduduk_ids)) {
            $pIds = array_filter($request->penduduk_ids, fn($val) => is_numeric($val));
            $penduduks = Penduduk::whereIn('id', $pIds)->get();
            foreach ($penduduks as $p) {
                $p->update(['dasawisma_id' => $id]);
                if ($p->nomor_kk) {
                    KartuKeluarga::where('nomor_kk', $p->nomor_kk)->update(['dasawisma_id' => $id]);
                    Penduduk::where('nomor_kk', $p->nomor_kk)->update(['dasawisma_id' => $id]);
                }
            }
        }

        if ($request->filled('remove_penduduk_id')) {
            $p = Penduduk::where('id', $request->remove_penduduk_id)->where('dasawisma_id', $id)->first();
            if ($p) {
                $p->update(['dasawisma_id' => null]);
            }
        }

        $kkCount = KartuKeluarga::where('dasawisma_id', $id)->count();
        $anggotaCount = Penduduk::where('dasawisma_id', $id)->count();

        return response()->json([
            'message' => 'Daftar Kartu Keluarga kelompok Dasawisma berhasil diperbarui.',
            'keluarga_count' => $kkCount,
            'anggota_count' => $anggotaCount,
        ]);
    }
}
