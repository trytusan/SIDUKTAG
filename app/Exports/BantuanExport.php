<?php

namespace App\Exports;

use App\Models\Bantuan;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BantuanExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $data;

    /**
     * Menerima koleksi data dari controller
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Mengambil koleksi data yang akan di-export
     */
    public function collection()
    {
        return $this->data;
    }

    /**
     * Header kolom di Excel
     */
    public function headings(): array
    {
        return [
            'ID',
            'Nama Program',
            'Jenis Bantuan',
            'Deskripsi',
            'Tanggal Mulai',
            'Tanggal Selesai',
            'Status',
            'Kuota',
            'Sumber Dana',
            'Dibuat Pada'
        ];
    }

    /**
     * Memetakan data dari model ke kolom Excel
     */
    public function map($item): array
    {
        return [
            $item->id,
            $item->penduduk->nama, // Ambil nama dari relasi penduduk
            $item->penduduk->nik,
            $item->bantuan->nama_program, // Ambil program dari relasi bantuan
            $item->bantuan->jenis_bantuan,
            $item->tanggal_menerima ? $item->tanggal_menerima->format('d/m/Y') : '-',
            $item->status_penerima,
        ];
    }

    /**
     * Memberikan styling dasar pada header
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Tebalkan baris pertama (Header)
            1 => ['font' => ['bold' => true]],
        ];
    }
}