<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\JenisSurat;
use App\Models\PengajuanSurat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PengajuanSuratController extends Controller
{
    public function index(Request $request): View
    {
        $surat = PengajuanSurat::with(['jenisSurat', 'penduduk'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return view('user.pengajuan-surat.index', compact('surat'));
    }

    public function create(Request $request): View
    {
        $penduduk = $request->user()->penduduk;
        $jenisSurat = JenisSurat::where('is_active', true)
            ->orderBy('nama')
            ->get();

        return view('user.pengajuan-surat.create', compact('jenisSurat', 'penduduk'));
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $penduduk = $user->penduduk;

        if (!$penduduk) {
            return redirect()
                ->route('user.pengaturan.profil')
                ->with('error', 'Data penduduk belum tersedia. Lengkapi profil terlebih dahulu.');
        }

        $validated = $request->validate([
            'jenis_surat_id' => ['required', 'exists:jenis_surat,id'],
            'keperluan' => ['required', 'string'],
            'dokumen_pendukung' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],
        ], [
            'jenis_surat_id.required' => 'Jenis surat wajib dipilih.',
            'jenis_surat_id.exists' => 'Jenis surat tidak valid.',
            'keperluan.required' => 'Keperluan wajib diisi.',
            'dokumen_pendukung.mimes' => 'Dokumen pendukung harus berupa jpg, jpeg, png, atau pdf.',
            'dokumen_pendukung.max' => 'Ukuran dokumen pendukung maksimal 4 MB.',
        ]);

        $jenisSurat = JenisSurat::findOrFail($validated['jenis_surat_id']);

        $data = [
            'user_id' => $user->id,
            'penduduk_id' => $penduduk->id,
            'jenis_surat_id' => $jenisSurat->id,
            'nomor_pengajuan' => 'SR-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5)),
            'nama_pemohon' => $penduduk->nama_lengkap,
            'nik' => $penduduk->nik,
            'jenis_surat_nama' => $jenisSurat->nama,
            'keperluan' => $validated['keperluan'],
            'tanggal_pengajuan' => now()->toDateString(),
            'status' => 'Menunggu',
        ];

        if ($request->hasFile('dokumen_pendukung')) {
            $data['dokumen_pendukung'] = $request->file('dokumen_pendukung')
                ->store('dokumen-surat', 'public');
        }

        PengajuanSurat::create($data);

        return redirect()
            ->route('user.pengajuan-surat.index')
            ->with('status', 'Pengajuan surat berhasil dibuat.');
    }

    public function show(Request $request, int $id): View
    {
        $surat = PengajuanSurat::with(['jenisSurat', 'penduduk', 'lampiran', 'riwayatStatus'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return view('user.pengajuan-surat.show', compact('surat'));
    }

    public function download(Request $request, int $id): StreamedResponse|RedirectResponse
    {
        $surat = PengajuanSurat::where('user_id', $request->user()->id)
            ->findOrFail($id);

        if (!$surat->file_hasil_surat) {
            return back()->with('error', 'File hasil surat belum tersedia.');
        }

        if (!Storage::disk('public')->exists($surat->file_hasil_surat)) {
            return back()->with('error', 'File hasil surat tidak ditemukan di penyimpanan.');
        }

        return Storage::disk('public')->download($surat->file_hasil_surat);
    }
}