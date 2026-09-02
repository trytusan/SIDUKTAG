import React from 'react'

interface StatusBadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | string
}

export default function StatusBadge({ children, variant }: StatusBadgeProps) {
  const text = String(children || '').toLowerCase()

  let selectedVariant = variant

  if (!selectedVariant) {
    if (['selesai', 'diterima', 'disetujui', 'aktif', 'tetap', 'laki-laki'].includes(text)) {
      selectedVariant = 'success'
    } else if (['menunggu', 'diproses', 'perempuan', 'pendatang'].includes(text)) {
      selectedVariant = 'warning'
    } else if (['ditolak', 'nonaktif', 'meninggal', 'pindah'].includes(text)) {
      selectedVariant = 'danger'
    } else {
      selectedVariant = 'neutral'
    }
  }

  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    info: 'bg-sky-50 text-sky-700 border-sky-200/80',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200/80',
  }[selectedVariant as 'success' | 'warning' | 'danger' | 'info' | 'neutral'] || 'bg-slate-50 text-slate-700 border-slate-200/80'

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${styles}`}>
      {children}
    </span>
  )
}
