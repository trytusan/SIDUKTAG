<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wilayah extends Model
{
    use HasFactory;

    protected $table = 'wilayah';

    protected $fillable = [
        'kode_wilayah',
        'nama_wilayah',
        'jenis_wilayah',
        'kepala_wilayah',
        'nomor_telepon',
        'jumlah_kk',
        'jumlah_penduduk',
        'luas_wilayah',
        'latitude',
        'longitude',
        'deskripsi',
        'warna_marker',
    ];

    protected $casts = [
        'jumlah_kk' => 'integer',
        'jumlah_penduduk' => 'integer',
        'luas_wilayah' => 'float',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    /**
     * Hitung & sinkronisasi jumlah penduduk dan KK riil
     * yang beralamat di wilayah / banjar ini.
     */
    public function syncDemografi()
    {
        $cleanName = trim(str_ireplace(['Banjar Dinas', 'Dusun', 'Lingkungan', 'RW', 'RT', '01', '02', '03'], '', $this->nama_wilayah));
        
        $keywords = array_filter(explode(' ', $cleanName), function ($w) {
            return strlen($w) > 3;
        });

        // Khusus Banjar Dinas Dauh Munduk, warga di Jalan Anggrek berdomisili di Dauh Munduk
        if (stripos($this->nama_wilayah, 'Dauh Munduk') !== false) {
            $keywords[] = 'Anggrek';
        }

        $kkList = KartuKeluarga::where(function ($q) use ($keywords) {
            foreach ($keywords as $kw) {
                $q->orWhere('alamat_keluarga', 'like', "%{$kw}%");
            }
        })->pluck('nomor_kk');

        $pendudukCount = Penduduk::where(function ($q) use ($keywords, $kkList) {
            if ($kkList->isNotEmpty()) {
                $q->whereIn('nomor_kk', $kkList);
            }
            foreach ($keywords as $kw) {
                $q->orWhere('alamat_lengkap', 'like', "%{$kw}%");
            }
        })->count();

        $kkCount = $kkList->count();

        if ($pendudukCount > 0 || $kkCount > 0) {
            $this->jumlah_penduduk = $pendudukCount;
            $this->jumlah_kk = $kkCount;
            $this->save();
        }
    }
}
