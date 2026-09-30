<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Formulir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FormulirController extends Controller
{
    public function index(Request $request)
    {
        $query = Formulir::with('creator')->latest('id');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_formulir', 'like', "%{$search}%")
                  ->orWhere('kode_formulir', 'like', "%{$search}%")
                  ->orWhere('kategori', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }

        if ($request->filled('kategori') && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = $request->query('per_page', 15);
        $formulirList = $query->paginate($perPage);

        $totalFormulir = Formulir::count();
        $totalDownload = Formulir::sum('download_count');
        $totalAktif = Formulir::where('is_active', true)->count();
        $kategoriList = Formulir::select('kategori')->distinct()->pluck('kategori');

        return response()->json([
            'success' => true,
            'data' => $formulirList,
            'stats' => [
                'total_formulir' => $totalFormulir,
                'total_download' => (int) $totalDownload,
                'total_aktif' => $totalAktif,
                'kategori_list' => $kategoriList,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_formulir' => 'required|string|max:255',
            'kode_formulir' => 'nullable|string|max:50',
            'kategori' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
            'persyaratan' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'file_template' => 'required|file|mimes:doc,docx,pdf|max:10240',
        ]);

        $file = $request->file('file_template');
        $extension = strtolower($file->getClientOriginalExtension());
        $fileSize = $file->getSize();

        $path = $file->store('formulir/templates', 'public');

        $formulir = Formulir::create([
            'nama_formulir' => $validated['nama_formulir'],
            'kode_formulir' => $validated['kode_formulir'] ?? null,
            'kategori' => $validated['kategori'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'persyaratan' => $validated['persyaratan'] ?? null,
            'file_template' => $path,
            'file_format' => $extension,
            'file_size' => $fileSize,
            'download_count' => 0,
            'is_active' => $request->has('is_active') ? filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN) : true,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Template formulir berhasil ditambahkan.',
            'data' => $formulir,
        ], 201);
    }

    public function show(string $id)
    {
        $formulir = Formulir::with('creator')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $formulir,
            'formulir' => $formulir,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $formulir = Formulir::findOrFail($id);

        $validated = $request->validate([
            'nama_formulir' => 'required|string|max:255',
            'kode_formulir' => 'nullable|string|max:50',
            'kategori' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
            'persyaratan' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'file_template' => 'nullable|file|mimes:doc,docx,pdf|max:10240',
        ]);

        $data = [
            'nama_formulir' => $validated['nama_formulir'],
            'kode_formulir' => $validated['kode_formulir'] ?? null,
            'kategori' => $validated['kategori'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'persyaratan' => $validated['persyaratan'] ?? null,
        ];

        if ($request->has('is_active')) {
            $data['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('file_template')) {
            if ($formulir->file_template && Storage::disk('public')->exists($formulir->file_template)) {
                Storage::disk('public')->delete($formulir->file_template);
            }

            $file = $request->file('file_template');
            $data['file_template'] = $file->store('formulir/templates', 'public');
            $data['file_format'] = strtolower($file->getClientOriginalExtension());
            $data['file_size'] = $file->getSize();
        }

        $formulir->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Template formulir berhasil diperbarui.',
            'data' => $formulir,
        ]);
    }

    public function destroy(string $id)
    {
        $formulir = Formulir::findOrFail($id);

        if ($formulir->file_template && Storage::disk('public')->exists($formulir->file_template)) {
            Storage::disk('public')->delete($formulir->file_template);
        }

        $formulir->delete();

        return response()->json([
            'success' => true,
            'message' => 'Template formulir berhasil dihapus.',
        ]);
    }

    public function download(string $id)
    {
        $formulir = Formulir::findOrFail($id);

        if (!Storage::disk('public')->exists($formulir->file_template)) {
            abort(404, 'Berkas formulir tidak ditemukan.');
        }

        $formulir->increment('download_count');

        $ext = $formulir->file_format ?: 'docx';
        $downloadName = preg_replace('/[^A-Za-z0-9_\-]/', '_', $formulir->nama_formulir) . '.' . $ext;

        return Storage::disk('public')->download($formulir->file_template, $downloadName);
    }
}
