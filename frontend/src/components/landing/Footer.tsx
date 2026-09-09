import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
      &copy; {new Date().getFullYear()} SIDUKTAG. Sistem Informasi Kependudukan & Geotagging.
    </footer>
  )
}

