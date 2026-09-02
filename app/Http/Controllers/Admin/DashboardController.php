<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bantuan;
use App\Models\KartuKeluarga;
use App\Models\Penduduk;
use App\Models\PengajuanSurat;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $totalPenduduk = Penduduk::count();
        $totalKartuKeluarga = KartuKeluarga::count();
        $totalPengajuanSurat = PengajuanSurat::count();
        $totalBantuanAktif = Bantuan::where('status_bantuan', 'Aktif')->count();

        $pengajuanTerbaru = PengajuanSurat::with(['penduduk', 'jenisSurat'])
            ->latest()
            ->take(5)
            ->get();

        $pendudukTerbaru = Penduduk::latest()
            ->take(5)
            ->get();

        if ($request->expectsJson()) {
            return response()->json([
                'stats' => [
                    'totalPenduduk' => $totalPenduduk,
                    'totalKeluarga' => $totalKartuKeluarga,
                    'pengajuanBulanIni' => $totalPengajuanSurat,
                    'bantuanAktif' => $totalBantuanAktif,
                ],
                'pengajuanTerbaru' => $pengajuanTerbaru,
                'pendudukTerbaru' => $pendudukTerbaru,
            ]);
        }

        return view('admin.dashboard.index', compact(
            'totalPenduduk',
            'totalKartuKeluarga',
            'totalPengajuanSurat',
            'totalBantuanAktif',
            'pengajuanTerbaru',
            'pendudukTerbaru'
        ));
    }
}