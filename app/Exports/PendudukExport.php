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
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Kategori Umur',
            'Agama',
            'Pekerjaan',
            'Status Kependudukan',
            'Alamat Lengkap'
        ];
    }

    /**
     * Memetakan data dari Model ke kolom Excel
     */
    public function map($row): array
    {
        return [
            $row->nama_lengkap,
            "'" . $row->nik, // Tambahkan tanda petik agar NIK tidak berubah jadi format scientific
            "'" . $row->nomor_kk,
            $row->jenis_kelamin,
            $row->tempat_lahir,
            isset($row->tanggal_lahir) ? $row->tanggal_lahir->format('d-m-Y') : '-',
            $row->kategori_umur,
            $row->agama,
            $row->pekerjaan,
            $row->status_kependudukan,
            $row->alamat_lengkap,
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