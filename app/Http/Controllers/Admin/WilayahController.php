<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Wilayah;
use App\Models\Penduduk;
use App\Models\KartuKeluarga;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WilayahController extends Controller
{
    /**
     * Tampilkan seluruh data wilayah beserta statistik ringkasan.
     */
    public function index(Request $request)
    {
        $query = Wilayah::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_wilayah', 'like', "%{$search}%")
                  ->orWhere('kode_wilayah', 'like', "%{$search}%")
                  ->orWhere('kepala_wilayah', 'like', "%{$search}%");
            });
        }

        if ($request->filled('jenis') && $request->jenis !== 'Semua') {
            $query->where('jenis_wilayah', $request->jenis);
        }

        $wilayah = $query->orderBy('nama_wilayah', 'asc')->get();

        // Sinkronisasi data demografi dengan penduduk riil
        foreach ($wilayah as $item) {
            $item->syncDemografi();
        }

        // Hitung pengelompokan persebaran KK:
        // Jika 1 KK tinggal di lokasi yang sama -> dijadikan satu data hunian
        // Jika 1 KK tinggal di lokasi berbeda -> dipisahkan datanya per titik lokasi
        $sebaranKkData = $this->hitungSebaranKk();

        $stats = [
            'total_wilayah' => Wilayah::count(),
            'total_dusun' => Wilayah::where('jenis_wilayah', 'Dusun')->count(),
            'total_rw' => Wilayah::where('jenis_wilayah', 'RW')->count(),
            'total_rt' => Wilayah::where('jenis_wilayah', 'RT')->count(),
            'total_penduduk' => (int) Wilayah::sum('jumlah_penduduk'),
            'total_kk' => (int) Wilayah::sum('jumlah_kk'),
            'total_luas' => (float) Wilayah::sum('luas_wilayah'),
            'total_kk_satu_atap' => $sebaranKkData['total_satu_atap'],
            'total_kk_terpencar' => $sebaranKkData['total_terpencar'],
            'total_titik_hunian' => $sebaranKkData['total_titik_hunian'],
        ];

        if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
            return response()->json([
                'wilayah' => $wilayah,
                'stats' => $stats,
                'sebaran_kk' => $sebaranKkData['daftar_kk'],
            ]);
        }

        $sebaranKk = $sebaranKkData['daftar_kk'];
        return view('admin.wilayah.index', compact('wilayah', 'stats', 'sebaranKk'));
    }

    /**
     * Algoritma pengelompokan spasial persebaran KK:
     * - Anggota keluarga yang bertempat tinggal sama dijadikan 1 data hunian.
     * - Anggota keluarga yang bertempat tinggal di lokasi berbeda dipisahkan datanya.
     */
    private function hitungSebaranKk(): array
    {
        $kks = KartuKeluarga::with('anggota')->get();
        $daftarKk = [];
        $totalSatuAtap = 0;
        $totalTerpencar = 0;
        $totalTitik = 0;

        foreach ($kks as $kk) {
            $anggotaList = $kk->anggota;
            if ($anggotaList->isEmpty()) {
                continue;
            }

            // Kelompokkan anggota berdasarkan koordinat (atau alamat jika tanpa koordinat)
            $lokasiGroups = [];
            foreach ($anggotaList as $anggota) {
                $hasCoord = (!is_null($anggota->latitude) && !is_null($anggota->longitude) &&
                             is_numeric($anggota->latitude) && is_numeric($anggota->longitude));

                $coordKey = $hasCoord
                    ? sprintf('%.5f_%.5f', (float) $anggota->latitude, (float) $anggota->longitude)
                    : 'addr_' . md5(strtolower(trim($anggota->alamat_lengkap ?: 'lokasi_keluarga')));

                if (!isset($lokasiGroups[$coordKey])) {
                    $lokasiGroups[$coordKey] = [
                        'latitude' => $hasCoord ? (float) $anggota->latitude : null,
                        'longitude' => $hasCoord ? (float) $anggota->longitude : null,
                        'alamat' => $anggota->alamat_lengkap ?: $kk->alamat_keluarga,
                        'anggota' => [],
                    ];
                }

                $lokasiGroups[$coordKey]['anggota'][] = [
                    'id' => $anggota->id,
                    'nama_lengkap' => $anggota->nama_lengkap,
                    'nik' => $anggota->nik,
                    'status_dalam_keluarga' => $anggota->status_dalam_keluarga ?: 'Anggota',
                    'alamat' => $anggota->alamat_lengkap ?: $kk->alamat_keluarga,
                    'nomor_telepon' => $anggota->nomor_telepon,
                    'pekerjaan' => $anggota->pekerjaan,
                ];
            }

            $isSplit = (count($lokasiGroups) > 1);
            if ($isSplit) {
                $totalTerpencar++;
            } else {
                $totalSatuAtap++;
            }
            $totalTitik += count($lokasiGroups);

            $titikList = [];
            $idx = 0;
            foreach ($lokasiGroups as $coordKey => $group) {
                $idx++;
                $hasKepala = collect($group['anggota'])->contains(function ($a) {
                    return strcasecmp($a['status_dalam_keluarga'], 'Kepala Keluarga') === 0;
                });

                $titikList[] = [
                    'index' => $idx,
                    'status_label' => $isSplit
                        ? ($hasKepala ? 'Lokasi Utama (Kepala KK)' : 'Lokasi Terpisah (Anggota)')
                        : 'Satu Atap (Tinggal Bersama)',
                    'is_kepala_keluarga' => $hasKepala,
                    'alamat' => $group['alamat'],
                    'latitude' => $group['latitude'],
                    'longitude' => $group['longitude'],
                    'jumlah_jiwa' => count($group['anggota']),
                    'anggota' => $group['anggota'],
                ];
            }

            $daftarKk[] = [
                'id' => $kk->id,
                'nomor_kk' => $kk->nomor_kk,
                'nama_kepala_keluarga' => $kk->nama_kepala_keluarga,
                'alamat_keluarga' => $kk->alamat_keluarga,
                'is_split' => $isSplit,
                'status_spasial' => $isSplit ? 'Beda Tempat Tinggal (Terpencar)' : 'Satu Tempat Tinggal (Satu Atap)',
                'total_anggota' => $anggotaList->count(),
                'jumlah_titik' => count($titikList),
                'titik_hunian' => $titikList,
            ];
        }

        return [
            'daftar_kk' => $daftarKk,
            'total_satu_atap' => $totalSatuAtap,
            'total_terpencar' => $totalTerpencar,
            'total_titik_hunian' => $totalTitik,
        ];
    }

    /**
     * Simpan data wilayah baru.
     */
    public function store(Request $request)
    {
        // Otomatis buat kode tempat/fasilitas unik jika tidak diisi oleh pengguna
        if (!$request->filled('kode_wilayah')) {
            $count = Wilayah::where('kode_wilayah', 'like', 'TU-%')->count() + 1;
            $autoCode = sprintf('TU-%04d', $count);
            while (Wilayah::where('kode_wilayah', $autoCode)->exists()) {
                $count++;
                $autoCode = sprintf('TU-%04d', $count);
            }
            $request->merge(['kode_wilayah' => $autoCode]);
        }

        $validated = $request->validate([
            'kode_wilayah' => ['required', 'string', 'max:50', 'unique:wilayah,kode_wilayah'],
            'nama_wilayah' => ['required', 'string', 'max:255'],
            'jenis_wilayah' => ['required', 'string', 'max:100'],
            'kepala_wilayah' => ['required', 'string', 'max:255'],
            'nomor_telepon' => ['nullable', 'string', 'max:50'],
            'jumlah_kk' => ['nullable', 'integer', 'min:0'],
            'jumlah_penduduk' => ['nullable', 'integer', 'min:0'],
            'luas_wilayah' => ['nullable', 'numeric', 'min:0'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'deskripsi' => ['nullable', 'string'],
            'warna_marker' => ['nullable', 'string', 'max:20'],
        ]);

        $wilayah = Wilayah::create($validated);
        $wilayah->syncDemografi();

        if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
            return response()->json([
                'message' => 'Data wilayah berhasil ditambahkan.',
                'wilayah' => $wilayah,
            ], 201);
        }

        return redirect()->route('admin.wilayah.index')->with('status', 'Data wilayah berhasil ditambahkan.');
    }

    /**
     * Tampilkan detail wilayah spesifik.
     */
    public function show(Request $request, $id)
    {
        $wilayah = Wilayah::findOrFail($id);
        $cleanName = trim(str_ireplace(['Banjar Dinas', 'Dusun', 'Lingkungan', 'RW', 'RT'], '', $wilayah->nama_wilayah));
        
        $penduduk = Penduduk::where('alamat_lengkap', 'like', "%{$cleanName}%")->get();

        if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
            return response()->json([
                'wilayah' => $wilayah,
                'penduduk' => $penduduk,
            ]);
        }

        return view('admin.wilayah.show', compact('wilayah', 'penduduk'));
    }

    /**
     * Perbarui data wilayah.
     */
    public function update(Request $request, $id)
    {
        $wilayah = Wilayah::findOrFail($id);

        if (!$request->filled('kode_wilayah')) {
            $request->merge(['kode_wilayah' => $wilayah->kode_wilayah]);
        }

        $validated = $request->validate([
            'kode_wilayah' => ['required', 'string', 'max:50', 'unique:wilayah,kode_wilayah,' . $wilayah->id],
            'nama_wilayah' => ['required', 'string', 'max:255'],
            'jenis_wilayah' => ['required', 'string', 'max:100'],
            'kepala_wilayah' => ['required', 'string', 'max:255'],
            'nomor_telepon' => ['nullable', 'string', 'max:50'],
            'jumlah_kk' => ['nullable', 'integer', 'min:0'],
            'jumlah_penduduk' => ['nullable', 'integer', 'min:0'],
            'luas_wilayah' => ['nullable', 'numeric', 'min:0'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'deskripsi' => ['nullable', 'string'],
            'warna_marker' => ['nullable', 'string', 'max:20'],
        ]);

        $wilayah->update($validated);
        $wilayah->syncDemografi();

        if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
            return response()->json([
                'message' => 'Data wilayah berhasil diperbarui.',
                'wilayah' => $wilayah,
            ]);
        }

        return redirect()->route('admin.wilayah.index')->with('status', 'Data wilayah berhasil diperbarui.');
    }

    /**
     * Hapus data wilayah.
     */
    public function destroy(Request $request, $id)
    {
        $wilayah = Wilayah::findOrFail($id);
        $wilayah->delete();

        if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
            return response()->json([
                'message' => 'Data wilayah berhasil dihapus.',
            ]);
        }

        return redirect()->route('admin.wilayah.index')->with('status', 'Data wilayah berhasil dihapus.');
    }
}

