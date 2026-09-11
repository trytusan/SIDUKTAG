import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'

interface SidebarUserProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function SidebarUser({ isOpen = false, onClose }: SidebarUserProps) {
  const router = useRouter()
  const { logout, user } = useAuth()

  const isActive = (path: string) => {
    if (path === '/user/dashboard') {
      return router.pathname === '/user/dashboard' || router.pathname === '/user'
    }
    return router.pathname.startsWith(path)
  }

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (onClose) onClose()
    }
  }

  const activeClass = 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-xs'
  const inactiveClass = 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'

  const navItems = [
    {
      label: 'Dashboard Saya',
      href: '/user/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
        </svg>
      ),
    },
    {
      label: 'Kartu Keluarga',
      href: '/user/kartu-keluarga',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7.5 12 3l9 4.5M4.5 10.5V15A7.5 7.5 0 0 0 12 22.5 7.5 7.5 0 0 0 19.5 15v-4.5" />
        </svg>
      ),
    },
    {
      label: 'Pengajuan Surat',
      href: '/user/pengajuan-surat',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H5.625A2.625 2.625 0 0 0 3 4.875v14.25a2.625 2.625 0 0 0 2.625 2.625h12.75A2.625 2.625 0 0 0 21 19.125v-1.5a3.375 3.375 0 0 0-1.5-2.812Z" />
        </svg>
      ),
    },
    {
      label: 'Bantuan Sosial',
      href: '/user/bantuan',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.5 12a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Z" />
        </svg>
      ),
    },
    {
      label: 'Peta Wilayah',
      href: '/user/peta',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 6.75V15m6-6v8.25m.503-14.406C14.713 2.39 13.376 2.25 12 2.25s-2.713.14-3.503.594l-4.5 2.571A1.5 1.5 0 003 6.72v11.558a1.5 1.5 0 002.003 1.407l4.497-2.57 5 2.857 4.5-2.571A1.5 1.5 0 0020 16.02V4.462a1.5 1.5 0 00-1.497-1.407l-3.003.539z" />
        </svg>
      ),
    },
    {
      label: 'Pengaturan Profil',
      href: '/user/pengaturan',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75A3.75 3.75 0 1 0 12 8.25a3.75 3.75 0 0 0 0 7.5Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12a7.5 7.5 0 0 0-.15-1.5l2.1-1.65-2-3.46-2.55 1a7.5 7.5 0 0 0-2.6-1.5l-.4-2.7h-4l-.4 2.7a7.5 7.5 0 0 0-2.6 1.5l-2.55-1-2 3.46 2.1 1.65A7.5 7.5 0 0 0 4.5 12c0 .5.05 1 .15 1.5l-2.1 1.65 2 3.46 2.55-1a7.5 7.5 0 0 0 2.6 1.5l.4 2.7h4l.4-2.7a7.5 7.5 0 0 0 2.6-1.5l2.55 1 2-3.46-2.1-1.65c.1-.5.15-1 .15-1.5Z" />
        </svg>
      ),
    },
  ]

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-white text-slate-700 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <Link href="/" className="group block" title="Lihat Landing Page">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
              SIDUKTAG
            </h2>
            <p className="mt-0.5 text-[11px] font-bold tracking-wider uppercase text-emerald-700">
              Portal Warga
            </p>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition active:scale-95 lg:hidden"
            title="Tutup Menu Navigasi"
            aria-label="Tutup menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onClick={handleNavClick}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
                  active ? activeClass : inactiveClass
                }`}
              >
                <div className={active ? 'text-emerald-700' : 'text-slate-400'}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Landing Page & Logout */}
        <div className="border-t border-slate-200 p-4 bg-slate-50/70 space-y-1.5">
          <Link
            href="/"
            prefetch={true}
            onClick={handleNavClick}
            className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
            </svg>
            <span>Ke Landing Page</span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H9m0 0 3-3m-3 3 3 3" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
