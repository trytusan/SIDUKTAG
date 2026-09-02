import React from 'react'

interface FormFileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  currentFileUrl?: string | null
}

export default function FormFile({
  label,
  error,
  helperText,
  currentFileUrl,
  className = '',
  id,
  name,
  ...props
}: FormFileProps) {
  const fileId = id || name

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={fileId} className="mb-2 block text-sm font-medium text-slate-700">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}

      {currentFileUrl && (
        <div className="mb-2 flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          <span className="truncate">File saat ini:</span>
          <a
            href={currentFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-emerald-600 hover:underline truncate"
          >
            Lihat File
          </a>
        </div>
      )}

      <input
        type="file"
        id={fileId}
        name={name}
        className={`w-full rounded-2xl border bg-white px-4 py-2.5 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${
          error ? 'border-red-400 bg-red-50/20' : 'border-slate-200 hover:border-slate-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
    </div>
  )
}
