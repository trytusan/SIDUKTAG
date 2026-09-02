import React from 'react'
import Link from 'next/link'
import Head from 'next/head'

export default function Custom500() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-white">
      <Head>
        <title>500 — Terjadi Kesalahan Server</title>
      </Head>
      <div className="space-y-4 max-w-md">
        <span className="inline-block rounded-2xl bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-400 border border-amber-500/20">
          Error 500
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Kesalahan Server
        </h1>
        <p className="text-sm text-slate-400">
          Terjadi kendala teknis pada server. Silakan muat ulang atau coba beberapa saat lagi.
        </p>
        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
          >
            &larr; Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
