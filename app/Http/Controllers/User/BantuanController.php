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
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Warga hanya dapat melihat daftar bantuan sosial dan tidak dapat membuat atau mengajukan bantuan.'
            ], 403);
        }

        return redirect()->route('user.bantuan.index')->with('error', 'Warga hanya dapat melihat daftar bantuan sosial.');
    }

    public function store(Request $request)
    {
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Warga tidak dapat mengajukan atau menambahkan bantuan sosial secara mandiri. Penetapan penerima dilakukan oleh Pemerintah Desa.'
            ], 403);
        }

        return redirect()->route('user.bantuan.index')->with('error', 'Warga tidak dapat mengajukan bantuan sosial secara mandiri.');
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
            return response()->json([
                'bantuan' => $bantuan,
                'data' => $bantuan,
            ]);
        }

        return view('user.bantuan.show', compact('bantuan'));
    }
}