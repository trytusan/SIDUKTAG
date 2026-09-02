import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import FormInput from '../../../src/components/form/input'
import FormTextarea from '../../../src/components/form/textarea'
import FormSelect from '../../../src/components/form/select'
import AlertError from '../../../src/components/ui/alert-error'
import api from '../../../src/lib/api'

export default function AdminJenisBantuanCreate() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nama_program: '',
    jenis_bantuan: 'Tunai',
    deskripsi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    status_bantuan: 'Aktif',
    kuota_penerima: '',
    sumber_bantuan: 'Pemerintah Pusat',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

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
      await api.post('/admin/jenis-bantuan', formData)
      router.push('/admin/jenis-bantuan')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal menambahkan program bantuan.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout pageTitle="Tambah Program Bantuan" subtitle="Buat program bantuan sosial baru">
      <PageHeader
        title="Formulir Tambah Program Bantuan"
        description="Lengkapi nama program, jenis, sumber dana, kuota penerima, dan periode"
        actions={[
          {
            label: 'Batal & Kembali',
            href: '/admin/jenis-bantuan',
            variant: 'secondary',
          },
        ]}
      />

      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <AlertError message={error} errors={validationErrors} />

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <FormInput
            label="Nama Program Bantuan"
            name="nama_program"
            value={formData.nama_program}
            onChange={handleChange}
            placeholder="Contoh: Bantuan Langsung Tunai (BLT) DD"
            required
            error={validationErrors.nama_program?.[0]}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormSelect
              label="Jenis Bantuan"
              name="jenis_bantuan"
              value={formData.jenis_bantuan}
              onChange={handleChange}
              options={['Tunai', 'Sembako / Pangan', 'Kesehatan', 'Pendidikan', 'Infrastruktur', 'Lainnya']}
              required
              error={validationErrors.jenis_bantuan?.[0]}
            />

            <FormSelect
              label="Status Bantuan"
              name="status_bantuan"
              value={formData.status_bantuan}
              onChange={handleChange}
              options={['Aktif', 'Nonaktif', 'Selesai']}
              required
              error={validationErrors.status_bantuan?.[0]}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Sumber Dana Bantuan"
              name="sumber_bantuan"
              value={formData.sumber_bantuan}
              onChange={handleChange}
              placeholder="Contoh: APBN, APBD, Dana Desa"
            />

            <FormInput
              label="Kuota Penerima (Jiwa / KK)"
              type="number"
              name="kuota_penerima"
              value={formData.kuota_penerima}
              onChange={handleChange}
              placeholder="Contoh: 100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Tanggal Mulai"
              type="date"
              name="tanggal_mulai"
              value={formData.tanggal_mulai}
              onChange={handleChange}
            />

            <FormInput
              label="Tanggal Selesai"
              type="date"
              name="tanggal_selesai"
              value={formData.tanggal_selesai}
              onChange={handleChange}
            />
          </div>

          <FormTextarea
            label="Deskripsi & Kriteria Penerima"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows={3}
            placeholder="Kriteria warga yang berhak menerima bantuan ini..."
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/admin/jenis-bantuan"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Program'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
