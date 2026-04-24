<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use Illuminate\Http\Request;
use Illuminate\View\View;

class KartuKeluargaController extends Controller
{
    public function index(Request $request): View
    {
        $penduduk = $request->user()->penduduk;
        $nomorKk = $penduduk?->nomor_kk;

        $kartuKeluarga = KartuKeluarga::where('nomor_kk', $nomorKk)->first();

        return view('user.kartu-keluarga.index', compact('kartuKeluarga', 'penduduk'));
    }

    public function show(Request $request, int $id): View
    {
        $penduduk = $request->user()->penduduk;
        $kartuKeluarga = KartuKeluarga::with('anggota')->findOrFail($id);

        if ($penduduk && $kartuKeluarga->nomor_kk !== $penduduk->nomor_kk) {
            abort(403, 'Anda tidak memiliki akses ke data keluarga ini.');
        }

        return view('user.kartu-keluarga.show', compact('kartuKeluarga', 'penduduk'));
    }
}