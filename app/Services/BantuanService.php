<?php

namespace App\Services;

use App\Models\Bantuan;
use App\Models\BantuanPenerima;
use Illuminate\Support\Facades\DB;

class BantuanService
{
    public function getAll()
    {
        return Bantuan::latest()->paginate(10);
    }

    public function findById($id)
    {
        return Bantuan::with('penerima.penduduk')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Bantuan::create($data);
    }

    public function update($id, array $data)
    {
        $bantuan = $this->findById($id);
        $bantuan->update($data);

        return $bantuan;
    }

    public function delete($id)
    {
        return Bantuan::destroy($id);
    }

    public function tambahPenerima($bantuanId, $pendudukId)
    {
        return DB::transaction(function () use ($bantuanId, $pendudukId) {

            return BantuanPenerima::create([
                'bantuan_id' => $bantuanId,
                'penduduk_id' => $pendudukId,
                'tanggal_menerima' => now(),
                'status_penerima' => 'Diterima'
            ]);
        });
    }

    public function getPenerima($bantuanId)
    {
        return BantuanPenerima::with('penduduk')
            ->where('bantuan_id', $bantuanId)
            ->get();
    }
}