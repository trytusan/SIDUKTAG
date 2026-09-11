import React from 'react'
import AuthLayout from '../src/components/layouts/auth'
import LoginForm from '../src/components/LoginForm'

export default function LoginPage() {
  return (
    <AuthLayout title="Login — SIDUKTAG">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V8.2a1 1 0 0 1 .4-.8l6-4.5a1 1 0 0 1 1.2 0l6 4.5a1 1 0 0 1 .4.8V21M9 21v-6h6v6" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">SIDUKTAG</h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">Sistem Informasi Kependudukan &amp; Geotagging</p>
        </div>

        <LoginForm />
      </div>
    </AuthLayout>
  )
}
