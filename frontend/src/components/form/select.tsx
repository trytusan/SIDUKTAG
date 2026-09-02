import React from 'react'

export interface Option {
  value: string | number
  label: string
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options?: (Option | string | number)[] | Record<string, string>
  placeholder?: string
}

export default function FormSelect({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Pilih salah satu',
  className = '',
  id,
  name,
  children,
  ...props
}: FormSelectProps) {
  const selectId = id || name

  let normalizedOptions: Option[] = []

  if (Array.isArray(options)) {
    normalizedOptions = options.map((opt) => {
      if (typeof opt === 'object' && opt !== null && 'value' in opt) {
        return opt as Option
      }
      return { value: opt as string | number, label: String(opt) }
    })
  } else if (typeof options === 'object' && options !== null) {
    normalizedOptions = Object.entries(options).map(([value, label]) => ({
      value,
      label: String(label),
    }))
  }

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-2 block text-sm font-medium text-slate-700">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          name={name}
          className={`w-full appearance-none rounded-2xl border bg-white px-4 py-3 pr-10 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
            error ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 hover:border-slate-300'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {normalizedOptions.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
    </div>
  )
}
