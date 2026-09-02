import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'
import SidebarUser from '../layout/sidebar-user'
import Navbar from '../layout/navbar'
import Footer from '../layout/footer'

interface UserLayoutProps {
  children: React.ReactNode
  title?: string
  pageTitle?: string
  subtitle?: string
}

export default function UserLayout({
  children,
  title = 'Portal Warga — SIDUKTAG',
  pageTitle = 'Dashboard Saya',
  subtitle = 'Layanan informasi dan pengajuan surat online',
}: UserLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, role, isProfileCompleted, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login')
      } else if (role === 'admin') {
        router.replace('/admin/dashboard')
      } else if (!isProfileCompleted && !router.pathname.startsWith('/user/onboarding')) {
        router.replace('/user/onboarding/step-1')
      }
    }
  }, [user, role, isProfileCompleted, loading, router])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-300">Memuat data pengguna...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Head>
        <title>{title}</title>
      </Head>

      <SidebarUser isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-72 flex min-h-screen flex-1 flex-col min-w-0">
        <Navbar
          title={pageTitle}
          subtitle={subtitle}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
