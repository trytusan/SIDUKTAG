<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Penduduk;
use App\Models\Wilayah;
use Illuminate\Http\Request;

class PetaController extends Controller
{
    /**
     * Endpoint data spasial untuk portal warga.
     * Menerapkan Privacy-by-Design:
     * - Titik warga HANYA mengirimkan koordinat latitude & longitude anonim tanpa data pribadi apapun.
     * - Tempat umum mengirimkan data fasilitas lengkap yang dapat diakses publik.
     */
    public function index(Request $request)
    {
        // 1. Lokasi warga (HANYA koordinat anonim untuk privasi, TANPA data pribadi seperti NIK, nama, No KK, No HP)
        $wargaMarkers = Penduduk::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get(['id', 'latitude', 'longitude'])
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'latitude' => (float) $p->latitude,
                    'longitude' => (float) $p->longitude,
                    'tipe' => 'pemukiman_warga',
                    'label' => 'Titik Pemukiman Warga',
                    'is_private' => true,
                ];
            });

        // 2. Tempat-tempat umum & fasilitas desa (tidak menampilkan wilayah Dusun)
        $tempatUmum = Wilayah::where('jenis_wilayah', '!=', 'Dusun')
            ->where('jenis_wilayah', 'not like', '%Dusun%')
            ->get()
            ->map(function ($w) {
            return [
                'id' => $w->id,
                'nama' => $w->nama_wilayah,
                'jenis' => $w->jenis_wilayah,
                'kode' => $w->kode_wilayah,
                'kepala' => $w->kepala_wilayah,
                'nomor_telepon' => $w->nomor_telepon,
                'jumlah_kk' => $w->jumlah_kk,
                'jumlah_penduduk' => $w->jumlah_penduduk,
                'luas_wilayah' => $w->luas_wilayah,
                'latitude' => (float) $w->latitude,
                'longitude' => (float) $w->longitude,
                'deskripsi' => $w->deskripsi,
                'warna_marker' => $w->warna_marker ?: '#10b981',
                'tipe' => 'tempat_umum',
                'is_accessible' => true,
            ];
        });

        $responseData = [
            'warga_markers' => $wargaMarkers,
            'tempat_umum' => $tempatUmum,
            'total_titik_warga' => $wargaMarkers->count(),
            'total_tempat_umum' => $tempatUmum->count(),
        ];

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($responseData);
        }

        return response()->json($responseData);
    }
}

