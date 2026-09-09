import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import UserLayout from '../../../src/components/layouts/user'
import CardStat from '../../../src/components/ui/card-stat'
import api from '../../../src/lib/api'
import { WargaMarker, TempatUmum } from '../../../src/components/maps/peta-warga-view'

// Dynamically import Leaflet map with SSR disabled
const PetaWargaView = dynamic(
  () => import('../../../src/components/maps/peta-warga-view'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[560px] w-full items-center justify-center rounded-3xl bg-slate-100 border border-slate-200">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <span className="text-xs font-semibold">Memuat Peta Spasial Desa...</span>
        </div>
      </div>
    ),
  }
)

export default function UserPetaPage() {
  const [wargaMarkers, setWargaMarkers] = useState<WargaMarker[]>([])
  const [tempatUmum, setTempatUmum] = useState<TempatUmum[]>([])
  const [selectedTempat, setSelectedTempat] = useState<TempatUmum | null>(null)
  const [searchTempat, setSearchTempat] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPetaData() {
      try {
        const res = await api.get('/user/peta')
        if (res.data) {
          if (Array.isArray(res.data.warga_markers)) {
            setWargaMarkers(res.data.warga_markers)
          }
          if (Array.isArray(res.data.tempat_umum)) {
            setTempatUmum(res.data.tempat_umum)
          }
        }
      } catch (err) {
        console.warn('Gagal memuat data peta user:', err)
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
    <UserLayout
      title="Peta Wilayah & Fasilitas — SIDUKTAG"
      pageTitle="Peta Wilayah & Fasilitas"
      subtitle="Visualisasi sebaran pemukiman warga dan lokasi fasilitas umum desa"
    >
      {/* Breadcrumb */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <li>
            <Link href="/user/dashboard" className="hover:text-emerald-600 transition">
              Dashboard
            </Link>
          </li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold">Peta Wilayah</li>
        </ol>
      </nav>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardStat
          title="Titik Pemukiman Warga"
          value={wargaMarkers.length}
          description="Sebaran rumah warga terpetakan"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
            </svg>
          }
        />
        <CardStat
          title="Tempat & Fasilitas Umum"
          value={tempatUmum.filter((t) => !(t.jenis?.toLowerCase() === 'dusun' || t.jenis?.toLowerCase().includes('dusun'))).length}
          description="Dapat diakses info & lokasinya"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <div className="sm:col-span-2 lg:col-span-1 rounded-3xl border border-sky-100 bg-sky-50/70 p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-sky-800 font-bold text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Perlindungan Privasi Warga</span>
          </div>
          <p className="mt-2 text-[11px] text-sky-700 leading-relaxed">
            Marker warga hanya memperlihatkan sebaran titik tempat tinggal secara anonim tanpa membuka NIK, identitas, atau data pribadi sesuai prinsip UU Pelindungan Data Pribadi.
          </p>
        </div>
      </div>

      {/* Main Map & Interactive Place Guide */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Map Canvas (70%) */}
        <div className="flex-1 space-y-4">
          <PetaWargaView
            wargaMarkers={wargaMarkers}
            tempatUmum={tempatUmum}
            height={600}
            selectedTempatId={selectedTempat?.id}
            onSelectTempat={(t) => setSelectedTempat(t)}
          />
        </div>

        {/* Places List (30%) */}
        <div className="w-full lg:w-84 flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Tempat Umum Desa</h3>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                {filteredTempat.length} Tempat
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Fasilitas publik yang dapat diklik untuk melihat lokasi dan kontak
            </p>
          </div>

          {/* Search Box */}
          <div>
            <input
              type="text"
              placeholder="Cari tempat / balai / kantor..."
              value={searchTempat}
              onChange={(e) => setSearchTempat(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Places Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[460px] pr-1">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Memuat daftar tempat umum...
              </div>
            ) : filteredTempat.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Tidak ada tempat umum yang sesuai.
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
                        ? 'border-emerald-500 bg-emerald-50/60 shadow-sm ring-1 ring-emerald-500'
                        : 'border-slate-100 bg-slate-50/70 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full mb-1">
                          {t.jenis || 'Tempat Umum'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {t.nama}
                        </h4>
                      </div>
                      <span
                        className="h-3 w-3 rounded-full shrink-0 mt-1"
                        style={{ backgroundColor: t.warna_marker || '#10b981' }}
                      />
                    </div>

                    {t.deskripsi && (
                      <p className="mt-2 text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {t.deskripsi}
                      </p>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-500">
                      {t.kepala && (
                        <div className="flex items-center justify-between">
                          <span>Penanggung Jawab:</span>
                          <span className="font-semibold text-slate-700">{t.kepala}</span>
                        </div>
                      )}
                      {t.nomor_telepon && (
                        <div className="flex items-center justify-between">
                          <span>Kontak:</span>
                          <span className="font-semibold text-emerald-600">{t.nomor_telepon}</span>
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
                        className="flex-1 text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 py-1.5 text-[11px] font-bold text-white transition shadow-sm"
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
    </UserLayout>
  )
}

