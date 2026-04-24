<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PendudukRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $pendudukId = $this->route('id') ?? $this->route('penduduk');

        return [
            'user_id' => ['nullable', 'exists:users,id'],
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'string', 'digits:16', 'unique:penduduk,nik,' . $pendudukId],
            'nomor_kk' => ['nullable', 'string', 'max:20'],
            'nomor_ktp' => ['nullable', 'string', 'max:20'],
            'tempat_lahir' => ['nullable', 'string', 'max:100'],
            'tanggal_lahir' => ['nullable', 'date'],
            'jenis_kelamin' => ['nullable', 'in:Laki-laki,Perempuan'],
            'agama' => ['nullable', 'string', 'max:50'],
            'status_perkawinan' => ['nullable', 'string', 'max:50'],
            'pekerjaan' => ['nullable', 'string', 'max:100'],
            'pendidikan_terakhir' => ['nullable', 'string', 'max:50'],
            'kategori_umur' => ['nullable', 'string', 'max:50'],
            'status_dalam_keluarga' => ['nullable', 'string', 'max:50'],
            'status_kependudukan' => ['nullable', 'in:Tetap,Pendatang,Pindah,Meninggal'],
            'nomor_telepon' => ['nullable', 'string', 'max:20'],
            'alamat_lengkap' => ['nullable', 'string'],
            'rt' => ['nullable', 'string', 'max:10'],
            'rw' => ['nullable', 'string', 'max:10'],
            'foto_profil' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'dokumen_pendukung' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'is_profile_completed' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.digits' => 'NIK harus 16 digit.',
            'nik.unique' => 'NIK sudah terdaftar.',
            'tanggal_lahir.date' => 'Tanggal lahir tidak valid.',
            'jenis_kelamin.in' => 'Jenis kelamin tidak valid.',
            'status_kependudukan.in' => 'Status kependudukan tidak valid.',
            'foto_profil.mimes' => 'Foto profil harus berformat jpg, jpeg, png, atau webp.',
            'foto_profil.max' => 'Ukuran foto profil maksimal 2 MB.',
            'dokumen_pendukung.mimes' => 'Dokumen pendukung harus berformat jpg, jpeg, png, atau pdf.',
            'dokumen_pendukung.max' => 'Ukuran dokumen pendukung maksimal 4 MB.',
            'latitude.numeric' => 'Latitude harus berupa angka.',
            'latitude.between' => 'Latitude harus di antara -90 sampai 90.',
            'longitude.numeric' => 'Longitude harus berupa angka.',
            'longitude.between' => 'Longitude harus di antara -180 sampai 180.',
        ];
    }
}