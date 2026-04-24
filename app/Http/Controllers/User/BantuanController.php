<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Bantuan;
use App\Models\BantuanPenerima;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BantuanController extends Controller
{
    public function index(Request $request): View
    {
        $pendudukId = $request->user()->penduduk?->id;

        $bantuan = BantuanPenerima::with(['bantuan', 'penduduk'])
            ->where('penduduk_id', $pendudukId)
            ->latest()
            ->paginate(10);

        return view('user.bantuan.index', compact('bantuan'));
    }

    public function create(): View
    {
        $programBantuan = Bantuan::where('status_bantuan', 'Aktif')->get();

        return view('user.bantuan.create', compact('programBantuan'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bantuan_id' => ['required', 'exists:bantuan,id'],
            'catatan' => ['nullable', 'string'],
        ]);

        $penduduk = $request->user()->penduduk;

        if (!$penduduk) {
            return back()->with('error', 'Data penduduk belum tersedia.');
        }

        BantuanPenerima::create([
            'bantuan_id' => $validated['bantuan_id'],
            'penduduk_id' => $penduduk->id,
            'tanggal_menerima' => null,
            'status_penerima' => 'Menunggu',
            'catatan' => $validated['catatan'] ?? null,
        ]);

        return redirect()
            ->route('user.bantuan.index')
            ->with('status', 'Pengajuan bantuan berhasil dikirim.');
    }

    public function show(Request $request, int $id): View
    {
        $pendudukId = $request->user()->penduduk?->id;

        $bantuan = BantuanPenerima::with(['bantuan', 'penduduk'])
            ->where('penduduk_id', $pendudukId)
            ->findOrFail($id);

        return view('user.bantuan.show', compact('bantuan'));
    }
}