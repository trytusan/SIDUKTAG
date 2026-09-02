import React from 'react'

export interface Column<T = any> {
  key: string
  label: string
  className?: string
  render?: (item: T, index: number) => React.ReactNode
}

interface TableProps<T = any> {
  columns: Column<T>[]
  data: T[]
  renderRow?: (item: T, index: number) => React.ReactNode
  emptyMessage?: string
  loading?: boolean
}

export default function Table<T = any>({
  columns,
  data = [],
  renderRow,
  emptyMessage = 'Belum ada data yang tersedia.',
  loading = false,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl bg-white border border-slate-200">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <span>Memuat data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3.5 ${col.className || ''}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, idx) => {
                if (renderRow) {
                  return (
                    <tr key={idx} className="transition-colors hover:bg-slate-50/80">
                      {renderRow(item, idx)}
                    </tr>
                  )
                }

                return (
                  <tr key={idx} className="transition-colors hover:bg-slate-50/80">
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3.5 text-slate-700 ${col.className || ''}`}>
                        {col.render ? col.render(item, idx) : (item as any)[col.key] ?? '-'}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
