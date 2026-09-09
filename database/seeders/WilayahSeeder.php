<?php

namespace Database\Seeders;

use App\Models\Wilayah;
use App\Models\KartuKeluarga;
use App\Models\Penduduk;
use Illuminate\Database\Seeder;

class WilayahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Hanya mencatat wilayah yang benar-benar memiliki data penduduk riil di sistem.
     */
    public function run(): void
    {
        $totalKK = KartuKeluarga::count();
        $totalPenduduk = Penduduk::count();

        Wilayah::updateOrCreate(
            ['kode_wilayah' => 'DSN-01'],
            [
                'nama_wilayah' => 'Banjar Dinas Dauh Munduk',
                'jenis_wilayah' => 'Dusun',
                'kepala_wilayah' => 'Nyoman Suarjana',
                'nomor_telepon' => null,
                'jumlah_kk' => $totalKK,
                'jumlah_penduduk' => $totalPenduduk,
                'luas_wilayah' => null,
                'latitude' => -8.0781358,
                'longitude' => 115.1536173,
                'deskripsi' => 'Banjar Dinas Dauh Munduk, Desa Bungkulan, Kec. Sawan, Kab. Buleleng, Prov. Bali.',
                'warna_marker' => '#10b981',
            ]
        );
    }
}
