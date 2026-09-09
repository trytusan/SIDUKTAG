<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JenisSurat;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class JenisSuratController extends Controller
{
    public function index(Request $request)
    {
        // 1. Ambil data dengan query builder agar bisa difilter
        $query = JenisSurat::query();

        // 2. Logika Pencarian
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // 3. Eksekusi Pagination
        $jenisSurat = $query->latest()->paginate(10)->withQueryString();

        // 4. Response JSON untuk Next.js
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'jenisSurat' => $jenisSurat
            ]);
        }

        // 5. Response View untuk Blade
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
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:jenis_surat,nama',
            'deskripsi' => 'nullable|string',
            'template_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,docx|max:2048',
        ]);

        $validated['slug'] = Str::slug($request->nama);
        $validated['is_active'] = $request->has('is_active') ? $request->boolean('is_active') : true;

        if ($request->hasFile('template_file')) {
            $validated['template_file'] = $request->file('template_file')->store('templates', 'public');
        }

        $jenisSurat = JenisSurat::create($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Jenis surat baru berhasil ditambahkan!',
                'data' => $jenisSurat
            ], 201);
        }

        return redirect()->route('admin.jenis-surat.index')
            ->with('status', 'Jenis surat baru berhasil ditambahkan!');
    }

    public function show(Request $request, $id)
    {
        $jenisSurat = JenisSurat::findOrFail($id);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'jenisSurat' => $jenisSurat
            ]);
        }

        return view('admin.jenis-surat.show', compact('jenisSurat'));
    }

    public function edit(Request $request, $id)
    {
        $jenisSurat = JenisSurat::findOrFail($id);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'jenisSurat' => $jenisSurat
            ]);
        }

        return view('admin.jenis-surat.edit', compact('jenisSurat'));
    }

    public function update(Request $request, $id)
    {
        $jenisSurat = JenisSurat::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:jenis_surat,nama,' . $id,
            'deskripsi' => 'nullable|string',
            'template_file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,docx|max:2048',
        ]);

        $data = [
            'nama' => $validated['nama'],
            'slug' => Str::slug($validated['nama']),
            'deskripsi' => $validated['deskripsi'] ?? null,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $jenisSurat->is_active,
        ];

        if ($request->hasFile('template_file')) {
            if ($jenisSurat->template_file) {
                Storage::disk('public')->delete($jenisSurat->template_file);
            }
            $data['template_file'] = $request->file('template_file')->store('templates', 'public');
        }

        $jenisSurat->update($data);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Jenis surat "' . $jenisSurat->nama . '" berhasil diperbarui.',
                'data' => $jenisSurat
            ]);
        }

        return redirect()->route('admin.jenis-surat.index')
            ->with('status', 'Jenis surat "' . $jenisSurat->nama . '" berhasil diperbarui.');
    }

    public function destroy(Request $request, $id)
    {
        $jenis = JenisSurat::findOrFail($id);

        // Cek relasi jika relasi pengajuanSurat didefinisikan di Model
        if (method_exists($jenis, 'pengajuanSurat') && $jenis->pengajuanSurat()->exists()) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Tidak bisa menghapus! Jenis surat ini sedang digunakan dalam pengajuan.'
                ], 422);
            }
            return redirect()->back()->with('error', 'Tidak bisa menghapus! Jenis surat ini sedang digunakan dalam pengajuan.');
        }

        if ($jenis->template_file) {
            Storage::disk('public')->delete($jenis->template_file);
        }

        $jenis->delete();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Jenis surat berhasil dihapus.'
            ]);
        }

        return redirect()->route('admin.jenis-surat.index')
            ->with('status', 'Jenis surat berhasil dihapus.');
    }
}