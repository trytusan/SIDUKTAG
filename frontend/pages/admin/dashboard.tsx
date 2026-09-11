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
      demografiUmur?: {
        Balita: number
        'Anak-anak': number
        Remaja: number
        Dewasa: number
        Lansia: number
      }
      gender?: {
        laki: number
        perempuan: number
      }
      statusKependudukan?: {
        tetap: number
        pendatang: number
        pendatang_sementara: number
        masa_berlaku_habis: number
        pindah: number
        meninggal: number
      }
      statistikSurat?: {
        total: number
        menunggu: number
        diproses: number
        selesai: number
        ditolak: number
      }
      statistikBantuan?: {
        total_penerima: number
        terverifikasi: number
        selesai_disalurkan: number
        menunggu: number
      }
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

  // Hitung persentase & fallback untuk visualisasi
  const umurStats = stats.demografiUmur || {
    Balita: 0,
    'Anak-anak': 0,
    Remaja: 0,
    Dewasa: 0,
    Lansia: 0,
  }
  const totalUmur = (umurStats.Balita + umurStats['Anak-anak'] + umurStats.Remaja + umurStats.Dewasa + umurStats.Lansia) || stats.totalPenduduk || 1

  const genderStats = stats.gender || { laki: 0, perempuan: 0 }
  const totalGender = (genderStats.laki + genderStats.perempuan) || 1
  const pctLaki = Math.round((genderStats.laki / totalGender) * 100)
  const pctPerempuan = 100 - pctLaki

  const statusStats = stats.statusKependudukan || {
    tetap: 0,
    pendatang: 0,
    pendatang_sementara: 0,
    masa_berlaku_habis: 0,
    pindah: 0,
    meninggal: 0,
  }

  const suratStats = stats.statistikSurat || {
    total: stats.pengajuanBulanIni || 0,
    menunggu: 0,
    diproses: 0,
    selesai: 0,
    ditolak: 0,
  }

  const bansosStats = stats.statistikBantuan || {
    total_penerima: 0,
    terverifikasi: 0,
    selesai_disalurkan: 0,
    menunggu: 0,
  }

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
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Visual Analytics & Demographics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Card 1: Demografi Kategori Usia */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Demografi Kelompok Usia
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Distribusi piramida usia seluruh warga</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                {stats.totalPenduduk} Jiwa
              </span>
            </div>

            <div className="space-y-3.5 mt-5">
              {[
                { label: 'Balita', sub: '0 - 5 thn', count: umurStats.Balita, color: 'bg-teal-500' },
                { label: 'Anak-anak', sub: '6 - 11 thn', count: umurStats['Anak-anak'], color: 'bg-sky-500' },
                { label: 'Remaja', sub: '12 - 25 thn', count: umurStats.Remaja, color: 'bg-indigo-500' },
                { label: 'Dewasa', sub: '26 - 45 thn', count: umurStats.Dewasa, color: 'bg-emerald-500' },
                { label: 'Lansia', sub: '> 45 thn', count: umurStats.Lansia, color: 'bg-amber-500' },
              ].map((item) => {
                const pct = totalUmur > 0 ? Math.round((item.count / totalUmur) * 100) : 0
                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <span>{item.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({item.sub})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{item.count} orang</span>
                        <span className="w-8 text-right font-mono text-[11px] text-slate-400 font-semibold">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                        style={{ width: `${Math.max(pct, item.count > 0 ? 4 : 0)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Standar Kategori Dukcapil</span>
            <Link href="/admin/penduduk" className="font-semibold text-emerald-600 hover:underline">
              Filter Usia &rarr;
            </Link>
          </div>
        </div>

        {/* Card 2: Rasio Gender & Komposisi Domisili */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <svg className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Gender & Status Domisili
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Komparasi jenis kelamin & sebaran warga</p>
              </div>
            </div>

            {/* Gender Dual Bar */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 mb-5">
              <div className="grid grid-cols-2 gap-3 mb-3 text-center">
                <div className="rounded-xl bg-white p-2.5 border border-sky-100 shadow-xs">
                  <span className="text-[11px] font-semibold text-sky-700 flex items-center justify-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Laki-laki
                  </span>
                  <p className="text-lg font-extrabold text-slate-800 mt-0.5">{genderStats.laki.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{pctLaki}% dari total</p>
                </div>
                <div className="rounded-xl bg-white p-2.5 border border-rose-100 shadow-xs">
                  <span className="text-[11px] font-semibold text-rose-700 flex items-center justify-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    Perempuan
                  </span>
                  <p className="text-lg font-extrabold text-slate-800 mt-0.5">{genderStats.perempuan.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{pctPerempuan}% dari total</p>
                </div>
              </div>

              {/* Stacked Comparative Bar */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 flex">
                <div
                  className="h-full bg-sky-500 transition-all duration-500"
                  style={{ width: `${pctLaki}%` }}
                  title={`Laki-laki: ${pctLaki}%`}
                />
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${pctPerempuan}%` }}
                  title={`Perempuan: ${pctPerempuan}%`}
                />
              </div>
            </div>

            {/* Status Kependudukan Grid */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Komposisi Status Kependudukan</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-violet-50/80 border border-violet-100 px-3 py-2">
                  <span className="font-medium text-violet-900">Tetap</span>
                  <span className="font-bold text-violet-950">{statusStats.tetap}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-emerald-50/80 border border-emerald-100 px-3 py-2">
                  <span className="font-medium text-emerald-900">Pendatang</span>
                  <span className="font-bold text-emerald-950">{statusStats.pendatang}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-amber-50/80 border border-amber-200 px-3 py-2">
                  <div>
                    <span className="font-medium text-amber-900 block">Pendatang Sementara</span>
                    {statusStats.masa_berlaku_habis > 0 && (
                      <span className="text-[10px] font-bold text-rose-600">
                        {statusStats.masa_berlaku_habis} izin habis
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-amber-950">{statusStats.pendatang_sementara}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-100 border border-slate-200 px-3 py-2">
                  <span className="font-medium text-slate-700">Pindah / Wafat</span>
                  <span className="font-bold text-slate-900">{statusStats.pindah + statusStats.meninggal}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pemantauan Domisili Warga</span>
            <Link href="/admin/penduduk" className="font-semibold text-sky-600 hover:underline">
              Kelola Penduduk &rarr;
            </Link>
          </div>
        </div>

        {/* Card 3: Status Layanan Surat & Realisasi Bansos */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Proses Surat & Bansos
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Efektivitas pelayanan & realisasi bantuan</p>
              </div>
            </div>

            {/* Rekap Surat */}
            <div className="mb-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Pelayanan Surat Keterangan</span>
                <span className="text-[11px] font-semibold text-slate-400">{suratStats.total} Total Masuk</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200 px-3 py-2">
                  <span className="font-medium text-amber-800">Menunggu</span>
                  <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                    {suratStats.menunggu}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-blue-50 border border-blue-200 px-3 py-2">
                  <span className="font-medium text-blue-800">Diproses</span>
                  <span className="rounded-full bg-blue-200/80 px-2 py-0.5 text-[10px] font-bold text-blue-900">
                    {suratStats.diproses}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2">
                  <span className="font-medium text-emerald-800">Selesai / Terbit</span>
                  <span className="rounded-full bg-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                    {suratStats.selesai}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-rose-50 border border-rose-200 px-3 py-2">
                  <span className="font-medium text-rose-800">Ditolak</span>
                  <span className="rounded-full bg-rose-200/80 px-2 py-0.5 text-[10px] font-bold text-rose-900">
                    {suratStats.ditolak}
                  </span>
                </div>
              </div>
            </div>

            {/* Rekap Bansos */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Penyaluran Bantuan Sosial</span>
                <span className="text-[11px] font-semibold text-slate-400">{bansosStats.total_penerima} Penerima</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                  <span className="font-medium text-slate-700">Terverifikasi Kelayakan</span>
                  <span className="font-bold text-emerald-700">{bansosStats.terverifikasi} Warga</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-emerald-50/80 border border-emerald-200 px-3 py-2">
                  <span className="font-medium text-emerald-900">Bantuan Selesai Diambil Fisik</span>
                  <span className="font-bold text-emerald-900">{bansosStats.selesai_disalurkan} Paket/Dana</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                  <span className="font-medium text-slate-600">Menunggu Verifikasi Berkas</span>
                  <span className="font-bold text-amber-700">{bansosStats.menunggu} Usulan</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Operasional & Verifikasi</span>
            <Link href="/admin/bantuan" className="font-semibold text-amber-600 hover:underline">
              Kelola Bansos &rarr;
            </Link>
          </div>
        </div>
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
            ]}
            data={pendudukTerbaru}
            emptyMessage="Belum ada data penduduk."
          />
        </div>
      </div>
    </AdminLayout>
  )
}
