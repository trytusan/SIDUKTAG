import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import CardStat from '../../../src/components/ui/card-stat'
import Table from '../../../src/components/ui/table'
import Pagination from '../../../src/components/utils/pagination'
import ConfirmModal from '../../../src/components/modal/Confirm'
import LoadingSpinner from '../../../src/components/ui/loading'
import { useAlert } from '../../../src/context/AlertContext'
import api, { getStorageUrl } from '../../../src/lib/api'
import { Formulir } from '../../../src/types'

export default function AdminFormulirIndex() {
  const { showAlert } = useAlert()
  const [data, setData] = useState<{
    data: Formulir[]
    current_page: number
    last_page: number
    total: number
    from?: number | null
    to?: number | null
  } | null>(null)

  const [stats, setStats] = useState({
    total_formulir: 0,
    total_download: 0,
    total_aktif: 0,
    kategori_list: [] as string[],
  })

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [kategori, setKategori] = useState('Semua')
  const [page, setPage] = useState(1)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedFormulir, setSelectedFormulir] = useState<Formulir | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (kategori && kategori !== 'Semua') params.append('kategori', kategori)
      params.append('page', String(page))

      const res = await api.get('/admin/formulir?' + params.toString())
      setData(res.data.data)
      if (res.data.stats) {
        setStats(res.data.stats)
      }
    } catch (err) {
      console.error('Failed to load formulir list:', err)
      showAlert({
        type: 'error',
        title: 'Gagal Memuat Data',
        message: 'Tidak dapat mengambil daftar formulir dari server.',
      })
    } finally {
      setLoading(false)
    }
  }, [search, kategori, page, showAlert])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchData])

  const handleDelete = async () => {
    if (!selectedFormulir) return
    setDeleting(true)
    try {
      await api.delete('/admin/formulir/' + selectedFormulir.id)
      showAlert({
        type: 'success',
        title: 'Berhasil Dihapus',
        message: 'Template formulir telah dihapus dari sistem.',
      })
      setDeleteModalOpen(false)
      setSelectedFormulir(null)
      fetchData()
    } catch (err: any) {
      console.error('Failed to delete formulir:', err)
      showAlert({
        type: 'error',
        title: 'Gagal Menghapus',
        message: err.response?.data?.message || 'Terjadi kesalahan sistem saat menghapus formulir.',
      })
    } finally {
      setDeleting(false)
    }
  }

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return '-'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getFormatBadge = (fmt?: string) => {
    const f = (fmt || 'docx').toLowerCase()
    if (f === 'pdf') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
          <svg className="h-3.5 w-3.5 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 3C5.34315 3 4 4.34315 4 6V18C4 19.6569 5.34315 21 7 21H17C18.6569 21 20 19.6569 20 18V9.41421C20 8.6186 19.6839 7.85561 19.1213 7.29289L15.7071 3.87868C15.1444 3.31596 14.3814 3 13.5858 3H7Z" />
          </svg>
          PDF
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
        <svg className="h-3.5 w-3.5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
        </svg>
        WORD ({f.toUpperCase()})
      </span>
    )
  }

  return (
    <AdminLayout
      pageTitle="Menu Formulir"
      subtitle="Kelola daftar jenis formulir dan berkas template (Word DOCX / PDF) untuk kebutuhan warga Banjar Saba Penatih."
    >
      <PageHeader
        title="Template & Formulir Layanan"
        description="Admin dapat mengunggah berkas template formulir (Word/PDF) yang dapat diunduh langsung oleh warga."
        actions={[
          {
            label: 'Tambah Template Formulir',
            href: '/admin/formulir/create',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            ),
            variant: 'primary',
          },
        ]}
      />

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <CardStat
          title="Total Formulir"
          value={stats.total_formulir.toLocaleString('id-ID')}
          description="Formulir terdaftar di sistem"
          variant="emerald"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        <CardStat
          title="Total Unduhan Warga"
          value={stats.total_download.toLocaleString('id-ID')}
          description="Kali berkas diunduh warga"
          variant="blue"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        />
        <CardStat
          title="Formulir Aktif"
          value={stats.total_aktif.toLocaleString('id-ID')}
          description="Dapat diunduh oleh warga"
          variant="emerald"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <CardStat
          title="Kategori Layanan"
          value={(stats.kategori_list?.length || 0).toLocaleString('id-ID')}
          description="Kelompok jenis permohonan"
          variant="amber"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
        />
      </div>

      {/* Filter & Toolbar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Cari nama formulir, kode dokumen, persyaratan..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <select
              value={kategori}
              onChange={(e) => {
                setKategori(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Kependudukan">Kependudukan</option>
              <option value="Surat Keterangan">Surat Keterangan</option>
              <option value="Pernikahan">Pernikahan</option>
              <option value="Kematian">Kematian</option>
              <option value="Pertanahan & Usaha">Pertanahan & Usaha</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Formulir */}
      {loading ? (
        <LoadingSpinner message="Memuat daftar formulir..." />
      ) : (
        <div className="space-y-4">
          <Table
            columns={[
              {
                key: 'formulir',
                label: 'Nama Formulir & Kode',
                render: (item: Formulir) => (
                  <div>
                    <Link
                      href={`/admin/formulir/${item.id}`}
                      className="font-bold text-slate-900 hover:text-emerald-700 transition text-sm"
                    >
                      {item.nama_formulir}
                    </Link>
                    {item.kode_formulir && (
                      <span className="ml-2 inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-600">
                        {item.kode_formulir}
                      </span>
                    )}
                    {item.deskripsi && (
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.deskripsi}</p>
                    )}
                  </div>
                ),
              },
              {
                key: 'kategori',
                label: 'Kategori',
                render: (item: Formulir) => (
                  <span className="inline-flex rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-100">
                    {item.kategori}
                  </span>
                ),
              },
              {
                key: 'template',
                label: 'Format & Ukuran',
                render: (item: Formulir) => (
                  <div className="space-y-1">
                    <div>{getFormatBadge(item.file_format)}</div>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {formatFileSize(item.file_size)}
                    </p>
                  </div>
                ),
              },
              {
                key: 'unduhan',
                label: 'Total Unduhan',
                render: (item: Formulir) => (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>{item.download_count || 0} Kali</span>
                  </div>
                ),
              },
              {
                key: 'status',
                label: 'Status Warga',
                render: (item: Formulir) => (
                  item.is_active ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Aktif (Tampil)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      Nonaktif
                    </span>
                  )
                ),
              },
              {
                key: 'actions',
                label: 'Aksi',
                render: (item: Formulir) => (
                  <div className="flex items-center gap-1.5">
                    {/* Unduh Template */}
                    <a
                      href={getStorageUrl(item.file_template)}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-emerald-600 transition"
                      title="Download Template Berkas"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>

                    {/* Detail */}
                    <Link
                      href={`/admin/formulir/${item.id}`}
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
                      title="Lihat Detail Formulir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>

                    {/* Edit */}
                    <Link
                      href={`/admin/formulir/${item.id}/edit`}
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-amber-600 transition"
                      title="Ubah Formulir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>

                    {/* Hapus */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFormulir(item)
                        setDeleteModalOpen(true)
                      }}
                      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition"
                      title="Hapus Formulir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ),
              },
            ]}
            data={data?.data || []}
            emptyMessage="Belum ada template formulir yang ditambahkan."
          />

          {data && data.last_page > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination
                currentPage={data.current_page}
                lastPage={data.last_page}
                total={data.total}
                from={data.from}
                to={data.to}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Hapus Template Formulir"
        message={`Apakah Anda yakin ingin menghapus formulir "${selectedFormulir?.nama_formulir}"? Berkas template fisik juga akan dihapus dari server.`}
        confirmText="Ya, Hapus Formulir"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </AdminLayout>
  )
}
