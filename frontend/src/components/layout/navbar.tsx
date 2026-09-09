import React from 'react'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { useSidebar } from '../../context/SidebarContext'
import { getStorageUrl } from '../../lib/api'

interface NavbarProps {
  title?: string
  subtitle?: string
  onToggleSidebar?: () => void
}

export default function Navbar({ title = 'Dashboard', subtitle = 'Selamat datang kembali', onToggleSidebar }: NavbarProps) {
  const { user, role } = useAuth()
  const { isOpen, toggleSidebar } = useSidebar()

  const handleToggle = onToggleSidebar || toggleSidebar

  const displayName = user?.name || (role === 'admin' ? 'Administrator' : 'Pengguna')
  const initial = displayName.charAt(0).toUpperCase()
  const photoUrl = user?.penduduk?.foto_profil ? getStorageUrl(user.penduduk.foto_profil) : null

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition shadow-sm active:scale-95 ${
              isOpen
                ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/60'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
            onClick={handleToggle}
            title={isOpen ? 'Tutup / Sembunyikan Menu Navigasi' : 'Buka / Tampilkan Menu Navigasi'}
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 line-clamp-1">{title}</h1>
            <p className="text-xs text-slate-500 line-clamp-1">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            prefetch={true}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition duration-150 hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700 active:scale-95"
            title="Kembali ke Halaman Utama (Landing Page)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
            </svg>
            <span className="hidden sm:inline">Ke Landing Page</span>
          </Link>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 shadow-sm">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover shadow-sm border border-slate-200"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                {initial}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800 line-clamp-1">{displayName}</p>
              <p className="text-xs text-slate-500 capitalize">{role || 'Pengguna aktif'}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
