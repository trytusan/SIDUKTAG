<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\BantuanPenerima;
use App\Models\KartuKeluarga;
use App\Models\PengajuanSurat;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
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

        // Eager load jenisSurat dan format nama kolom untuk tabel Next.js
        $pengajuanTerbaru = PengajuanSurat::with('jenisSurat')
            ->where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nomor_pengajuan' => $item->nomor_pengajuan ?? ('REG-' . str_pad($item->id, 5, '0', STR_PAD_LEFT)),
                    'jenis_surat_nama' => optional($item->jenisSurat)->nama ?? '-',
                    'tanggal_pengajuan' => $item->created_at ? $item->created_at->format('d/m/Y') : '-',
                    'status' => $item->status,
                ];
            });

        $aktivitasTerbaru = PengajuanSurat::with('jenisSurat')
            ->where('user_id', $user->id)
            ->latest()
            ->take(3)
            ->get();

        // JIKA REQUEST DARI NEXT.JS / AXIOS -> RETURN JSON
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'user' => $user,
                'penduduk' => $penduduk,
                'kartuKeluarga' => $kartuKeluarga,
                'totalPengajuan' => $totalPengajuan,
                'totalSuratSelesai' => $totalSuratSelesai,
                'totalBantuanAktif' => $totalBantuanAktif,
                'totalAnggotaKeluarga' => $totalAnggotaKeluarga,
                'pengajuanTerbaru' => $pengajuanTerbaru,
                'aktivitasTerbaru' => $aktivitasTerbaru,
            ]);
        }

        // JIKA REQUEST DARI BROWSER BLADE
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