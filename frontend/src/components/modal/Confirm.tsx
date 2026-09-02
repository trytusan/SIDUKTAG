import React from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary' | 'warning'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  title = 'Konfirmasi Tindakan',
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null

  const btnStyles = {
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
    warning: 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-scale-in">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{message}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-50 ${btnStyles[variant]}`}
          >
            {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
