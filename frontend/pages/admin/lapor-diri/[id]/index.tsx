import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AdminLayout from '../../../../src/components/layouts/admin'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api, { getStorageUrl } from '../../../../src/lib/api'
import { LaporDiri } from '../../../../src/types'

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

export default function AdminLaporDiriDetail() {
  const router = useRouter()
  const { id } = router.query
  const [data, setData] = useState<LaporDiri | null>(null)
  const [loading, setLoading] = useState(true)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    if (!id) return
    async function fetchDetail() {
      try {
        const res = await api.get('/admin/lapor-diri/' + id)
        setData(res.data.lapor_diri || res.data.data)
      } catch (err) {
        console.error('Failed to load lapor diri detail:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading || !data) {
    return (
      <AdminLayout pageTitle="Detail Lapor Diri">
        <LoadingSpinner message="Memuat informasi formulir lapor diri..." />
      </AdminLayout>
    )
  }

  const printUrl = `${apiUrl}/admin/lapor-diri/${data.id}/cetak`

  return (
    <AdminLayout
      pageTitle="Detail Lapor Diri"
      subtitle={`Pelapor: ${data.nama_lengkap} (${data.kewarganegaraan === 'WNA' ? 'Paspor: ' + (data.nomor_paspor || '-') : 'NIK: ' + (data.nik || '-')})`}
    >
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
                <span className="text-slate-300">/</span>
              </li>
              <li>
                <Link href="/admin/lapor-diri" className="hover:text-emerald-600 transition">
                  Lapor Diri Warga Baru
                </Link>
              </li>
              <li>
                <span className="text-slate-300">/</span>
              </li>
              <li className="text-slate-800 font-semibold truncate max-w-[200px]">
                {data.nama_lengkap}
              </li>
            </ol>
          </nav>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {data.nama_lengkap}
            </h1>
            <span
              className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold border ${
                data.kewarganegaraan === 'WNA'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {data.kewarganegaraan === 'WNA' ? `WNA - ${data.negara_asal || 'Asing'}` : 'WNI'}
            </span>
            <span className="inline-flex items-center rounded-xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              {data.status_tempat_tinggal}
            </span>
            {data.kewarganegaraan === 'WNA' && data.status_bekerja && (
              <span
                className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-semibold border ${
                  data.status_bekerja === 'Bekerja'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Status Bekerja: {data.status_bekerja}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dicatat tanggal:{' '}
            <strong className="text-slate-700">
              {data.tanggal_lapor ? new Date(data.tanggal_lapor).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}
            </strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/lapor-diri"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </Link>
          <Link
            href={`/admin/lapor-diri/${data.id}/cetak`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak Formulir
          </Link>
          <a
            href={printUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Download PDF
          </a>
          <Link
            href={`/admin/lapor-diri/${data.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Formulir
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* BAGIAN A: DATA PRIBADI */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800">
                A
              </span>
              <h2 className="text-base font-bold text-slate-800">DATA PRIBADI PELAPOR</h2>
            </div>
            <span
              className={`rounded-lg px-2.5 py-0.5 text-xs font-bold ${
                data.kewarganegaraan === 'WNA'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {data.kewarganegaraan === 'WNA' ? 'WARGA NEGARA ASING (WNA)' : 'WARGA NEGARA INDONESIA (WNI)'}
            </span>
          </div>

          {data.kewarganegaraan === 'WNA' ? (
            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 font-medium">Nama Lengkap Sesuai Paspor</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.nama_lengkap}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Kewarganegaraan / Negara Asal</p>
                <p className="font-semibold text-purple-700 mt-0.5">{data.negara_asal || 'Asing'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Nomor Paspor</p>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{data.nomor_paspor || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Masa Berlaku Paspor</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {data.masa_berlaku_paspor ? new Date(data.masa_berlaku_paspor).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Jenis Izin Tinggal</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.jenis_izin_tinggal || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Nomor Izin Tinggal (KITAS/KITAP)</p>
                <p className="font-mono font-semibold text-slate-800 mt-0.5">{data.nomor_izin_tinggal || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Masa Berlaku Izin Tinggal</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {data.masa_berlaku_izin ? new Date(data.masa_berlaku_izin).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Jenis Kelamin</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.jenis_kelamin}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Tempat, Tanggal Lahir</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {data.tempat_lahir || '-'},{' '}
                  {data.tanggal_lahir ? new Date(data.tanggal_lahir).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Status Perkawinan</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.status_perkawinan || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">No. Telepon / WhatsApp</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.nomor_telepon || '-'}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 font-medium">Nama Lengkap</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.nama_lengkap}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Nomor Induk Kependudukan (NIK)</p>
                <p className="font-mono font-semibold text-slate-800 mt-0.5">{data.nik}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Nomor Kartu Keluarga (KK)</p>
                <p className="font-mono font-semibold text-slate-800 mt-0.5">{data.nomor_kk || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Jenis Kelamin</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.jenis_kelamin}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Tempat, Tanggal Lahir</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {data.tempat_lahir},{' '}
                  {data.tanggal_lahir ? new Date(data.tanggal_lahir).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Agama</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.agama}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Status Perkawinan</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.status_perkawinan}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Pekerjaan</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.pekerjaan}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">No. Telepon / HP</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.nomor_telepon || '-'}</p>
              </div>
            </div>
          )}
        </div>

        {/* STATUS BEKERJA (KHUSUS WNA / TKA) */}
        {data.kewarganegaraan === 'WNA' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-800">
                  💼
                </span>
                <h2 className="text-base font-bold text-slate-800">STATUS BEKERJA & KEGIATAN WNA</h2>
              </div>
              <span
                className={`rounded-lg px-2.5 py-0.5 text-xs font-bold ${
                  data.status_bekerja === 'Bekerja'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                Status: {data.status_bekerja || 'Belum diisi'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 font-medium">Status Bekerja / Kegiatan</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.status_bekerja || '-'}</p>
              </div>

              {data.status_bekerja === 'Bekerja' ? (
                <>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Nama Perusahaan / Pemberi Kerja</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{data.nama_perusahaan || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Jabatan / Posisi Pekerjaan</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{data.jabatan_pekerjaan || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Nomor Dokumen RPTKA / IMTA / Kemenaker</p>
                    <p className="font-mono font-semibold text-slate-800 mt-0.5">{data.nomor_dokumen_kerja || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Status Verifikasi Kerja</p>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 mt-1">
                      ✓ Status Bekerja Terverifikasi OK
                    </span>
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2">
                  <p className="text-xs text-slate-400 font-medium">Keterangan Aktivitas</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    WNA terdaftar dengan kategori kegiatan: <strong>{data.status_bekerja || '-'}</strong> di lingkungan Banjar Saba.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DATA PENJAMIN / SPONSOR (KHUSUS WNA) */}
        {data.kewarganegaraan === 'WNA' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-800">
                🛡️
              </span>
              <h2 className="text-base font-bold text-slate-800">DATA PENJAMIN / SPONSOR</h2>
            </div>

            <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 font-medium">Nama Penjamin / Sponsor</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.nama_penjamin || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Kategori Penjamin</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.kategori_penjamin || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">NIK Penjamin / No. Identitas</p>
                <p className="font-mono font-semibold text-slate-800 mt-0.5">{data.nik_penjamin || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">No. Telepon / Kontak Penjamin</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.telepon_penjamin || '-'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-400 font-medium">Alamat Tempat Tinggal Penjamin</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.alamat_penjamin || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {/* BAGIAN B: DATA TEMPAT TINGGAL BARU */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800">
              B
            </span>
            <h2 className="text-base font-bold text-slate-800">
              DATA TEMPAT TINGGAL BARU (DI BANJAR SABA PENATIH)
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 font-medium">Alamat Tempat Tinggal Baru</p>
                <p className="font-semibold text-slate-800 mt-0.5">{data.alamat_baru}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Status Tempat Tinggal</p>
                  <p className="font-semibold text-emerald-700 mt-0.5">{data.status_tempat_tinggal}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Mulai Tinggal Sejak</p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {data.tanggal_mulai_tinggal
                      ? new Date(data.tanggal_mulai_tinggal).toLocaleDateString('id-ID', { dateStyle: 'long' })
                      : '-'}
                  </p>
                </div>
              </div>

              {data.status_tempat_tinggal !== 'Milik Sendiri' && (
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    Informasi Pemilik Tempat Tinggal
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400">Nama Pemilik:</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{data.nama_pemilik_rumah || '-'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Kontak Pemilik:</span>
                      <p className="font-semibold text-slate-800 mt-0.5">{data.nomor_kontak_pemilik || '-'}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-xs font-mono text-slate-500">
                <span>Koordinat: </span>
                <span className="font-bold text-slate-700">
                  {data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : 'Belum ditentukan'}
                </span>
              </div>
            </div>

            {/* Peta Lokasi */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Peta Lokasi Geotagging</p>
              {data.latitude && data.longitude ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <MapPreview
                    latitude={data.latitude}
                    longitude={data.longitude}
                    title={`Tempat Tinggal: ${data.nama_lengkap}`}
                    height={220}
                  />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400">
                  Titik koordinat peta belum diatur
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BAGIAN C: DATA ASAL */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800">
              C
            </span>
            <h2 className="text-base font-bold text-slate-800">DATA DAERAH ASAL</h2>
          </div>

          <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-400 font-medium">Alamat Asal</p>
              <p className="font-semibold text-slate-800 mt-0.5">{data.alamat_asal}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">RT / RW / Lingkungan</p>
              <p className="font-semibold text-slate-800 mt-0.5">{data.rt_rw_asal || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Kelurahan / Desa</p>
              <p className="font-semibold text-slate-800 mt-0.5">{data.kelurahan_asal || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Kecamatan</p>
              <p className="font-semibold text-slate-800 mt-0.5">{data.kecamatan_asal || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Kota / Kabupaten</p>
              <p className="font-semibold text-slate-800 mt-0.5">{data.kota_kabupaten_asal || '-'}</p>
            </div>
          </div>
        </div>

        {/* BAGIAN D: ANGGOTA KELUARGA YANG IKUT PINDAH */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800">
                D
              </span>
              <h2 className="text-base font-bold text-slate-800">
                DATA ANGGOTA KELUARGA YANG IKUT PINDAH
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              Total: {data.anggota?.length || 0} Jiwa
            </span>
          </div>

          {!data.anggota || data.anggota.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
              Tidak ada anggota keluarga lain yang didaftarkan (pindah sendiri).
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">No</th>
                    <th className="py-2.5 px-4">Nama Lengkap</th>
                    <th className="py-2.5 px-4">{data.kewarganegaraan === 'WNA' ? 'No. Paspor / NIK' : 'NIK'}</th>
                    <th className="py-2.5 px-4">Tempat / Tgl Lahir</th>
                    <th className="py-2.5 px-4">Hubungan Keluarga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {data.anggota.map((ang, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 text-center text-slate-400 font-bold">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{ang.nama}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {ang.nomor_paspor ? (
                          <span className="font-semibold text-purple-700">Paspor: {ang.nomor_paspor}</span>
                        ) : (
                          ang.nik || '-'
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {ang.tempat_lahir || '-'}
                        {ang.tanggal_lahir ? `, ${new Date(ang.tanggal_lahir).toLocaleDateString('id-ID')}` : ''}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex rounded-lg bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
                          {ang.hubungan_keluarga || 'Famili'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* BAGIAN E: DOKUMEN YANG DILAMPIRKAN */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800">
                E
              </span>
              <h2 className="text-base font-bold text-slate-800">DOKUMEN YANG DILAMPIRKAN</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {data.kewarganegaraan === 'WNA' ? 'Persyaratan Dokumen WNA (Tanpa Pasfoto)' : 'Persyaratan Dokumen WNI'}
            </span>
          </div>

          {data.kewarganegaraan === 'WNA' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Paspor */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Fotokopi Paspor</span>
                  {data.lampiran_paspor ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Tidak ada
                    </span>
                  )}
                </div>
                {data.file_paspor ? (
                  <a
                    href={getStorageUrl(data.file_paspor)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Buka Berkas Paspor
                  </a>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-2">Tidak ada berkas digital diunggah</p>
                )}
              </div>

              {/* KITAS / KITAP */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Fotokopi KITAS / KITAP</span>
                  {data.lampiran_kitas_kitap ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Tidak ada
                    </span>
                  )}
                </div>
                {data.file_kitas_kitap ? (
                  <a
                    href={getStorageUrl(data.file_kitas_kitap)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Buka Berkas KITAS/KITAP
                  </a>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-2">Tidak ada berkas digital diunggah</p>
                )}
              </div>

              {/* Surat Permohonan / Sponsor */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Surat Permohonan / Sponsor</span>
                  {data.lampiran_surat_permohonan ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Tidak ada
                    </span>
                  )}
                </div>
                {data.file_surat_permohonan ? (
                  <a
                    href={getStorageUrl(data.file_surat_permohonan)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Buka Surat Sponsor
                  </a>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-2">Tidak ada berkas digital diunggah</p>
                )}
              </div>

              {/* KTP Penjamin */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Fotokopi KTP Penjamin</span>
                  {data.lampiran_ktp_penjamin ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Tidak ada
                    </span>
                  )}
                </div>
                {data.file_ktp_penjamin ? (
                  <a
                    href={getStorageUrl(data.file_ktp_penjamin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Buka KTP Penjamin
                  </a>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-2">Tidak ada berkas digital diunggah</p>
                )}
              </div>

              {/* Dokumen Kerja */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Dokumen Kerja (RPTKA/Kemenaker)</span>
                  {data.lampiran_dokumen_kerja ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Tidak ada
                    </span>
                  )}
                </div>
                {data.file_dokumen_kerja ? (
                  <a
                    href={getStorageUrl(data.file_dokumen_kerja)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Buka Dokumen Kerja
                  </a>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-2">Tidak ada berkas digital diunggah</p>
                )}
              </div>

              {/* Dokumen Lainnya */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Dokumen Pendukung Lainnya</span>
                  {data.lampiran_dokumen_lainnya ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Tidak ada
                    </span>
                  )}
                </div>
                {data.file_dokumen_lainnya ? (
                  <a
                    href={getStorageUrl(data.file_dokumen_lainnya)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Buka Berkas Lainnya
                  </a>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-2">Tidak ada berkas digital diunggah</p>
                )}
              </div>

              {/* Tanda Tangan Pelapor */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Tanda Tangan Pelapor</span>
                  {data.tanda_tangan || data.lampiran_ttd ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Tidak ada
                    </span>
                  )}
                </div>
                {data.tanda_tangan ? (
                  <div className="mt-2 space-y-2">
                    <div className="h-16 w-full rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1">
                      <img
                        src={getStorageUrl(data.tanda_tangan)}
                        alt="Tanda Tangan Pelapor"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <a
                      href={getStorageUrl(data.tanda_tangan)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Buka Berkas TTD
                    </a>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-2">Belum ada tanda tangan digital / berkas</p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* KTP */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Fotokopi KTP</span>
                  {data.lampiran_ktp ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Tidak ada
                    </span>
                  )}
                </div>
                {data.file_ktp ? (
                  <a
                    href={getStorageUrl(data.file_ktp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Buka Berkas KTP
                  </a>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-2">Tidak ada berkas digital diunggah</p>
                )}
              </div>

              {/* KK */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Fotokopi KK</span>
                  {data.lampiran_kk ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Tidak ada
                    </span>
                  )}
                </div>
                {data.file_kk ? (
                  <a
                    href={getStorageUrl(data.file_kk)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Buka Berkas KK
                  </a>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-2">Tidak ada berkas digital diunggah</p>
                )}
              </div>

              {/* Surat Pindah */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Surat Keterangan Pindah</span>
                  {data.lampiran_surat_pindah ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Tidak ada
                    </span>
                  )}
                </div>
                {data.file_surat_pindah ? (
                  <a
                    href={getStorageUrl(data.file_surat_pindah)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Buka Surat Pindah
                  </a>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-2">Tidak ada berkas digital diunggah</p>
                )}
              </div>

              {/* Tanda Tangan Pelapor */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Tanda Tangan Pelapor</span>
                  {data.tanda_tangan || data.lampiran_ttd ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Tidak ada
                    </span>
                  )}
                </div>
                {data.tanda_tangan ? (
                  <div className="mt-2 space-y-2">
                    <div className="h-16 w-full rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1">
                      <img
                        src={getStorageUrl(data.tanda_tangan)}
                        alt="Tanda Tangan Pelapor"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <a
                      href={getStorageUrl(data.tanda_tangan)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Buka Berkas TTD
                    </a>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-2">Belum ada tanda tangan digital / berkas</p>
                )}
              </div>
            </div>
          )}

          {data.catatan && (
            <div className="mt-4 rounded-xl bg-amber-50/70 p-4 border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block mb-1">Catatan Verifikasi Petugas:</span>
              <p className="text-amber-800">{data.catatan}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
