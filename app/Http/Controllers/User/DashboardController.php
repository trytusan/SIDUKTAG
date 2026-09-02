<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\BantuanPenerima;
use App\Models\KartuKeluarga;
use App\Models\PengajuanSurat;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(Request $request): View
    {
        $user = $request->user();
        $penduduk = $user->penduduk;

        $totalPengajuan = PengajuanSurat::where('user_id', $user->id)->count();

        $totalSuratSelesai = PengajuanSurat::where('user_id', $user->id)
            ->where('status', 'Selesai')
            ->count();

        $totalBantuanAktif = 0;
        if ($penduduk) {
            $totalBantuanAktif = BantuanPenerima::where('penduduk_id', $penduduk->id)
                ->whereIn('status_penerima', ['Diterima', 'Menunggu'])
                ->count();
        }

        $kartuKeluarga = null;
        $totalAnggotaKeluarga = 0;

        if ($penduduk?->nomor_kk) {
            $kartuKeluarga = KartuKeluarga::with('anggota')
                ->where('nomor_kk', $penduduk->nomor_kk)
                ->first();

            $totalAnggotaKeluarga = $kartuKeluarga?->anggota?->count() ?? 0;
        }

        $pengajuanTerbaru = PengajuanSurat::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        $aktivitasTerbaru = PengajuanSurat::where('user_id', $user->id)
            ->latest()
            ->take(3)
            ->get();

        return view('user.dashboard.index', compact(
            'user',
            'penduduk',
            'kartuKeluarga',
            'totalPengajuan',
            'totalSuratSelesai',
            'totalBantuanAktif',
            'totalAnggotaKeluarga',
            'pengajuanTerbaru',
            'aktivitasTerbaru'
        ));
    }
}