import React from 'react'

export default function FeaturesSection() {
  return (
    <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 text-left w-full">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white">Geotagging Lokasi</h3>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          Pemetaan koordinat tempat tinggal warga secara presisi untuk efisiensi distribusi logistik dan bantuan.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white">Pengajuan Surat Online</h3>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          Ajukan surat pengantar, domisili, atau keterangan tidak mampu secara praktis tanpa harus antre.
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.5 12a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white">Bantuan Sosial Terbuka</h3>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          Informasi program bantuan sosial pemerintah yang transparan dan dapat dipantau langsung statusnya.
        </p>
      </div>
    </div>
  )
}

