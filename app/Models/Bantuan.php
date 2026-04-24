<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bantuan extends Model
{
    use HasFactory;

    protected $table = 'bantuan';

    protected $fillable = [
        'nama_program',
        'jenis_bantuan',
        'deskripsi',
        'tanggal_mulai',
        'tanggal_selesai',
        'status_bantuan',
        'kuota_penerima',
        'sumber_bantuan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function penerima(): HasMany
    {
        return $this->hasMany(BantuanPenerima::class);
    }
}