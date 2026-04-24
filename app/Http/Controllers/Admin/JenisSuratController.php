<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JenisSurat;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class JenisSuratController extends Controller
{
    public function index(Request $request)
    {
        // 1. Ambil data dengan query builder agar bisa difilter
        $jenisSurat = \App\Models\JenisSurat::query()
            // 2. Logika Pencarian (Search)
            ->when($request->search, function ($query, $search) {
                $query->where('nama', 'like', "%{$search}%")
                    ->orWhere('deskripsi', 'like', "%{$search}%");
            })
            // 3. Urutkan dari yang terbaru
            ->latest()
            // 4. Pagination (10 data per halaman)
            ->paginate(10)
            // 5. Penting: Jaga agar parameter pencarian tetap ada saat pindah halaman
            ->withQueryString();

        // 6. Kirim ke View
        return view('admin.jenis-surat.index', [
            'jenisSurat' => $jenisSurat,
            'pageTitle' => 'Manajemen Jenis Surat'
        ]);
    }

    public function create()
    {
        return view('admin.jenis-surat.create');
    }

    public function store(Request $request)
    {
        // 1. Validasi input sesuai dengan atribut 'name' di partials/form.blade.php
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:jenis_surat,nama',
            'deskripsi' => 'nullable|string',
        ]);

        // 2. Generate slug otomatis dari nama surat
        $validated['slug'] = \Illuminate\Support\Str::slug($request->nama);

        // 3. Set status default menjadi aktif
        $validated['is_active'] = true;

        // 4. Simpan ke database
        \App\Models\JenisSurat::create($validated);

        // 5. Redirect kembali ke index dengan pesan sukses
        return redirect()->route('admin.jenis-surat.index')
            ->with('status', 'Jenis surat baru berhasil ditambahkan!');
    }
    public function edit($id)
    {
        $jenisSurat = JenisSurat::findOrFail($id);
        return view('admin.jenis-surat.edit', compact('jenisSurat'));
    }

    public function update(Request $request, $id)
    {
        // 1. Validasi input
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:jenis_surat,nama,' . $id,
            'deskripsi' => 'nullable|string',
        ]);

        // 2. Cari data yang akan diupdate
        $jenisSurat = \App\Models\JenisSurat::findOrFail($id);

        // 3. Update data
        $jenisSurat->update([
            'nama' => $validated['nama'],
            'slug' => \Illuminate\Support\Str::slug($validated['nama']),
            'deskripsi' => $validated['deskripsi'],
            // Checkbox is_active hanya akan ada di request jika dicentang
            'is_active' => $request->has('is_active') ? true : false,
        ]);

        // 4. Redirect ke index dengan pesan sukses
        return redirect()->route('admin.jenis-surat.index')
            ->with('status', 'Jenis surat "' . $jenisSurat->nama . '" berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $jenis = \App\Models\JenisSurat::findOrFail($id);

        // Opsional: Cek apakah jenis surat ini sedang digunakan oleh data pengajuan
        if ($jenis->pengajuanSurat()->exists()) {
            return redirect()->back()->with('error', 'Tidak bisa menghapus! Jenis surat ini sedang digunakan dalam pengajuan.');
        }

        $jenis->delete();

        return redirect()->route('admin.jenis-surat.index')
            ->with('status', 'Jenis surat berhasil dihapus.');
    }
}