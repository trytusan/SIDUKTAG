<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LaporDiri;
use App\Models\LaporDiriAnggota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LaporDiriController extends Controller
{
    public function index(Request $request)
    {
        $query = LaporDiri::with(['anggota'])->latest('id');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%")
                  ->orWhere('alamat_baru', 'like', "%{$search}%")
                  ->orWhere('kota_kabupaten_asal', 'like', "%{$search}%")
                  ->orWhere('nama_pemilik_rumah', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status_tempat_tinggal') && $request->status_tempat_tinggal !== 'Semua') {
            $query->where('status_tempat_tinggal', $request->status_tempat_tinggal);
        }

        if ($request->query('export') === 'pdf') {
            $data = $query->get();
            return view('admin.lapor-diri.pdf', compact('data'));
        }

        $perPage = $request->query('per_page', 15);
        $laporDiriList = $query->paginate($perPage);

        $totalPelapor = LaporDiri::count();
        $totalAnggota = LaporDiriAnggota::count();
        $totalJiwa = $totalPelapor + $totalAnggota;
        $totalKost = LaporDiri::where('status_tempat_tinggal', 'Kost')->count();
        $totalKontrak = LaporDiri::where('status_tempat_tinggal', 'Kontrak/Sewa')->count();

        return response()->json([
            'success' => true,
            'data' => $laporDiriList,
            'stats' => [
                'total_pelapor' => $totalPelapor,
                'total_jiwa' => $totalJiwa,
                'total_kost' => $totalKost,
                'total_kontrak' => $totalKontrak,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:Laki-Laki,Perempuan',
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'agama' => 'required|string|max:50',
            'status_perkawinan' => 'required|string|max:50',
            'pekerjaan' => 'required|string|max:100',
            'nik' => 'required|string|size:16',
            'nomor_kk' => 'nullable|string|max:16',
            'nomor_telepon' => 'nullable|string|max:20',

            // B. Alamat Baru
            'alamat_baru' => 'required|string',
            'tanggal_mulai_tinggal' => 'nullable|date',
            'status_tempat_tinggal' => 'required|in:Kost,Kontrak/Sewa,Milik Sendiri,Numpang',
            'nama_pemilik_rumah' => 'nullable|string|max:255',
            'nomor_kontak_pemilik' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',

            // C. Alamat Asal
            'alamat_asal' => 'required|string',
            'rt_rw_asal' => 'nullable|string|max:50',
            'kelurahan_asal' => 'nullable|string|max:100',
            'kecamatan_asal' => 'nullable|string|max:100',
            'kota_kabupaten_asal' => 'nullable|string|max:100',

            // E. Dokumen
            'lampiran_ktp' => 'nullable|boolean',
            'lampiran_kk' => 'nullable|boolean',
            'lampiran_surat_pindah' => 'nullable|boolean',
            'lampiran_ttd' => 'nullable|boolean',
            'file_ktp' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_kk' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_surat_pindah' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_tanda_tangan' => 'nullable|file|mimes:jpeg,png,jpg|max:4096',
            'tanda_tangan_data' => 'nullable|string',

            // Meta
            'tanggal_lapor' => 'nullable|date',
            'catatan' => 'nullable|string',

            // Anggota
            'anggota' => 'nullable|array',
            'anggota.*.nama' => 'required|string|max:255',
            'anggota.*.nik' => 'nullable|string|max:16',
            'anggota.*.tempat_lahir' => 'nullable|string|max:100',
            'anggota.*.tanggal_lahir' => 'nullable|date',
            'anggota.*.hubungan_keluarga' => 'nullable|string|max:50',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $data = $validated;
            unset($data['anggota'], $data['file_ktp'], $data['file_kk'], $data['file_surat_pindah'], $data['file_tanda_tangan'], $data['tanda_tangan_data']);

            if ($request->hasFile('file_ktp')) {
                $data['file_ktp'] = $request->file('file_ktp')->store('lapor-diri/ktp', 'public');
                $data['lampiran_ktp'] = true;
            }
            if ($request->hasFile('file_kk')) {
                $data['file_kk'] = $request->file('file_kk')->store('lapor-diri/kk', 'public');
                $data['lampiran_kk'] = true;
            }
            if ($request->hasFile('file_surat_pindah')) {
                $data['file_surat_pindah'] = $request->file('file_surat_pindah')->store('lapor-diri/surat-pindah', 'public');
                $data['lampiran_surat_pindah'] = true;
            }

            if ($request->hasFile('file_tanda_tangan')) {
                $data['tanda_tangan'] = $request->file('file_tanda_tangan')->store('lapor-diri/ttd', 'public');
                $data['lampiran_ttd'] = true;
            } elseif ($request->filled('tanda_tangan_data')) {
                $base64Image = $request->tanda_tangan_data;
                if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
                    $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
                    $type = strtolower($type[1]);
                    $decoded = base64_decode($base64Image);
                    if ($decoded !== false) {
                        $filename = 'lapor-diri/ttd/' . Str::uuid() . '.' . $type;
                        Storage::disk('public')->put($filename, $decoded);
                        $data['tanda_tangan'] = $filename;
                        $data['lampiran_ttd'] = true;
                    }
                }
            }

            $data['created_by'] = auth()->id();
            $data['tanggal_lapor'] = $data['tanggal_lapor'] ?? now()->toDateString();
            $data['status_lapor'] = 'Terdaftar';

            $laporDiri = LaporDiri::create($data);

            if (!empty($validated['anggota'])) {
                foreach ($validated['anggota'] as $ang) {
                    if (!empty($ang['nama'])) {
                        $laporDiri->anggota()->create($ang);
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Data lapor diri berhasil disimpan.',
                'data' => $laporDiri->load('anggota'),
            ], 201);
        });
    }

    public function show(string $id)
    {
        $laporDiri = LaporDiri::with(['anggota', 'creator'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'lapor_diri' => $laporDiri,
            'data' => $laporDiri,
        ]);
    }

    public function edit(string $id)
    {
        $laporDiri = LaporDiri::with(['anggota'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'lapor_diri' => $laporDiri,
            'data' => $laporDiri,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $laporDiri = LaporDiri::findOrFail($id);

        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:Laki-Laki,Perempuan',
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'agama' => 'required|string|max:50',
            'status_perkawinan' => 'required|string|max:50',
            'pekerjaan' => 'required|string|max:100',
            'nik' => 'required|string|size:16',
            'nomor_kk' => 'nullable|string|max:16',
            'nomor_telepon' => 'nullable|string|max:20',

            // B. Alamat Baru
            'alamat_baru' => 'required|string',
            'tanggal_mulai_tinggal' => 'nullable|date',
            'status_tempat_tinggal' => 'required|in:Kost,Kontrak/Sewa,Milik Sendiri,Numpang',
            'nama_pemilik_rumah' => 'nullable|string|max:255',
            'nomor_kontak_pemilik' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',

            // C. Alamat Asal
            'alamat_asal' => 'required|string',
            'rt_rw_asal' => 'nullable|string|max:50',
            'kelurahan_asal' => 'nullable|string|max:100',
            'kecamatan_asal' => 'nullable|string|max:100',
            'kota_kabupaten_asal' => 'nullable|string|max:100',

            // E. Dokumen
            'lampiran_ktp' => 'nullable|boolean',
            'lampiran_kk' => 'nullable|boolean',
            'lampiran_surat_pindah' => 'nullable|boolean',
            'lampiran_ttd' => 'nullable|boolean',
            'file_ktp' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_kk' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_surat_pindah' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_tanda_tangan' => 'nullable|file|mimes:jpeg,png,jpg|max:4096',
            'tanda_tangan_data' => 'nullable|string',

            // Meta
            'tanggal_lapor' => 'nullable|date',
            'status_lapor' => 'nullable|in:Terdaftar,Diverifikasi,Ditolak',
            'catatan' => 'nullable|string',

            // Anggota
            'anggota' => 'nullable|array',
            'anggota.*.id' => 'nullable|integer',
            'anggota.*.nama' => 'required|string|max:255',
            'anggota.*.nik' => 'nullable|string|max:16',
            'anggota.*.tempat_lahir' => 'nullable|string|max:100',
            'anggota.*.tanggal_lahir' => 'nullable|date',
            'anggota.*.hubungan_keluarga' => 'nullable|string|max:50',
        ]);

        return DB::transaction(function () use ($request, $validated, $laporDiri) {
            $data = $validated;
            unset($data['anggota'], $data['file_ktp'], $data['file_kk'], $data['file_surat_pindah'], $data['file_tanda_tangan'], $data['tanda_tangan_data']);

            if ($request->hasFile('file_ktp')) {
                if ($laporDiri->file_ktp) Storage::disk('public')->delete($laporDiri->file_ktp);
                $data['file_ktp'] = $request->file('file_ktp')->store('lapor-diri/ktp', 'public');
                $data['lampiran_ktp'] = true;
            }
            if ($request->hasFile('file_kk')) {
                if ($laporDiri->file_kk) Storage::disk('public')->delete($laporDiri->file_kk);
                $data['file_kk'] = $request->file('file_kk')->store('lapor-diri/kk', 'public');
                $data['lampiran_kk'] = true;
            }
            if ($request->hasFile('file_surat_pindah')) {
                if ($laporDiri->file_surat_pindah) Storage::disk('public')->delete($laporDiri->file_surat_pindah);
                $data['file_surat_pindah'] = $request->file('file_surat_pindah')->store('lapor-diri/surat-pindah', 'public');
                $data['lampiran_surat_pindah'] = true;
            }

            if ($request->hasFile('file_tanda_tangan')) {
                if ($laporDiri->tanda_tangan) Storage::disk('public')->delete($laporDiri->tanda_tangan);
                $data['tanda_tangan'] = $request->file('file_tanda_tangan')->store('lapor-diri/ttd', 'public');
                $data['lampiran_ttd'] = true;
            } elseif ($request->filled('tanda_tangan_data')) {
                $base64Image = $request->tanda_tangan_data;
                if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
                    $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
                    $type = strtolower($type[1]);
                    $decoded = base64_decode($base64Image);
                    if ($decoded !== false) {
                        if ($laporDiri->tanda_tangan) Storage::disk('public')->delete($laporDiri->tanda_tangan);
                        $filename = 'lapor-diri/ttd/' . Str::uuid() . '.' . $type;
                        Storage::disk('public')->put($filename, $decoded);
                        $data['tanda_tangan'] = $filename;
                        $data['lampiran_ttd'] = true;
                    }
                }
            }

            $laporDiri->update($data);

            $existingAnggotaIds = [];
            if (!empty($validated['anggota'])) {
                foreach ($validated['anggota'] as $ang) {
                    if (!empty($ang['nama'])) {
                        if (!empty($ang['id'])) {
                            $existingItem = LaporDiriAnggota::where('id', $ang['id'])
                                ->where('lapor_diri_id', $laporDiri->id)
                                ->first();
                            if ($existingItem) {
                                $existingItem->update($ang);
                                $existingAnggotaIds[] = $existingItem->id;
                                continue;
                            }
                        }
                        $created = $laporDiri->anggota()->create($ang);
                        $existingAnggotaIds[] = $created->id;
                    }
                }
            }

            $laporDiri->anggota()->whereNotIn('id', $existingAnggotaIds)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data lapor diri berhasil diperbarui.',
                'data' => $laporDiri->fresh('anggota'),
            ]);
        });
    }

    public function destroy(string $id)
    {
        $laporDiri = LaporDiri::findOrFail($id);

        if ($laporDiri->file_ktp) Storage::disk('public')->delete($laporDiri->file_ktp);
        if ($laporDiri->file_kk) Storage::disk('public')->delete($laporDiri->file_kk);
        if ($laporDiri->file_surat_pindah) Storage::disk('public')->delete($laporDiri->file_surat_pindah);
        if ($laporDiri->tanda_tangan) Storage::disk('public')->delete($laporDiri->tanda_tangan);

        $laporDiri->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data formulir lapor diri berhasil dihapus.',
        ]);
    }

    public function cetak(string $id)
    {
        $laporDiri = LaporDiri::with(['anggota'])->findOrFail($id);
        return view('admin.lapor-diri.cetak', compact('laporDiri'));
    }
}
