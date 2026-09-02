import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { getStorageUrl } from '../../lib/api'

interface NavbarProps {
  title?: string
  subtitle?: string
  onToggleSidebar?: () => void
}

export default function Navbar({ title = 'Dashboard', subtitle = 'Selamat datang kembali', onToggleSidebar }: NavbarProps) {
  const { user, role } = useAuth()

  const displayName = user?.name || (role === 'admin' ? 'Administrator' : 'Pengguna')
  const initial = displayName.charAt(0).toUpperCase()
  const photoUrl = user?.penduduk?.foto_profil ? getStorageUrl(user.penduduk.foto_profil) : null

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden"
            onClick={onToggleSidebar}
            aria-label="Buka menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{title}</h1>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
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
