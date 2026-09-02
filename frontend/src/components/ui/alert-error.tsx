import React from 'react'

interface AlertErrorProps {
  message?: string | null
  errors?: Record<string, string[] | string> | null
  onClose?: () => void
  children?: React.ReactNode
}

export default function AlertError({ message, errors, onClose, children }: AlertErrorProps) {
  if (!message && !errors && !children) return null

  return (
    <div className="flex items-start justify-between rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-800 shadow-sm animate-fade-in">
      <div className="flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="space-y-1">
          {message && <p className="font-semibold">{message}</p>}
          {children}
          {errors && (
            <ul className="list-inside list-disc text-xs space-y-0.5 mt-1">
              {Object.entries(errors).map(([field, err]) => (
                <li key={field}>
                  {Array.isArray(err) ? err.join(', ') : err}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-red-600 hover:bg-red-100/60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
