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
                  ->orWhere('nomor_paspor', 'like', "%{$search}%")
                  ->orWhere('negara_asal', 'like', "%{$search}%")
                  ->orWhere('nama_perusahaan', 'like', "%{$search}%")
                  ->orWhere('alamat_baru', 'like', "%{$search}%")
                  ->orWhere('kota_kabupaten_asal', 'like', "%{$search}%")
                  ->orWhere('nama_pemilik_rumah', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status_tempat_tinggal') && $request->status_tempat_tinggal !== 'Semua') {
            $query->where('status_tempat_tinggal', $request->status_tempat_tinggal);
        }

        if ($request->filled('kewarganegaraan') && $request->kewarganegaraan !== 'Semua') {
            $query->where('kewarganegaraan', $request->kewarganegaraan);
        }

        if ($request->filled('status_bekerja') && $request->status_bekerja !== 'Semua') {
            $query->where('status_bekerja', $request->status_bekerja);
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
        $totalWni = LaporDiri::where(function ($q) {
            $q->where('kewarganegaraan', 'WNI')->orWhereNull('kewarganegaraan');
        })->count();
        $totalWna = LaporDiri::where('kewarganegaraan', 'WNA')->count();
        $totalWnaBekerja = LaporDiri::where('kewarganegaraan', 'WNA')->where('status_bekerja', 'Bekerja')->count();

        $totalKost = LaporDiri::where('status_tempat_tinggal', 'Kost')->count();
        $totalKontrak = LaporDiri::where('status_tempat_tinggal', 'Kontrak/Sewa')->count();
        $totalMilikSendiri = LaporDiri::where('status_tempat_tinggal', 'Milik Sendiri')->count();
        $totalNumpang = LaporDiri::where('status_tempat_tinggal', 'Numpang')->count();

        return response()->json([
            'success' => true,
            'data' => $laporDiriList,
            'stats' => [
                'total_pelapor' => $totalPelapor,
                'total_jiwa' => $totalJiwa,
                'total_wni' => $totalWni,
                'total_wna' => $totalWna,
                'total_wna_bekerja' => $totalWnaBekerja,
                'kost' => $totalKost,
                'kontrak_sewa' => $totalKontrak,
                'milik_sendiri' => $totalMilikSendiri,
                'numpang' => $totalNumpang,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $isWna = $request->kewarganegaraan === 'WNA';

        $rules = [
            'kewarganegaraan' => 'required|in:WNI,WNA',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:Laki-Laki,Perempuan',
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'agama' => $isWna ? 'nullable|string|max:50' : 'required|string|max:50',
            'status_perkawinan' => 'required|string|max:50',
            'pekerjaan' => $isWna ? 'nullable|string|max:100' : 'required|string|max:100',
            'nik' => $isWna ? 'nullable|string|max:20' : 'required|string|size:16',
            'nomor_kk' => 'nullable|string|max:16',
            'nomor_telepon' => 'nullable|string|max:20',

            // WNA specific fields
            'negara_asal' => $isWna ? 'required|string|max:100' : 'nullable|string|max:100',
            'nomor_paspor' => $isWna ? 'required|string|max:50' : 'nullable|string|max:50',
            'masa_berlaku_paspor' => 'nullable|date',
            'jenis_izin_tinggal' => 'nullable|string|max:50',
            'nomor_izin_tinggal' => 'nullable|string|max:50',
            'masa_berlaku_izin' => 'nullable|date',

            // Status Bekerja
            'status_bekerja' => 'nullable|in:Bekerja,Tidak Bekerja,Pelajar/Mahasiswa,Wisatawan/Turis,Lainnya',
            'nama_perusahaan' => 'nullable|string|max:255',
            'jabatan_pekerjaan' => 'nullable|string|max:100',
            'nomor_dokumen_kerja' => 'nullable|string|max:100',

            // Penjamin / Sponsor
            'nama_penjamin' => 'nullable|string|max:255',
            'kategori_penjamin' => 'nullable|string|max:100',
            'nik_penjamin' => 'nullable|string|max:20',
            'telepon_penjamin' => 'nullable|string|max:20',
            'alamat_penjamin' => 'nullable|string',

            // B. Alamat Baru
            'alamat_baru' => 'required|string',
            'tanggal_mulai_tinggal' => 'nullable|date',
            'status_tempat_tinggal' => 'required|in:Kost,Kontrak/Sewa,Milik Sendiri,Numpang',
            'nama_pemilik_rumah' => 'nullable|string|max:255',
            'nomor_kontak_pemilik' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',

            // C. Alamat Asal
            'alamat_asal' => $isWna ? 'nullable|string' : 'required|string',
            'rt_rw_asal' => 'nullable|string|max:50',
            'kelurahan_asal' => 'nullable|string|max:100',
            'kecamatan_asal' => 'nullable|string|max:100',
            'kota_kabupaten_asal' => 'nullable|string|max:100',

            // Dokumen WNI
            'lampiran_ktp' => 'nullable|boolean',
            'lampiran_kk' => 'nullable|boolean',
            'lampiran_surat_pindah' => 'nullable|boolean',
            'file_ktp' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_kk' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_surat_pindah' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',

            // Dokumen WNA
            'lampiran_paspor' => 'nullable|boolean',
            'lampiran_kitas_kitap' => 'nullable|boolean',
            'lampiran_surat_permohonan' => 'nullable|boolean',
            'lampiran_ktp_penjamin' => 'nullable|boolean',
            'lampiran_dokumen_kerja' => 'nullable|boolean',
            'lampiran_dokumen_lainnya' => 'nullable|boolean',
            'file_paspor' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_kitas_kitap' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_surat_permohonan' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_ktp_penjamin' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_dokumen_kerja' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_dokumen_lainnya' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',

            'lampiran_ttd' => 'nullable|boolean',
            'file_tanda_tangan' => 'nullable|file|mimes:jpeg,png,jpg|max:4096',
            'tanda_tangan_data' => 'nullable|string',

            // Meta
            'tanggal_lapor' => 'nullable|date',
            'catatan' => 'nullable|string',

            // Anggota
            'anggota' => 'nullable|array',
            'anggota.*.nama' => 'required|string|max:255',
            'anggota.*.nik' => 'nullable|string|max:16',
            'anggota.*.nomor_paspor' => 'nullable|string|max:50',
            'anggota.*.tempat_lahir' => 'nullable|string|max:100',
            'anggota.*.tanggal_lahir' => 'nullable|date',
            'anggota.*.hubungan_keluarga' => 'nullable|string|max:50',
        ];

        $validated = $request->validate($rules);

        return DB::transaction(function () use ($request, $validated) {
            $data = $validated;
            $fileFields = [
                'file_ktp' => ['dir' => 'lapor-diri/ktp', 'flag' => 'lampiran_ktp'],
                'file_kk' => ['dir' => 'lapor-diri/kk', 'flag' => 'lampiran_kk'],
                'file_surat_pindah' => ['dir' => 'lapor-diri/surat-pindah', 'flag' => 'lampiran_surat_pindah'],
                'file_paspor' => ['dir' => 'lapor-diri/paspor', 'flag' => 'lampiran_paspor'],
                'file_kitas_kitap' => ['dir' => 'lapor-diri/kitas-kitap', 'flag' => 'lampiran_kitas_kitap'],
                'file_surat_permohonan' => ['dir' => 'lapor-diri/permohonan', 'flag' => 'lampiran_surat_permohonan'],
                'file_ktp_penjamin' => ['dir' => 'lapor-diri/ktp-penjamin', 'flag' => 'lampiran_ktp_penjamin'],
                'file_dokumen_kerja' => ['dir' => 'lapor-diri/dokumen-kerja', 'flag' => 'lampiran_dokumen_kerja'],
                'file_dokumen_lainnya' => ['dir' => 'lapor-diri/dokumen-lainnya', 'flag' => 'lampiran_dokumen_lainnya'],
            ];

            unset($data['anggota'], $data['file_tanda_tangan'], $data['tanda_tangan_data']);
            foreach ($fileFields as $key => $cfg) {
                unset($data[$key]);
            }

            foreach ($fileFields as $key => $cfg) {
                if ($request->hasFile($key)) {
                    $data[$key] = $request->file($key)->store($cfg['dir'], 'public');
                    $data[$cfg['flag']] = true;
                }
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

        $isWna = ($request->input('kewarganegaraan') ?? $laporDiri->kewarganegaraan) === 'WNA';

        $rules = [
            'kewarganegaraan' => 'required|in:WNI,WNA',
            'nama_lengkap' => 'required|string|max:255',
            'jenis_kelamin' => 'required|in:Laki-Laki,Perempuan',
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'agama' => $isWna ? 'nullable|string|max:50' : 'required|string|max:50',
            'status_perkawinan' => 'required|string|max:50',
            'pekerjaan' => $isWna ? 'nullable|string|max:100' : 'required|string|max:100',
            'nik' => $isWna ? 'nullable|string|max:20' : 'required|string|size:16',
            'nomor_kk' => 'nullable|string|max:16',
            'nomor_telepon' => 'nullable|string|max:20',

            // WNA specific fields
            'negara_asal' => $isWna ? 'required|string|max:100' : 'nullable|string|max:100',
            'nomor_paspor' => $isWna ? 'required|string|max:50' : 'nullable|string|max:50',
            'masa_berlaku_paspor' => 'nullable|date',
            'jenis_izin_tinggal' => 'nullable|string|max:50',
            'nomor_izin_tinggal' => 'nullable|string|max:50',
            'masa_berlaku_izin' => 'nullable|date',

            // Status Bekerja
            'status_bekerja' => 'nullable|in:Bekerja,Tidak Bekerja,Pelajar/Mahasiswa,Wisatawan/Turis,Lainnya',
            'nama_perusahaan' => 'nullable|string|max:255',
            'jabatan_pekerjaan' => 'nullable|string|max:100',
            'nomor_dokumen_kerja' => 'nullable|string|max:100',

            // Penjamin / Sponsor
            'nama_penjamin' => 'nullable|string|max:255',
            'kategori_penjamin' => 'nullable|string|max:100',
            'nik_penjamin' => 'nullable|string|max:20',
            'telepon_penjamin' => 'nullable|string|max:20',
            'alamat_penjamin' => 'nullable|string',

            // B. Alamat Baru
            'alamat_baru' => 'required|string',
            'tanggal_mulai_tinggal' => 'nullable|date',
            'status_tempat_tinggal' => 'required|in:Kost,Kontrak/Sewa,Milik Sendiri,Numpang',
            'nama_pemilik_rumah' => 'nullable|string|max:255',
            'nomor_kontak_pemilik' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',

            // C. Alamat Asal
            'alamat_asal' => $isWna ? 'nullable|string' : 'required|string',
            'rt_rw_asal' => 'nullable|string|max:50',
            'kelurahan_asal' => 'nullable|string|max:100',
            'kecamatan_asal' => 'nullable|string|max:100',
            'kota_kabupaten_asal' => 'nullable|string|max:100',

            // Dokumen WNI
            'lampiran_ktp' => 'nullable|boolean',
            'lampiran_kk' => 'nullable|boolean',
            'lampiran_surat_pindah' => 'nullable|boolean',
            'file_ktp' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_kk' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_surat_pindah' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',

            // Dokumen WNA
            'lampiran_paspor' => 'nullable|boolean',
            'lampiran_kitas_kitap' => 'nullable|boolean',
            'lampiran_surat_permohonan' => 'nullable|boolean',
            'lampiran_ktp_penjamin' => 'nullable|boolean',
            'lampiran_dokumen_kerja' => 'nullable|boolean',
            'lampiran_dokumen_lainnya' => 'nullable|boolean',
            'file_paspor' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_kitas_kitap' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_surat_permohonan' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_ktp_penjamin' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_dokumen_kerja' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',
            'file_dokumen_lainnya' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:4096',

            'lampiran_ttd' => 'nullable|boolean',
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
            'anggota.*.nomor_paspor' => 'nullable|string|max:50',
            'anggota.*.tempat_lahir' => 'nullable|string|max:100',
            'anggota.*.tanggal_lahir' => 'nullable|date',
            'anggota.*.hubungan_keluarga' => 'nullable|string|max:50',
        ];

        $validated = $request->validate($rules);

        return DB::transaction(function () use ($request, $validated, $laporDiri) {
            $data = $validated;
            $fileFields = [
                'file_ktp' => ['dir' => 'lapor-diri/ktp', 'flag' => 'lampiran_ktp'],
                'file_kk' => ['dir' => 'lapor-diri/kk', 'flag' => 'lampiran_kk'],
                'file_surat_pindah' => ['dir' => 'lapor-diri/surat-pindah', 'flag' => 'lampiran_surat_pindah'],
                'file_paspor' => ['dir' => 'lapor-diri/paspor', 'flag' => 'lampiran_paspor'],
                'file_kitas_kitap' => ['dir' => 'lapor-diri/kitas-kitap', 'flag' => 'lampiran_kitas_kitap'],
                'file_surat_permohonan' => ['dir' => 'lapor-diri/permohonan', 'flag' => 'lampiran_surat_permohonan'],
                'file_ktp_penjamin' => ['dir' => 'lapor-diri/ktp-penjamin', 'flag' => 'lampiran_ktp_penjamin'],
                'file_dokumen_kerja' => ['dir' => 'lapor-diri/dokumen-kerja', 'flag' => 'lampiran_dokumen_kerja'],
                'file_dokumen_lainnya' => ['dir' => 'lapor-diri/dokumen-lainnya', 'flag' => 'lampiran_dokumen_lainnya'],
            ];

            unset($data['anggota'], $data['file_tanda_tangan'], $data['tanda_tangan_data']);
            foreach ($fileFields as $key => $cfg) {
                unset($data[$key]);
            }

            foreach ($fileFields as $key => $cfg) {
                if ($request->hasFile($key)) {
                    if ($laporDiri->{$key}) {
                        Storage::disk('public')->delete($laporDiri->{$key});
                    }
                    $data[$key] = $request->file($key)->store($cfg['dir'], 'public');
                    $data[$cfg['flag']] = true;
                }
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

        $fileFields = [
            'file_ktp',
            'file_kk',
            'file_surat_pindah',
            'file_paspor',
            'file_kitas_kitap',
            'file_surat_permohonan',
            'file_ktp_penjamin',
            'file_dokumen_kerja',
            'file_dokumen_lainnya',
            'tanda_tangan',
        ];

        foreach ($fileFields as $field) {
            if ($laporDiri->{$field}) {
                Storage::disk('public')->delete($laporDiri->{$field});
            }
        }

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
