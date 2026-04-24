<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BantuanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_program' => ['required', 'string', 'max:255'],
            'jenis_bantuan' => ['required', 'string', 'max:100'],
            'deskripsi' => ['nullable', 'string'],
            'tanggal_mulai' => ['nullable', 'date'],
            'tanggal_selesai' => ['nullable', 'date', 'after_or_equal:tanggal_mulai'],
            'status_bantuan' => ['nullable', 'in:Aktif,Nonaktif,Selesai'],
            'kuota_penerima' => ['nullable', 'integer', 'min:1'],
            'sumber_bantuan' => ['nullable', 'string', 'max:255'],

            'penduduk_id' => ['nullable', 'exists:penduduk,id'],
            'tanggal_menerima' => ['nullable', 'date'],
            'status_penerima' => ['nullable', 'in:Menunggu,Diterima,Ditolak,Selesai'],
            'catatan' => ['nullable', 'string'],
            'dokumen_pendukung' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama_program.required' => 'Nama program bantuan wajib diisi.',
            'jenis_bantuan.required' => 'Jenis bantuan wajib diisi.',
            'tanggal_mulai.date' => 'Tanggal mulai tidak valid.',
            'tanggal_selesai.date' => 'Tanggal selesai tidak valid.',
            'tanggal_selesai.after_or_equal' => 'Tanggal selesai harus setelah atau sama dengan tanggal mulai.',
            'status_bantuan.in' => 'Status bantuan tidak valid.',
            'kuota_penerima.integer' => 'Kuota penerima harus berupa angka.',
            'kuota_penerima.min' => 'Kuota penerima minimal 1.',
            'penduduk_id.exists' => 'Data penerima bantuan tidak ditemukan.',
            'tanggal_menerima.date' => 'Tanggal menerima tidak valid.',
            'status_penerima.in' => 'Status penerima tidak valid.',
            'dokumen_pendukung.mimes' => 'Dokumen pendukung harus berformat jpg, jpeg, png, atau pdf.',
            'dokumen_pendukung.max' => 'Ukuran dokumen pendukung maksimal 4 MB.',
        ];
    }
}