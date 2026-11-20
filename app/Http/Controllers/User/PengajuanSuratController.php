<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\JenisSurat;
use App\Models\PengajuanSurat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PengajuanSuratController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Ambil data pengajuan milik user login
        $query = PengajuanSurat::with(['jenisSurat', 'penduduk'])
            ->where('user_id', $user->id);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nomor_pengajuan', 'like', "%{$search}%")
                  ->orWhere('keperluan', 'like', "%{$search}%")
                  ->orWhere('jenis_surat_nama', 'like', "%{$search}%");
            });
        }

        $surat = $query->latest()->paginate(10)->withQueryString();

        // 2. Response JSON untuk Next.js / Axios
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($surat);
        }

        return view('user.pengajuan-surat.index', compact('surat'));
    }

    public function create(Request $request)
    {
        $penduduk = $request->user()->penduduk;
        $jenisSurat = JenisSurat::where('is_active', true)
            ->orderBy('nama')
            ->get();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'jenisSurat' => $jenisSurat,
                'penduduk' => $penduduk
            ]);
        }

        return view('user.pengajuan-surat.create', compact('jenisSurat', 'penduduk'));
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $penduduk = $user->penduduk;

        if (!$penduduk) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Data kependudukan belum tersedia. Lengkapi profil terlebih dahulu.'
                ], 422);
            }

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
            $this->mirrorFile($data['dokumen_pendukung']);
        }

        $pengajuan = PengajuanSurat::create($data);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Pengajuan surat berhasil dibuat.',
                'data' => $pengajuan
            ], 201);
        }

        return redirect()
            ->route('user.pengajuan-surat.index')
            ->with('status', 'Pengajuan surat berhasil dibuat.');
    }

    public function show(Request $request, int $id)
    {
        $surat = PengajuanSurat::with(['jenisSurat', 'penduduk'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'surat' => $surat,
                'data' => $surat,
            ]);
        }

        return view('user.pengajuan-surat.show', compact('surat'));
    }

    public function download(Request $request, int $id)
    {
        $surat = PengajuanSurat::where('user_id', $request->user()->id)
            ->findOrFail($id);

        if (!$surat->file_hasil_surat) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'File hasil surat belum tersedia.'], 404);
            }
            return back()->with('error', 'File hasil surat belum tersedia.');
        }

        $relativePath = ltrim($surat->file_hasil_surat, '/');
        $filename = basename($relativePath);
        $candidates = [
            storage_path('app/public/' . $relativePath),
            public_path('storage/' . $relativePath),
            storage_path('app/public/hasil-surat/' . $filename),
            public_path('storage/hasil-surat/' . $filename),
            base_path('storage/' . $relativePath),
            base_path('public_html/storage/' . $relativePath),
            storage_path('app/' . $relativePath),
        ];

        foreach ($candidates as $cand) {
            if ($cand && file_exists($cand) && is_file($cand)) {
                return response()->download($cand, $filename);
            }
        }

        if (Storage::disk('public')->exists($relativePath)) {
            return Storage::disk('public')->download($relativePath);
        }

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json(['message' => 'File tidak ditemukan di penyimpanan server.'], 404);
        }
        return back()->with('error', 'File hasil surat tidak ditemukan di penyimpanan server.');
    }

    /**
     * Otomatis salin berkas dari storage/app/public ke public storage folder (kompatibilitas shared hosting)
     */
    private function mirrorFile(?string $relativePath): void
    {
        if (!$relativePath) return;

        $sourceCandidates = [
            storage_path('app/public/' . $relativePath),
            public_path('storage/' . $relativePath),
            storage_path('app/' . $relativePath),
            base_path('storage/' . $relativePath),
        ];

        $source = null;
        foreach ($sourceCandidates as $cand) {
            if ($cand && file_exists($cand) && is_file($cand)) {
                $source = $cand;
                break;
            }
        }

        if (!$source) return;

        $destCandidates = [
            public_path('storage/' . $relativePath),
            base_path('storage/' . $relativePath),
            base_path('public_html/storage/' . $relativePath),
            base_path('../public_html/storage/' . $relativePath),
            isset($_SERVER['DOCUMENT_ROOT']) ? ($_SERVER['DOCUMENT_ROOT'] . '/storage/' . $relativePath) : null,
        ];

        foreach ($destCandidates as $dest) {
            if (!$dest || $dest === $source) continue;
            try {
                $parent = dirname($dest);
                if (!file_exists($parent)) {
                    @mkdir($parent, 0775, true);
                }
                @copy($source, $dest);
            } catch (\Throwable $e) {}
        }
    }
}