import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'

interface SidebarAdminProps {
  isOpen?: boolean
  onClose?: () => void
}

interface SubMenuItem {
  label: string
  href: string
}

interface MenuItem {
  label: string
  href?: string
  icon: React.ReactNode
  children?: SubMenuItem[]
}

export default function SidebarAdmin({ isOpen = false, onClose }: SidebarAdminProps) {
  const router = useRouter()
  const { logout } = useAuth()

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({})

  const isChildActive = (children?: SubMenuItem[]) => {
    if (!children) return false
    return children.some((child) => router.pathname.startsWith(child.href))
  }

  const isSingleActive = (path?: string) => {
    if (!path) return false
    if (path === '/admin/dashboard') {
      return router.pathname === '/admin/dashboard' || router.pathname === '/admin'
    }
    return router.pathname.startsWith(path)
  }

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (onClose) onClose()
    }
  }

  const navItems: MenuItem[] = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
        </svg>
      ),
    },
    {
      label: 'Kependudukan',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      children: [
        { label: 'Data Penduduk', href: '/admin/penduduk' },
        { label: 'Data Keluarga', href: '/admin/kartu-keluarga' },
      ],
    },
    {
      label: 'Pemetaan Wilayah',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 6.75V15m6-6v8.25m.503-14.406C14.713 2.39 13.376 2.25 12 2.25s-2.713.14-3.503.594l-4.5 2.571A1.5 1.5 0 003 6.72v11.558a1.5 1.5 0 002.003 1.407l4.497-2.57 5 2.857 4.5-2.571A1.5 1.5 0 0020 16.02V4.462a1.5 1.5 0 00-1.497-1.407l-3.003.539z" />
        </svg>
      ),
      children: [
        { label: 'Peta Sebaran Wilayah', href: '/admin/peta' },
        { label: 'Data Wilayah', href: '/admin/wilayah' },
        { label: 'Tambah Tempat Umum', href: '/admin/wilayah/create' },
      ],
    },
    {
      label: 'Pelayanan Surat',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H5.625A2.625 2.625 0 003 4.875v14.25a2.625 2.625 0 002.625 2.625h12.75A2.625 2.625 0 0021 19.125v-1.5a3.375 3.375 0 00-1.5-2.812Z" />
        </svg>
      ),
      children: [
        { label: 'Pengajuan Surat', href: '/admin/pengajuan-surat' },
        { label: 'Master Jenis Surat', href: '/admin/jenis-surat' },
      ],
    },
    {
      label: 'Bantuan Sosial',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0Z" />
        </svg>
      ),
      children: [
        { label: 'Penerima Bantuan', href: '/admin/bantuan' },
        { label: 'Master Program', href: '/admin/jenis-bantuan' },
      ],
    },
    {
      label: 'Berita & Informasi',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      ),
      children: [
        { label: 'Data Berita & Informasi', href: '/admin/berita' },
        { label: 'Tambah Berita & Informasi', href: '/admin/berita/create' },
      ],
    },
    {
      label: 'Pengaturan',
      href: '/admin/pengaturan',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75A3.75 3.75 0 1012 8.25a3.75 3.75 0 000 7.5Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12a7.5 7.5 0 00-.15-1.5l2.1-1.65-2-3.46-2.55 1a7.5 7.5 0 00-2.6-1.5l-.4-2.7h-4l-.4 2.7a7.5 7.5 0 00-2.6 1.5l-2.55-1-2 3.46 2.1 1.65A7.5 7.5 0 004.5 12c0 .5.05 1 .15 1.5l-2.1 1.65 2 3.46 2.55-1a7.5 7.5 0 002.6 1.5l.4 2.7h4l.4-2.7a7.5 7.5 0 002.6-1.5l2.55 1 2-3.46-2.1-1.65c.1-.5.15-1 .15-1.5Z" />
        </svg>
      ),
    },
  ]

  // Otomatis buka dropdown jika sedang berada di salah satu rute anaknya
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children && isChildActive(item.children)) {
        setOpenMenus((prev) => ({ ...prev, [item.label]: true }))
      }
    })
  }, [router.pathname])

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const activeParentClass = 'bg-white/10 text-white font-medium'
  const inactiveParentClass = 'text-slate-300 hover:bg-white/5 hover:text-white'

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
        className={`fixed top-0 left-0 z-40 flex h-screen w-72 flex-col border-r border-white/10 bg-slate-950 text-slate-200 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <Link href="/" className="group block" title="Lihat Landing Page">
            <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition">SIDUKTAG</h2>
            <p className="mt-1 text-xs font-medium text-emerald-400">Panel Administrator</p>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition active:scale-95"
            title="Tutup / Sembunyikan Menu Navigasi"
            aria-label="Tutup menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map((item) => {
            // Menu Tunggal
            if (!item.children && item.href) {
              const active = isSingleActive(item.href)
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={true}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
                    active ? 'bg-emerald-500/15 text-emerald-300 font-semibold' : inactiveParentClass
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            }

            // Menu dengan Dropdown Submenu
            const isGroupOpen = !!openMenus[item.label]
            const childActive = isChildActive(item.children)

            return (
              <div key={item.label} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleMenu(item.label)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
                    childActive ? activeParentClass : inactiveParentClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-200 ${isGroupOpen ? 'rotate-180 text-emerald-400' : 'text-slate-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Submenu Drawer */}
                {isGroupOpen && (
                  <div className="ml-5 pl-4 border-l border-white/10 space-y-1 pt-1 pb-1">
                    {item.children?.map((child) => {
                      const active =
                        router.pathname === child.href ||
                        (router.pathname.startsWith(child.href + '/') &&
                          !item.children?.some((sibling) => sibling.href !== child.href && router.pathname.startsWith(sibling.href)))
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          prefetch={true}
                          onClick={handleNavClick}
                          className={`block rounded-xl px-3.5 py-2 text-xs transition-colors duration-200 ${
                            active
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                              : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                          }`}
                        >
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Landing Page & Logout */}
        <div className="border-t border-white/10 p-4 space-y-1">
          <Link
            href="/"
            prefetch={true}
            onClick={handleNavClick}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
            </svg>
            <span>Landing Page</span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H9m0 0 3-3m-3 3 3 3" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}