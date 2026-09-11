import React from 'react'
import Link from 'next/link'

export default function GuideSection() {
  const steps = [
    {
      step: '01',
      title: 'Pendaftaran Akun Warga',
      desc: 'Buat akun mandiri dengan memasukkan NIK dan Nomor KK yang sah, lengkapi alamat email, dan buat kata sandi aman.',
      badge: 'Langkah Awal',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
    {
      step: '02',
      title: 'Lengkapi Profil & Geotagging',
      desc: 'Pilih klasifikasi pekerjaan resmi Dukcapil, status dalam keluarga, dan tandai titik lokasi rumah Anda secara presisi pada peta.',
      badge: 'Onboarding 3 Tahap',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      step: '03',
      title: 'Pilih Layanan / Ajukan Surat',
      desc: 'Pilih jenis surat keterangan yang dibutuhkan (SKTM, Domisili, dll), tuliskan keperluan permohonan, dan unggah berkas syarat pendukung.',
      badge: 'Bebas Antre',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      step: '04',
      title: 'Pantau Status & Unduh Surat',
      desc: 'Pantau verifikasi operator secara real-time. Jika selesai, unduh berkas digital resmi atau ambil dokumen fisik bertanda tangan di kantor desa.',
      badge: 'Transparan & Resmi',
      badgeColor: 'bg-violet-100 text-violet-800 border-violet-200',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <section id="panduan-layanan" className="mt-24 w-full text-left scroll-mt-24">
      {/* Header Seksi */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-bold text-sky-800 shadow-xs">
          <svg className="h-4 w-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Petunjuk &amp; Alur Penggunaan
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
          4 Langkah Mudah Pelayanan Mandiri Warga
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-center">
          Proses birokrasi kini lebih ringkas dan dapat diakses dari rumah melalui gawai smartphone maupun komputer tanpa harus mengantre panjang di kantor desa.
        </p>
      </div>

      {/* Grid 4 Langkah Proses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((s, idx) => (
          <div
            key={s.step}
            className="group relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Step Number & Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                  {s.icon}
                </div>
                <span className="font-mono text-2xl font-black text-slate-200 group-hover:text-emerald-500 transition-colors">
                  {s.step}
                </span>
              </div>

              {/* Badge Keterangan */}
              <div className="mb-2.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${s.badgeColor}`}>
                  {s.badge}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-xs text-slate-600 text-justify leading-relaxed">{s.desc}</p>
            </div>

            {/* Step Progress Line on Desktop */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Tahap {idx + 1} dari 4</span>
              <span className="text-emerald-600 font-bold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </div>
          </div>
        ))}
      </div>

      {/* Callout Pelayanan Bantuan Khusus Lansia / Disabilitas (Poin 18 Evaluasi) */}
      <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50/70 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm sm:text-base font-bold text-amber-950">
              Layanan Pendampingan untuk Warga Lansia &amp; Kebutuhan Khusus
            </h4>
            <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed text-justify">
              Bagi warga lanjut usia, penyandang disabilitas, atau masyarakat yang mengalami kesulitan mengoperasikan ponsel secara mandiri, <strong>Operator Desa dan Perangkat RT</strong> siap membantu penginputan berkas dan pengajuan surat secara langsung di loket pelayanan kantor desa.
            </p>
          </div>
          <Link
            href="/login"
            className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition active:scale-95"
          >
            <span>Mulai Sekarang</span>
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

