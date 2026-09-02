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
    }
}