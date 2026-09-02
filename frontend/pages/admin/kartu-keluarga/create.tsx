import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import FormInput from '../../../src/components/form/input'
import FormTextarea from '../../../src/components/form/textarea'
import AlertError from '../../../src/components/ui/alert-error'
import api from '../../../src/lib/api'

export default function AdminKartuKeluargaCreate() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nomor_kk: '',
    nama_kepala_keluarga: '',
    alamat_keluarga: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setValidationErrors({})

    try {
      await api.post('/admin/kartu-keluarga', formData)
      router.push('/admin/kartu-keluarga')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal menambahkan Kartu Keluarga.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout pageTitle="Tambah Kartu Keluarga" subtitle="Pencatatan data Kartu Keluarga baru">
      <PageHeader
        title="Formulir Kartu Keluarga Baru"
        description="Masukkan nomor KK, nama kepala keluarga, dan alamat domisili"
        actions={[
          {
            label: 'Batal & Kembali',
            href: '/admin/kartu-keluarga',
            variant: 'secondary',
          },
        ]}
      />

      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <AlertError message={error} errors={validationErrors} />

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <FormInput
            label="Nomor Kartu Keluarga (16 Digit)"
            name="nomor_kk"
            value={formData.nomor_kk}
            onChange={handleChange}
            maxLength={16}
            placeholder="16 Digit No. KK"
            required
            error={validationErrors.nomor_kk?.[0]}
          />

          <FormInput
            label="Nama Kepala Keluarga"
            name="nama_kepala_keluarga"
            value={formData.nama_kepala_keluarga}
            onChange={handleChange}
            placeholder="Nama lengkap kepala keluarga"
            required
            error={validationErrors.nama_kepala_keluarga?.[0]}
          />

          <FormTextarea
            label="Alamat Keluarga"
            name="alamat_keluarga"
            value={formData.alamat_keluarga}
            onChange={handleChange}
            rows={3}
            placeholder="Alamat rumah keluarga"
            required
            error={validationErrors.alamat_keluarga?.[0]}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/admin/kartu-keluarga"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Kartu Keluarga'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
