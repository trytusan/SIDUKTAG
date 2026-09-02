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
import api from '../../../../src/lib/api'
import { Bantuan } from '../../../../src/types'

export default function AdminJenisBantuanEdit() {
  const router = useRouter()
  const { id } = router.query
  const [bantuan, setBantuan] = useState<Bantuan | null>(null)
  const [loadingInitial, setLoadingInitial] = useState(true)

  const [formData, setFormData] = useState({
    nama_program: '',
    jenis_bantuan: 'Tunai',
    deskripsi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    status_bantuan: 'Aktif',
    kuota_penerima: '',
    sumber_bantuan: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!id) return
    async function fetchEdit() {
      try {
        const res = await api.get('/admin/jenis-bantuan/' + id + '/edit')
        const b: Bantuan = res.data.jenisBantuan
        setBantuan(b)
        if (b) {
          setFormData({
            nama_program: b.nama_program || '',
            jenis_bantuan: b.jenis_bantuan || 'Tunai',
            deskripsi: b.deskripsi || '',
            tanggal_mulai: b.tanggal_mulai ? b.tanggal_mulai.substring(0, 10) : '',
            tanggal_selesai: b.tanggal_selesai ? b.tanggal_selesai.substring(0, 10) : '',
            status_bantuan: b.status_bantuan || 'Aktif',
            kuota_penerima: b.kuota_penerima ? String(b.kuota_penerima) : '',
            sumber_bantuan: b.sumber_bantuan || '',
          })
        }
      } catch (err) {
        console.error('Failed to load edit jenis bantuan:', err)
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
      await api.put('/admin/jenis-bantuan/' + id, formData)
      router.push('/admin/jenis-bantuan')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal memperbarui program bantuan.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial || !bantuan) {
    return (
      <AdminLayout pageTitle="Edit Program Bantuan">
        <LoadingSpinner message="Memuat form edit program bantuan..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout pageTitle="Edit Program Bantuan" subtitle={'Ubah ' + bantuan.nama_program}>
      <PageHeader
        title="Formulir Edit Program Bantuan"
        description="Perbarui informasi rincian program bantuan sosial"
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
            />

            <FormSelect
              label="Status Bantuan"
              name="status_bantuan"
              value={formData.status_bantuan}
              onChange={handleChange}
              options={['Aktif', 'Nonaktif', 'Selesai']}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Sumber Dana Bantuan"
              name="sumber_bantuan"
              value={formData.sumber_bantuan}
              onChange={handleChange}
            />

            <FormInput
              label="Kuota Penerima"
              type="number"
              name="kuota_penerima"
              value={formData.kuota_penerima}
              onChange={handleChange}
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
              {submitting ? 'Menyimpan...' : 'Perbarui Program'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
