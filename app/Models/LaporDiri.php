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
        'kewarganegaraan',
        'negara_asal',
        'nomor_paspor',
        'masa_berlaku_paspor',
        'jenis_izin_tinggal',
        'nomor_izin_tinggal',
        'masa_berlaku_izin',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'agama',
        'status_perkawinan',
        'pekerjaan',
        'status_bekerja',
        'nama_perusahaan',
        'jabatan_pekerjaan',
        'nomor_dokumen_kerja',
        'nik',
        'nomor_kk',
        'nomor_telepon',

        // B. Alamat Baru
        'alamat_baru',
        'tanggal_mulai_tinggal',
        'status_tempat_tinggal',
        'nama_pemilik_rumah',
        'nomor_kontak_pemilik',
        'nama_penjamin',
        'kategori_penjamin',
        'nik_penjamin',
        'telepon_penjamin',
        'alamat_penjamin',
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
        'lampiran_paspor',
        'lampiran_kitas_kitap',
        'lampiran_surat_permohonan',
        'lampiran_ktp_penjamin',
        'lampiran_dokumen_kerja',
        'lampiran_dokumen_lainnya',
        'lampiran_ttd',
        'file_ktp',
        'file_kk',
        'file_surat_pindah',
        'file_paspor',
        'file_kitas_kitap',
        'file_surat_permohonan',
        'file_ktp_penjamin',
        'file_dokumen_kerja',
        'file_dokumen_lainnya',
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
        'masa_berlaku_paspor' => 'date',
        'masa_berlaku_izin' => 'date',
        'lampiran_ktp' => 'boolean',
        'lampiran_kk' => 'boolean',
        'lampiran_surat_pindah' => 'boolean',
        'lampiran_paspor' => 'boolean',
        'lampiran_kitas_kitap' => 'boolean',
        'lampiran_surat_permohonan' => 'boolean',
        'lampiran_ktp_penjamin' => 'boolean',
        'lampiran_dokumen_kerja' => 'boolean',
        'lampiran_dokumen_lainnya' => 'boolean',
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
