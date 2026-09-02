import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AuthLayout from '../src/components/layouts/auth'
import { resetPassword } from '../src/lib/auth'

export default function ResetPasswordPage() {
  const router = useRouter()
  const token = (router.query.token as string) || ''
  const initialEmail = (router.query.email as string) || ''

  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Sync email from query once available
  React.useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email as string)
    }
  }, [router.query.email])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setStatus(null)

    try {
      const res = await resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      setStatus(res?.message || 'Password berhasil diatur ulang. Mengalihkan ke halaman login...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.email?.[0] ||
        err?.response?.data?.errors?.password?.[0] ||
        'Gagal mengatur ulang password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset Password — SIDUKTAG">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Reset Password</h1>
          <p className="mt-1 text-xs text-slate-300">Masukkan password baru Anda untuk mengamankan akun</p>
        </div>

        {status && (
          <div className="mb-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/20 p-4 text-xs font-medium text-emerald-200">
            {status}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-red-400/30 bg-red-500/20 p-4 text-xs font-medium text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Password Baru
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-400 focus:bg-white/15 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Ulangi password baru"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-400 focus:bg-white/15 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-950/40 transition duration-200 hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Menyimpan Password...' : 'Simpan Password Baru'}
          </button>

          <p className="pt-2 text-center text-xs text-slate-300">
            <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Kembali ke Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}
