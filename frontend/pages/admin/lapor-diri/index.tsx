import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import Table from '../../../src/components/ui/table'
import Pagination from '../../../src/components/utils/pagination'
import LoadingSpinner from '../../../src/components/ui/loading'
import ConfirmModal from '../../../src/components/modal/Confirm'
import CardStat from '../../../src/components/ui/card-stat'
import { useAlert } from '../../../src/context/AlertContext'
import api from '../../../src/lib/api'
import { LaporDiri, PaginatedResponse } from '../../../src/types'

export default function AdminLaporDiriIndex() {
  const { showAlert } = useAlert()
  const [data, setData] = useState<PaginatedResponse<LaporDiri> | null>(null)
  const [stats, setStats] = useState<{
    total_pelapor?: number
    total_jiwa?: number
    total_wni?: number
    total_wna?: number
    total_wna_bekerja?: number
    kost?: number
    kontrak_sewa?: number
    milik_sendiri?: number
    numpang?: number
  } | null>(null)

  const [search, setSearch] = useState('')
  const [statusTinggal, setStatusTinggal] = useState('Semua')
  const [kewarganegaraan, setKewarganegaraan] = useState('Semua')
  const [statusBekerja, setStatusBekerja] = useState('Semua')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  async function fetchLaporDiri(
    p = 1,
    s = search,
    st = statusTinggal,
    kw = kewarganegaraan,
    sb = statusBekerja
  ) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', String(p))
      if (s.trim()) params.append('search', s.trim())
      if (st && st !== 'Semua') params.append('status_tempat_tinggal', st)
      if (kw && kw !== 'Semua') params.append('kewarganegaraan', kw)
      if (sb && sb !== 'Semua') params.append('status_bekerja', sb)

      const res = await api.get('/admin/lapor-diri?' + params.toString())
      setData(res.data.data || res.data.lapor_diri || res.data)
      if (res.data.stats) {
        setStats(res.data.stats)
      }
      setPage(p)
    } catch (err) {
      console.error('Failed to load lapor diri:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLaporDiri(1, search, statusTinggal, kewarganegaraan, statusBekerja)
  }, [search, statusTinggal, kewarganegaraan, statusBekerja])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await api.delete('/admin/lapor-diri/' + deleteId)
      setDeleteId(null)
      fetchLaporDiri(page, search, statusTinggal)
      showAlert({
        type: 'delete',
        title: 'Berhasil Dihapus!',
        message: 'Data formulir lapor diri warga baru berhasil dihapus.',
      })
    } catch (err) {
      console.error('Failed to delete lapor diri:', err)
      showAlert({
        type: 'error',
        title: 'Gagal Menghapus',
        message: 'Terjadi kesalahan saat menghapus data lapor diri.',
      })
    } finally {
      setDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Kost':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            Kost
          </span>
        )
      case 'Kontrak/Sewa':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
            Kontrak / Sewa
          </span>
        )
      case 'Milik Sendiri':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            Milik Sendiri
          </span>
        )
      case 'Numpang':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200">
            Numpang
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {status}
          </span>
        )
    }
  }

  const totalPelapor = stats?.total_pelapor ?? data?.total ?? 0
  const totalJiwa = stats?.total_jiwa ?? totalPelapor
  const totalWni = stats?.total_wni ?? 0
  const totalWna = stats?.total_wna ?? 0
  const totalWnaBekerja = stats?.total_wna_bekerja ?? 0
  const totalKost = stats?.kost ?? 0
  const totalKontrak = stats?.kontrak_sewa ?? 0

  const tableItems: LaporDiri[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.data)
    ? (data as any).data
    : Array.isArray((data as any)?.data?.data)
    ? (data as any).data.data
    : []

  const paginationData = (data && !Array.isArray(data) && (data as any).last_page)
    ? data
    : (data && (data as any).data && (data as any).data.last_page)
    ? (data as any).data
    : null

  return (
    <AdminLayout
      pageTitle="Lapor Diri Warga Baru"
      subtitle="Manajemen dan pencatatan formulir lapor diri warga baru (WNI & WNA) di Banjar Saba Penatih"
    >
      {/* Page Header */}
      <div className="mb-6">
        <PageHeader
          title="Lapor Diri Warga Baru"
          description="Pencatatan data warga baru (WNI & WNA) yang menyerahkan formulir lapor diri ke kantor Banjar Saba Penatih."
        />
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <CardStat
          title="Total Pelapor"
          value={totalPelapor.toLocaleString('id-ID')}
          description={`WNI: ${totalWni} • WNA: ${totalWna}`}
          variant="emerald"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <CardStat
          title="Total Jiwa Terdata"
          value={totalJiwa.toLocaleString('id-ID')}
          description="Pelapor + anggota keluarga ikut"
          variant="blue"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <CardStat
          title="WNA Terdaftar"
          value={totalWna.toLocaleString('id-ID')}
          description={`${totalWnaBekerja} Orang Status Bekerja`}
          variant="violet"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <CardStat
          title="Kost & Kontrak"
          value={`${totalKost} / ${totalKontrak}`}
          description="Hunian Kost / Sewa Rumah"
          variant="amber"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, NIK, paspor, perusahaan..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <select
              value={statusTinggal}
              onChange={(e) => setStatusTinggal(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Semua">Semua Status Tinggal</option>
              <option value="Kost">Kost</option>
              <option value="Kontrak/Sewa">Kontrak / Sewa</option>
              <option value="Milik Sendiri">Milik Sendiri</option>
              <option value="Numpang">Numpang</option>
            </select>
          </div>

          <div>
            <select
              value={kewarganegaraan}
              onChange={(e) => setKewarganegaraan(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Semua">Semua Kewarganegaraan</option>
              <option value="WNI">WNI (Warga Negara Indonesia)</option>
              <option value="WNA">WNA (Warga Negara Asing)</option>
            </select>
          </div>

          <div>
            <select
              value={statusBekerja}
              onChange={(e) => setStatusBekerja(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Semua">Semua Status Bekerja</option>
              <option value="Bekerja">Bekerja</option>
              <option value="Tidak Bekerja">Tidak Bekerja</option>
              <option value="Pelajar/Mahasiswa">Pelajar / Mahasiswa</option>
              <option value="Wisatawan/Turis">Wisatawan / Turis</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-500 font-medium">
            Menampilkan <strong className="text-slate-800">{data?.data?.length || 0}</strong> dari{' '}
            <strong className="text-slate-800">{data?.total || 0}</strong> formulir terdaftar
          </p>

          <div className="flex items-center gap-2">
            <a
              href={`${apiUrl}/admin/lapor-diri?export=pdf${search ? `&search=${encodeURIComponent(search)}` : ''}${
                statusTinggal !== 'Semua' ? `&status_tempat_tinggal=${encodeURIComponent(statusTinggal)}` : ''
              }${
                kewarganegaraan !== 'Semua' ? `&kewarganegaraan=${encodeURIComponent(kewarganegaraan)}` : ''
              }${
                statusBekerja !== 'Semua' ? `&status_bekerja=${encodeURIComponent(statusBekerja)}` : ''
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export PDF Rekap</span>
            </a>

            <Link
              href="/admin/lapor-diri/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Input Lapor Diri</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Table Data */}
      {loading ? (
        <LoadingSpinner message="Memuat data lapor diri warga baru..." />
      ) : (
        <div className="space-y-4">
          <Table
            columns={[
              {
                key: 'pelapor',
                label: 'Nama Pelapor & Identitas',
                render: (item: LaporDiri) => (
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Link
                        href={`/admin/lapor-diri/${item.id}`}
                        className="font-bold text-slate-900 hover:text-emerald-700 transition"
                      >
                        {item.nama_lengkap}
                      </Link>
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold border ${
                          item.kewarganegaraan === 'WNA'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {item.kewarganegaraan === 'WNA' ? `WNA (${item.negara_asal || 'Asing'})` : 'WNI'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-mono mt-0.5">
                      {item.kewarganegaraan === 'WNA'
                        ? `Paspor: ${item.nomor_paspor || '-'}`
                        : `NIK: ${item.nik || '-'}`}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {item.jenis_kelamin}{' '}
                      {item.kewarganegaraan === 'WNA'
                        ? item.status_bekerja
                          ? `• Status: ${item.status_bekerja}`
                          : ''
                        : item.pekerjaan
                        ? `• ${item.pekerjaan}`
                        : ''}
                    </p>
                    {item.kewarganegaraan === 'WNA' && item.status_bekerja === 'Bekerja' && (
                      <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
                        🏢 {item.nama_perusahaan || 'Perusahaan'}{' '}
                        {item.jabatan_pekerjaan ? `(${item.jabatan_pekerjaan})` : ''}
                      </p>
                    )}
                  </div>
                ),
              },
              {
                key: 'tempat_tinggal',
                label: 'Alamat Tinggal di Banjar',
                render: (item: LaporDiri) => (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      {getStatusBadge(item.status_tempat_tinggal)}
                      {item.tanggal_mulai_tinggal && (
                        <span className="text-[11px] text-slate-400">
                          Sejak: {item.tanggal_mulai_tinggal}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-800 line-clamp-2">{item.alamat_baru}</p>
                    {item.nama_pemilik_rumah && (
                      <p className="text-[11px] text-slate-500">
                        Pemilik: <strong>{item.nama_pemilik_rumah}</strong>{' '}
                        {item.nomor_kontak_pemilik ? `(${item.nomor_kontak_pemilik})` : ''}
                      </p>
                    )}
                  </div>
                ),
              },
              {
                key: 'asal',
                label: 'Daerah Asal / Penjamin',
                render: (item: LaporDiri) => (
                  <div>
                    {item.kewarganegaraan === 'WNA' ? (
                      <>
                        <p className="font-semibold text-purple-800 text-xs">
                          Negara: {item.negara_asal || '-'}
                        </p>
                        {item.nama_penjamin && (
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Penjamin: <strong>{item.nama_penjamin}</strong>
                          </p>
                        )}
                        {item.jenis_izin_tinggal && (
                          <p className="text-[10px] text-slate-400">
                            Izin: {item.jenis_izin_tinggal}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-slate-800 text-xs">
                          {item.kota_kabupaten_asal || '-'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Kec. {item.kecamatan_asal || '-'}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {item.alamat_asal}
                        </p>
                      </>
                    )}
                  </div>
                ),
              },
              {
                key: 'keluarga_ikut',
                label: 'Keluarga Ikut',
                render: (item: LaporDiri) => {
                  const count = item.anggota_count ?? (item.anggota?.length || 0)
                  return (
                    <div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {count} Orang
                      </span>
                      {count > 0 && item.anggota && (
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {item.anggota.map((a) => a.nama).join(', ')}
                        </p>
                      )}
                    </div>
                  )
                },
              },
              {
                key: 'lampiran',
                label: 'Berkas Fisik',
                render: (item: LaporDiri) => (
                  <div className="flex flex-col gap-1 text-[11px]">
                    {item.kewarganegaraan === 'WNA' ? (
                      <>
                        <span className={item.lampiran_paspor ? 'text-emerald-700 font-semibold' : 'text-slate-300 line-through'}>
                          {item.lampiran_paspor ? '✓' : '✗'} FC Paspor
                        </span>
                        <span className={item.lampiran_kitas_kitap ? 'text-emerald-700 font-semibold' : 'text-slate-300 line-through'}>
                          {item.lampiran_kitas_kitap ? '✓' : '✗'} KITAS/KITAP
                        </span>
                        <span className={item.lampiran_surat_permohonan ? 'text-emerald-700 font-semibold' : 'text-slate-300 line-through'}>
                          {item.lampiran_surat_permohonan ? '✓' : '✗'} Surat Sponsor
                        </span>
                        {item.status_bekerja === 'Bekerja' && (
                          <span className={item.lampiran_dokumen_kerja ? 'text-emerald-700 font-semibold' : 'text-amber-600'}>
                            {item.lampiran_dokumen_kerja ? '✓' : '○'} Dok. Kerja (RPTKA)
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className={item.lampiran_ktp ? 'text-emerald-700 font-semibold' : 'text-slate-300 line-through'}>
                          {item.lampiran_ktp ? '✓' : '✗'} FC KTP
                        </span>
                        <span className={item.lampiran_kk ? 'text-emerald-700 font-semibold' : 'text-slate-300 line-through'}>
                          {item.lampiran_kk ? '✓' : '✗'} FC KK
                        </span>
                        <span className={item.lampiran_surat_pindah ? 'text-emerald-700 font-semibold' : 'text-slate-300 line-through'}>
                          {item.lampiran_surat_pindah ? '✓' : '✗'} Surat Pindah
                        </span>
                      </>
                    )}
                  </div>
                ),
              },
              {
                key: 'actions',
                label: 'Aksi',
                render: (item: LaporDiri) => (
                  <div className="flex items-center gap-1.5">
                    {/* Pratinjau / Detail */}
                    <Link
                      href={`/admin/lapor-diri/${item.id}`}
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition"
                      title="Lihat Detail Formulir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>

                    {/* Cetak Formulir PDF */}
                    <Link
                      href={`/admin/lapor-diri/${item.id}/cetak`}
                      target="_blank"
                      className="rounded-xl border border-blue-200 bg-blue-50 p-2 text-blue-700 hover:bg-blue-100 transition"
                      title="Cetak Formulir Lembar Fisik"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </Link>

                    {/* Edit */}
                    <Link
                      href={`/admin/lapor-diri/${item.id}/edit`}
                      className="rounded-xl border border-amber-200 bg-amber-50 p-2 text-amber-700 hover:bg-amber-100 transition"
                      title="Edit Data"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>

                    {/* Hapus */}
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-700 hover:bg-rose-100 transition"
                      title="Hapus Data"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ),
              },
            ]}
            data={tableItems}
            emptyMessage="Belum ada data pendaftaran lapor diri warga baru."
          />

          {paginationData && paginationData.last_page > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination
                currentPage={paginationData.current_page || page}
                lastPage={paginationData.last_page}
                total={paginationData.total}
                from={paginationData.from}
                to={paginationData.to}
                onPageChange={(p) => fetchLaporDiri(p, search, statusTinggal)}
              />
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Hapus Formulir Lapor Diri?"
        message="Data formulir lapor diri warga baru ini beserta daftar anggota keluarga yang ikut pindah akan dihapus secara permanen dari sistem."
        confirmText="Ya, Hapus Formulir"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  )
}
