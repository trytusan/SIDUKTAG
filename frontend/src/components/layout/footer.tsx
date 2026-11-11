import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
      &copy; {new Date().getFullYear()} SIDULISA — Sistem Informasi Penduduk Lingkungan Saba. All rights reserved.
    </footer>
  )
}
