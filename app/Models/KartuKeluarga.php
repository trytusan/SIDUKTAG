<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany; // Ubah ini

class KartuKeluarga extends Model
{
    use HasFactory;

    protected $table = 'kartu_keluarga';

    protected $fillable = [
        'nomor_kk',
        'nama_kepala_keluarga',
        'alamat_keluarga',
        'rt',
        'rw',
        'jumlah_anggota',
    ];

    /**
     * Relasi ke Penduduk (Satu KK memiliki banyak Penduduk)
     */
    public function anggota(): HasMany
    {
        // Parameter: NamaModel, ForeignKey di tabel penduduk, LocalKey di tabel KK
        return $this->hasMany(Penduduk::class, 'nomor_kk', 'nomor_kk');
        return $this->hasMany(Penduduk::class, 'nomor_kk', 'nomor_kk')
            ->orderByRaw("
                CASE 
                    WHEN status_dalam_keluarga = 'Kepala Keluarga' THEN 1
                    WHEN status_dalam_keluarga = 'Suami' THEN 2
                    WHEN status_dalam_keluarga = 'Istri' THEN 3
                    WHEN status_dalam_keluarga = 'Anak' THEN 4
                    WHEN status_dalam_keluarga = 'Menantu' THEN 5
                    WHEN status_dalam_keluarga = 'Cucu' THEN 6
                    WHEN status_dalam_keluarga IN ('Orang Tua', 'Ayah', 'Ibu') THEN 7
                    WHEN status_dalam_keluarga = 'Mertua' THEN 8
                    WHEN status_dalam_keluarga = 'Famili Lain' THEN 9
                    WHEN status_dalam_keluarga = 'Pembantu' THEN 10
                    ELSE 11
                END ASC
            ")
            ->orderBy('tanggal_lahir', 'asc');
    }
}