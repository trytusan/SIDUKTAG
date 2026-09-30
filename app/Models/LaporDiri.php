<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporDiri extends Model
{
    use HasFactory;

    protected $table = 'lapor_diris';

    protected $fillable = [
        'nama_lengkap',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'agama',
        'status_perkawinan',
        'pekerjaan',
        'nik',
        'nomor_kk',
        'nomor_telepon',

        // B. Alamat Baru
        'alamat_baru',
        'tanggal_mulai_tinggal',
        'status_tempat_tinggal',
        'nama_pemilik_rumah',
        'nomor_kontak_pemilik',
        'latitude',
        'longitude',

        // C. Alamat Asal
        'alamat_asal',
        'rt_rw_asal',
        'kelurahan_asal',
        'kecamatan_asal',
        'kota_kabupaten_asal',

        // E. Dokumen Fisik & Tanda Tangan
        'lampiran_ktp',
        'lampiran_kk',
        'lampiran_surat_pindah',
        'lampiran_ttd',
        'file_ktp',
        'file_kk',
        'file_surat_pindah',
        'tanda_tangan',

        // Meta
        'tanggal_lapor',
        'status_lapor',
        'catatan',
        'created_by',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_mulai_tinggal' => 'date',
        'tanggal_lapor' => 'date',
        'lampiran_ktp' => 'boolean',
        'lampiran_kk' => 'boolean',
        'lampiran_surat_pindah' => 'boolean',
        'lampiran_ttd' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function anggota()
    {
        return $this->hasMany(LaporDiriAnggota::class, 'lapor_diri_id')->orderBy('id', 'asc');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
