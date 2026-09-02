import React from 'react'

interface DetailModalProps {
  isOpen: boolean
  title?: string
  children: React.ReactNode
  onClose: () => void
  maxWidth?: string
}

export default function DetailModal({
  isOpen,
  title = 'Detail Data',
  children,
  onClose,
  maxWidth = 'max-w-2xl',
}: DetailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className={`w-full ${maxWidth} rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-scale-in my-8 max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">{children}</div>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
