import React from 'react'

interface Option {
  value: string | number
  label: string
}

interface FormRadioProps {
  label?: string
  name: string
  options: Option[]
  selectedValue?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  className?: string
}

export default function FormRadio({
  label,
  name,
  options,
  selectedValue,
  onChange,
  error,
  required,
  className = '',
}: FormRadioProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <p className="mb-2 block text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </p>
      )}
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 select-none">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selectedValue === opt.value}
              onChange={onChange}
              className="h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500/30"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  )
}
