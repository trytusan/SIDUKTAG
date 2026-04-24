<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JenisSurat;
use App\Models\PengajuanSurat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PengajuanSuratController extends Controller
{
    public function index(Request $request)
    {
        // 1. Definisikan Query Dasar dengan Filter yang Aktif
        $query = PengajuanSurat::with(['jenisSurat', 'penduduk'])
            ->when($request->search, function ($q, $search) {
                $q->where('nama_pemohon', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%")
                    ->orWhere('keperluan', 'like', "%{$search}%");
            })
            ->when($request->jenis_surat_id, function ($q, $jenis_id) {
                $q->where('jenis_surat_id', $jenis_id);
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status', $status);
            })
            ->when($request->tanggal, function ($q, $tanggal) {
                $q->whereDate('tanggal_pengajuan', $tanggal);
            })
            ->latest();

        // 2. LOGIKA EXPORT
        if ($request->export === 'excel') {
            return \Maatwebsite\Excel\Facades\Excel::download(
                new \App\Exports\PengajuanSuratExport($query->get()),
                'Data-Pengajuan-Surat-' . now()->format('Y-m-d') . '.xlsx'
            );
        }

        if ($request->export === 'pdf') {
            $data = $query->get();
            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('admin.pengajuan-surat.pdf', compact('data'));
            return $pdf->download('Rekap-Pengajuan-Surat.pdf');
        }

        // 3. LOGIKA TAMPILAN BIASA (Pagination)
        $pengajuanSurat = $query->paginate(10)->withQueryString();
        $listJenisSurat = JenisSurat::where('is_active', true)->orderBy('nama')->get();

        return view('admin.pengajuan-surat.index', compact('pengajuanSurat', 'listJenisSurat'));
    }

    public function create()
    {
        // Ambil data penduduk untuk dropdown pemohon
        $listPenduduk = \App\Models\Penduduk::orderBy('nama_lengkap', 'asc')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->id => $item->nik . ' - ' . $item->nama_lengkap];
            })
            ->prepend('Pilih Warga / Pemohon', '');

        // Ambil jenis surat
        $jenisSurat = \App\Models\JenisSurat::all();

        return view('admin.pengajuan-surat.create', compact('listPenduduk', 'jenisSurat'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Ganti nama_pemohon & nik menjadi penduduk_id
            'penduduk_id' => ['required', 'exists:penduduk,id'],
            'jenis_surat_id' => ['required', 'exists:jenis_surat,id'],
            'keperluan' => ['required', 'string'],
            'dokumen_pendukung' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],
            'tanggal_pengajuan' => ['required', 'date'],
        ]);

        $jenisSurat = JenisSurat::findOrFail($validated['jenis_surat_id']);

        // Logika tambahan untuk data otomatis
        $validated['user_id'] = auth()->id();
        $validated['jenis_surat_nama'] = $jenisSurat->nama;
        $validated['nomor_pengajuan'] = 'SR-' . now()->format('Ymd') . '-' . strtoupper(\Illuminate\Support\Str::random(5));
        $validated['status'] = 'Menunggu';

        // Handle upload file
        if ($request->hasFile('dokumen_pendukung')) {
            $validated['dokumen_pendukung'] = $request->file('dokumen_pendukung')->store('dokumen-surat', 'public');
        }

        PengajuanSurat::create($validated);

        return redirect()->route('admin.pengajuan-surat.index')
            ->with('status', 'Pengajuan surat berhasil ditambahkan.');
    }

    public function show(int $id): View
    {
        $surat = PengajuanSurat::with(['penduduk', 'jenisSurat', 'lampiran', 'riwayatStatus'])->findOrFail($id);

        return view('admin.pengajuan-surat.show', compact('surat'));
    }

    public function verifikasi(int $id): View
    {
        $surat = PengajuanSurat::findOrFail($id);

        return view('admin.pengajuan-surat.verifikasi', compact('surat'));
    }

    public function updateVerifikasi(Request $request, int $id): RedirectResponse
    {
        $surat = PengajuanSurat::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'in:Menunggu,Diproses,Selesai,Ditolak'],
            'catatan_operator' => ['nullable', 'string'],
        ]);

        if ($validated['status'] === 'Selesai') {
            $validated['tanggal_pengesahan'] = now()->toDateString();
        }

        $surat->update($validated);

        return redirect()->route('admin.pengajuan-surat.show', $surat->id)->with('status', 'Status pengajuan berhasil diperbarui.');
    }

    public function cetak(int $id): View
    {
        $surat = PengajuanSurat::with(['penduduk', 'jenisSurat'])->findOrFail($id);

        return view('admin.pengajuan-surat.cetak', compact('surat'));
    }

    public function destroy(int $id)
    {
        $surat = PengajuanSurat::findOrFail($id);

        // Hapus file fisik jika ada
        if ($surat->dokumen_pendukung) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($surat->dokumen_pendukung);
        }

        $surat->delete();

        return redirect()->route('admin.pengajuan-surat.index')
            ->with('status', 'Pengajuan surat berhasil dihapus.');
    }
}