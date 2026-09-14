import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import Table from '../../../src/components/ui/table'
import StatusBadge from '../../../src/components/ui/status-badge'
import FormSelect from '../../../src/components/form/select'
import Pagination from '../../../src/components/utils/pagination'
import LoadingSpinner from '../../../src/components/ui/loading'
import ConfirmModal from '../../../src/components/modal/Confirm'
import CardStat from '../../../src/components/ui/card-stat'
import { useAlert } from '../../../src/context/AlertContext'
import api from '../../../src/lib/api'
import { BantuanPenerima, PaginatedResponse } from '../../../src/types'

export default function AdminBantuanIndex() {
  const { showAlert } = useAlert()
  const [data, setData] = useState<PaginatedResponse<BantuanPenerima> | null>(null)
  const [stats, setStats] = useState<{ total_penerima?: number; diterima?: number; menunggu?: number; total_program?: number } | null>(null)
  const [listProgram, setListProgram] = useState<{ jenis_bantuan: string }[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [statusVerifikasi, setStatusVerifikasi] = useState('')
  const [jenis, setJenis] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  async function fetchPenerima(p = 1, s = search, st = status, j = jenis, t = tanggal, sv = statusVerifikasi) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', String(p))
      if (s) params.append('search', s)
      if (st) params.append('status', st)
      if (sv) params.append('status_verifikasi', sv)
      if (j) params.append('jenis', j)
      if (t) params.append('tanggal', t)

      const res = await api.get('/admin/bantuan?' + params.toString())
      setData(res.data.bantuan)
      if (res.data.listProgram) {
        setListProgram(res.data.listProgram)
      }
      if (res.data.stats) {
        setStats(res.data.stats)
      }
      setPage(p)
    } catch (err) {
      console.error('Failed to load bantuan data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPenerima(1, search, status, jenis, tanggal, statusVerifikasi)
  }, [search, status, jenis, tanggal, statusVerifikasi])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await api.delete('/admin/bantuan/' + deleteId)
      setDeleteId(null)
      fetchPenerima(page, search, status, jenis, tanggal, statusVerifikasi)
      showAlert({
        type: 'delete',
        title: 'Berhasil Dihapus!',
        message: 'Data penerima bantuan telah berhasil dihapus.',
      })
    } catch (err) {
      alert('Gagal menghapus data penerima bantuan.')
      showAlert({
        type: 'error',
        title: 'Gagal Menghapus',
        message: 'Terjadi kesalahan saat menghapus data penerima bantuan.',
      })
    } finally {
      setDeleting(false)
    }
  }

  const getExportUrl = (type: 'excel' | 'pdf') => {
    const params = new URLSearchParams()
    params.append('export', type)
    if (search) params.append('search', search)
    if (status) params.append('status', status)
    if (statusVerifikasi) params.append('status_verifikasi', statusVerifikasi)
    if (jenis) params.append('jenis', jenis)
    if (tanggal) params.append('tanggal', tanggal)
    return `${apiUrl}/admin/bantuan?${params.toString()}`
  }

  const totalPenerima = stats?.total_penerima ?? (data?.total || 0)
  const totalDisetujui = (stats as any)?.disetujui ?? (data?.data ? data.data.filter((b) => b.status_penerima === 'Diterima').length : 0)
  const totalSelesai = (stats as any)?.selesai ?? (data?.data ? data.data.filter((b) => b.status_penerima === 'Selesai').length : 0)
  const totalMenunggu = (stats as any)?.menunggu ?? (data?.data ? data.data.filter((b) => b.status_penerima === 'Menunggu').length : 0)
  const totalProgram = stats?.total_program ?? (listProgram.length || 0)

  return (
    <AdminLayout pageTitle="Data Bantuan" subtitle="Kelola dan pantau penyaluran bantuan sosial bagi warga">
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
          <li className="text-slate-800 font-semibold">Bantuan</li>
        </ol>
      </nav>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <CardStat
          title="Total Penerima"
          value={totalPenerima.toLocaleString('id-ID')}
          description="Alokasi pengajuan bansos"
          variant="emerald"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <CardStat
          title="Disetujui (Siap Salur)"
          value={totalDisetujui.toLocaleString('id-ID')}
          description="Lolos seleksi / siap diambil"
          variant="blue"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <CardStat
          title="Selesai (Sudah Diambil)"
          value={totalSelesai.toLocaleString('id-ID')}
          description="Bantuan diserahkan ke warga"
          variant="emerald"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 13l4 4L19 7" />
            </svg>
          }
        />
        <CardStat
          title="Menunggu Verifikasi"
          value={totalMenunggu.toLocaleString('id-ID')}
          description="Menunggu ditinjau operator"
          variant="amber"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <CardStat
          title="Program Aktif"
          value={totalProgram.toLocaleString('id-ID')}
          description="Total ragam program bansos"
          variant="violet"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
      </div>

      {/* Quick Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => {
            setStatus('')
            setStatusVerifikasi('')
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            status === '' && statusVerifikasi === ''
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span>Semua Penerima</span>
          <span className="rounded-full bg-slate-200/50 px-2 py-0.5 text-[10px] text-slate-700 font-semibold">
            {totalPenerima}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatus('Menunggu')
            setStatusVerifikasi('')
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            status === 'Menunggu'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 ring-2 ring-amber-300'
              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <span>Menunggu Verifikasi</span>
          <span className="rounded-full bg-amber-200/70 px-2 py-0.5 text-[10px] text-amber-900 font-bold">
            {totalMenunggu}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatus('Diterima')
            setStatusVerifikasi('')
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            status === 'Diterima'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 ring-2 ring-sky-300'
              : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
          }`}
        >
          <span>Disetujui (Siap Salur)</span>
          <span className="rounded-full bg-sky-200/70 px-2 py-0.5 text-[10px] text-sky-900 font-bold">
            {totalDisetujui}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatus('Selesai')
            setStatusVerifikasi('')
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            status === 'Selesai'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-300'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <span>Selesai (Sudah Diterima Fisik)</span>
          <span className="rounded-full bg-emerald-200/70 px-2 py-0.5 text-[10px] text-emerald-900 font-bold">
            {totalSelesai}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatus('Ditolak')
            setStatusVerifikasi('')
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
            status === 'Ditolak'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 ring-2 ring-rose-300'
              : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
          }`}
        >
          <span>Ditolak</span>
        </button>
      </div>

      {/* Filter Box */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIK, atau program..."
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />

          <FormSelect
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            options={listProgram.map((lp) => ({ value: lp.jenis_bantuan, label: lp.jenis_bantuan }))}
            placeholder="Semua Jenis Bantuan"
          />

          <FormSelect
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { value: 'Menunggu', label: 'Menunggu Verifikasi' },
              { value: 'Diterima', label: 'Disetujui (Siap Salur)' },
              { value: 'Selesai', label: 'Selesai (Sudah Diambil)' },
              { value: 'Ditolak', label: 'Ditolak' },
            ]}
            placeholder="Semua Status Realisasi"
          />

          <FormSelect
            value={statusVerifikasi}
            onChange={(e) => setStatusVerifikasi(e.target.value)}
            options={[
              { value: 'Menunggu Verifikasi', label: 'Menunggu Verifikasi' },
              { value: 'Terverifikasi', label: 'Terverifikasi' },
              { value: 'Ditolak', label: 'Verifikasi Ditolak' },
            ]}
            placeholder="Semua Status Verifikasi"
          />

          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            title="Tanggal Realisasi / Pengambilan"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setStatus('')
              setStatusVerifikasi('')
              setJenis('')
              setTanggal('')
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Bersihkan Filter</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Export Excel */}
            <a
              href={getExportUrl('excel')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export Excel</span>
            </a>

            {/* Export PDF */}
            <a
              href={getExportUrl('pdf')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cetak PDF</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/admin/jenis-bantuan"
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Kelola Jenis Bantuan</span>
            </Link>

            <Link
              href="/admin/bantuan/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Ajukan Bantuan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Table Data */}
      {loading ? (
        <LoadingSpinner message="Memuat penerima bantuan..." />
      ) : (
        <div className="space-y-4">
          <Table
            columns={[
              {
                key: 'no',
                label: 'No',
                className: 'w-12 text-center',
                render: (_: any, idx: number) => {
                  const from = data?.from || 1
                  return <span className="text-xs text-slate-500 font-semibold">{from + idx}</span>
                },
              },
              {
                key: 'penduduk',
                label: 'Nama Warga (NIK)',
                render: (item: BantuanPenerima) => (
                  <div>
                    <p className="font-semibold text-slate-800">{item.penduduk?.nama_lengkap || '-'}</p>
                    <p className="text-xs text-slate-400">NIK: {item.penduduk?.nik || '-'}</p>
                  </div>
                ),
              },
              {
                key: 'program',
                label: 'Program Bantuan',
                render: (item: BantuanPenerima) => (
                  <div>
                    <p className="font-medium text-slate-800">{item.bantuan?.nama_program || '-'}</p>
                    <p className="text-xs text-slate-400">Jenis: {item.bantuan?.jenis_bantuan || '-'}</p>
                  </div>
                ),
              },
              {
                key: 'status_verifikasi',
                label: 'Verifikasi',
                render: (item: BantuanPenerima) => {
                  const sv = item.status_verifikasi || 'Menunggu Verifikasi'
                  const isVerified = sv === 'Terverifikasi'
                  const isRejected = sv === 'Ditolak'
                  return (
                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold border ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isRejected
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {sv}
                      </span>
                      {item.tanggal_verifikasi && (
                        <p className="text-[10px] text-slate-400 mt-0.5">Tgl: {item.tanggal_verifikasi}</p>
                      )}
                    </div>
                  )
                },
              },
              {
                key: 'status_penerima',
                label: 'Status Penyaluran',
                render: (item: BantuanPenerima) => {
                  const sp = item.status_penerima
                  if (sp === 'Selesai') {
                    return (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Selesai (Sudah Diambil)
                      </span>
                    )
                  }
                  if (sp === 'Diterima') {
                    return (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                        <svg className="w-3.5 h-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        Disetujui (Siap Salur)
                      </span>
                    )
                  }
                  if (sp === 'Ditolak') {
                    return (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Ditolak
                      </span>
                    )
                  }
                  return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Menunggu
                    </span>
                  )
                },
              },
              {
                key: 'tanggal_menerima',
                label: 'Tanggal Salur / Fisik',
                render: (item: BantuanPenerima) => (
                  <span className="text-xs text-slate-700">
                    {item.tanggal_menerima || (item.status_penerima === 'Selesai' ? 'Sudah Diambil' : 'Belum Diambil')}
                  </span>
                ),
              },
              {
                key: 'actions',
                label: 'Aksi',
                className: 'text-center',
                render: (item: BantuanPenerima) => (
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={'/admin/bantuan/' + item.id}
                      className="inline-flex items-center rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                      title="Lihat Detail"
                    >
                      Detail
                    </Link>
                    <Link
                      href={'/admin/bantuan/' + item.id + '/edit'}
                      className="inline-flex items-center rounded-xl bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                      title="Edit Status"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="inline-flex items-center rounded-xl bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                      title="Hapus Data"
                    >
                      Hapus
                    </button>
                  </div>
                ),
              },
            ]}
            data={data?.data || []}
            emptyMessage="Belum ada data penerima bantuan."
          />

          {data && (
            <Pagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              total={data.total}
              from={data.from}
              to={data.to}
              onPageChange={(p) => fetchPenerima(p, search, status, jenis, tanggal)}
            />
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Hapus Data Penerima Bantuan"
        message="Apakah Anda yakin ingin menghapus data penerima bantuan ini?"
        confirmText="Hapus Sekarang"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  )
}
