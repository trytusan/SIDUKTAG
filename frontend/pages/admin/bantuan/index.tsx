import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import Table from '../../../src/components/ui/table'
import StatusBadge from '../../../src/components/ui/status-badge'
import FormSelect from '../../../src/components/form/select'
import Pagination from '../../../src/components/utils/pagination'
import LoadingSpinner from '../../../src/components/ui/loading'
import ConfirmModal from '../../../src/components/modal/Confirm'
import api from '../../../src/lib/api'
import { BantuanPenerima, PaginatedResponse } from '../../../src/types'

export default function AdminBantuanIndex() {
  const [data, setData] = useState<PaginatedResponse<BantuanPenerima> | null>(null)
  const [listProgram, setListProgram] = useState<{ jenis_bantuan: string }[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [jenis, setJenis] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  async function fetchPenerima(p = 1, s = search, st = status, j = jenis, t = tanggal) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', String(p))
      if (s) params.append('search', s)
      if (st) params.append('status', st)
      if (j) params.append('jenis', j)
      if (t) params.append('tanggal', t)

      const res = await api.get('/admin/bantuan?' + params.toString())
      setData(res.data.bantuan)
      if (res.data.listProgram) {
        setListProgram(res.data.listProgram)
      }
      setPage(p)
    } catch (err) {
      console.error('Failed to load bantuan data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPenerima(1, search, status, jenis, tanggal)
  }, [search, status, jenis, tanggal])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await api.delete('/admin/bantuan/' + deleteId)
      setDeleteId(null)
      fetchPenerima(page, search, status, jenis, tanggal)
    } catch (err) {
      alert('Gagal menghapus data penerima bantuan.')
    } finally {
      setDeleting(false)
    }
  }

  const getExportUrl = (type: 'excel' | 'pdf') => {
    const params = new URLSearchParams()
    params.append('export', type)
    if (search) params.append('search', search)
    if (status) params.append('status', status)
    if (jenis) params.append('jenis', jenis)
    if (tanggal) params.append('tanggal', tanggal)
    return `${apiUrl}/admin/bantuan?${params.toString()}`
  }

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
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold">Bantuan</li>
        </ol>
      </nav>

      {/* Filter Box */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            options={['Menunggu', 'Diterima', 'Ditolak', 'Selesai']}
            placeholder="Semua Status Bantuan"
          />

          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
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
                key: 'tanggal_menerima',
                label: 'Tanggal Salur',
                render: (item: BantuanPenerima) => item.tanggal_menerima || 'Belum Disalurkan',
              },
              {
                key: 'status_penerima',
                label: 'Status',
                render: (item: BantuanPenerima) => (
                  <StatusBadge>{item.status_penerima}</StatusBadge>
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
