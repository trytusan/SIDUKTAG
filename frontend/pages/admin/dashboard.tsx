import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../src/components/layouts/admin'
import CardStat from '../../src/components/ui/card-stat'
import Table from '../../src/components/ui/table'
import StatusBadge from '../../src/components/ui/status-badge'
import LoadingSpinner from '../../src/components/ui/loading'
import api from '../../src/lib/api'
import { PengajuanSurat, Penduduk } from '../../src/types'

export default function AdminDashboard() {
  const [data, setData] = useState<{
    stats: {
      totalPenduduk: number
      totalKeluarga: number
      pengajuanBulanIni: number
      bantuanAktif: number
    }
    pengajuanTerbaru: PengajuanSurat[]
    pendudukTerbaru: Penduduk[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/admin/dashboard')
        setData(res.data)
      } catch (err) {
        console.error('Failed to load admin dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading || !data) {
    return (
      <AdminLayout pageTitle="Dashboard Administrator">
        <LoadingSpinner message="Memuat ringkasan data admin..." />
      </AdminLayout>
    )
  }

  const { stats, pengajuanTerbaru, pendudukTerbaru } = data

  return (
    <AdminLayout
      pageTitle="Dashboard Administrator"
      subtitle="Ringkasan kependudukan dan aktivitas layanan desa/kelurahan"
    >
      {/* Quick Action / Landing Page Return Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Panel Kontrol Administrator</h2>
            <p className="text-xs text-slate-500">Anda dapat beralih melihat halaman depan portal warga kapan saja</p>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
          </svg>
          <span>Kembali ke Landing Page</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CardStat
          title="Total Penduduk"
          value={stats.totalPenduduk}
          description="Warga terdaftar di sistem"
          variant="emerald"
        />
        <CardStat
          title="Total Keluarga"
          value={stats.totalKeluarga}
          description="Kepala Keluarga terdata"
          variant="blue"
        />
        <CardStat
          title="Pengajuan Bulan Ini"
          value={stats.pengajuanBulanIni}
          description="Permohonan surat masuk"
          variant="amber"
        />
        <CardStat
          title="Program Bantuan"
          value={stats.bantuanAktif}
          description="Bansos aktif berjalan"
          variant="violet"
        />
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pengajuan Surat Masuk */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Pengajuan Surat Masuk</h3>
            <Link
              href="/admin/pengajuan-surat"
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Kelola Semua &rarr;
            </Link>
          </div>

          <Table
            columns={[
              { key: 'nama_pemohon', label: 'Nama Warga' },
              { key: 'jenis_surat_nama', label: 'Jenis Surat' },
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
                    href={`/admin/pengajuan-surat/${item.id}`}
                    className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Proses
                  </Link>
                ),
              },
            ]}
            data={pengajuanTerbaru}
            emptyMessage="Belum ada pengajuan surat masuk."
          />
        </div>

        {/* Penduduk Baru Terdaftar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Penduduk Terbaru</h3>
            <Link
              href="/admin/penduduk"
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Lihat Semua &rarr;
            </Link>
          </div>

          <Table
            columns={[
              { key: 'nama_lengkap', label: 'Nama Lengkap' },
              { key: 'nik', label: 'NIK' },
              { key: 'nomor_kk', label: 'No. KK' },
              {
                key: 'status_kependudukan',
                label: 'Status',
                render: (item: Penduduk) => <StatusBadge>{item.status_kependudukan || 'Tetap'}</StatusBadge>,
              },
              {
                key: 'actions',
                label: 'Aksi',
                render: (item: Penduduk) => (
                  <Link
                    href={`/admin/penduduk/${item.id}`}
                    className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Detail
                  </Link>
                ),
              },
            ]}
            data={pendudukTerbaru}
            emptyMessage="Belum ada data penduduk."
          />
        </div>
      </div>
    </AdminLayout>
  )
}
