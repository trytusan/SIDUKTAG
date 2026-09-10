import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Navbar from '../../src/components/landing/Navbar'
import Footer from '../../src/components/landing/Footer'
import api from '../../src/lib/api'
import { WargaMarker, TempatUmum } from '../../src/components/maps/peta-warga-view'

// Dynamically import Leaflet map with SSR disabled
const PetaWargaView = dynamic(
  () => import('../../src/components/maps/peta-warga-view'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[620px] w-full items-center justify-center rounded-3xl bg-slate-100 border border-slate-200">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <span className="text-xs font-semibold">Memuat Peta Spasial Desa...</span>
        </div>
      </div>
    ),
  }
)

export default function PublicPetaPage() {
  const [wargaMarkers, setWargaMarkers] = useState<WargaMarker[]>([])
  const [tempatUmum, setTempatUmum] = useState<TempatUmum[]>([])
  const [selectedTempat, setSelectedTempat] = useState<TempatUmum | null>(null)
  const [searchTempat, setSearchTempat] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPetaData() {
      try {
        const res = await api.get('/api/peta')
        if (res.data) {
          if (Array.isArray(res.data.warga_markers)) {
            setWargaMarkers(res.data.warga_markers)
          }
          if (Array.isArray(res.data.tempat_umum)) {
            setTempatUmum(res.data.tempat_umum)
          }
        }
      } catch (err) {
        console.warn('Gagal memuat data peta publik:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPetaData()
  }, [])

  const filteredTempat = tempatUmum
    .filter((t) => !(t.jenis?.toLowerCase() === 'dusun' || t.jenis?.toLowerCase().includes('dusun')))
    .filter((t) => {
      const q = searchTempat.toLowerCase()
      return (
        t.nama.toLowerCase().includes(q) ||
        (t.jenis && t.jenis.toLowerCase().includes(q)) ||
        (t.kepala && t.kepala.toLowerCase().includes(q))
      )
    })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      <Head>
        <title>Peta Wilayah &amp; Fasilitas Desa — SIDUKTAG</title>
        <meta
          name="description"
          content="Visualisasi pemetaan geospasial sebaran pemukiman warga desa dan lokasi sarana fasilitas umum secara interaktif dan transparan."
        />
      </Head>

      {/* Header / Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-6 text-xs text-slate-500 font-medium" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-emerald-700 transition">
                Beranda
              </Link>
            </li>
            <li>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 01-1.414 0z" />
              </svg>
            </li>
            <li className="text-slate-900 font-semibold">Peta Wilayah</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-[11px] font-bold text-emerald-800 mb-2.5 shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Pemetaan Geospasial Wilayah Desa
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Peta Wilayah &amp; Fasilitas Desa
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Visualisasi persebaran pemukiman penduduk desa serta lokasi fasilitas umum secara interaktif, transparan, dan akurat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
            >
              &larr; Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* Top Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Card 1: Titik Pemukiman Warga */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500">Titik Pemukiman Warga</p>
              <p className="text-2xl font-black text-slate-900">
                {loading ? '...' : wargaMarkers.length}
              </p>
              <p className="text-[11px] text-slate-400">Sebaran rumah warga terpetakan</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
              </svg>
            </div>
          </div>

          {/* Card 2: Tempat & Fasilitas Umum */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500">Tempat &amp; Fasilitas Umum</p>
              <p className="text-2xl font-black text-slate-900">
                {loading ? '...' : filteredTempat.length}
              </p>
              <p className="text-[11px] text-slate-400">Dapat diakses info &amp; lokasinya</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          {/* Card 3: Catatan Perlindungan Privasi */}
          <div className="sm:col-span-2 lg:col-span-1 rounded-3xl border border-sky-100 bg-sky-50/70 p-5 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-sky-800 font-bold text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Perlindungan Privasi Warga</span>
            </div>
            <p className="mt-2 text-[11px] text-sky-700 leading-relaxed text-justify">
              Marker warga hanya menampilkan sebaran titik secara anonim tanpa membuka identitas atau data pribadi, menjamin kepatuhan terhadap prinsip perlindungan data pribadi.
            </p>
          </div>
        </div>

        {/* Main Map & Interactive Places Guide */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Canvas (Left / 70%) */}
          <div className="flex-1 space-y-4">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 sm:p-3 shadow-xs">
              <PetaWargaView
                wargaMarkers={wargaMarkers}
                tempatUmum={tempatUmum}
                height={620}
                selectedTempatId={selectedTempat?.id}
                onSelectTempat={(t) => setSelectedTempat(t)}
              />
            </div>
          </div>

          {/* Places Sidebar (Right / 30%) */}
          <div className="w-full lg:w-96 flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Tempat Umum Desa</h3>
                <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
                  {filteredTempat.length} Fasilitas
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Pilih tempat untuk melihat posisi langsung di peta dan kontak resmi.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari fasilitas / balai / kantor..."
                value={searchTempat}
                onChange={(e) => setSearchTempat(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 pl-9 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 absolute left-3 top-3 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Places Scrollable List */}
            <div className="flex-1 overflow-y-auto space-y-3 max-h-[500px] pr-1">
              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Memuat daftar fasilitas umum...
                </div>
              ) : filteredTempat.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p>Tidak ada tempat atau fasilitas yang sesuai.</p>
                </div>
              ) : (
                filteredTempat.map((t) => {
                  const isSelected = selectedTempat?.id === t.id
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTempat(t)}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                          : 'border-slate-200/80 bg-slate-50/60 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full mb-1 border border-emerald-200/60">
                            {t.jenis || 'Fasilitas Umum'}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">
                            {t.nama}
                          </h4>
                        </div>
                        <span
                          className="h-3 w-3 rounded-full shrink-0 mt-1 border border-white shadow-xs"
                          style={{ backgroundColor: t.warna_marker || '#10b981' }}
                        />
                      </div>

                      {t.deskripsi && (
                        <p className="mt-2 text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {t.deskripsi}
                        </p>
                      )}

                      <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-1 text-[11px] text-slate-500">
                        {t.kepala && (
                          <div className="flex items-center justify-between">
                            <span>Penanggung Jawab:</span>
                            <span className="font-semibold text-slate-700">{t.kepala}</span>
                          </div>
                        )}
                        {t.nomor_telepon && (
                          <div className="flex items-center justify-between">
                            <span>Kontak:</span>
                            <span className="font-semibold text-emerald-700">{t.nomor_telepon}</span>
                          </div>
                        )}
                        {Number(t.jumlah_kk) > 0 && (
                          <div className="flex items-center justify-between">
                            <span>Keluarga Terdaftar:</span>
                            <span className="font-semibold text-slate-700">{t.jumlah_kk} KK</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <a
                          href={`https://www.google.com/maps?q=${t.latitude},${t.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 py-1.5 text-[11px] font-bold text-white transition shadow-xs"
                        >
                          Petunjuk Arah &rarr;
                        </a>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

