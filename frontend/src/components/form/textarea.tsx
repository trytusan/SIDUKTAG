import React from 'react'

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export default function FormTextarea({
  label,
  error,
  helperText,
  className = '',
  id,
  name,
  rows = 3,
  ...props
}: FormTextareaProps) {
  const textareaId = id || name

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="mb-2 block text-sm font-medium text-slate-700">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        rows={rows}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
          error ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 hover:border-slate-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
    </div>
  )
}
