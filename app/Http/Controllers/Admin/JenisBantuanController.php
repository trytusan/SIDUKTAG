<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bantuan; // Menggunakan model Bantuan
use Illuminate\Http\Request;

class JenisBantuanController extends Controller
{
    public function index(Request $request)
    {
        $jenisBantuan = Bantuan::query()
            ->when($request->search, function ($q, $search) {
                $q->where('nama_program', 'like', "%{$search}%")
                  ->orWhere('jenis_bantuan', 'like', "%{$search}%")
                  ->orWhere('sumber_bantuan', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return view('admin.jenis-bantuan.index', compact('jenisBantuan'));
    }

    public function create()
    {
        return view('admin.jenis-bantuan.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_program' => 'required|string|max:255',
            'jenis_bantuan' => 'required|string',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'status_bantuan' => 'required|in:Aktif,Nonaktif,Selesai',
            'kuota_penerima' => 'nullable|integer',
            'sumber_bantuan' => 'nullable|string',
        ]);

        Bantuan::create($validated);

        return redirect()->route('admin.jenis-bantuan.index')
            ->with('status', 'Program bantuan berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $jenisBantuan = Bantuan::findOrFail($id);
        return view('admin.jenis-bantuan.edit', compact('jenisBantuan'));
    }

    public function update(Request $request, $id)
    {
        $jenisBantuan = Bantuan::findOrFail($id);
        
        $validated = $request->validate([
            'nama_program' => 'required|string|max:255',
            'jenis_bantuan' => 'required|string',
            'status_bantuan' => 'required|in:Aktif,Nonaktif,Selesai',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date',
            'kuota_penerima' => 'nullable|integer',
            'sumber_bantuan' => 'nullable|string',
            'deskripsi' => 'nullable|string',
        ]);

        $jenisBantuan->update($validated);

        return redirect()->route('admin.jenis-bantuan.index')
            ->with('status', 'Program bantuan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        Bantuan::destroy($id);
        return redirect()->route('admin.jenis-bantuan.index')
            ->with('status', 'Program bantuan berhasil dihapus.');
    }
}