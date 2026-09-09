import React from 'react'

interface AlertErrorProps {
  message?: string | null
  errors?: Record<string, string[] | string> | null
  onClose?: () => void
  children?: React.ReactNode
}

export default function AlertError({ message, errors, onClose, children }: AlertErrorProps) {
  // Hitung apakah benar-benar ada error validasi di dalam object errors
  const hasErrors = Boolean(
    errors &&
    typeof errors === 'object' &&
    Object.keys(errors).length > 0 &&
    Object.values(errors).some((err) => {
      if (Array.isArray(err)) return err.length > 0
      return Boolean(err && String(err).trim().length > 0)
    })
  )

  const hasMessage = Boolean(message && typeof message === 'string' && message.trim().length > 0)
  const hasChildren = Boolean(children)

  // Jangan tampilkan apa pun jika tidak ada pesan error, rincian validasi, ataupun children
  if (!hasMessage && !hasErrors && !hasChildren) {
    return null
  }

  return (
    <div className="flex items-start justify-between rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-800 shadow-sm animate-fade-in mb-4">
      <div className="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="space-y-1">
          {hasMessage && <p className="font-semibold">{message}</p>}
          {children}
          {hasErrors && errors && (
            <ul className="list-inside list-disc text-xs space-y-0.5 mt-1">
              {Object.entries(errors).map(([field, err]) => {
                const text = Array.isArray(err) ? err.join(', ') : err
                if (!text || !String(text).trim()) return null
                return (
                  <li key={field}>
                    {text}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-red-600 hover:bg-red-100/60 transition"
          aria-label="Tutup pesan error"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
