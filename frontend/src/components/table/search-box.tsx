import React, { useState, useEffect } from 'react'

interface SearchBoxProps {
  value?: string
  placeholder?: string
  onChange: (value: string) => void
  debounceMs?: number
}

export default function SearchBox({
  value = '',
  placeholder = 'Cari data...',
  onChange,
  debounceMs = 300,
}: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState(value)

  useEffect(() => {
    setSearchTerm(value)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== value) {
        onChange(searchTerm)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchTerm, debounceMs, onChange, value])

  return (
    <div className="relative flex-1 min-w-[240px]">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => {
            setSearchTerm('')
            onChange('')
          }}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
