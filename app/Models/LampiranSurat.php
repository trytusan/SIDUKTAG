<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LampiranSurat extends Model
{
    use HasFactory;

    protected $table = 'lampiran_surat';

    protected $fillable = [
        'pengajuan_surat_id',
        'nama_file',
        'path_file',
        'mime_type',
        'size',
    ];

    public function pengajuanSurat(): BelongsTo
    {
        return $this->belongsTo(PengajuanSurat::class);
    }
}