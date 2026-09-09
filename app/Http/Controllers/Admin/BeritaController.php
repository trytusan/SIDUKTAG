<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BeritaController extends Controller
{
    /**
     * Tampilkan daftar berita & informasi beserta statistik.
     */
    public function index(Request $request)
    {
        $query = Berita::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('penulis', 'like', "%{$search}%")
                  ->orWhere('ringkasan', 'like', "%{$search}%");
            });
        }

        if ($request->filled('kategori') && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('status') && $request->status !== 'Semua') {
            $query->where('status', $request->status);
        }

        $berita = $query->latest('tanggal_publikasi')->latest('id')->get();

        $stats = [
            'total' => Berita::count(),
            'published' => Berita::where('status', 'Published')->count(),
            'draft' => Berita::where('status', 'Draft')->count(),
            'views' => (int) Berita::sum('views'),
        ];

        if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
            return response()->json([
                'berita' => $berita,
                'stats' => $stats,
            ]);
        }

        return view('admin.berita.index', compact('berita', 'stats'));
    }

    /**
     * Simpan publikasi berita baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:berita,slug'],
            'kategori' => ['required', 'string', 'max:100'],
            'ringkasan' => ['required', 'string'],
            'konten' => ['required', 'string'],
            'gambar' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:Published,Draft,Archived'],
            'penulis' => ['nullable', 'string', 'max:100'],
            'tanggal_publikasi' => ['required', 'date'],
        ]);

        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['judul']);
            $slug = $baseSlug;
            $counter = 1;
            while (Berita::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        if (empty($validated['penulis'])) {
            $validated['penulis'] = auth()->user()->name ?? 'Admin Administrator';
        }

        $berita = Berita::create($validated);

        if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
            return response()->json([
                'message' => 'Berita berhasil disimpan dan dipublikasikan.',
                'berita' => $berita,
            ], 201);
        }

        return redirect()->route('admin.berita.index')->with('status', 'Berita berhasil dipublikasikan.');
    }

    /**
     * Tampilkan detail berita dan tambah hit counter views.
     */
    public function show(Request $request, $id)
    {
        $berita = is_numeric($id)
            ? Berita::findOrFail($id)
            : Berita::where('slug', $id)->firstOrFail();

        // Increment views
        $berita->increment('views');

        if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
            return response()->json([
                'berita' => $berita,
            ]);
        }

        return view('admin.berita.show', compact('berita'));
    }

    /**
     * Perbarui data berita.
     */
    public function update(Request $request, $id)
    {
        $berita = Berita::findOrFail($id);

        $validated = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:berita,slug,' . $berita->id],
            'kategori' => ['required', 'string', 'max:100'],
            'ringkasan' => ['required', 'string'],
            'konten' => ['required', 'string'],
            'gambar' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', 'in:Published,Draft,Archived'],
            'penulis' => ['nullable', 'string', 'max:100'],
            'tanggal_publikasi' => ['required', 'date'],
        ]);

        $berita->update($validated);

        if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
            return response()->json([
                'message' => 'Berita berhasil diperbarui.',
                'berita' => $berita,
            ]);
        }

        return redirect()->route('admin.berita.index')->with('status', 'Berita berhasil diperbarui.');
    }

    /**
     * Hapus artikel berita.
     */
    public function destroy(Request $request, $id)
    {
        $berita = Berita::findOrFail($id);
        $berita->delete();

        if ($request->wantsJson() || $request->is('api/*') || $request->ajax()) {
            return response()->json([
                'message' => 'Berita berhasil dihapus.',
            ]);
        }

        return redirect()->route('admin.berita.index')->with('status', 'Berita berhasil dihapus.');
    }
}

