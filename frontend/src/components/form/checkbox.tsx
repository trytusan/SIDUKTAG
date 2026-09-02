import React from 'react'

interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode
  error?: string
}

export default function FormCheckbox({
  label,
  error,
  className = '',
  id,
  name,
  ...props
}: FormCheckboxProps) {
  const checkboxId = id || name

  return (
    <div>
      <label htmlFor={checkboxId} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700 select-none">
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          className={`h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/30 ${className}`}
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}
