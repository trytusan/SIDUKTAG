import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../src/context/AuthContext'

export default function DashboardRouter() {
  const router = useRouter()
  const { user, role, isProfileCompleted, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login')
      } else if (role === 'admin') {
        router.replace('/admin/dashboard')
      } else if (isProfileCompleted) {
        router.replace('/user/dashboard')
      } else {
        router.replace('/user/onboarding/step-1')
      }
    }
  }, [user, role, isProfileCompleted, loading, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-100">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent"></div>
        <p className="text-sm font-medium text-slate-300">Mengarahkan ke dashboard...</p>
      </div>
    </div>
  )
}
