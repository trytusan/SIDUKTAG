import React from 'react'

interface AlertSuccessProps {
  message?: string | null
  onClose?: () => void
  children?: React.ReactNode
}

export default function AlertSuccess({ message, onClose, children }: AlertSuccessProps) {
  const content = message || children
  if (!content) return null

  return (
    <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm text-emerald-800 shadow-sm animate-fade-in">
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{content}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-emerald-600 hover:bg-emerald-100/60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
