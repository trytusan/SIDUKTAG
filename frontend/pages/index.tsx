import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../src/context/AuthContext'

export default function HomePage() {
  const router = useRouter()
  const { user, role, isProfileCompleted, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (role === 'admin') {
          router.replace('/admin/dashboard')
        } else if (isProfileCompleted) {
          router.replace('/user/dashboard')
        } else {
          router.replace('/user/onboarding/step-1')
        }
      }
    }
  }, [user, role, isProfileCompleted, loading, router])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Head>
        <title>SIDUKTAG — Sistem Informasi Kependudukan & Geotagging</title>
      </Head>

      {/* Hero Header */}
      <header className="border-b border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 font-bold">
              S
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">SIDUKTAG</span>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400">Sistem Terintegrasi</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
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
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 text-left w-full">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Geotagging Lokasi</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Pemetaan koordinat tempat tinggal warga secara presisi untuk efisiensi distribusi logistik dan bantuan.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Pengajuan Surat Online</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Ajukan surat pengantar, domisili, atau keterangan tidak mampu secara praktis tanpa harus antre.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.5 12a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Bantuan Sosial Terbuka</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Informasi program bantuan sosial pemerintah yang transparan dan dapat dipantau langsung statusnya.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} SIDUKTAG. Sistem Informasi Kependudukan & Geotagging.
      </footer>
    </div>
  )
}
