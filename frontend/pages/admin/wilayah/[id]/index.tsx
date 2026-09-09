import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AdminLayout from '../../../../src/components/layouts/admin'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api from '../../../../src/lib/api'
import { Wilayah, Penduduk } from '../../../../src/types'

// Dynamically import Leaflet Map Preview
const MapPreview = dynamic(
  () => import('../../../../src/components/maps/map-preview'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 text-xs">
        Memuat titik lokasi peta...
      </div>
    ),
  }
)

export default function AdminWilayahDetail() {
  const router = useRouter()
  const { id } = router.query
  const [wilayah, setWilayah] = useState<Wilayah | null>(null)
  const [pendudukList, setPendudukList] = useState<Penduduk[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchDetail() {
      try {
        const res = await api.get('/admin/wilayah/' + id)
        if (res.data?.wilayah) {
          setWilayah(res.data.wilayah)
        }
        if (Array.isArray(res.data?.penduduk)) {
          setPendudukList(res.data.penduduk)
        }
      } catch (err) {
        console.error('Failed to load detail wilayah:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading || !wilayah) {
    return (
      <AdminLayout pageTitle="Detail Wilayah & Tempat Umum">
        <LoadingSpinner message="Memuat informasi detail wilayah..." />
      </AdminLayout>
    )
  }

  const lat = Number(wilayah.latitude)
  const lng = Number(wilayah.longitude)

  return (
    <AdminLayout
      title={`Detail ${wilayah.nama_wilayah} — SIDUKTAG`}
      pageTitle="Detail Tempat Umum / Wilayah"
      subtitle={`${wilayah.jenis_wilayah} • Kode: ${wilayah.kode_wilayah}`}
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
          <li>
            <Link href="/admin/wilayah" className="hover:text-emerald-600 transition">
              Data Wilayah
            </Link>
          </li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold">{wilayah.nama_wilayah}</li>
        </ol>
      </nav>

      {/* Header Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="h-4 w-4 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: wilayah.warna_marker || '#10b981' }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">{wilayah.nama_wilayah}</h2>
              <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                {wilayah.jenis_wilayah}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Kode: {wilayah.kode_wilayah}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/wilayah"
            className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </Link>

          <Link
            href={'/admin/wilayah/' + wilayah.id + '/edit'}
            className="inline-flex items-center rounded-2xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-600 transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Fasilitas
          </Link>

          <Link
            href="/admin/peta"
            className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6.75V15m6-6v8.25m.503-14.406C14.713 2.39 13.376 2.25 12 2.25s-2.713.14-3.503.594l-4.5 2.571A1.5 1.5 0 003 6.72v11.558a1.5 1.5 0 002.003 1.407l4.497-2.57 5 2.857 4.5-2.571A1.5 1.5 0 0020 16.02V4.462a1.5 1.5 0 00-1.497-1.407l-3.003.539z" />
            </svg>
            Buka di Peta Sebaran
          </Link>

          <a
            href={`https://www.google.com/maps?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Google Maps
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Detail Info & Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Informasi Pokok */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Informasi Fasilitas / Wilayah
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-slate-400 font-medium">Pengelola / Penanggung Jawab</span>
                <p className="font-bold text-slate-800 text-sm mt-1">{wilayah.kepala_wilayah}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-slate-400 font-medium">Nomor Telepon / Kontak</span>
                <p className="font-bold text-slate-800 text-sm mt-1">
                  {wilayah.nomor_telepon ? (
                    <a href={`tel:${wilayah.nomor_telepon}`} className="text-emerald-600 hover:underline">
                      {wilayah.nomor_telepon}
                    </a>
                  ) : (
                    <span className="text-slate-400 font-normal">Tidak ada kontak</span>
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-slate-400 font-medium">Jumlah Kepala Keluarga</span>
                <p className="font-bold text-slate-800 text-sm mt-1">{wilayah.jumlah_kk} KK</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <span className="text-slate-400 font-medium">Total Penduduk</span>
                <p className="font-bold text-slate-800 text-sm mt-1">{wilayah.jumlah_penduduk} Jiwa</p>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs">
              <span className="text-slate-400 font-medium block mb-1">Deskripsi & Keterangan Fasilitas:</span>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {wilayah.deskripsi || 'Tidak ada deskripsi tambahan untuk wilayah/fasilitas ini.'}
              </p>
            </div>
          </div>

          {/* Card 2: Titik Koordinat & Peta Spasial */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800">Titik Geospasial Wilayah</h3>
              <span className="font-mono text-xs text-slate-500 font-semibold">
                📍 {lat.toFixed(6)}, {lng.toFixed(6)}
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <MapPreview latitude={lat} longitude={lng} />
            </div>
          </div>
        </div>

        {/* Right Column: Ringkasan Cepat & Warga Terkait */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Ringkasan Data
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tipe Tempat</span>
                <span className="font-semibold text-slate-800">{wilayah.jenis_wilayah}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Kode Registrasi</span>
                <span className="font-mono font-bold text-emerald-700">{wilayah.kode_wilayah}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Luas Area</span>
                <span className="font-semibold text-slate-800">
                  {wilayah.luas_wilayah ? `${wilayah.luas_wilayah} Ha` : '-'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Warna Marker</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: wilayah.warna_marker || '#10b981' }}
                  />
                  <span>{wilayah.warna_marker || '#10b981'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Terdaftar Sejak</span>
                <span className="text-slate-700 font-medium">
                  {wilayah.created_at ? new Date(wilayah.created_at).toLocaleDateString('id-ID') : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Card Penduduk Terdaftar di Wilayah ini jika ada */}
          {pendudukList.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800">
                  Warga di Wilayah Ini ({pendudukList.length})
                </h3>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {pendudukList.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/penduduk/${p.id}`}
                    className="block rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 hover:bg-emerald-50/50 hover:border-emerald-200 transition text-xs"
                  >
                    <div className="font-bold text-slate-800">{p.nama_lengkap}</div>
                    <div className="text-[11px] text-slate-400 font-mono">NIK: {p.nik}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

