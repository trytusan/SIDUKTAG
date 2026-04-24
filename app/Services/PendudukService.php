<?php

namespace App\Services;

use App\Models\Penduduk;
use Illuminate\Support\Facades\DB;

class PendudukService
{
    public function getAll()
    {
        return Penduduk::latest()->paginate(10);
    }

    public function findById($id)
    {
        return Penduduk::findOrFail($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            return Penduduk::create($data);
        });
    }

    public function update($id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $penduduk = $this->findById($id);
            $penduduk->update($data);

            return $penduduk;
        });
    }

    public function delete($id)
    {
        $penduduk = $this->findById($id);
        return $penduduk->delete();
    }

    public function search($keyword)
    {
        return Penduduk::where('nama_lengkap', 'like', "%{$keyword}%")
            ->orWhere('nik', 'like', "%{$keyword}%")
            ->paginate(10);
    }
}