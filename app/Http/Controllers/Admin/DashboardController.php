<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bantuan;
use App\Models\BantuanPenerima;
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

        // 1. Demografi Kategori Umur
        $demografiUmur = [
            'Balita' => Penduduk::where('kategori_umur', 'Balita')->count(),
            'Anak-anak' => Penduduk::where('kategori_umur', 'Anak-anak')->count(),
            'Remaja' => Penduduk::where('kategori_umur', 'Remaja')->count(),
            'Dewasa' => Penduduk::where('kategori_umur', 'Dewasa')->count(),
            'Lansia' => Penduduk::where('kategori_umur', 'Lansia')->count(),
        ];

        // 2. Rasio Jenis Kelamin
        $gender = [
            'laki' => Penduduk::where('jenis_kelamin', 'Laki-laki')->count(),
            'perempuan' => Penduduk::where('jenis_kelamin', 'Perempuan')->count(),
        ];

        // 3. Komposisi Status Kependudukan
        $statusKependudukan = [
            'tetap' => Penduduk::where('status_kependudukan', 'Tetap')->count(),
            'pendatang' => Penduduk::where('status_kependudukan', 'Pendatang')->count(),
            'pendatang_sementara' => Penduduk::where('status_kependudukan', 'Pendatang Sementara')->count(),
            'masa_berlaku_habis' => Penduduk::where('status_kependudukan', 'Pendatang Sementara')
                ->whereNotNull('masa_berlaku')
                ->where('masa_berlaku', '<', now()->toDateString())
                ->count(),
            'pindah' => Penduduk::where('status_kependudukan', 'Pindah')->count(),
            'meninggal' => Penduduk::where('status_kependudukan', 'Meninggal')->count(),
        ];

        // 4. Statistik Pelayanan Surat
        $statistikSurat = [
            'total' => $totalPengajuanSurat,
            'menunggu' => PengajuanSurat::where('status', 'Menunggu')->count(),
            'diproses' => PengajuanSurat::where('status', 'Diproses')->count(),
            'selesai' => PengajuanSurat::where('status', 'Selesai')->count(),
            'ditolak' => PengajuanSurat::where('status', 'Ditolak')->count(),
        ];

        // 5. Statistik Realisasi Bantuan Sosial
        $statistikBantuan = [
            'total_penerima' => BantuanPenerima::count(),
            'terverifikasi' => BantuanPenerima::where('status_verifikasi', 'Terverifikasi')->count(),
            'selesai_disalurkan' => BantuanPenerima::where('status_penerima', 'Selesai')->count(),
            'menunggu' => BantuanPenerima::where('status_verifikasi', 'Menunggu Verifikasi')->count(),
        ];

        $pengajuanTerbaru = PengajuanSurat::with(['penduduk', 'jenisSurat'])
            ->latest()
            ->take(5)
            ->get();

        $pendudukTerbaru = Penduduk::latest()
            ->take(5)
            ->get();

        if ($request->expectsJson() || $request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'stats' => [
                    'totalPenduduk' => $totalPenduduk,
                    'totalKeluarga' => $totalKartuKeluarga,
                    'pengajuanBulanIni' => $totalPengajuanSurat,
                    'bantuanAktif' => $totalBantuanAktif,
                    'demografiUmur' => $demografiUmur,
                    'gender' => $gender,
                    'statusKependudukan' => $statusKependudukan,
                    'statistikSurat' => $statistikSurat,
                    'statistikBantuan' => $statistikBantuan,
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