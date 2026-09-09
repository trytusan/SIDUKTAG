import React, { useEffect, useState } from 'react'

export interface AnimatedAlertOptions {
  type?: 'success' | 'delete' | 'error' | 'warning'
  title: string
  message: string
  duration?: number // duration in ms, defaults to 2200ms
  buttonText?: string
  onClose?: () => void
}

interface AnimatedAlertModalProps {
  isOpen: boolean
  options: AnimatedAlertOptions | null
  onDismiss: () => void
}

export default function AnimatedAlertModal({
  isOpen,
  options,
  onDismiss,
}: AnimatedAlertModalProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!isOpen || !options) return

    const duration = options.duration ?? 2200
    setProgress(100)

    const intervalTime = 20
    const step = (intervalTime / duration) * 100

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer)
          return 0
        }
        return prev - step
      })
    }, intervalTime)

    const timeout = setTimeout(() => {
      onDismiss()
      if (options.onClose) {
        options.onClose()
      }
    }, duration)

    return () => {
      clearInterval(timer)
      clearTimeout(timeout)
    }
  }, [isOpen, options, onDismiss])

  if (!isOpen || !options) return null

  const handleManualClose = () => {
    onDismiss()
    if (options.onClose) {
      options.onClose()
    }
  }

  const isDelete = options.type === 'delete' || options.type === 'error'
  const isSuccess = !options.type || options.type === 'success'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-2xl anim-bounce-in">
        
        {/* Animated Icon */}
        <div className="mx-auto mb-4 flex items-center justify-center">
          {isSuccess && (
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/30 anim-pop-icon anim-ripple-success">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="anim-draw-check"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}

          {isDelete && (
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-red-400 text-white shadow-lg shadow-rose-500/30 anim-pop-icon anim-ripple-danger">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          )}

          {options.type === 'warning' && (
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-lg shadow-amber-500/30 anim-pop-icon">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          )}
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
          {options.title}
        </h3>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {options.message}
        </p>

        {/* Action Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleManualClose}
            className={`w-full rounded-2xl py-3 px-5 text-sm font-bold text-white shadow-md transition active:scale-95 ${
              isDelete
                ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-rose-600/25'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/25'
            }`}
          >
            {options.buttonText || 'OK, Mengerti'}
          </button>
        </div>

        {/* Progress indicator bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
          <div
            className={`h-full transition-all duration-75 ease-linear ${
              isDelete ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

