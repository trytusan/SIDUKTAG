<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Dasawisma;
use App\Models\Penduduk;

class DasawismaSeeder extends Seeder
{
    public function run(): void
    {
        $kelompok = [
            [
                'nama_dasawisma' => 'Dasawisma Melati 01',
                'ketua_dasawisma' => 'Ibu Ni Wayan Suasti',
                'nomor_telepon_ketua' => '081234567891',
                'keterangan' => 'Wilayah Gang Kenanga & Tempekan Kaja',
            ],
            [
                'nama_dasawisma' => 'Dasawisma Melati 02',
                'ketua_dasawisma' => 'Ibu Ni Made Candri',
                'nomor_telepon_ketua' => '081234567892',
                'keterangan' => 'Wilayah Gang Melati & Sekitarnya',
            ],
            [
                'nama_dasawisma' => 'Dasawisma Anggrek 01',
                'ketua_dasawisma' => 'Ibu Ni Nyoman Rustini',
                'nomor_telepon_ketua' => '081234567893',
                'keterangan' => 'Wilayah Tempekan Kelod & Gang Anggrek',
            ],
            [
                'nama_dasawisma' => 'Dasawisma Mawar 01',
                'ketua_dasawisma' => 'Ibu Ni Ketut Sukerti',
                'nomor_telepon_ketua' => '081234567894',
                'keterangan' => 'Wilayah Sekitar Bale Banjar Saba',
            ],
        ];

        foreach ($kelompok as $k) {
            Dasawisma::firstOrCreate(
                ['nama_dasawisma' => $k['nama_dasawisma']],
                $k
            );
        }

        // Hubungkan beberapa warga awal ke Dasawisma jika ada
        $dasawisma1 = Dasawisma::first();
        if ($dasawisma1) {
            $penduduk = Penduduk::whereNull('dasawisma_id')->take(5)->get();
            foreach ($penduduk as $p) {
                $p->update(['dasawisma_id' => $dasawisma1->id]);
            }
        }

        $this->command?->info('Seeder Dasawisma berhasil dijalankan.');
    }
}
