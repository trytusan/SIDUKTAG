import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import PageHeader from '../../../../src/components/ui/page-header'
import FormInput from '../../../../src/components/form/input'
import FormTextarea from '../../../../src/components/form/textarea'
import AlertError from '../../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../../src/components/ui/loading'
import ConfirmModal from '../../../../src/components/modal/Confirm'
import { useAlert } from '../../../../src/context/AlertContext'
import api from '../../../../src/lib/api'
import { KartuKeluarga } from '../../../../src/types'

export default function AdminKartuKeluargaEdit() {
  const router = useRouter()
  const { id } = router.query
  const { showAlert } = useAlert()
  const [kartuKeluarga, setKartuKeluarga] = useState<KartuKeluarga | null>(null)
  const [loadingInitial, setLoadingInitial] = useState(true)

  const [formData, setFormData] = useState({
    nomor_kk: '',
    nama_kepala_keluarga: '',
    alamat_keluarga: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!id) return
    async function fetchEdit() {
      try {
        const res = await api.get('/admin/kartu-keluarga/' + id + '/edit')
        const kk: KartuKeluarga = res.data.kartuKeluarga
        setKartuKeluarga(kk)
        if (kk) {
          setFormData({
            nomor_kk: kk.nomor_kk || '',
            nama_kepala_keluarga: kk.nama_kepala_keluarga || '',
            alamat_keluarga: kk.alamat_keluarga || '',
          })
        }
      } catch (err) {
        console.error('Failed to load edit KK:', err)
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchEdit()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirm(true)
  }

  const handleExecuteSave = async () => {
    setSubmitting(true)
    setError(null)
    setValidationErrors({})

    try {
      await api.put('/admin/kartu-keluarga/' + id, formData)
      setShowConfirm(false)
      router.push('/admin/kartu-keluarga')
      showAlert({
        type: 'success',
        title: 'Berhasil Diperbarui!',
        message: 'Data Kartu Keluarga telah berhasil diperbarui di database.',
        onClose: () => router.push('/admin/kartu-keluarga'),
      })
    } catch (err: any) {
      setShowConfirm(false)
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal memperbarui Kartu Keluarga.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial || !kartuKeluarga) {
    return (
      <AdminLayout pageTitle="Edit Kartu Keluarga">
        <LoadingSpinner message="Memuat form edit KK..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout pageTitle="Edit Kartu Keluarga" subtitle={'No. KK: ' + kartuKeluarga.nomor_kk}>
      <PageHeader
        title="Formulir Edit Kartu Keluarga"
        description="Perbarui informasi kepala keluarga dan alamat"
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

        <form onSubmit={handleFormSubmit} className="mt-6 space-y-5">
          <FormInput
            label="Nomor Kartu Keluarga (16 Digit)"
            name="nomor_kk"
            value={formData.nomor_kk}
            onChange={handleChange}
            maxLength={16}
            required
            error={validationErrors.nomor_kk?.[0]}
          />

          <FormInput
            label="Nama Kepala Keluarga"
            name="nama_kepala_keluarga"
            value={formData.nama_kepala_keluarga}
            onChange={handleChange}
            required
            error={validationErrors.nama_kepala_keluarga?.[0]}
          />

          <FormTextarea
            label="Alamat Keluarga"
            name="alamat_keluarga"
            value={formData.alamat_keluarga}
            onChange={handleChange}
            rows={3}
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
              {submitting ? 'Menyimpan...' : 'Perbarui Kartu Keluarga'}
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Konfirmasi Simpan Perubahan"
        message="Apakah Anda yakin data Kartu Keluarga yang diubah sudah benar dan ingin menyimpan perubahan ini ke sistem?"
        confirmText="Ya, Simpan Perubahan"
        cancelText="Batal / Cek Kembali"
        variant="primary"
        loading={submitting}
        onConfirm={handleExecuteSave}
        onCancel={() => setShowConfirm(false)}
      />
    </AdminLayout>
  )
}
