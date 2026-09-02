import React from 'react'

export default function LoadingSpinner({ message = 'Memuat data...' }: { message?: string }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 p-8 text-slate-500">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}
