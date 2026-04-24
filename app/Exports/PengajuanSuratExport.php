<?php
namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PengajuanSuratExport implements FromCollection, WithHeadings
{
    protected $data;

    public function __construct($data) {
        $this->data = $data;
    }

    public function collection() {
        return $this->data->map(function($item, $key) {
            return [
                $key + 1,
                $item->nama_pemohon,
                $item->nik,
                $item->jenis_surat_nama,
                $item->tanggal_pengajuan,
                $item->status
            ];
        });
    }

    public function headings(): array {
        return ['No', 'Nama Pemohon', 'NIK', 'Jenis Surat', 'Tanggal', 'Status'];
    }
}