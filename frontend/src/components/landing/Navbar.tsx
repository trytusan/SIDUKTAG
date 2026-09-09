import React from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, role, isProfileCompleted } = useAuth()

  const dashboardHref =
    role === 'admin'
      ? '/admin/dashboard'
      : isProfileCompleted
      ? '/user/dashboard'
      : '/user/onboarding/step-1'

  return (
    <header className="border-b border-white/10 px-6 py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 font-bold">
            S
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">SIDUKTAG</span>
            <p className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400">Sistem Terintegrasi</p>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold text-emerald-400">
            Beranda
          </Link>
          <Link href="/berita" className="text-sm font-semibold text-slate-300 hover:text-white transition">
            Berita & Informasi
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition hover:from-emerald-400 hover:to-teal-400 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard {role === 'admin' ? 'Admin' : 'Warga'}</span>
              <span className="text-xs">&rarr;</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 shadow-md transition hover:bg-emerald-400"
              >
                Daftar Warga
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

