import React from 'react'
import Link from 'next/link'

interface ActionButton {
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
}

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ActionButton[]
  children?: React.ReactNode
}

export default function PageHeader({
  title,
  description,
  actions = [],
  children,
}: PageHeaderProps) {
  const buttonStyles = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-700/20 shadow-sm',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-red-700/20 shadow-sm',
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {actions.map((action, i) => {
          const style = `inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 ${
            buttonStyles[action.variant || 'primary']
          }`

          if (action.href) {
            return (
              <Link key={i} href={action.href} className={style}>
                {action.icon}
                <span>{action.label}</span>
              </Link>
            )
          }

          return (
            <button key={i} type="button" onClick={action.onClick} className={style}>
              {action.icon}
              <span>{action.label}</span>
            </button>
          )
        })}
        {children}
      </div>
    </div>
  )
}
