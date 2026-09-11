import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AuthLayout({ children, title = 'Autentikasi — SIDUKTAG' }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 selection:bg-emerald-100 selection:text-emerald-900">
      <Head>
        <title>{title}</title>
      </Head>

      {/* Decorative Warm Slate Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-sky-100/60 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition"
          >
            <span>&larr;</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
