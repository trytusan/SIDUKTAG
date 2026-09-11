import React, { useState } from 'react'
import Link from 'next/link'
import AuthLayout from '../src/components/layouts/auth'
import { forgotPassword } from '../src/lib/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setStatus(null)

    try {
      const res = await forgotPassword(email)
      setStatus(res?.status || res?.message || 'Tautan reset password telah dikirim ke email Anda.')
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.email?.[0] ||
        'Gagal mengirim tautan reset password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Lupa Password — SIDUKTAG">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.875a4.5 4.5 0 10-9 0V10.5m-.75 0h10.5A2.25 2.25 0 0119.5 12.75v5.25a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18v-5.25A2.25 2.25 0 016.75 10.5Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Lupa Password?</h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Masukkan email terdaftar Anda untuk menerima tautan atur ulang password.
          </p>
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
              Email Terdaftar
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition duration-200 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Mengirim Tautan...' : 'Kirim Tautan Reset'}
          </button>

          <p className="pt-2 text-center text-xs text-slate-500">
            Ingat password Anda?{' '}
            <Link href="/login" className="font-bold text-emerald-700 hover:text-emerald-800">
              Kembali ke Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}
