import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'
import { useSidebar } from '../../context/SidebarContext'
import SidebarAdmin from '../layout/sidebar-admin'
import Navbar from '../layout/navbar'
import Footer from '../layout/footer'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  pageTitle?: string
  subtitle?: string
}

export default function AdminLayout({
  children,
  title = 'Admin Dashboard — SIDUKTAG',
  pageTitle = 'Dashboard Admin',
  subtitle = 'Kelola data kependudukan dan layanan warga',
}: AdminLayoutProps) {
  const { isOpen, closeSidebar } = useSidebar()
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login')
      } else if (role !== 'admin') {
        router.replace('/user/dashboard')
      }
    }
  }, [user, role, loading, router])

  if (loading || !user || role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-800">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-600">Memeriksa hak akses admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex selection:bg-emerald-100 selection:text-emerald-900">
      <Head>
        <title>{title}</title>
      </Head>

      <SidebarAdmin isOpen={isOpen} onClose={closeSidebar} />

      <div
        className={`flex min-h-screen flex-1 flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isOpen ? 'lg:ml-72' : 'lg:ml-0'
        }`}
      >
        <Navbar
          title={pageTitle}
          subtitle={subtitle}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
