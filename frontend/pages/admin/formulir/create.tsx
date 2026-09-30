import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import FormInput from '../../../src/components/form/input'
import FormTextarea from '../../../src/components/form/textarea'
import FormSelect from '../../../src/components/form/select'
import AlertError from '../../../src/components/ui/alert-error'
import { useAlert } from '../../../src/context/AlertContext'
import api from '../../../src/lib/api'

export default function AdminFormulirCreate() {
  const router = useRouter()
  const { showAlert } = useAlert()

  const [formData, setFormData] = useState({
    nama_formulir: '',
    kode_formulir: '',
    kategori: 'Kependudukan',
    deskripsi: '',
    persyaratan: '',
    is_active: true,
  })

  const [fileTemplate, setFileTemplate] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (!['doc', 'docx', 'pdf'].includes(ext || '')) {
        setError('Format file tidak didukung. Harap unggah berkas berekstensi .doc, .docx, atau .pdf')
        setFileTemplate(null)
        e.target.value = ''
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Ukuran file melebihi batas maksimum 10MB.')
        setFileTemplate(null)
        e.target.value = ''
        return
      }
      setError(null)
      setFileTemplate(file)
    } else {
      setFileTemplate(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileTemplate) {
      setError('Silakan pilih berkas template formulir (Word .doc/.docx atau PDF).')
      return
    }

    setSubmitting(true)
    setError(null)
    setValidationErrors({})

    try {
      const fd = new FormData()
      fd.append('nama_formulir', formData.nama_formulir)
      if (formData.kode_formulir) fd.append('kode_formulir', formData.kode_formulir)
      fd.append('kategori', formData.kategori)
      if (formData.deskripsi) fd.append('deskripsi', formData.deskripsi)
      if (formData.persyaratan) fd.append('persyaratan', formData.persyaratan)
      fd.append('is_active', formData.is_active ? '1' : '0')
      fd.append('file_template', fileTemplate)

      const res = await api.post('/admin/formulir', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      showAlert({
        type: 'success',
        title: 'Berhasil Ditambahkan!',
        message: 'Template formulir baru berhasil disimpan.',
      })

      const createdId = res.data?.data?.id
      if (createdId) {
        router.push(`/admin/formulir/${createdId}`)
      } else {
        router.push('/admin/formulir')
      }
    } catch (err: any) {
      console.error('Failed to create formulir:', err)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
        setError('Terdapat kesalahan pengisian formulir. Periksa kolom yang ditandai merah.')
      } else {
        setError(err.response?.data?.message || 'Terjadi kesalahan sistem saat menyimpan data.')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout
      pageTitle="Tambah Template Formulir"
      subtitle="Unggah formulir baru dan berkas template (Word / PDF) untuk warga Banjar Saba Penatih."
    >
      {/* Breadcrumb Navigation */}
      <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/admin/formulir" className="hover:text-emerald-700 transition">
          Daftar Formulir
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">Tambah Baru</span>
      </nav>

      <PageHeader
        title="Unggah Template Formulir Baru"
        description="Lengkapi detail formulir, panduan pengisian, dan unggah berkas template resmi."
      />

      <div className="mt-6 w-full">
        {error && <AlertError message={error} errors={validationErrors} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Informasi Umum Formulir
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <FormInput
                  label="Nama Formulir Layanan"
                  name="nama_formulir"
                  value={formData.nama_formulir}
                  onChange={handleChange}
                  placeholder="Contoh: Formulir Permohonan KTP Baru / Surat Pernyataan Belum Menikah"
                  required
                  error={validationErrors.nama_formulir?.[0]}
                />
              </div>

              <div>
                <FormInput
                  label="Kode Dokumen (Opsional)"
                  name="kode_formulir"
                  value={formData.kode_formulir}
                  onChange={handleChange}
                  placeholder="Contoh: F-1.01 atau SK-02"
                  error={validationErrors.kode_formulir?.[0]}
                />
              </div>
            </div>

            <div>
              <FormSelect
                label="Kategori Layanan Formulir"
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                required
                error={validationErrors.kategori?.[0]}
                options={[
                  { value: 'Kependudukan', label: 'Kependudukan (KK, KTP, Pindah Datang)' },
                  { value: 'Surat Keterangan', label: 'Surat Keterangan (Domisili, Usaha, Kelakuan Baik)' },
                  { value: 'Pernikahan', label: 'Pernikahan / Perkawinan' },
                  { value: 'Kematian', label: 'Kematian / Waris' },
                  { value: 'Pertanahan & Usaha', label: 'Pertanahan & Usaha / UMKM' },
                  { value: 'Lainnya', label: 'Lainnya' },
                ]}
              />
            </div>

            <div>
              <FormTextarea
                label="Deskripsi / Penjelasan Singkat"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                rows={2}
                placeholder="Penjelasan singkat mengenai peruntukan formulir ini untuk warga..."
                error={validationErrors.deskripsi?.[0]}
              />
            </div>

            <div>
              <FormTextarea
                label="Persyaratan & Petunjuk Pengisian (Opsional)"
                name="persyaratan"
                value={formData.persyaratan}
                onChange={handleChange}
                rows={4}
                placeholder="Tuliskan daftar berkas pendukung yang harus dibawa warga ke kantor Banjar (contoh: 1. Fotokopi KK, 2. Pasfoto 3x4, 3. Meterai)..."
                error={validationErrors.persyaratan?.[0]}
              />
            </div>
          </div>

          {/* Upload Berkas Template */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Berkas Template Dokumen (.docx / .doc / .pdf)
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Pilih Berkas Template Word atau PDF <span className="text-rose-500">*</span>
              </label>
              <div className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-emerald-500 transition bg-slate-50/50">
                <input
                  type="file"
                  id="file_template"
                  accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <label htmlFor="file_template" className="cursor-pointer block">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mb-3">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  {fileTemplate ? (
                    <div>
                      <p className="text-sm font-bold text-slate-900">{fileTemplate.name}</p>
                      <p className="text-xs text-emerald-600 font-semibold mt-1">
                        Ukuran: {(fileTemplate.size / 1024).toFixed(1)} KB • Klik untuk mengganti
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        Klik di sini untuk memilih berkas template formulir
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Mendukung Microsoft Word (.doc, .docx) dan Dokumen PDF (Maksimal 10MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
              {validationErrors.file_template?.[0] && (
                <p className="mt-1 text-xs text-rose-600">{validationErrors.file_template[0]}</p>
              )}
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800">
                    Aktifkan Formulir (Tampilkan di Portal Warga)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Jika dicentang, warga dapat melihat dan mengunduh formulir ini di portal mereka.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/admin/formulir"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 transition"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Mengunggah Berkas...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Simpan Template Formulir</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
