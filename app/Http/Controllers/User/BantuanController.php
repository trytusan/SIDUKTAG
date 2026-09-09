<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Bantuan;
use App\Models\BantuanPenerima;
use App\Models\Penduduk;
use Illuminate\Http\Request;

class BantuanController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Cari ID penduduk dari relasi akun atau fallback berdasarkan user_id/NIK
        $penduduk = $user->penduduk ?? Penduduk::where('user_id', $user->id)
            ->orWhere('nik', $user->nik ?? null)
            ->first();
            
        $pendudukId = $penduduk?->id;

        $bantuan = BantuanPenerima::with(['bantuan', 'penduduk'])
            ->where('penduduk_id', $pendudukId)
            ->latest()
            ->paginate(10);

        // Response JSON untuk Next.js / Axios
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($bantuan);
        }

        return view('user.bantuan.index', compact('bantuan'));
    }

    public function create(Request $request)
    {
        $programBantuan = Bantuan::where('status_bantuan', 'Aktif')->get();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'programBantuan' => $programBantuan
            ]);
        }

        return view('user.bantuan.create', compact('programBantuan'));
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $penduduk = $user->penduduk ?? Penduduk::where('user_id', $user->id)
            ->orWhere('nik', $user->nik ?? null)
            ->first();

        if (!$penduduk) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Data penduduk belum tersedia. Lengkapi profil terlebih dahulu.'
                ], 422);
            }
            return back()->with('error', 'Data penduduk belum tersedia.');
        }

        $validated = $request->validate([
            'bantuan_id' => ['required', 'exists:bantuan,id'],
            'catatan'    => ['nullable', 'string'],
        ]);

        $penerima = BantuanPenerima::create([
            'bantuan_id'       => $validated['bantuan_id'],
            'penduduk_id'      => $penduduk->id,
            'tanggal_menerima' => null,
            'status_penerima'  => 'Menunggu',
            'catatan'          => $validated['catatan'] ?? null,
        ]);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Pengajuan bantuan berhasil dikirim.',
                'data'    => $penerima
            ], 201);
        }

        return redirect()
            ->route('user.bantuan.index')
            ->with('status', 'Pengajuan bantuan berhasil dikirim.');
    }

    public function show(Request $request, int $id)
    {
        $user = $request->user();
        $penduduk = $user->penduduk ?? Penduduk::where('user_id', $user->id)
            ->orWhere('nik', $user->nik ?? null)
            ->first();
            
        $pendudukId = $penduduk?->id;

        $bantuan = BantuanPenerima::with(['bantuan', 'penduduk'])
            ->where('penduduk_id', $pendudukId)
            ->findOrFail($id);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($bantuan);
        }

        return view('user.bantuan.show', compact('bantuan'));
    }
}