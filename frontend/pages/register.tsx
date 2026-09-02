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
      <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.765z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Daftar Akun Baru</h1>
          <p className="mt-1 text-xs text-slate-300">Buat akun warga untuk mengakses layanan kelurahan/desa</p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/20 p-4 text-xs font-medium text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-400 focus:bg-white/15 focus:ring-2 focus:ring-emerald-400/20"
            />
            {validationErrors.name && (
              <p className="mt-1 text-xs text-red-300">{validationErrors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-400 focus:bg-white/15 focus:ring-2 focus:ring-emerald-400/20"
            />
            {validationErrors.email && (
              <p className="mt-1 text-xs text-red-300">{validationErrors.email[0]}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-400 focus:bg-white/15 focus:ring-2 focus:ring-emerald-400/20"
            />
            {validationErrors.password && (
              <p className="mt-1 text-xs text-red-300">{validationErrors.password[0]}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Ulangi password"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-400 focus:bg-white/15 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/40 transition duration-200 hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
          </button>

          <p className="pt-2 text-center text-xs text-slate-300">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Login di sini
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}
