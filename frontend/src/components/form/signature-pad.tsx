import React, { useRef, useState, useEffect } from 'react'

interface SignaturePadProps {
  label?: string
  initialUrl?: string | null
  onChange: (value: string | File | null) => void
  onChecklistChange?: (checked: boolean) => void
  isChecklistChecked?: boolean
}

export default function SignaturePad({
  label = 'Tanda Tangan Pelapor',
  initialUrl = null,
  onChange,
  onChecklistChange,
  isChecklistChecked = false,
}: SignaturePadProps) {
  const [mode, setMode] = useState<'canvas' | 'upload'>('canvas')
  const [hasCanvasDrawn, setHasCanvasDrawn] = useState(false)
  const [previewUpload, setPreviewUpload] = useState<string | null>(null)
  const [currentSavedUrl, setCurrentSavedUrl] = useState<string | null>(initialUrl)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    if (mode !== 'canvas') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width || 400
    canvas.height = 160

    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [mode])

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    isDrawing.current = true
    const pos = getCoordinates(e)
    lastPos.current = pos

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pos = getCoordinates(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
    setHasCanvasDrawn(true)
  }

  const stopDrawing = () => {
    if (!isDrawing.current) return
    isDrawing.current = false
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    onChange(dataUrl)
    if (onChecklistChange) onChecklistChange(true)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasCanvasDrawn(false)
    onChange(null)
    if (onChecklistChange) onChecklistChange(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setPreviewUpload(null)
      onChange(null)
      if (onChecklistChange) onChecklistChange(false)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreviewUpload(objectUrl)
    onChange(file)
    if (onChecklistChange) onChecklistChange(true)
  }

  const handleResetSaved = () => {
    setCurrentSavedUrl(null)
    onChange(null)
    if (onChecklistChange) onChecklistChange(false)
  }

  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/20 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white shadow-xs">
            ✍️
          </span>
          <div>
            <span className="text-sm font-bold text-slate-800">{label}</span>
            <p className="text-xs text-slate-500">
              Gores tanda tangan langsung di layar (mouse/layar sentuh) atau unggah foto/scan berkas fisik
            </p>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="inline-flex rounded-xl bg-slate-200/80 p-1 text-xs">
          <button
            type="button"
            onClick={() => setMode('canvas')}
            className={`rounded-lg px-3 py-1.5 font-bold transition ${
              mode === 'canvas'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✍️ Gores TTD Digital
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`rounded-lg px-3 py-1.5 font-bold transition ${
              mode === 'upload'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📤 Upload Berkas TTD
          </button>
        </div>
      </div>

      {/* Jika ada initial signature tersimpan sebelumnya */}
      {currentSavedUrl && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-white p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-14 w-28 rounded-lg bg-slate-50 border border-emerald-200 flex items-center justify-center p-1">
              <img
                src={currentSavedUrl}
                alt="TTD Tersimpan"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-900">Tanda Tangan Telah Tersimpan</p>
              <p className="text-[11px] text-emerald-700">
                Gunakan tombol di samping jika ingin memperbarui / mengganti tanda tangan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetSaved}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50"
          >
            Ganti TTD
          </button>
        </div>
      )}

      {/* Mode 1: Canvas Signature Pad */}
      {mode === 'canvas' && (
        <div className="space-y-2">
          <div className="relative rounded-xl border-2 border-dashed border-slate-300 bg-white shadow-inner overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-40 cursor-crosshair touch-none"
            />
            {!hasCanvasDrawn && !currentSavedUrl && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mb-1 opacity-50 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                <span className="text-xs font-medium text-slate-600">Goreskan tanda tangan pelapor di area kanvas ini</span>
                <span className="text-[11px] text-slate-400">Gunakan mouse, touchpad, atau sentuhan jari</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Dapat digores menggunakan Mouse, Touchpad, atau Layar Sentuh Tablet/HP</span>
            {hasCanvasDrawn && (
              <button
                type="button"
                onClick={clearCanvas}
                className="font-bold text-rose-600 hover:text-rose-700 hover:underline px-2.5 py-1 rounded bg-rose-50"
              >
                Hapus & Ulangi TTD
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Upload File Signature */}
      {mode === 'upload' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilih Berkas Scan / Foto Tanda Tangan Basah (JPG / PNG, Max 4MB)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
            />
          </div>

          {previewUpload && (
            <div className="rounded-xl border border-emerald-200 bg-white p-3.5 flex items-center gap-3">
              <div className="h-16 w-32 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-1">
                <img
                  src={previewUpload}
                  alt="Preview TTD"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Pratinjau Berkas TTD Pelapor</p>
                <p className="text-[11px] text-emerald-600 font-medium">✓ Berkas tanda tangan siap disimpan.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
