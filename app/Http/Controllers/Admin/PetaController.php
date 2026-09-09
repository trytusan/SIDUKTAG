<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use App\Models\Penduduk;
use App\Models\Wilayah;
use Illuminate\Http\Request;

class PetaController extends Controller
{
    /**
     * Tampilkan data spasial peta admin dengan pengelompokan lokasi Kartu Keluarga:
     * - Jika anggota dalam 1 KK tinggal di lokasi yang sama (koordinat identik / pembulatan 5 desimal),
     *   dikelompokkan menjadi 1 marker rumah KK.
     * - Jika anggota dalam 1 KK tinggal di lokasi berbeda, ditampilkan per lokasi masing-masing
     *   dengan relasi spasial ke anggota KK lainnya.
     */
    public function index(Request $request)
    {
        $data = $this->getPetaData();

        if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
            return response()->json($data);
        }

        return view('admin.peta.index', $data);
    }

    /**
     * API data endpoint eksplisit untuk peta admin.
     */
    public function data(Request $request)
    {
        return response()->json($this->getPetaData());
    }

    /**
     * Membangun payload data spasial lengkap untuk peta admin.
     */
    private function getPetaData(): array
    {
        // 1. Ambil seluruh KK beserta seluruh anggotanya yang memiliki koordinat
        $kartuKeluargaList = KartuKeluarga::with(['anggota'])->get();

        $kkMarkers = [];
        $totalKkTerpetakan = 0;
        $totalKkSatuLokasi = 0;
        $totalKkTerpencar = 0;
        $totalJiwaTerpetakan = 0;

        // Kumpulan ID penduduk yang sudah diproses di bawah KK
        $processedPendudukIds = [];

        foreach ($kartuKeluargaList as $kk) {
            // Ambil anggota yang memiliki latitude & longitude valid
            $anggotaValid = $kk->anggota->filter(function ($item) {
                return !is_null($item->latitude) && !is_null($item->longitude) &&
                       is_numeric($item->latitude) && is_numeric($item->longitude);
            });

            if ($anggotaValid->isEmpty()) {
                continue;
            }

            $totalKkTerpetakan++;
            $totalJiwaTerpetakan += $anggotaValid->count();

            // Kelompokkan anggota KK berdasarkan koordinat (presisi 5 desimal ~ 1.1 meter)
            $lokasiGroups = [];
            foreach ($anggotaValid as $anggota) {
                $processedPendudukIds[] = $anggota->id;
                $coordKey = sprintf('%.5f_%.5f', (float) $anggota->latitude, (float) $anggota->longitude);

                if (!isset($lokasiGroups[$coordKey])) {
                    $lokasiGroups[$coordKey] = [
                        'latitude' => (float) $anggota->latitude,
                        'longitude' => (float) $anggota->longitude,
                        'alamat' => $anggota->alamat_lengkap ?: $kk->alamat_keluarga,
                        'anggota' => [],
                    ];
                }

                $lokasiGroups[$coordKey]['anggota'][] = [
                    'id' => $anggota->id,
                    'nama_lengkap' => $anggota->nama_lengkap,
                    'nik' => $anggota->nik,
                    'status_dalam_keluarga' => $anggota->status_dalam_keluarga ?: 'Anggota',
                    'jenis_kelamin' => $anggota->jenis_kelamin,
                    'pekerjaan' => $anggota->pekerjaan,
                    'nomor_telepon' => $anggota->nomor_telepon,
                    'foto_profil' => $anggota->foto_profil,
                    'alamat' => $anggota->alamat_lengkap,
                ];
            }

            $totalTitikLokasiKK = count($lokasiGroups);
            $isSplit = ($totalTitikLokasiKK > 1);

            if ($isSplit) {
                $totalKkTerpencar++;
            } else {
                $totalKkSatuLokasi++;
            }

            $locIndex = 0;
            foreach ($lokasiGroups as $coordKey => $group) {
                $locIndex++;

                // Cek apakah ada kepala keluarga di titik ini
                $hasKepalaKeluarga = collect($group['anggota'])->contains(function ($a) {
                    return strcasecmp($a['status_dalam_keluarga'], 'Kepala Keluarga') === 0;
                });

                // Kumpulkan anggota KK lain yang tinggal di lokasi berbeda
                $anggotaLokasiLain = [];
                if ($isSplit) {
                    foreach ($lokasiGroups as $otherKey => $otherGroup) {
                        if ($otherKey === $coordKey) {
                            continue;
                        }
                        foreach ($otherGroup['anggota'] as $otherAnggota) {
                            $anggotaLokasiLain[] = array_merge($otherAnggota, [
                                'latitude' => $otherGroup['latitude'],
                                'longitude' => $otherGroup['longitude'],
                                'alamat_lokasi_ini' => $otherGroup['alamat'],
                            ]);
                        }
                    }
                }

                // Tentukan tipe marker
                $tipeMarker = 'kk_bersama';
                if ($isSplit) {
                    $tipeMarker = $hasKepalaKeluarga ? 'kk_utama' : 'kk_terpisah';
                }

                $markerId = "kk-{$kk->nomor_kk}-loc-{$locIndex}";

                $kkMarkers[] = [
                    'id' => $markerId,
                    'kk_id' => $kk->id,
                    'nomor_kk' => $kk->nomor_kk,
                    'nama_kepala_keluarga' => $kk->nama_kepala_keluarga,
                    'alamat_keluarga' => $kk->alamat_keluarga,
                    'latitude' => $group['latitude'],
                    'longitude' => $group['longitude'],
                    'alamat_lokasi' => $group['alamat'],
                    'is_split' => $isSplit,
                    'tipe_marker' => $tipeMarker,
                    'is_kepala_keluarga_here' => $hasKepalaKeluarga,
                    'total_anggota_kk' => $anggotaValid->count(),
                    'jumlah_anggota_di_lokasi' => count($group['anggota']),
                    'anggota_di_lokasi' => $group['anggota'],
                    'anggota_lokasi_lain' => $anggotaLokasiLain,
                    'total_titik_kk' => $totalTitikLokasiKK,
                ];
            }
        }

        // 2. Ambil penduduk yang memiliki koordinat namun belum terdata di relasi KK
        $pendudukMandiri = Penduduk::whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->whereNotIn('id', $processedPendudukIds)
            ->get();

        foreach ($pendudukMandiri as $p) {
            $totalJiwaTerpetakan++;
            $kkMarkers[] = [
                'id' => "penduduk-mandiri-{$p->id}",
                'kk_id' => null,
                'nomor_kk' => $p->nomor_kk ?: '-',
                'nama_kepala_keluarga' => $p->nama_lengkap,
                'alamat_keluarga' => $p->alamat_lengkap,
                'latitude' => (float) $p->latitude,
                'longitude' => (float) $p->longitude,
                'alamat_lokasi' => $p->alamat_lengkap,
                'is_split' => false,
                'tipe_marker' => 'warga_mandiri',
                'is_kepala_keluarga_here' => true,
                'total_anggota_kk' => 1,
                'jumlah_anggota_di_lokasi' => 1,
                'anggota_di_lokasi' => [
                    [
                        'id' => $p->id,
                        'nama_lengkap' => $p->nama_lengkap,
                        'nik' => $p->nik,
                        'status_dalam_keluarga' => $p->status_dalam_keluarga ?: 'Warga',
                        'jenis_kelamin' => $p->jenis_kelamin,
                        'pekerjaan' => $p->pekerjaan,
                        'nomor_telepon' => $p->nomor_telepon,
                        'foto_profil' => $p->foto_profil,
                        'alamat' => $p->alamat_lengkap,
                    ],
                ],
                'anggota_lokasi_lain' => [],
                'total_titik_kk' => 1,
            ];
        }

        // 3. Ambil data Tempat Umum & Fasilitas Wilayah (tidak menampilkan wilayah Dusun pada peta)
        $wilayahList = Wilayah::where('jenis_wilayah', '!=', 'Dusun')
            ->where('jenis_wilayah', 'not like', '%Dusun%')
            ->get()
            ->map(function ($w) {
            return [
                'id' => $w->id,
                'nama_wilayah' => $w->nama_wilayah,
                'jenis_wilayah' => $w->jenis_wilayah,
                'kode_wilayah' => $w->kode_wilayah,
                'kepala_wilayah' => $w->kepala_wilayah,
                'nomor_telepon' => $w->nomor_telepon,
                'jumlah_kk' => (int) $w->jumlah_kk,
                'jumlah_penduduk' => (int) $w->jumlah_penduduk,
                'luas_wilayah' => (float) $w->luas_wilayah,
                'latitude' => (float) $w->latitude,
                'longitude' => (float) $w->longitude,
                'deskripsi' => $w->deskripsi,
                'warna_marker' => $w->warna_marker ?: '#10b981',
                'tipe' => 'tempat_umum',
            ];
        });

        // 4. Statistik spasial
        $stats = [
            'total_kk' => $totalKkTerpetakan,
            'total_kk_satu_lokasi' => $totalKkSatuLokasi,
            'total_kk_terpencar' => $totalKkTerpencar,
            'total_titik_marker_kk' => count($kkMarkers),
            'total_penduduk_terpetakan' => $totalJiwaTerpetakan,
            'total_fasilitas_umum' => $wilayahList->count(),
        ];

        return [
            'kk_markers' => $kkMarkers,
            'wilayah_list' => $wilayahList,
            'stats' => $stats,
        ];
    }
}

