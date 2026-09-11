import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AuthLayout from '../src/components/layouts/auth'
import { useAuth } from '../src/context/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      router.push('/user/onboarding/step-1')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || err?.message || 'Registrasi gagal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Daftar Akun Warga — SIDUKTAG">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.765z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Daftar Akun Baru</h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">Buat akun warga untuk mengakses layanan desa online</p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
            {validationErrors.name && (
              <p className="mt-1 text-xs text-rose-600">{validationErrors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
            {validationErrors.email && (
              <p className="mt-1 text-xs text-rose-600">{validationErrors.email[0]}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
            {validationErrors.password && (
              <p className="mt-1 text-xs text-rose-600">{validationErrors.password[0]}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Ulangi password"
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition duration-200 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
          </button>

          <p className="pt-2 text-center text-xs text-slate-500">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-bold text-emerald-700 hover:text-emerald-800">
              Login di sini
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}
