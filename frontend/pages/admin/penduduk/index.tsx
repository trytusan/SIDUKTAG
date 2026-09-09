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
import { Penduduk, PaginatedResponse } from '../../../src/types'

export default function AdminPendudukIndex() {
  const { showAlert } = useAlert()
  const [data, setData] = useState<PaginatedResponse<Penduduk> | null>(null)
  const [stats, setStats] = useState<{ total?: number; laki?: number; perempuan?: number; tetap?: number } | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [gender, setGender] = useState('')
  const [kategoriUmur, setKategoriUmur] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  async function fetchPenduduk(p = 1, s = search, st = status, g = gender, ku = kategoriUmur) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', String(p))
      if (s) params.append('search', s)
      if (st) params.append('status_kependudukan', st)
      if (g) params.append('jenis_kelamin', g)
      if (ku) params.append('kategori_umur', ku)

      const res = await api.get('/admin/penduduk?' + params.toString())
      setData(res.data.penduduk)
      if (res.data.stats) {
        setStats(res.data.stats)
      }
      setPage(p)
    } catch (err) {
      console.error('Failed to load penduduk:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPenduduk(1, search, status, gender, kategoriUmur)
  }, [search, status, gender, kategoriUmur])

  const handleReset = () => {
    setSearch('')
    setStatus('')
    setGender('')
    setKategoriUmur('')
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await api.delete('/admin/penduduk/' + deleteId)
      setDeleteId(null)
      fetchPenduduk(page, search, status, gender, kategoriUmur)
      showAlert({
        type: 'delete',
        title: 'Berhasil Dihapus!',
        message: 'Data penduduk telah berhasil dihapus dari sistem.',
      })
    } catch (err) {
      alert('Gagal menghapus data penduduk.')
      showAlert({
        type: 'error',
        title: 'Gagal Menghapus',
        message: 'Terjadi kesalahan saat menghapus data penduduk.',
      })
    } finally {
      setDeleting(false)
    }
  }

  const getExportUrl = (type: 'excel' | 'pdf') => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (status) params.append('status_kependudukan', status)
    if (gender) params.append('jenis_kelamin', gender)
    if (kategoriUmur) params.append('kategori_umur', kategoriUmur)
    return `${apiUrl}/admin/penduduk/export/${type}?${params.toString()}`
  }

  const totalPenduduk = stats?.total ?? (data?.total || 0)
  const totalLaki = stats?.laki ?? (data?.data ? data.data.filter((p) => p.jenis_kelamin === 'Laki-laki').length : 0)
  const totalPerempuan = stats?.perempuan ?? (data?.data ? data.data.filter((p) => p.jenis_kelamin === 'Perempuan').length : 0)
  const totalTetap = stats?.tetap ?? (data?.data ? data.data.filter((p) => p.status_kependudukan === 'Tetap').length : 0)

  return (
    <AdminLayout pageTitle="Data Penduduk" subtitle="Kelola seluruh data identitas warga desa/kelurahan">
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
          <li className="text-slate-800 font-semibold">Data Penduduk</li>
        </ol>
      </nav>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <CardStat
          title="Total Penduduk"
          value={totalPenduduk.toLocaleString('id-ID')}
          description="Total warga terdata dalam sistem"
          variant="emerald"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <CardStat
          title="Laki-Laki"
          value={totalLaki.toLocaleString('id-ID')}
          description="Warga berjenis kelamin laki-laki"
          variant="blue"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
        <CardStat
          title="Perempuan"
          value={totalPerempuan.toLocaleString('id-ID')}
          description="Warga berjenis kelamin perempuan"
          variant="rose"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <CardStat
          title="Penduduk Tetap"
          value={totalTetap.toLocaleString('id-ID')}
          description="Warga berstatus domisili tetap"
          variant="violet"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        />
      </div>

      {/* Filter Box */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIK, atau KK..."
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />

          <FormSelect
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            options={['Laki-laki', 'Perempuan']}
            placeholder="Semua Jenis Kelamin"
          />

          <FormSelect
            value={kategoriUmur}
            onChange={(e) => setKategoriUmur(e.target.value)}
            options={['Balita', 'Anak-anak', 'Remaja', 'Dewasa', 'Lansia']}
            placeholder="Semua Kategori Umur"
          />

          <FormSelect
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={['Tetap', 'Pendatang', 'Pindah', 'Meninggal']}
            placeholder="Semua Status Kependudukan"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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
              <span>Excel</span>
            </a>

            {/* Export PDF */}
            <a
              href={getExportUrl('pdf')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>PDF</span>
            </a>

            {/* Tambah Penduduk */}
            <Link
              href="/admin/penduduk/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Tambah Penduduk</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Table Data */}
      {loading ? (
        <LoadingSpinner message="Memuat data penduduk..." />
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
                key: 'nama_lengkap',
                label: 'Nama Lengkap',
                render: (item: Penduduk) => (
                  <div>
                    <p className="font-semibold text-slate-800">{item.nama_lengkap}</p>
                    <p className="text-xs text-slate-400">Hub: {item.status_dalam_keluarga || '-'}</p>
                  </div>
                ),
              },
              { key: 'nik', label: 'NIK' },
              { key: 'nomor_kk', label: 'Nomor KK' },
              { key: 'jenis_kelamin', label: 'Jenis Kelamin' },
              {
                key: 'kategori_umur',
                label: 'Kategori Umur',
                render: (item: Penduduk) => item.kategori_umur || '-',
              },
              {
                key: 'status_kependudukan',
                label: 'Status',
                render: (item: Penduduk) => <StatusBadge>{item.status_kependudukan || 'Tetap'}</StatusBadge>,
              },
              {
                key: 'actions',
                label: 'Aksi',
                className: 'text-center',
                render: (item: Penduduk) => (
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={'/admin/penduduk/' + item.id}
                      className="inline-flex items-center rounded-xl bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                    >
                      Detail
                    </Link>
                    <Link
                      href={'/admin/penduduk/' + item.id + '/edit'}
                      className="inline-flex items-center rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="inline-flex items-center rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Hapus
                    </button>
                  </div>
                ),
              },
            ]}
            data={data?.data || []}
            emptyMessage="Tidak ada data penduduk yang sesuai dengan kriteria pencarian."
          />

          {data && (
            <Pagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              total={data.total}
              from={data.from}
              to={data.to}
              onPageChange={(p) => fetchPenduduk(p, search, status, gender, kategoriUmur)}
            />
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Hapus Data Penduduk"
        message="Apakah Anda yakin ingin menghapus data penduduk ini dari database?"
        confirmText="Hapus Sekarang"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  )
}
