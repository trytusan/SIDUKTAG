import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import Table from '../../../src/components/ui/table'
import CardStat from '../../../src/components/ui/card-stat'
import ConfirmModal from '../../../src/components/modal/Confirm'
import { Berita } from '../../../src/types'
import api, { getBeritaImageUrl, DEFAULT_BERITA_FALLBACK } from '../../../src/lib/api'
import { useAlert } from '../../../src/context/AlertContext'

export default function AdminBeritaIndex() {
  const { showAlert } = useAlert()
  const [beritaList, setBeritaList] = useState<Berita[]>([])
  const [search, setSearch] = useState('')
  const [filterKategori, setFilterKategori] = useState('Semua')
  const [filterStatus, setFilterStatus] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [previewBerita, setPreviewBerita] = useState<Berita | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/berita')
      if (res.data?.berita && Array.isArray(res.data.berita)) {
        setBeritaList(res.data.berita)
      } else {
        setBeritaList([])
      }
    } catch (err) {
      console.error('Failed to load berita:', err)
      setBeritaList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await api.delete('/admin/berita/' + deleteId)
      setBeritaList((prev) => prev.filter((b) => b.id !== deleteId))
      showAlert({
        type: 'delete',
        title: 'Berhasil Dihapus!',
        message: 'Artikel berita telah berhasil dihapus.',
      })
    } catch (err) {
      console.error('API delete failed:', err)
    } finally {
      setDeleteId(null)
    }
  }

  const filteredData = beritaList.filter((item) => {
    const matchKategori = filterKategori === 'Semua' || item.kategori === filterKategori
    const matchStatus = filterStatus === 'Semua' || item.status === filterStatus
    const matchSearch =
      item.judul.toLowerCase().includes(search.toLowerCase()) ||
      item.penulis.toLowerCase().includes(search.toLowerCase()) ||
      item.ringkasan.toLowerCase().includes(search.toLowerCase())
    return matchKategori && matchStatus && matchSearch
  })

  // Statistics
  const totalBerita = beritaList.length
  const totalPublished = beritaList.filter((b) => b.status === 'Published').length
  const totalDraft = beritaList.filter((b) => b.status === 'Draft').length
  const totalViews = beritaList.reduce((sum, b) => sum + (Number(b.views) || 0), 0)

  return (
    <AdminLayout
      title="Data Berita & Informasi — SIDUKTAG"
      pageTitle="Berita & Informasi"
      subtitle="Kelola publikasi pengumuman, agenda kegiatan desa, dan informasi kependudukan"
    >
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
          <li className="text-slate-500">Berita & Informasi</li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold">Data Berita</li>
        </ol>
      </nav>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardStat
          title="Total Artikel / Berita"
          value={totalBerita}
          description="Semua publikasi informasi"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H5.625A2.625 2.625 0 003 4.875v14.25a2.625 2.625 0 002.625 2.625h12.75A2.625 2.625 0 0021 19.125v-1.5a3.375 3.375 0 00-1.5-2.812Z" />
            </svg>
          }
        />
        <CardStat
          title="Berita Diterbitkan"
          value={totalPublished}
          description="Tampil di portal publik warga"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <CardStat
          title="Konsep / Draft"
          value={totalDraft}
          description="Menunggu peninjauan terbit"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          }
        />
        <CardStat
          title="Total Pembaca (Views)"
          value={totalViews.toLocaleString('id-ID')}
          description="Akumulasi tayangan artikel"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </div>

      {/* Action bar and search box */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Cari judul berita atau penulis..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="w-44">
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Pengumuman">Pengumuman</option>
                <option value="Kegiatan Desa">Kegiatan Desa</option>
                <option value="Bantuan Sosial">Bantuan Sosial</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Pembangunan">Pembangunan</option>
              </select>
            </div>

            <div className="w-36">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Semua">Semua Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <Link
            href="/admin/berita/create"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Berita Baru</span>
          </Link>
        </div>

        {/* Data Table */}
        <Table
          columns={[
            {
              key: 'judul',
              label: 'Berita & Informasi',
              render: (b: Berita) => (
                <div className="flex items-center gap-3.5 py-1">
                  <div className="h-12 w-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={b.gambar || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200&auto=format&fit=crop&q=60'}
                      alt={b.judul}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="max-w-md">
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1 hover:text-emerald-600 transition cursor-pointer" onClick={() => setPreviewBerita(b)}>
                      {b.judul}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{b.ringkasan}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'kategori',
              label: 'Kategori',
              render: (b: Berita) => (
                <span className="inline-block rounded-xl bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                  {b.kategori}
                </span>
              ),
            },
            {
              key: 'penulis',
              label: 'Penulis',
              render: (b: Berita) => (
                <div className="text-xs text-slate-600 font-medium">
                  {b.penulis}
                </div>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              render: (b: Berita) => (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                    b.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      b.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {b.status}
                </span>
              ),
            },
            {
              key: 'tanggal_publikasi',
              label: 'Tanggal & Tayangan',
              render: (b: Berita) => (
                <div className="text-xs">
                  <span className="text-slate-700 font-medium">{b.tanggal_publikasi}</span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{b.views} kali</span>
                  </div>
                </div>
              ),
            },
            {
              key: 'id',
              label: 'Aksi',
              className: 'text-right',
              render: (b: Berita) => (
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    href={`/admin/berita/${b.id}`}
                    className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                    title="Lihat Detail Lengkap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Link>

                  <Link
                    href={`/admin/berita/${b.id}/edit`}
                    className="rounded-xl p-2 text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition"
                    title="Edit Berita & Informasi"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeleteId(b.id)}
                    className="rounded-xl p-2 text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                    title="Hapus Berita"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredData}
          emptyMessage="Belum ada artikel atau berita yang sesuai."
        />
      </div>

      {/* Modal Preview Berita Lengkap */}
      {previewBerita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                  {previewBerita.kategori}
                </span>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs text-slate-500">{previewBerita.tanggal_publikasi}</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewBerita(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {previewBerita.judul}
            </h2>

            <div className="flex items-center gap-3 text-xs text-slate-500 pb-3 border-b border-slate-100">
              <span>Oleh: <strong className="text-slate-700">{previewBerita.penulis}</strong></span>
              <span>&bull;</span>
              <span>Dibaca {previewBerita.views} kali</span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-72 w-full bg-slate-100 shadow-sm relative">
              <img
                src={getBeritaImageUrl(previewBerita.gambar, previewBerita.kategori)}
                alt={previewBerita.judul}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true'
                    target.src = DEFAULT_BERITA_FALLBACK
                  }
                }}
              />
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs italic text-slate-600 leading-relaxed">
              &ldquo;{previewBerita.ringkasan}&rdquo;
            </div>

            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {previewBerita.konten}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/admin/berita/${previewBerita.id}`}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
              >
                <span>Buka Detail Lengkap</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <button
                type="button"
                onClick={() => setPreviewBerita(null)}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Hapus Berita"
        message="Apakah Anda yakin ingin menghapus artikel berita ini? Artikel tidak akan dapat diakses lagi oleh warga di portal."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  )
}
