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

  const activeClass = 'bg-emerald-500/15 text-emerald-300 font-semibold'
  const inactiveClass = 'text-slate-300 hover:bg-white/5 hover:text-white'

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
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 flex h-screen w-72 flex-col border-r border-white/10 bg-slate-950 text-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">SIDUKTAG</h2>
            <p className="mt-1 text-xs font-medium text-emerald-400">Portal Warga / Masyarakat</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Tutup menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
                  active ? activeClass : inactiveClass
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H9m0 0 3-3m-3 3 3 3" />
            </svg>
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  )
}
