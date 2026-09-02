<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BantuanPenerima extends Model
{
    use HasFactory;

    protected $table = 'bantuan_penerima';

    protected $fillable = [
        'bantuan_id',     // Menghubungkan ke tabel 'bantuan' (Master Program dari Admin)
        'penduduk_id',    // Menghubungkan ke tabel 'penduduk' (Data User yang mengajukan)
        'tanggal_menerima',
        'status_penerima', // Contoh: Menunggu, Diterima, Ditolak
        'catatan',
    ];

    protected $casts = [
        'tanggal_menerima' => 'date',
    ];

    /**
     * Relasi ke Master Program Bantuan
     */
    public function bantuan(): BelongsTo
    {
        // Pastikan foreign key di tabel adalah bantuan_id
        return $this->belongsTo(Bantuan::class, 'bantuan_id');
    }

    /**
     * Relasi ke Data Penduduk (User yang mengajukan)
     */
    public function penduduk(): BelongsTo
    {
        // Pastikan foreign key di tabel adalah penduduk_id
        return $this->belongsTo(Penduduk::class, 'penduduk_id');
    }
}