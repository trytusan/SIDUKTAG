import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AdminLayout from '../../../../src/components/layouts/admin'
import StatusBadge from '../../../../src/components/ui/status-badge'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api, { getStorageUrl } from '../../../../src/lib/api'
import { Penduduk } from '../../../../src/types'

const MapPreview = dynamic(
  () => import('../../../../src/components/maps/map-preview'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-56 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 text-xs">
        Memuat peta lokasi...
      </div>
    ),
  }
)

export default function AdminPendudukDetail() {
  const router = useRouter()
  const { id } = router.query
  const [penduduk, setPenduduk] = useState<Penduduk | null>(null)
  const [loading, setLoading] = useState(true)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!id) return
    async function fetchDetail() {
      try {
        const res = await api.get('/admin/penduduk/' + id)
        setPenduduk(res.data.penduduk)
      } catch (err) {
        console.error('Failed to load detail penduduk:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading || !penduduk) {
    return (
      <AdminLayout pageTitle="Detail Penduduk">
        <LoadingSpinner message="Memuat informasi data penduduk..." />
      </AdminLayout>
    )
  }

  const fotoUrl = penduduk.foto_profil ? getStorageUrl(penduduk.foto_profil) : null
  const dokumenUrl = penduduk.dokumen_pendukung ? getStorageUrl(penduduk.dokumen_pendukung) : null
  const pdfBiodataUrl = `${apiUrl}/admin/penduduk/export/pdf?id=${penduduk.id}`

  return (
    <AdminLayout pageTitle="Detail Penduduk" subtitle={'NIK: ' + penduduk.nik}>
      {/* Header & Breadcrumb */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <nav className="flex mb-2" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <li>
                <Link href="/admin/dashboard" className="hover:text-emerald-600 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 01-1.414 0z" />
                </svg>
              </li>
              <li>
                <Link href="/admin/penduduk" className="hover:text-emerald-600 transition">
                  Penduduk
                </Link>
              </li>
              <li>
                <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 01-1.414 0z" />
                </svg>
              </li>
              <li className="text-slate-800 font-semibold">Detail Profil</li>
            </ol>
          </nav>
          <h2 className="text-2xl font-bold text-slate-900">Informasi Penduduk</h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/penduduk"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition"
          >
            <svg className="mr-2 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </Link>

          <Link
            href={'/admin/penduduk/' + penduduk.id + '/edit'}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profil
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (1/3) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card Avatar & Status */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-32 bg-gradient-to-br from-emerald-500 to-teal-600" />
            <div className="relative -mt-16 flex justify-center">
              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt={penduduk.nama_lengkap}
                  className="h-32 w-32 rounded-3xl object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-slate-100 text-4xl font-black text-slate-400 border-4 border-white shadow-lg">
                  {penduduk.nama_lengkap.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="px-6 pt-4 pb-6 text-center">
              <h3 className="text-xl font-bold text-slate-900">{penduduk.nama_lengkap}</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">NIK: {penduduk.nik}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  {penduduk.status_kependudukan || 'Tetap'}
                </span>
                <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 border border-sky-200">
                  {penduduk.kategori_umur || 'Umur'}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Status Profil</span>
              <div className="flex items-center text-emerald-600 font-bold gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Terdaftar
              </div>
            </div>
          </div>

          {/* Card Dokumen & Cetak */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Dokumen & Berkas
            </h4>

            <div>
              <span className="text-xs text-slate-500 block mb-1.5 font-medium">Dokumen Pendukung</span>
              {dokumenUrl ? (
                <a
                  href={dokumenUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-emerald-600 hover:bg-slate-100 w-full justify-center transition"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span>Lihat Dokumen &rarr;</span>
                </a>
              ) : (
                <p className="text-xs text-slate-400 italic">Tidak ada file yang diunggah</p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <a
                href={pdfBiodataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 hover:border-emerald-300 hover:text-emerald-600 transition"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Cetak Biodata Penduduk (PDF)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Identitas */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-7 py-5">
              <h4 className="text-base font-bold text-slate-900">Data Identitas Pokok</h4>
            </div>
            <div className="p-7">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Nomor Kartu Keluarga</p>
                  <p className="mt-1 font-semibold text-slate-800">{penduduk.nomor_kk}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Jenis Kelamin</p>
                  <p className="mt-1 font-semibold text-slate-800">{penduduk.jenis_kelamin || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Tempat, Tanggal Lahir</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {(penduduk.tempat_lahir || '-') + ', ' + (penduduk.tanggal_lahir ? penduduk.tanggal_lahir.substring(0, 10) : '-')}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Agama</p>
                  <p className="mt-1 font-semibold text-slate-800">{penduduk.agama || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Sosial & Pekerjaan */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-7 py-5">
              <h4 className="text-base font-bold text-slate-900">Informasi Sosial & Pekerjaan</h4>
            </div>
            <div className="p-7">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pekerjaan</p>
                  <p className="mt-1 font-semibold text-slate-800">{penduduk.pekerjaan || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pendidikan Terakhir</p>
                  <p className="mt-1 font-semibold text-slate-800">{penduduk.pendidikan_terakhir || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Status Perkawinan</p>
                  <p className="mt-1 font-semibold text-slate-800">{penduduk.status_perkawinan || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Status dalam Keluarga</p>
                  <p className="mt-1 font-semibold text-slate-800">{penduduk.status_dalam_keluarga || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kontak & Lokasi */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-7 py-5">
              <h4 className="text-base font-bold text-slate-900">Kontak & Lokasi Geotagging</h4>
            </div>
            <div className="p-7 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Nomor Telepon</p>
                  <p className="mt-1 font-semibold text-slate-800">{penduduk.nomor_telepon || '-'}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Titik Koordinat</p>
                  {penduduk.latitude && penduduk.longitude ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${penduduk.latitude},${penduduk.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {penduduk.latitude}, {penduduk.longitude} (Buka Google Maps)
                    </a>
                  ) : (
                    <p className="mt-1 text-xs text-slate-400 italic">Koordinat belum ditandai</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Alamat Lengkap</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700 italic">
                  &ldquo;{penduduk.alamat_lengkap || 'Alamat belum diisi'}&rdquo;
                </p>
              </div>

              {penduduk.latitude && penduduk.longitude && (
                <div className="pt-2">
                  <MapPreview
                    latitude={penduduk.latitude}
                    longitude={penduduk.longitude}
                    title={penduduk.nama_lengkap}
                    height={240}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
