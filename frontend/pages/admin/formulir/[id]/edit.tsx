import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import PageHeader from '../../../../src/components/ui/page-header'
import FormInput from '../../../../src/components/form/input'
import FormTextarea from '../../../../src/components/form/textarea'
import FormSelect from '../../../../src/components/form/select'
import AlertError from '../../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../../src/components/ui/loading'
import { useAlert } from '../../../../src/context/AlertContext'
import api, { getStorageUrl, downloadFile } from '../../../../src/lib/api'
import { Formulir } from '../../../../src/types'

export default function AdminFormulirEdit() {
  const router = useRouter()
  const { id } = router.query
  const { showAlert } = useAlert()

  const [formulir, setFormulir] = useState<Formulir | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!formulir) return
    setDownloading(true)
    const fallbackName = `${formulir.nama_formulir}.${formulir.file_format || 'docx'}`
    await downloadFile(`/admin/formulir/${formulir.id}/download`, fallbackName)
    setDownloading(false)
  }

  const [formData, setFormData] = useState({
    nama_formulir: '',
    kode_formulir: '',
    kategori: 'Kependudukan',
    deskripsi: '',
    persyaratan: '',
    is_active: true,
  })

  const [newFileTemplate, setNewFileTemplate] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!id) return
    async function fetchFormulir() {
      try {
        const res = await api.get('/admin/formulir/' + id)
        const d = res.data.formulir || res.data.data
        if (d) {
          setFormulir(d)
          setFormData({
            nama_formulir: d.nama_formulir || '',
            kode_formulir: d.kode_formulir || '',
            kategori: d.kategori || 'Kependudukan',
            deskripsi: d.deskripsi || '',
            persyaratan: d.persyaratan || '',
            is_active: Boolean(d.is_active),
          })
        }
      } catch (err) {
        console.error('Failed to load formulir:', err)
        setError('Gagal memuat informasi formulir.')
      } finally {
        setLoading(false)
      }
    }
    fetchFormulir()
  }, [id])

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
        setNewFileTemplate(null)
        e.target.value = ''
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Ukuran file melebihi batas maksimum 10MB.')
        setNewFileTemplate(null)
        e.target.value = ''
        return
      }
      setError(null)
      setNewFileTemplate(file)
    } else {
      setNewFileTemplate(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setValidationErrors({})

    try {
      const fd = new FormData()
      fd.append('_method', 'PUT')
      fd.append('nama_formulir', formData.nama_formulir)
      if (formData.kode_formulir) fd.append('kode_formulir', formData.kode_formulir)
      fd.append('kategori', formData.kategori)
      if (formData.deskripsi) fd.append('deskripsi', formData.deskripsi)
      if (formData.persyaratan) fd.append('persyaratan', formData.persyaratan)
      fd.append('is_active', formData.is_active ? '1' : '0')

      if (newFileTemplate) {
        fd.append('file_template', newFileTemplate)
      }

      await api.post('/admin/formulir/' + id, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      showAlert({
        type: 'success',
        title: 'Berhasil Diperbarui!',
        message: 'Data template formulir telah berhasil disimpan.',
      })

      router.push('/admin/formulir/' + id)
    } catch (err: any) {
      console.error('Failed to update formulir:', err)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
        setError('Terdapat kesalahan pengisian data. Silakan periksa kolom yang ditandai merah.')
      } else {
        setError(err.response?.data?.message || 'Terjadi kesalahan sistem saat memperbarui formulir.')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout pageTitle="Ubah Formulir">
        <LoadingSpinner message="Memuat informasi formulir..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      pageTitle="Ubah Template Formulir"
      subtitle={`Mengubah data formulir: ${formulir?.nama_formulir || ''}`}
    >
      {/* Breadcrumb Navigation */}
      <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/admin/formulir" className="hover:text-emerald-700 transition">
          Daftar Formulir
        </Link>
        <span>/</span>
        <Link href={`/admin/formulir/${formulir?.id}`} className="hover:text-emerald-700 transition">
          {formulir?.nama_formulir || 'Detail'}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">Ubah</span>
      </nav>

      <PageHeader
        title="Ubah Template Formulir"
        description="Perbarui informasi dokumen atau ganti berkas template yang tersedia."
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
                  required
                  error={validationErrors.nama_formulir?.[0]}
                />
              </div>

              <div>
                <FormInput
                  label="Kode Dokumen"
                  name="kode_formulir"
                  value={formData.kode_formulir}
                  onChange={handleChange}
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
                error={validationErrors.deskripsi?.[0]}
              />
            </div>

            <div>
              <FormTextarea
                label="Persyaratan & Petunjuk Pengisian"
                name="persyaratan"
                value={formData.persyaratan}
                onChange={handleChange}
                rows={4}
                error={validationErrors.persyaratan?.[0]}
              />
            </div>
          </div>

          {/* Penggantian Berkas Template */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 space-y-6">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Berkas Template Dokumen
            </h2>

            {formulir?.file_template && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-emerald-200 text-emerald-700 font-bold text-xs uppercase shadow-xs">
                    {formulir.file_format || 'DOC'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">Berkas Template Tersimpan</p>
                    <p className="text-[11px] text-emerald-700">
                      Telah diunduh sebanyak {formulir.download_count || 0} kali oleh warga
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="rounded-xl border border-emerald-300 bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition inline-flex items-center gap-1.5 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {downloading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
                      <span>Mengunduh...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Unduh Template Saat Ini</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Ganti Berkas Template (Kosongkan jika tidak ingin mengubah berkas)
              </label>
              <input
                type="file"
                accept=".doc,.docx,.pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
              />
              {newFileTemplate && (
                <p className="mt-1.5 text-xs text-emerald-700 font-semibold">
                  ✓ Berkas baru dipilih: {newFileTemplate.name} ({(newFileTemplate.size / 1024).toFixed(1)} KB)
                </p>
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
                    Status apakah formulir ini dapat diunduh oleh warga secara mandiri.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href={`/admin/formulir/${id}`}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 transition"
            >
              {submitting ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Formulir'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
