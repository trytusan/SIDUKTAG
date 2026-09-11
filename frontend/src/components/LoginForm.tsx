import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Preload potential destination routes into browser cache
  useEffect(() => {
    router.prefetch('/admin/dashboard')
    router.prefetch('/user/dashboard')
    router.prefetch('/user/onboarding/step-1')
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await login({ email, password, remember: remember ? 1 : 0 })
      if (res?.role === 'admin' || res?.redirect === '/admin/dashboard') {
        router.replace('/admin/dashboard')
      } else if (res?.redirect) {
        if (res.redirect.startsWith('http://') || res.redirect.startsWith('https://')) {
          const url = new URL(res.redirect)
          router.replace(url.pathname)
        } else {
          router.replace(res.redirect)
        }
      } else if (res?.is_profile_completed) {
        router.replace('/user/dashboard')
      } else {
        router.replace('/user/onboarding/step-1')
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.email?.[0] ||
        err?.message ||
        'Login gagal. Periksa kembali email dan password Anda.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
          Email
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75a17.933 17.933 0 0 1-7.5-1.632Z" />
            </svg>
          </span>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            required
            className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 py-3 pl-12 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
          Password
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.875a4.5 4.5 0 1 0-9 0V10.5m-.75 0h10.5A2.25 2.25 0 0 1 19.5 12.75v5.25a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18v-5.25A2.25 2.25 0 0 1 6.75 10.5Z" />
            </svg>
          </span>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 py-3 pl-12 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            name="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>Ingat saya</span>
        </label>

        <Link href="/forgot-password" className="text-emerald-700 font-medium transition hover:text-emerald-800">
          Lupa password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition duration-200 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Memproses...</span>
          </div>
        ) : (
          'Masuk ke Akun'
        )}
      </button>

      <p className="pt-2 text-center text-xs text-slate-500">
        Belum punya akun warga?{' '}
        <Link href="/register" className="font-bold text-emerald-700 hover:text-emerald-800">
          Daftar Sekarang
        </Link>
      </p>
    </form>
  )
}
