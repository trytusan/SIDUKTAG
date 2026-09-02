import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import UserLayout from '../../../src/components/layouts/user'
import FormInput from '../../../src/components/form/input'
import AlertSuccess from '../../../src/components/ui/alert-success'
import AlertError from '../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../src/components/ui/loading'
import api from '../../../src/lib/api'
import { useAuth } from '../../../src/context/AuthContext'

export default function UserPengaturanAkun() {
  const { user, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccess(null)
    setError(null)
    setValidationErrors({})

    try {
      const res = await api.post('/user/pengaturan/akun', { name, email })
      setSuccess(res.data.message || 'Informasi akun berhasil diperbarui.')
      await refreshUser()
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal memperbarui akun.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <UserLayout pageTitle="Pengaturan Akun" subtitle="Kelola nama pengguna dan alamat email login">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <Link
          href="/user/pengaturan/profil"
          className="border-b-2 border-transparent px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          Profil Kependudukan
        </Link>
        <Link
          href="/user/pengaturan/akun"
          className="border-b-2 border-emerald-600 px-6 py-3 text-sm font-bold text-emerald-600"
        >
          Informasi Akun
        </Link>
        <Link
          href="/user/pengaturan/password"
          className="border-b-2 border-transparent px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          Ganti Password
        </Link>
      </div>

      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Informasi Akun & Email</h2>
          <p className="mt-1 text-xs text-slate-500">Perbarui email yang digunakan untuk masuk ke portal</p>
        </div>

        <AlertSuccess message={success} onClose={() => setSuccess(null)} />
        <AlertError message={error} errors={validationErrors} onClose={() => setError(null)} />

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <FormInput
            label="Nama Akun"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={validationErrors.name?.[0]}
          />

          <FormInput
            label="Alamat Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={validationErrors.email?.[0]}
          />

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Akun'}
            </button>
          </div>
        </form>
      </div>
    </UserLayout>
  )
}
