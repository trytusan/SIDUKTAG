<?php

namespace App\Exports;

use App\Models\Penduduk;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PendudukExport implements FromQuery, WithMapping, WithHeadings, WithStyles, ShouldAutoSize
{
    use Exportable;

    protected $request;

    // Menangkap request dari Controller untuk filter
    public function __construct($request)
    {
        $this->request = $request;
    }

    /**
     * Logic Query untuk mengambil data (berdasarkan filter yang aktif)
     */
    public function query()
    {
        $query = Penduduk::query();

        // Filter Nama/NIK/KK
        if ($this->request->filled('search')) {
            $search = $this->request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('nomor_kk', 'like', "%{$search}%");
            });
        }

        // Filter Jenis Kelamin
        if ($this->request->filled('jenis_kelamin')) {
            $query->where('jenis_kelamin', $this->request->jenis_kelamin);
        }

        // Filter Kategori Umur
        if ($this->request->filled('kategori_umur')) {
            $query->where('kategori_umur', $this->request->kategori_umur);
        }

        // Filter Status Kependudukan
        if ($this->request->filled('status_kependudukan')) {
            $query->where('status_kependudukan', $this->request->status_kependudukan);
        }

        // Filter Status Hubungan dalam Keluarga
        if ($this->request->filled('status_dalam_keluarga')) {
            $query->where('status_dalam_keluarga', $this->request->status_dalam_keluarga);
        }

        if ($this->request->boolean('hanya_kepala_keluarga')) {
            $query->where('status_dalam_keluarga', 'Kepala Keluarga');
        }

        if ($this->request->filled('status_masa_berlaku')) {
            if ($this->request->status_masa_berlaku === 'aktif') {
                $query->where('status_kependudukan', 'Pendatang Sementara')
                      ->where(function($inner) {
                          $inner->whereNull('masa_berlaku')->orWhere('masa_berlaku', '>=', now()->toDateString());
                      });
            } elseif ($this->request->status_masa_berlaku === 'habis') {
                $query->where('status_kependudukan', 'Pendatang Sementara')
                      ->whereNotNull('masa_berlaku')
                      ->where('masa_berlaku', '<', now()->toDateString());
            }
        }

        return $query->latest();
    }

    /**
     * Header untuk Excel
     */
    public function headings(): array
    {
        return [
            'Nama Lengkap',
            'NIK',
            'Nomor KK',
            'Hubungan Keluarga (SHDK)',
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Kategori Umur',
            'Agama',
            'Pendidikan Terakhir',
            'Pekerjaan',
            'Status Perkawinan',
            'Status Kependudukan',
            'Tanggal Masuk',
            'Masa Berlaku Izin',
            'Status Keberadaan',
            'No. Akta Kematian',
            'Alamat Lengkap',
            'Titik Koordinat'
        ];
    }

    /**
     * Memetakan data dari Model ke kolom Excel
     */
    public function map($row): array
    {
        $statusKeberadaan = ($row->tanggal_meninggal || $row->akta_kematian) ? 'Meninggal' : 'Hidup';

        $masaBerlaku = '-';
        if ($row->status_kependudukan === 'Pendatang Sementara') {
            if ($row->masa_berlaku) {
                $isExpired = \Carbon\Carbon::parse($row->masa_berlaku)->isPast();
                $masaBerlaku = $row->masa_berlaku->format('d-m-Y') . ($isExpired ? ' (Kedaluwarsa)' : ' (Aktif)');
            } else {
                $masaBerlaku = 'Tidak Terbatas';
            }
        }

        $koordinat = ($row->latitude && $row->longitude) ? "{$row->latitude}, {$row->longitude}" : '-';

        return [
            $row->nama_lengkap,
            "'" . $row->nik, // Tambahkan tanda petik agar NIK tidak berubah jadi format scientific
            "'" . $row->nomor_kk,
            $row->status_dalam_keluarga ?? '-',
            $row->jenis_kelamin ?? '-',
            $row->tempat_lahir ?? '-',
            isset($row->tanggal_lahir) ? $row->tanggal_lahir->format('d-m-Y') : '-',
            $row->kategori_umur ?? '-',
            $row->agama ?? '-',
            $row->pendidikan_terakhir ?? '-',
            $row->pekerjaan ?? '-',
            $row->status_perkawinan ?? '-',
            $row->status_kependudukan ?? 'Penduduk Tetap',
            isset($row->tanggal_masuk) ? $row->tanggal_masuk->format('d-m-Y') : '-',
            $masaBerlaku,
            $statusKeberadaan,
            $row->akta_kematian ?? '-',
            $row->alamat_lengkap ?? '-',
            $koordinat,
        ];
    }

    /**
     * Memberikan style dasar pada Excel (Header Bold)
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Row 1 (Header) dibuat Bold
            1 => ['font' => ['bold' => true]],
        ];
    }
}