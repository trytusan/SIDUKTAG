<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Penduduk extends Model
{
    use HasFactory;

    protected $table = 'penduduk';

    protected $fillable = [
        'user_id',
        'nama_lengkap',
        'nik',
        'nomor_kk',
        'nomor_ktp',
        'tempat_lahir',
        'tanggal_lahir',
        'jenis_kelamin',
        'agama',
        'status_perkawinan',
        'pekerjaan',
        'pendidikan_terakhir',
        'kategori_umur',
        'status_dalam_keluarga',
        'status_kependudukan',
        'nomor_telepon',
        'alamat_lengkap',
        'foto_profil',
        'dokumen_pendukung',
        'latitude',
        'longitude',
        'is_profile_completed',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'is_profile_completed' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pengajuanSurat(): HasMany
    {
        return $this->hasMany(PengajuanSurat::class, 'penduduk_id');
    }

    public function kartuKeluarga(): BelongsTo
    {
        return $this->belongsTo(KartuKeluarga::class, 'nomor_kk', 'nomor_kk');
    }
    public function kartuKeluargaUtama()
    {
        return $this->kartuKeluarga()->limit(1);
    }

    public function bantuanPenerima(): HasMany
    {
        return $this->hasMany(BantuanPenerima::class, 'penduduk_id');
    }
}