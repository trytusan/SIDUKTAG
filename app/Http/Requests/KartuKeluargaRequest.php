<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KartuKeluargaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $kkId = $this->route('id') ?? $this->route('kartu_keluarga');

        return [
            'nomor_kk' => ['required', 'string', 'max:20', 'unique:kartu_keluarga,nomor_kk,' . $kkId],
            'nama_kepala_keluarga' => ['required', 'string', 'max:255'],
            'alamat_keluarga' => ['required', 'string'],
            'rt' => ['nullable', 'string', 'max:10'],
            'rw' => ['nullable', 'string', 'max:10'],
            'jumlah_anggota' => ['nullable', 'integer', 'min:1'],

            'anggota' => ['nullable', 'array'],
            'anggota.*.penduduk_id' => ['nullable', 'exists:penduduk,id'],
            'anggota.*.nama' => ['nullable', 'string', 'max:255'],
            'anggota.*.nik' => ['nullable', 'string', 'max:20'],
            'anggota.*.status_dalam_keluarga' => ['nullable', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'nomor_kk.required' => 'Nomor KK wajib diisi.',
            'nomor_kk.unique' => 'Nomor KK sudah terdaftar.',
            'nama_kepala_keluarga.required' => 'Nama kepala keluarga wajib diisi.',
            'alamat_keluarga.required' => 'Alamat keluarga wajib diisi.',
            'jumlah_anggota.integer' => 'Jumlah anggota harus berupa angka.',
            'jumlah_anggota.min' => 'Jumlah anggota minimal 1.',
            'anggota.*.penduduk_id.exists' => 'Data anggota keluarga tidak ditemukan.',
        ];
    }
}