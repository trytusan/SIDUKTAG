<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;

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
    protected function kategoriUmur(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->tanggal_lahir)
                    return null;

                $umur = Carbon::parse($this->tanggal_lahir)->age;

                if ($umur <= 12)
                    return 'Anak-anak';
                if ($umur <= 25)
                    return 'Remaja';
                if ($umur <= 45)
                    return 'Dewasa';
                return 'Lansia';
            },
        );
    }
}