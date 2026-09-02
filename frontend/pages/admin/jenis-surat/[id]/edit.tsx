import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import PageHeader from '../../../../src/components/ui/page-header'
import FormInput from '../../../../src/components/form/input'
import FormTextarea from '../../../../src/components/form/textarea'
import FormSelect from '../../../../src/components/form/select'
import FormFile from '../../../../src/components/form/file'
import AlertError from '../../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api, { getStorageUrl } from '../../../../src/lib/api'
import { JenisSurat } from '../../../../src/types'

export default function AdminJenisSuratEdit() {
  const router = useRouter()
  const { id } = router.query
  const [jenisSurat, setJenisSurat] = useState<JenisSurat | null>(null)
  const [loadingInitial, setLoadingInitial] = useState(true)

  const [formData, setFormData] = useState({
    nama: '',
    slug: '',
    deskripsi: '',
    is_active: '1',
  })
  const [templateFile, setTemplateFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!id) return
    async function fetchEdit() {
      try {
        const res = await api.get('/admin/jenis-surat/' + id + '/edit')
        const js: JenisSurat = res.data.jenisSurat
        setJenisSurat(js)
        if (js) {
          setFormData({
            nama: js.nama || '',
            slug: js.slug || '',
            deskripsi: js.deskripsi || '',
            is_active: js.is_active ? '1' : '0',
          })
        }
      } catch (err) {
        console.error('Failed to load edit jenis surat:', err)
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchEdit()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setValidationErrors({})

    try {
      const payload = new FormData()
      payload.append('_method', 'PUT')
      payload.append('nama', formData.nama)
      payload.append('slug', formData.slug)
      payload.append('deskripsi', formData.deskripsi)
      payload.append('is_active', formData.is_active)
      if (templateFile) {
        payload.append('template_file', templateFile)
      }

      await api.post('/admin/jenis-surat/' + id, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      router.push('/admin/jenis-surat')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal memperbarui jenis surat.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial || !jenisSurat) {
    return (
      <AdminLayout pageTitle="Edit Jenis Surat">
        <LoadingSpinner message="Memuat form edit jenis surat..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout pageTitle="Edit Jenis Surat" subtitle={'Ubah ' + jenisSurat.nama}>
      <PageHeader
        title="Formulir Edit Jenis Surat"
        description="Perbarui nama, deskripsi, atau status keaktifan jenis surat"
        actions={[
          {
            label: 'Batal & Kembali',
            href: '/admin/jenis-surat',
            variant: 'secondary',
          },
        ]}
      />

      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <AlertError message={error} errors={validationErrors} />

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <FormInput
            label="Nama Jenis Surat"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
            error={validationErrors.nama?.[0]}
          />

          <FormInput
            label="Kode / Slug Unik"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            error={validationErrors.slug?.[0]}
          />

          <FormTextarea
            label="Deskripsi / Petunjuk Pengajuan"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows={3}
          />

          <FormSelect
            label="Status Keaktifan"
            name="is_active"
            value={formData.is_active}
            onChange={handleChange}
            options={[
              { value: '1', label: 'Aktif (Dapat diajukan warga)' },
              { value: '0', label: 'Nonaktif' },
            ]}
          />

          <FormFile
            label="Ganti Template File (Opsional)"
            accept=".doc,.docx,.pdf"
            currentFileUrl={jenisSurat.template_file ? getStorageUrl(jenisSurat.template_file) : null}
            onChange={(e) => {
              if (e.target.files?.[0]) setTemplateFile(e.target.files[0])
            }}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/admin/jenis-surat"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Perbarui Jenis Surat'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
