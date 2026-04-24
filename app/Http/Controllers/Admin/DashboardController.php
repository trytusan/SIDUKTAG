<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bantuan;
use App\Models\KartuKeluarga;
use App\Models\Penduduk;
use App\Models\PengajuanSurat;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
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