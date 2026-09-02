import React from 'react'
import Head from 'next/head'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AuthLayout({ children, title = 'Autentikasi — SIDUKTAG' }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4 overflow-hidden">
      <Head>
        <title>{title}</title>
      </Head>

      {/* Decorative Blur Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[32rem] w-[32rem] rounded-full bg-emerald-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
