import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import CardStat from '../../../src/components/ui/card-stat'
import { KkMarker, Wilayah, PetaAdminStats } from '../../../src/types'
import api from '../../../src/lib/api'

// Dynamically import Leaflet Map with SSR disabled
const PetaSebaranWilayah = dynamic(
  () => import('../../../src/components/maps/peta-sebaran-wilayah'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[580px] w-full items-center justify-center rounded-3xl bg-slate-100 border border-slate-200">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <span className="text-xs font-semibold">Memuat Peta Spasial Sebaran KK & Wilayah...</span>
        </div>
      </div>
    ),
  }
)

export default function AdminPetaWilayahIndex() {
  const [kkMarkers, setKkMarkers] = useState<KkMarker[]>([])
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([])
  const [stats, setStats] = useState<PetaAdminStats>({
    total_kk: 0,
    total_kk_satu_lokasi: 0,
    total_kk_terpencar: 0,
    total_titik_marker_kk: 0,
    total_penduduk_terpetakan: 0,
    total_fasilitas_umum: 0,
  })
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPetaData() {
      try {
        const res = await api.get('/admin/peta')
        if (res.data) {
          if (Array.isArray(res.data.kk_markers)) {
            setKkMarkers(res.data.kk_markers)
          }
          if (Array.isArray(res.data.wilayah_list)) {
            setWilayahList(res.data.wilayah_list)
          }
          if (res.data.stats) {
            setStats(res.data.stats)
          }
        }
      } catch (err) {
        console.error('Failed to load peta data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPetaData()
  }, [])

  return (
    <AdminLayout
      title="Peta Sebaran KK & Wilayah — SIDUKTAG"
      pageTitle="Peta Sebaran KK & Wilayah"
      subtitle="Pemetaan geospasial hunian Kartu Keluarga dan fasilitas desa berbasis Geotagging"
    >
      {/* Breadcrumb */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <li>
            <Link href="/admin/dashboard" className="hover:text-emerald-600 transition">
              Dashboard
            </Link>
          </li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-500">Pemetaan Wilayah</li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold">Peta Sebaran KK & Wilayah</li>
        </ol>
      </nav>

      {/* Info Banner on Spatial Grouping */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-900 shadow-sm">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-emerald-950">
            Sistem Geotagging Demografi Terpadu (Smart KK Spatial Grouping)
          </h4>
          <p className="text-emerald-800 mt-0.5 leading-relaxed">
            Anggota keluarga dalam 1 KK yang tinggal bersama di satu lokasi dikelompokkan menjadi <strong>1 marker hunian KK</strong>. Jika ada anggota yang tinggal di lokasi berbeda (merantau, indekos, beda rumah), titik hunian dipetakan per lokasinya masing-masing lengkap dengan <strong>garis relasi spasial keluarga</strong>.
          </p>
        </div>
      </div>

      {/* Top Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <CardStat
          title="Total KK Terpetakan"
          value={stats.total_kk.toLocaleString('id-ID')}
          description={`${stats.total_titik_marker_kk} titik hunian terdata`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
            </svg>
          }
        />
        <CardStat
          title="KK Satu Lokasi (Satu Atap)"
          value={stats.total_kk_satu_lokasi.toLocaleString('id-ID')}
          description="Seluruh anggota tinggal bersama"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <CardStat
          title="KK Beda Lokasi (Terpencar)"
          value={stats.total_kk_terpencar.toLocaleString('id-ID')}
          description="Anggota di titik koordinat berbeda"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <CardStat
          title="Total Jiwa Terpetakan"
          value={stats.total_penduduk_terpetakan.toLocaleString('id-ID')}
          description="Jiwa terdaftar koordinat GPS"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
      </div>

      {/* Main Map Canvas & Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Peta Interaktif Spasial Demografi</h2>
            <p className="text-xs text-slate-500">
              Gunakan mouse untuk navigasi, klik pin untuk melihat identitas KK, anggota keluarga di lokasi tersebut, dan relasi spasial.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/kartu-keluarga"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Data Kartu Keluarga</span>
            </Link>

            <Link
              href="/admin/penduduk"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Data Penduduk</span>
            </Link>
          </div>
        </div>

        {/* Map Canvas */}
        <PetaSebaranWilayah
          kkMarkers={kkMarkers}
          wilayahList={wilayahList}
          selectedId={selectedMarkerId}
          onSelectMarker={(m) => setSelectedMarkerId(m?.id || null)}
        />
      </div>
    </AdminLayout>
  )
}
