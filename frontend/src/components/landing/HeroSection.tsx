import React from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'

export default function HeroSection() {
  const { user, role, isProfileCompleted } = useAuth()

  const dashboardHref =
    role === 'admin'
      ? '/admin/dashboard'
      : isProfileCompleted
      ? '/user/dashboard'
      : '/user/onboarding/step-1'

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-6">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        Pelayanan Digital Cepat, Akurat & Transparan
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-3xl leading-tight">
        Sistem Informasi Kependudukan & Geotagging
      </h1>

      <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed">
        Platform terpadu untuk pendataan warga, pemetaan lokasi rumah (geotagging), pengajuan surat keterangan daring, serta transparansi penyaluran bantuan sosial.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        {user ? (
          <>
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition duration-200 hover:bg-emerald-400 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Buka Dashboard {role === 'admin' ? 'Admin' : 'Warga'}</span>
              <span>&rarr;</span>
            </Link>
            <Link
              href="/berita"
              className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition duration-200 hover:bg-white/10"
            >
              Lihat Berita & Pengumuman
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-2xl bg-emerald-500 px-8 py-4 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition duration-200 hover:bg-emerald-400 hover:scale-105"
            >
              Masuk ke Portal
            </Link>
            <Link
              href="/register"
              className="rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition duration-200 hover:bg-white/10"
            >
              Daftar Akun Baru
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

