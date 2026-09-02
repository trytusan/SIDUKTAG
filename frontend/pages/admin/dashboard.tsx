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
              { key: 'nomor_pengajuan', label: 'No. Pengajuan' },
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
