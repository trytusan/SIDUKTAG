import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import UserLayout from '../../../src/components/layouts/user'
import CardStat from '../../../src/components/ui/card-stat'
import StatusBadge from '../../../src/components/ui/status-badge'
import Table from '../../../src/components/ui/table'
import LoadingSpinner from '../../../src/components/ui/loading'
import api, { getStorageUrl } from '../../../src/lib/api'
import { PengajuanSurat, Penduduk, KartuKeluarga } from '../../../src/types'

const MapPreview = dynamic(
  () => import('../../../src/components/maps/map-preview'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-48 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 text-xs">
        Memuat peta...
      </div>
    ),
  }
)

export default function UserDashboard() {
  const [data, setData] = useState<{
    totalPengajuan: number
    totalSuratSelesai: number
    totalBantuanAktif: number
    totalAnggotaKeluarga: number
    pengajuanTerbaru: PengajuanSurat[]
    aktivitasTerbaru: PengajuanSurat[]
    penduduk?: Penduduk | null
    kartuKeluarga?: KartuKeluarga | null
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/user/dashboard')
        setData(res.data)
      } catch (err) {
        console.error('Failed to load user dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !data) {
    return (
      <UserLayout pageTitle="Dashboard Warga">
        <LoadingSpinner message="Memuat dashboard..." />
      </UserLayout>
    )
  }

  const {
    totalPengajuan,
    totalSuratSelesai,
    totalBantuanAktif,
    totalAnggotaKeluarga,
    pengajuanTerbaru,
    penduduk,
    kartuKeluarga,
  } = data

  return (
    <UserLayout pageTitle="Dashboard Warga" subtitle="Selamat datang di Portal Layanan Kependudukan">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              Nomor KK: {penduduk?.nomor_kk || '-'}
            </span>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Halo, {penduduk?.nama_lengkap || 'Warga'}!
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-emerald-100 max-w-xl">
              NIK Anda: <span className="font-semibold">{penduduk?.nik || '-'}</span> &bull; {penduduk?.alamat_lengkap || 'Alamat belum diatur'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/user/pengajuan-surat/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-emerald-700 shadow-md transition duration-200 hover:bg-emerald-50 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Ajukan Surat Baru</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardStat
          title="Total Pengajuan"
          value={totalPengajuan}
          description="Semua berkas yang pernah diajukan"
          variant="blue"
        />
        <CardStat
          title="Surat Selesai"
          value={totalSuratSelesai}
          description="Siap diunduh atau diambil"
          variant="emerald"
        />
        <CardStat
          title="Bantuan Aktif"
          value={totalBantuanAktif}
          description="Program bantuan terdaftar"
          variant="amber"
        />
        <CardStat
          title="Anggota Keluarga"
          value={totalAnggotaKeluarga}
          description="Tercatat dalam Kartu Keluarga"
          variant="violet"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Pengajuan Surat Terbaru */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Pengajuan Surat Terakhir</h3>
            <Link
              href="/user/pengajuan-surat"
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Lihat Semua &rarr;
            </Link>
          </div>

          <Table
            columns={[
              { key: 'nomor_pengajuan', label: 'No. Pengajuan' },
              { key: 'jenis_surat_nama', label: 'Jenis Surat' },
              { key: 'tanggal_pengajuan', label: 'Tanggal' },
              {
                key: 'status',
                label: 'Status',
                render: (item: PengajuanSurat) => <StatusBadge>{item.status}</StatusBadge>,
              },
              {
                key: 'actions',
                label: 'Aksi',
                render: (item: PengajuanSurat) => (
                  <Link
                    href={`/user/pengajuan-surat/${item.id}`}
                    className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Detail
                  </Link>
                ),
              },
            ]}
            data={pengajuanTerbaru}
            emptyMessage="Belum ada riwayat pengajuan surat."
          />
        </div>

        {/* Right 1 Col: Geotagging & Family Info */}
        <div className="space-y-6">
          {/* Kartu Keluarga Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800">Kartu Keluarga</h3>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Nomor KK</span>
                <span className="font-semibold text-slate-800">{penduduk?.nomor_kk || '-'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Kepala Keluarga</span>
                <span className="font-semibold text-slate-800">
                  {kartuKeluarga?.nama_kepala_keluarga || '-'}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">Jumlah Anggota</span>
                <span className="font-semibold text-slate-800">
                  {totalAnggotaKeluarga} Orang
                </span>
              </div>
            </div>
            <Link
              href="/user/kartu-keluarga"
              className="mt-4 block rounded-2xl border border-slate-200 bg-slate-50 py-2.5 text-center text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Lihat Anggota Keluarga
            </Link>
          </div>

          {/* Lokasi Rumah (Geotagging) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-3">Lokasi Tempat Tinggal</h3>
            {penduduk?.latitude && penduduk?.longitude ? (
              <MapPreview
                latitude={penduduk.latitude}
                longitude={penduduk.longitude}
                title={penduduk.nama_lengkap}
                height={180}
              />
            ) : (
              <div className="rounded-2xl bg-slate-50 p-4 text-center text-xs text-slate-400">
                Titik koordinat belum ditandai.{' '}
                <Link href="/user/pengaturan/profil" className="text-emerald-600 underline">
                  Atur sekarang
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
