<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dasawisma extends Model
{
    use HasFactory;

    protected $table = 'dasawisma';

    protected $fillable = [
        'nama_dasawisma',
        'ketua_dasawisma',
        'nomor_telepon_ketua',
        'keterangan',
    ];

    /**
     * Anggota penduduk yang terdaftar dalam Dasawisma ini
     */
    public function anggota(): HasMany
    {
        return $this->hasMany(Penduduk::class, 'dasawisma_id');
    }
}
