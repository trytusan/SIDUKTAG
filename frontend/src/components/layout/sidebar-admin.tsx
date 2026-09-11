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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      children: [
        { label: 'Data Penduduk', href: '/admin/penduduk' },
        { label: 'Kartu Keluarga', href: '/admin/kartu-keluarga' },
      ],
    },
    {
      label: 'Peta Wilayah',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-14.406C14.713 2.39 13.376 2.25 12 2.25s-2.713.14-3.503.594l-4.5 2.571A1.5 1.5 0 003 6.72v11.558a1.5 1.5 0 002.003 1.407l4.497-2.57 5 2.857 4.5-2.571A1.5 1.5 0 0020 16.02V4.462a1.5 1.5 0 00-1.497-1.407l-3.003.539z" />
        </svg>
      ),
      children: [
        { label: 'Data Wilayah', href: '/admin/wilayah' },
        { label: 'Peta Wilayah', href: '/admin/peta' },
      ],
    },
    {
      label: 'Layanan Surat',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H5.625A2.625 2.625 0 003 4.875v14.25a2.625 2.625 0 002.625 2.625h12.75A2.625 2.625 0 0021 19.125v-1.5a3.375 3.375 0 00-1.5-2.812Z" />
        </svg>
      ),
      children: [
        { label: 'Pengajuan Surat', href: '/admin/pengajuan-surat' },
        { label: 'Jenis Surat', href: '/admin/jenis-surat' },
      ],
    },
    {
      label: 'Bantuan Sosial',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Z" />
        </svg>
      ),
      children: [
        { label: 'Data Bantuan', href: '/admin/bantuan' },
        { label: 'Jenis Bantuan', href: '/admin/jenis-bantuan' },
      ],
    },
    {
      label: 'Berita & Informasi',
      href: '/admin/berita',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
        </svg>
      ),
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

  const activeParentClass = 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600 shadow-xs'
  const inactiveParentClass = 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'

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
              Panel Administrator
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
                    active ? activeParentClass : inactiveParentClass
                  }`}
                >
                  <div className={active ? 'text-emerald-700' : 'text-slate-400'}>
                    {item.icon}
                  </div>
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
                    <div className={childActive ? 'text-emerald-700' : 'text-slate-400'}>
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-200 ${isGroupOpen ? 'rotate-180 text-emerald-700' : 'text-slate-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Submenu Drawer */}
                {isGroupOpen && (
                  <div className="ml-5 pl-4 border-l border-slate-200 space-y-1 pt-1 pb-1">
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
                              ? 'bg-emerald-50 text-emerald-800 font-bold'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
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