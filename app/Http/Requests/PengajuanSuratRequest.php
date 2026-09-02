<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PengajuanSuratRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['nullable', 'exists:users,id'],
            'penduduk_id' => ['nullable', 'exists:penduduk,id'],
            'jenis_surat_id' => ['nullable', 'exists:jenis_surat,id'],

            'nama_pemohon' => ['required', 'string', 'max:255'],
            'nik' => ['required', 'string', 'digits:16'],
            'jenis_surat_nama' => ['nullable', 'string', 'max:255'],
            'keperluan' => ['required', 'string'],
            'tanggal_pengajuan' => ['nullable', 'date'],
            'tanggal_pengesahan' => ['nullable', 'date'],
            'status' => ['nullable', 'in:Menunggu,Diproses,Selesai,Ditolak'],
            'catatan_operator' => ['nullable', 'string'],
            'dokumen_pendukung' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:4096'],
            'file_hasil_surat' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'nama_pemohon.required' => 'Nama pemohon wajib diisi.',
            'nik.required' => 'NIK wajib diisi.',
            'nik.digits' => 'NIK harus 16 digit.',
            'keperluan.required' => 'Keperluan wajib diisi.',
            'tanggal_pengajuan.date' => 'Tanggal pengajuan tidak valid.',
            'tanggal_pengesahan.date' => 'Tanggal pengesahan tidak valid.',
            'status.in' => 'Status pengajuan tidak valid.',
            'dokumen_pendukung.mimes' => 'Dokumen pendukung harus berformat jpg, jpeg, png, atau pdf.',
            'dokumen_pendukung.max' => 'Ukuran dokumen pendukung maksimal 4 MB.',
            'file_hasil_surat.mimes' => 'File hasil surat harus berformat pdf, doc, atau docx.',
            'file_hasil_surat.max' => 'Ukuran file hasil surat maksimal 5 MB.',
        ];
    }
}