<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class KartuKeluargaExport implements FromQuery, WithHeadings, WithMapping
{
    protected $query;

    public function __construct($query)
    {
        $this->query = $query;
    }

    public function query()
    {
        return $this->query;
    }

    public function headings(): array
    {
        return [
            'Nomor KK',
            'Nama Kepala Keluarga',
            'Alamat',
            'Jumlah Anggota',
            'Tanggal Dibuat',
        ];
    }

    public function map($kk): array
    {
        return [
            $kk->nomor_kk,
            $kk->nama_kepala_keluarga,
            $kk->alamat_keluarga,
            $kk->anggota_count . ' Orang',
            $kk->created_at->format('d/m/Y'),
        ];
    }
}