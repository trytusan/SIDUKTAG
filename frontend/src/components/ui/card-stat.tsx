import React from 'react'

interface CardStatProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  variant?: 'emerald' | 'blue' | 'amber' | 'violet' | 'rose'
}

export default function CardStat({
  title,
  value,
  description,
  icon,
  variant = 'emerald',
}: CardStatProps) {
  const bgColors = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-sky-50 text-sky-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
    rose: 'bg-rose-50 text-rose-600',
  }

  const defaultIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-800">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bgColors[variant]}`}>
          {icon || defaultIcon}
        </div>
      </div>
      {description && <p className="mt-3 text-xs text-slate-500">{description}</p>}
    </div>
  )
}
