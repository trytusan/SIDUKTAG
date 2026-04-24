<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiwayatStatusSurat extends Model
{
    use HasFactory;

    protected $table = 'riwayat_status_surat';

    protected $fillable = [
        'pengajuan_surat_id',
        'status',
        'keterangan',
        'tanggal_status',
    ];

    protected $casts = [
        'tanggal_status' => 'datetime',
    ];

    public function pengajuanSurat(): BelongsTo
    {
        return $this->belongsTo(PengajuanSurat::class);
    }
}