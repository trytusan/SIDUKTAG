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

        $pengajuanSurat = $query->paginate(10)->withQueryString();
        $listJenisSurat = JenisSurat::where('is_active', true)->orderBy('nama')->get();

        if ($request->expectsJson()) {
            return response()->json([
                'pengajuanSurat' => $pengajuanSurat,
                'listJenisSurat' => $listJenisSurat,
                'stats' => [
                    'total' => PengajuanSurat::count(),
                    'menunggu' => PengajuanSurat::where('status', 'Menunggu')->count(),
                    'diproses' => PengajuanSurat::where('status', 'Diproses')->count(),
                    'selesai' => PengajuanSurat::where('status', 'Selesai')->count(),
                ],
            ]);
        }

        return view('admin.pengajuan-surat.index', compact('pengajuanSurat', 'listJenisSurat'));
    }

    public function create()
    {
        $listPenduduk = \App\Models\Penduduk::orderBy('nama_lengkap', 'asc')
            ->get(['id', 'nama_lengkap', 'nik']);

        $jenisSurat = \App\Models\JenisSurat::where('is_active', true)->get();

        if (request()->expectsJson()) {
            return response()->json([
                'penduduk' => $listPenduduk,
                'jenisSurat' => $jenisSurat,
            ]);
        }

        $listPendudukMap = $listPenduduk->mapWithKeys(function ($item) {
            return [$item->id => $item->nik . ' - ' . $item->nama_lengkap];
        })->prepend('Pilih Warga / Pemohon', '');

        return view('admin.pengajuan-surat.create', ['listPenduduk' => $listPendudukMap, 'jenisSurat' => $jenisSurat]);
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'penduduk_id' => ['required', 'exists:penduduk,id'],
            'jenis_surat_id' => ['required', 'exists:jenis_surat,id'],
            'keperluan' => ['required', 'string'],
            'dokumen_pendukung' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],
            'tanggal_pengajuan' => ['nullable', 'date'],
        ]);

        $penduduk = \App\Models\Penduduk::findOrFail($validated['penduduk_id']);
        $jenisSurat = JenisSurat::findOrFail($validated['jenis_surat_id']);

        $validated['user_id'] = $penduduk->user_id ?? auth()->id();
        $validated['nama_pemohon'] = $penduduk->nama_lengkap;
        $validated['nik'] = $penduduk->nik;
        $validated['jenis_surat_nama'] = $jenisSurat->nama;
        $validated['nomor_pengajuan'] = 'SR-' . now()->format('Ymd') . '-' . strtoupper(\Illuminate\Support\Str::random(5));
        $validated['status'] = 'Menunggu';
        $validated['tanggal_pengajuan'] = $validated['tanggal_pengajuan'] ?? now()->toDateString();

        if ($request->hasFile('dokumen_pendukung')) {
            $validated['dokumen_pendukung'] = $request->file('dokumen_pendukung')->store('dokumen-surat', 'public');
        }

        $surat = PengajuanSurat::create($validated);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Pengajuan surat berhasil ditambahkan.',
                'data' => $surat,
            ], 201);
        }

        return redirect()->route('admin.pengajuan-surat.index')
            ->with('status', 'Pengajuan surat berhasil ditambahkan.');
    }

    public function show(int $id): \Illuminate\Http\JsonResponse|View
    {
        $surat = PengajuanSurat::with(['penduduk', 'jenisSurat', 'lampiran', 'riwayatStatus'])->findOrFail($id);

        if (request()->expectsJson()) {
            return response()->json(['pengajuanSurat' => $surat]);
        }

        return view('admin.pengajuan-surat.show', compact('surat'));
    }

    public function verifikasi(int $id): \Illuminate\Http\JsonResponse|View
    {
        $surat = PengajuanSurat::with(['penduduk', 'jenisSurat'])->findOrFail($id);

        if (request()->expectsJson()) {
            return response()->json(['pengajuanSurat' => $surat]);
        }

        return view('admin.pengajuan-surat.verifikasi', compact('surat'));
    }

    public function updateVerifikasi(Request $request, int $id): \Illuminate\Http\JsonResponse|RedirectResponse
    {
        $surat = PengajuanSurat::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'in:Menunggu,Diproses,Selesai,Ditolak'],
            'catatan_operator' => ['nullable', 'string'],
            'file_hasil_surat' => ['nullable', 'file', 'mimes:pdf,docx,jpg,jpeg,png', 'max:4096'],
        ]);

        if ($request->hasFile('file_hasil_surat')) {
            $validated['file_hasil_surat'] = $request->file('file_hasil_surat')->store('hasil-surat', 'public');
        }

        if ($validated['status'] === 'Selesai') {
            $validated['tanggal_pengesahan'] = now()->toDateString();
        }

        $surat->update($validated);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Status pengajuan berhasil diperbarui.',
                'surat' => $surat->fresh(['penduduk', 'jenisSurat']),
            ]);
        }

        return redirect()->route('admin.pengajuan-surat.show', $surat->id)->with('status', 'Status pengajuan berhasil diperbarui.');
    }

    public function cetak(int $id): \Illuminate\Http\JsonResponse|View
    {
        $surat = PengajuanSurat::with(['penduduk', 'jenisSurat'])->findOrFail($id);

        if (request()->expectsJson()) {
            return response()->json(['pengajuanSurat' => $surat]);
        }

        return view('admin.pengajuan-surat.cetak', compact('surat'));
    }

    public function destroy(int $id): \Illuminate\Http\JsonResponse|RedirectResponse
    {
        $surat = PengajuanSurat::findOrFail($id);

        if ($surat->dokumen_pendukung) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($surat->dokumen_pendukung);
        }

        if ($surat->file_hasil_surat) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($surat->file_hasil_surat);
        }

        $surat->delete();

        if (request()->expectsJson()) {
            return response()->json(['message' => 'Pengajuan surat berhasil dihapus.']);
        }

        return redirect()->route('admin.pengajuan-surat.index')
            ->with('status', 'Pengajuan surat berhasil dihapus.');
    }
}