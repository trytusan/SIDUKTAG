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
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Reset Password</h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">Masukkan password baru Anda untuk mengamankan akun</p>
        </div>

        {status && (
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
            {status}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Password Baru
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Ulangi password baru"
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition duration-200 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Menyimpan Password...' : 'Simpan Password Baru'}
          </button>

          <p className="pt-2 text-center text-xs text-slate-500">
            <Link href="/login" className="font-bold text-emerald-700 hover:text-emerald-800">
              Kembali ke Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}
