<?php

namespace App\Services;

use App\Models\PengajuanSurat;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SuratService
{
    public function getAll()
    {
        return PengajuanSurat::with(['jenisSurat', 'penduduk'])
            ->latest()
            ->paginate(10);
    }

    public function findById($id)
    {
        return PengajuanSurat::with(['lampiran', 'riwayatStatus'])
            ->findOrFail($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {

            $data['nomor_pengajuan'] = $this->generateNomor();

            return PengajuanSurat::create($data);
        });
    }

    public function updateStatus($id, $status, $catatan = null)
    {
        return DB::transaction(function () use ($id, $status, $catatan) {

            $surat = $this->findById($id);

            $surat->update([
                'status' => $status,
                'catatan_operator' => $catatan,
                'tanggal_pengesahan' => $status === 'Selesai' ? now() : null
            ]);

            // simpan riwayat
            $surat->riwayatStatus()->create([
                'status' => $status,
                'keterangan' => $catatan,
                'tanggal_status' => now()
            ]);

            return $surat;
        });
    }

    public function uploadHasil($id, $filePath)
    {
        $surat = $this->findById($id);

        $surat->update([
            'file_hasil_surat' => $filePath
        ]);

        return $surat;
    }

    private function generateNomor()
    {
        return 'SR-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));
    }
}