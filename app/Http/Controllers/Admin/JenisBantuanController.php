<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bantuan;
use Illuminate\Http\Request;

class JenisBantuanController extends Controller
{
    public function index(Request $request)
    {
        $query = Bantuan::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_program', 'like', "%{$search}%")
                  ->orWhere('jenis_bantuan', 'like', "%{$search}%")
                  ->orWhere('sumber_bantuan', 'like', "%{$search}%");
            });
        }

        $jenisBantuan = $query->latest()->paginate(10)->withQueryString();

        // Kembalikan pagination langsung sebagai JSON agar cocok dengan res.data di Next.js
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($jenisBantuan);
        }

        return view('admin.jenis-bantuan.index', compact('jenisBantuan'));
    }

    public function create()
    {
        return view('admin.jenis-bantuan.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_program'   => 'required|string|max:255',
            'jenis_bantuan'  => 'required|string',
            'deskripsi'      => 'nullable|string',
            'tanggal_mulai'  => 'nullable|date',
            'tanggal_selesai'=> 'nullable|date',
            'status_bantuan' => 'required|in:Aktif,Nonaktif,Selesai',
            'kuota_penerima' => 'nullable|integer',
            'sumber_bantuan' => 'nullable|string',
        ]);

        $bantuan = Bantuan::create($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Program bantuan berhasil ditambahkan.',
                'data'    => $bantuan
            ], 201);
        }

        return redirect()->route('admin.jenis-bantuan.index')
            ->with('status', 'Program bantuan berhasil ditambahkan.');
    }

    public function show(Request $request, $id)
    {
        $jenisBantuan = Bantuan::findOrFail($id);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($jenisBantuan);
        }

        return view('admin.jenis-bantuan.show', compact('jenisBantuan'));
    }

    public function edit(Request $request, $id)
    {
        $jenisBantuan = Bantuan::findOrFail($id);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($jenisBantuan);
        }

        return view('admin.jenis-bantuan.edit', compact('jenisBantuan'));
    }

    public function update(Request $request, $id)
    {
        $jenisBantuan = Bantuan::findOrFail($id);

        $validated = $request->validate([
            'nama_program'   => 'required|string|max:255',
            'jenis_bantuan'  => 'required|string',
            'status_bantuan' => 'required|in:Aktif,Nonaktif,Selesai',
            'tanggal_mulai'  => 'nullable|date',
            'tanggal_selesai'=> 'nullable|date',
            'kuota_penerima' => 'nullable|integer',
            'sumber_bantuan' => 'nullable|string',
            'deskripsi'      => 'nullable|string',
        ]);

        $jenisBantuan->update($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Program bantuan berhasil diperbarui.',
                'data'    => $jenisBantuan
            ]);
        }

        return redirect()->route('admin.jenis-bantuan.index')
            ->with('status', 'Program bantuan berhasil diperbarui.');
    }

    public function destroy(Request $request, $id)
    {
        $bantuan = Bantuan::findOrFail($id);
        $bantuan->delete();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Program bantuan berhasil dihapus.'
            ]);
        }

        return redirect()->route('admin.jenis-bantuan.index')
            ->with('status', 'Program bantuan berhasil dihapus.');
    }
}