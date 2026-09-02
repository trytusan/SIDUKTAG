<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PengajuanSurat extends Model
{
    use HasFactory;

    protected $table = 'pengajuan_surat';

    protected $fillable = [
        'user_id',
        'penduduk_id',
        'jenis_surat_id',
        'nomor_pengajuan',
        'nama_pemohon',
        'nik',
        'jenis_surat_nama',
        'keperluan',
        'tanggal_pengajuan',
        'tanggal_pengesahan',
        'status',
        'catatan_operator',
        'dokumen_pendukung',
        'file_hasil_surat',
    ];

    protected $casts = [
        'tanggal_pengajuan' => 'date',
        'tanggal_pengesahan' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function penduduk(): BelongsTo
    {
        return $this->belongsTo(Penduduk::class);
    }

    public function jenisSurat(): BelongsTo
    {
        return $this->belongsTo(JenisSurat::class);
    }

    public function lampiran(): HasMany
    {
        return $this->hasMany(LampiranSurat::class);
    }

    public function riwayatStatus(): HasMany
    {
        return $this->hasMany(RiwayatStatusSurat::class);
    }
}