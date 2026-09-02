import React, { useState } from 'react'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import FormInput from '../../../src/components/form/input'
import AlertSuccess from '../../../src/components/ui/alert-success'
import AlertError from '../../../src/components/ui/alert-error'
import { changePassword } from '../../../src/lib/auth'

export default function AdminPengaturanPassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccess(null)
    setError(null)
    setValidationErrors({})

    try {
      const res = await changePassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      })

      setSuccess(res.message || 'Password administrator berhasil diperbarui.')
      setCurrentPassword('')
      setPassword('')
      setPasswordConfirmation('')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal mengubah password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout pageTitle="Ganti Password Admin" subtitle="Perbarui kata sandi akun administrator">
      <div className="flex border-b border-slate-200">
        <Link
          href="/admin/pengaturan/profil"
          className="border-b-2 border-transparent px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-800"
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
          className="border-b-2 border-emerald-600 px-6 py-3 text-sm font-bold text-emerald-600"
        >
          Ganti Password
        </Link>
      </div>

      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Ubah Kata Sandi Admin</h2>
          <p className="mt-1 text-xs text-slate-500">
            Gunakan password minimal 8 karakter dengan kombinasi huruf dan angka
          </p>
        </div>

        <AlertSuccess message={success} onClose={() => setSuccess(null)} />
        <AlertError message={error} errors={validationErrors} onClose={() => setError(null)} />

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <FormInput
            label="Password Saat Ini"
            type="password"
            name="current_password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
            error={validationErrors.current_password?.[0]}
          />

          <FormInput
            label="Password Baru"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 8 karakter"
            required
            error={validationErrors.password?.[0]}
          />

          <FormInput
            label="Konfirmasi Password Baru"
            type="password"
            name="password_confirmation"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="Ulangi password baru"
            required
          />

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Perbarui Password'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
