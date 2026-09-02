import React from 'react'

interface PaginationProps {
  currentPage: number
  lastPage: number
  total?: number
  from?: number | null
  to?: number | null
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  lastPage,
  total,
  from,
  to,
  onPageChange,
}: PaginationProps) {
  if (lastPage <= 1) return null

  // Generate page numbers
  const pages: (number | string)[] = []
  const delta = 2

  for (let i = 1; i <= lastPage; i++) {
    if (
      i === 1 ||
      i === lastPage ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
      <div className="text-xs text-slate-500">
        {from && to && total ? (
          <span>
            Menampilkan <span className="font-semibold text-slate-700">{from}</span> -{' '}
            <span className="font-semibold text-slate-700">{to}</span> dari{' '}
            <span className="font-semibold text-slate-700">{total}</span> data
          </span>
        ) : (
          <span>Halaman {currentPage} dari {lastPage}</span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          &larr; Sebelumnya
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span key={idx} className="px-2 text-xs text-slate-400">
                  ...
                </span>
              )
            }

            const pageNum = p as number
            const isActive = pageNum === currentPage

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`h-9 w-9 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Selanjutnya &rarr;
        </button>
      </div>
    </div>
  )
}
