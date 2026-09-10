import React from 'react'
import Link from 'next/link'

export default function FeaturesSection() {
  return (
    <section className="mt-20 w-full text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Kolom Kiri: Keterangan Sistem (Rata Kanan-Kiri / Justified) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 w-fit shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            Layanan &amp; Keunggulan Sistem
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl leading-snug">
            Transformasi Digital Pelayanan &amp; Pendataan Desa
          </h2>

          <div className="space-y-3.5 text-justify text-sm sm:text-base text-slate-600 leading-relaxed">
            <p>
              Sistem Informasi Kependudukan dan Geotagging (SIDUKTAG) dikembangkan untuk mewujudkan tata kelola administrasi desa yang modern, cepat, dan transparan. Melalui platform ini, pendataan warga tidak hanya mencakup identitas pokok keluarga, melainkan juga terintegrasi langsung dengan pemetaan koordinat geospasial lokasi tempat tinggal secara presisi.
            </p>
            <p>
              Masyarakat dapat mengajukan beragam surat permohonan dan kebutuhan administrasi kependudukan secara mandiri kapan saja tanpa antre. Selain itu, pemerintah desa dapat mengelola penyaluran bantuan sosial secara adil, memantau perubahan demografi penduduk secara berkala, dan mempercepat respons penanganan kebutuhan warga di lapangan.
            </p>
          </div>

          {/* 3 Fitur Unggulan Sistem */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              href="/peta"
              className="group/card block rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-emerald-300 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-slate-900">Geotagging</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 opacity-0 group-hover/card:opacity-100 transition-opacity">
                  Peta &rarr;
                </span>
              </div>
              <p className="text-[11px] text-slate-500 text-justify leading-relaxed">
                Pemetaan lokasi rumah warga secara presisi untuk efisiensi distribusi logistik &amp; bantuan.
              </p>
            </Link>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-2 text-sky-700 font-bold text-xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-50 text-sky-700 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-slate-900">Surat Online</span>
              </div>
              <p className="text-[11px] text-slate-500 text-justify leading-relaxed">
                Ajukan surat pengantar dan keterangan resmi secara praktis tanpa perlu antre di kantor.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold text-xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 text-amber-700 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Z" />
                  </svg>
                </div>
                <span className="text-slate-900">Bansos Terbuka</span>
              </div>
              <p className="text-[11px] text-slate-500 text-justify leading-relaxed">
                Penyaluran bantuan sosial transparan yang dapat dipantau langsung status pengajuannya.
              </p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Foto Desa & Keterangan di Bawahnya */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
            {/* Bingkai Foto Desa */}
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] w-full bg-slate-100 border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80"
                alt="Pemandangan Lingkungan Wilayah Desa"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              {/* Badge Wilayah di atas Foto */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-slate-800 shadow-sm border border-white/60 backdrop-blur-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Kawasan Wilayah Desa
                </span>
                <span className="text-[11px] font-semibold text-white bg-slate-950/70 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
                  Harmoni &amp; Asri
                </span>
              </div>
            </div>

            {/* Keterangan di Bawah Foto Desa */}
            <div className="space-y-2 text-left pt-1">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 shrink-0" />
                <h4 className="text-base font-bold text-slate-900">
                  Wilayah Harmonis Berbasis Digital
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                Potret lingkungan permukiman desa yang asri, rukun, dan dinamis. Melalui pemanfaatan sistem informasi kependudukan dan pemetaan lokasi, keterhubungan antar warga dan percepatan pelayanan publik desa dapat terwujud secara berkesinambungan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
