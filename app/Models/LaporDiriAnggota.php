<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporDiriAnggota extends Model
{
    use HasFactory;

    protected $table = 'lapor_diri_anggotas';

    protected $fillable = [
        'lapor_diri_id',
        'nama',
        'nik',
        'nomor_paspor',
        'tempat_lahir',
        'tanggal_lahir',
        'hubungan_keluarga',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    public function laporDiri()
    {
        return $this->belongsTo(LaporDiri::class, 'lapor_diri_id');
    }
}
