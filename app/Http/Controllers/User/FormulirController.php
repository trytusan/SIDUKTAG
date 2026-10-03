<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Formulir;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FormulirController extends Controller
{
    public function index(Request $request)
    {
        $query = Formulir::active()->latest('id');

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

        $perPage = $request->query('per_page', 24);
        $formulirList = $query->paginate($perPage);

        $kategoriList = Formulir::active()->select('kategori')->distinct()->pluck('kategori');

        return response()->json([
            'success' => true,
            'data' => $formulirList,
            'kategori_list' => $kategoriList,
        ]);
    }

    public function show(string $id)
    {
        $formulir = Formulir::active()->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $formulir,
            'formulir' => $formulir,
        ]);
    }

    public function download(string $id)
    {
        $formulir = Formulir::active()->findOrFail($id);

        if (!Storage::disk('public')->exists($formulir->file_template)) {
            abort(404, 'Berkas formulir tidak ditemukan di server.');
        }

        $formulir->increment('download_count');

        $ext = $formulir->file_format ?: 'docx';
        $downloadName = null;

        if (!empty($formulir->nama_file_asli)) {
            $downloadName = trim(preg_replace('/[\/\\:\*\?"<>\|]/', '', $formulir->nama_file_asli));
        }

        if (empty($downloadName)) {
            $cleanName = trim(preg_replace('/[\/\\:\*\?"<>\|]/', '', $formulir->nama_formulir));
            if (empty($cleanName)) {
                $cleanName = 'Formulir_' . $formulir->id;
            }
            $downloadName = $cleanName . '.' . $ext;
        }

        if (!str_contains($downloadName, '.')) {
            $downloadName .= '.' . $ext;
        }

        return Storage::disk('public')->download($formulir->file_template, $downloadName);
    }
}
