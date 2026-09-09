<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\KartuKeluarga;
use Illuminate\Http\Request;

class KartuKeluargaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $penduduk = $user->penduduk;
        $nomorKk = $penduduk?->nomor_kk;

        // Eager load relasi anggota keluarga jika nomor KK tersedia
        $kartuKeluarga = null;
        if ($nomorKk) {
            $kartuKeluarga = KartuKeluarga::with(['anggota' => function ($query) {
                $query->orderByRaw("CASE WHEN status_dalam_keluarga = 'Kepala Keluarga' THEN 1 ELSE 2 END")
                      ->orderBy('tanggal_lahir', 'asc');
            }])->where('nomor_kk', $nomorKk)->first();
        }

        // Response JSON untuk Next.js / Axios
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'kartuKeluarga' => $kartuKeluarga,
                'kartu_keluarga' => $kartuKeluarga,
                'data' => $kartuKeluarga,
                'penduduk' => $penduduk
            ]);
        }

        return view('user.kartu-keluarga.index', compact('kartuKeluarga', 'penduduk'));
    }

    public function show(Request $request, int $id)
    {
        $user = $request->user();
        $penduduk = $user->penduduk;
        $kartuKeluarga = KartuKeluarga::with('anggota')->findOrFail($id);

        if ($penduduk && $kartuKeluarga->nomor_kk !== $penduduk->nomor_kk) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Anda tidak memiliki akses ke data keluarga ini.'
                ], 403);
            }
            abort(403, 'Anda tidak memiliki akses ke data keluarga ini.');
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'kartuKeluarga' => $kartuKeluarga,
                'kartu_keluarga' => $kartuKeluarga,
                'data' => $kartuKeluarga,
                'penduduk' => $penduduk
            ]);
        }

        return view('user.kartu-keluarga.show', compact('kartuKeluarga', 'penduduk'));
    }
}