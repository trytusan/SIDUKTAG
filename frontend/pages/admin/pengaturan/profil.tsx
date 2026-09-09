import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import FormInput from '../../../src/components/form/input'
import AlertSuccess from '../../../src/components/ui/alert-success'
import AlertError from '../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../src/components/ui/loading'
import ConfirmModal from '../../../src/components/modal/Confirm'
import api from '../../../src/lib/api'
import { useAuth } from '../../../src/context/AuthContext'
import { useAlert } from '../../../src/context/AlertContext'
import { User } from '../../../src/types'

export default function AdminPengaturanProfil() {
  const { showAlert } = useAlert()
  const { user, refreshUser } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    telepon: user?.telepon || '',
    jabatan: user?.jabatan || '',
  })
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    async function fetchProfil() {
      try {
        const res = await api.get('/admin/pengaturan/profil')
        const u: User = res.data.user
        if (u) {
          setFormData({
            name: u.name || '',
            email: u.email || '',
            telepon: u.telepon || '',
            jabatan: u.jabatan || '',
          })
        }
      } catch (err) {
        console.error('Failed to load admin profile:', err)
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchProfil()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirm(true)
  }

  const handleExecuteSave = async () => {
    setSubmitting(true)
    setSuccess(null)
    setError(null)
    setValidationErrors({})

    try {
      const res = await api.post('/admin/pengaturan/profil', formData)
      setSuccess(res.data.message || 'Profil berhasil diperbarui.')
      const msg = res.data.message || 'Profil berhasil diperbarui.'
      setSuccess(msg)
      setShowConfirm(false)
      await refreshUser()
      showAlert({
        type: 'success',
        title: 'Profil Diperbarui!',
        message: msg,
      })
    } catch (err: any) {
      setShowConfirm(false)
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal memperbarui profil admin.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial) {
    return (
      <AdminLayout pageTitle="Pengaturan Profil Admin">
        <LoadingSpinner message="Memuat profil admin..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout pageTitle="Pengaturan Admin" subtitle="Kelola data profil dan akun administrator">
      <div className="flex border-b border-slate-200">
        <Link
          href="/admin/pengaturan/profil"
          className="border-b-2 border-emerald-600 px-6 py-3 text-sm font-bold text-emerald-600"
        >
          Profil Administrator
        </Link>
        <Link
          href="/admin/pengaturan/akun"
          className="border-b-2 border-transparent px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          Informasi Akun
        </Link>
        <Link
          href="/admin/pengaturan/password"
          className="border-b-2 border-transparent px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          Ganti Password
        </Link>
      </div>

      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Edit Profil Administrator</h2>
          <p className="mt-1 text-xs text-slate-500">Perbarui identitas dan jabatan petugas</p>
        </div>

        <AlertSuccess message={success} onClose={() => setSuccess(null)} />
        <AlertError message={error} errors={validationErrors} onClose={() => setError(null)} />

        <form onSubmit={handleFormSubmit} className="mt-6 space-y-5">
          <FormInput
            label="Nama Lengkap Petugas"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            error={validationErrors.name?.[0]}
          />

          <FormInput
            label="Alamat Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={validationErrors.email?.[0]}
          />

          <FormInput
            label="Nomor Telepon / HP"
            name="telepon"
            value={formData.telepon}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
            error={validationErrors.telepon?.[0]}
          />

          <FormInput
            label="Jabatan / Posisi"
            name="jabatan"
            value={formData.jabatan}
            onChange={handleChange}
            placeholder="Contoh: Kasi Pelayanan, Operator Desa"
            error={validationErrors.jabatan?.[0]}
          />

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Konfirmasi Simpan Profil"
        message="Apakah Anda yakin data profil administrator yang diubah sudah benar?"
        confirmText="Ya, Simpan Profil"
        cancelText="Batal / Cek Kembali"
        variant="primary"
        loading={submitting}
        onConfirm={handleExecuteSave}
        onCancel={() => setShowConfirm(false)}
      />
    </AdminLayout>
  )
}
