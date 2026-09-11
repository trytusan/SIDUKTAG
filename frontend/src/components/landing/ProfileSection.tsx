import React from 'react'
import Link from 'next/link'

export default function ProfileSection() {
  return (
    <section id="profil-desa" className="mt-24 w-full text-left scroll-mt-24">
      {/* Header Seksi */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800 shadow-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          Profil Wilayah &amp; Komitmen Pelayanan
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
          Mengenal Profil Wilayah &amp; Visi Pemerintahan Digital
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-center">
          Pemerintah desa berkomitmen mewujudkan transparansi data, kecepatan birokrasi, serta pemerataan kesejahteraan masyarakat melalui tata kelola kependudukan terintegrasi berbasis spasial georeferensi.
        </p>
      </div>

      {/* Grid 4 Kartu Karakteristik Wilayah */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Identitas & Geografis */}
        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">Identitas Wilayah</h3>
            <p className="text-xs text-slate-600 text-justify leading-relaxed">
              Pusat pelayanan masyarakat yang menaungi sebaran dusun, rukun tetangga, dan lingkungan pemukiman warga dengan keanekaragaman sosial-budaya yang harmonis dan guyub rukun.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
            <span>Kecamatan &amp; Desa Terdata</span>
            <span>Aktif</span>
          </div>
        </div>

        {/* Card 2: Geotagging & Tata Ruang */}
        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-sky-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">Pemetaan Presisi</h3>
            <p className="text-xs text-slate-600 text-justify leading-relaxed">
              Integrasi titik koordinat rumah warga pada peta spasial interaktif memudahkan verifikasi alamat faktual, zonasi bantuan sosial, serta perencanaan sarana prasarana desa.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-sky-700">
            <span>Peta Tematik Terintegrasi</span>
            <Link href="/peta" className="hover:underline">Buka Peta &rarr;</Link>
          </div>
        </div>

        {/* Card 3: Pelayanan Inklusif & Ramah Warga */}
        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-amber-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">Layanan Inklusif</h3>
            <p className="text-xs text-slate-600 text-justify leading-relaxed">
              Pelayanan dirancang untuk seluruh kelompok umur mulai dari balita hingga lansia, serta memfasilitasi pendataan warga tetap maupun pendatang sementara secara tertib administrasi.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-amber-700">
            <span>Standar Resmi Dukcapil</span>
            <span>Tertib Data</span>
          </div>
        </div>

        {/* Card 4: Transparansi Bantuan & Surat */}
        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-violet-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 group-hover:bg-violet-600 group-hover:text-white transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900">Transparan &amp; Cepat</h3>
            <p className="text-xs text-slate-600 text-justify leading-relaxed">
              Seluruh tahapan verifikasi pengajuan surat dan riwayat penyaluran bantuan sosial dapat dipantau oleh pemohon secara langsung demi menjamin akuntabilitas tanpa diskriminasi.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-violet-700">
            <span>Verifikasi Berjenjang</span>
            <span>Real-time</span>
          </div>
        </div>
      </div>

      {/* Banner Informasi Jam Kerja & Kontak Kantor Desa */}
      <div className="mt-8 rounded-3xl border border-slate-200/90 bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pusat Layanan Warga</span>
            <h4 className="text-lg sm:text-xl font-bold">Kantor Pelayanan Administrasi Desa / Kelurahan</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Buka setiap hari kerja: <strong>Senin s.d. Jumat (08:00 - 15:30 WIB)</strong>. Pelayanan daring SIDUKTAG beroperasi <strong>24 jam</strong> dan permohonan akan diverifikasi pada jam kerja operasional.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 justify-end">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-md transition hover:bg-emerald-400 active:scale-95"
            >
              <span>Daftar Akun Warga Baru</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <span>Masuk Portal Layanan</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

