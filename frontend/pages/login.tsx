import React from 'react'
import AuthLayout from '../src/components/layouts/auth'
import LoginForm from '../src/components/LoginForm'

export default function LoginPage() {
  return (
    <AuthLayout title="Login — SIDUKTAG">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V8.2a1 1 0 0 1 .4-.8l6-4.5a1 1 0 0 1 1.2 0l6 4.5a1 1 0 0 1 .4.8V21M9 21v-6h6v6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">SIDUKTAG</h1>
          <p className="mt-1 text-xs text-slate-300">Sistem Informasi Kependudukan & Geotagging</p>
        </div>

        <LoginForm />
      </div>
    </AuthLayout>
  )
}
