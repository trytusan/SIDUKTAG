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
import { PengajuanSurat, PaginatedResponse, JenisSurat } from '../../../src/types'

export default function AdminPengajuanSuratIndex() {
  const [data, setData] = useState<PaginatedResponse<PengajuanSurat> | null>(null)
  const [jenisSuratList, setJenisSuratList] = useState<JenisSurat[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [jenisSuratId, setJenisSuratId] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  async function fetchSurat(p = 1, s = search, st = status, js = jenisSuratId, t = tanggal) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', String(p))
      if (s) params.append('search', s)
      if (st) params.append('status', st)
      if (js) params.append('jenis_surat_id', js)
      if (t) params.append('tanggal', t)

      const res = await api.get('/admin/pengajuan-surat?' + params.toString())
      setData(res.data.pengajuanSurat)
      if (res.data.listJenisSurat) {
        setJenisSuratList(res.data.listJenisSurat)
      }
      setPage(p)
    } catch (err) {
      console.error('Failed to load pengajuan surat:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurat(1, search, status, jenisSuratId, tanggal)
  }, [search, status, jenisSuratId, tanggal])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await api.delete('/admin/pengajuan-surat/' + deleteId)
      setDeleteId(null)
      fetchSurat(page, search, status, jenisSuratId, tanggal)
    } catch (err) {
      alert('Gagal menghapus pengajuan surat.')
    } finally {
      setDeleting(false)
    }
  }

  const getExportUrl = (type: 'excel' | 'pdf') => {
    const params = new URLSearchParams()
    params.append('export', type)
    if (search) params.append('search', search)
    if (status) params.append('status', status)
    if (jenisSuratId) params.append('jenis_surat_id', jenisSuratId)
    if (tanggal) params.append('tanggal', tanggal)
    return `${apiUrl}/admin/pengajuan-surat?${params.toString()}`
  }

  return (
    <AdminLayout pageTitle="Pengajuan Surat" subtitle="Kelola dan verifikasi permohonan surat keterangan warga">
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
          <li className="text-slate-800 font-semibold">Pengajuan Surat</li>
        </ol>
      </nav>

      {/* Filter Box */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari No. Pengajuan, Nama, atau NIK..."
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />

          <FormSelect
            value={jenisSuratId}
            onChange={(e) => setJenisSuratId(e.target.value)}
            options={jenisSuratList.map((j) => ({ value: j.id, label: j.nama }))}
            placeholder="Semua Jenis Surat"
          />

          <FormSelect
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={['Menunggu', 'Diproses', 'Selesai', 'Ditolak']}
            placeholder="Semua Status"
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
              href="/admin/jenis-surat"
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Kelola Jenis Surat</span>
            </Link>

            <Link
              href="/admin/pengajuan-surat/create"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Ajukan Surat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Table Data */}
      {loading ? (
        <LoadingSpinner message="Memuat pengajuan surat..." />
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
              { key: 'nomor_pengajuan', label: 'No. Pengajuan' },
              {
                key: 'nama_pemohon',
                label: 'Nama Pemohon',
                render: (item: PengajuanSurat) => (
                  <div>
                    <p className="font-semibold text-slate-800">{item.nama_pemohon}</p>
                    <p className="text-xs text-slate-400">NIK: {item.nik}</p>
                  </div>
                ),
              },
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
                className: 'text-center',
                render: (item: PengajuanSurat) => (
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={'/admin/pengajuan-surat/' + item.id}
                      className="inline-flex items-center rounded-xl bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                      title="Lihat Detail"
                    >
                      Detail
                    </Link>
                    <Link
                      href={'/admin/pengajuan-surat/' + item.id + '/verifikasi'}
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                      title="Verifikasi Surat"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Verifikasi</span>
                    </Link>
                    {item.status === 'Selesai' && (
                      <Link
                        href={'/admin/pengajuan-surat/' + item.id + '/cetak'}
                        target="_blank"
                        className="inline-flex items-center gap-1 rounded-xl bg-sky-50 px-2.5 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                        title="Cetak Surat"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Cetak</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="inline-flex items-center rounded-xl bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                      title="Hapus Pengajuan"
                    >
                      Hapus
                    </button>
                  </div>
                ),
              },
            ]}
            data={data?.data || []}
            emptyMessage="Belum ada data pengajuan surat yang sesuai."
          />

          {data && (
            <Pagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              total={data.total}
              from={data.from}
              to={data.to}
              onPageChange={(p) => fetchSurat(p, search, status, jenisSuratId, tanggal)}
            />
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Hapus Pengajuan Surat"
        message="Apakah Anda yakin ingin menghapus arsip pengajuan surat ini?"
        confirmText="Hapus Sekarang"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  )
}
