import React, { useState, useEffect, useCallback } from 'react'
import UserLayout from '../../../src/components/layouts/user'
import PageHeader from '../../../src/components/ui/page-header'
import LoadingSpinner from '../../../src/components/ui/loading'
import api, { getStorageUrl, downloadFile } from '../../../src/lib/api'
import { Formulir } from '../../../src/types'

export default function UserFormulirIndex() {
  const [formulirList, setFormulirList] = useState<Formulir[]>([])
  const [kategoriList, setKategoriList] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [kategori, setKategori] = useState('Semua')

  const [selectedFormulir, setSelectedFormulir] = useState<Formulir | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const handleDownload = async (item: Formulir) => {
    setDownloadingId(item.id)
    const fallbackName = `${item.nama_formulir}.${item.file_format || 'docx'}`
    await downloadFile(`/user/formulir/${item.id}/download`, fallbackName)
    setDownloadingId(null)

    // Optimistically update download count in local state
    setFormulirList((prev) =>
      prev.map((f) => (f.id === item.id ? { ...f, download_count: (f.download_count || 0) + 1 } : f))
    )
    if (selectedFormulir && selectedFormulir.id === item.id) {
      setSelectedFormulir((prev) =>
        prev ? { ...prev, download_count: (prev.download_count || 0) + 1 } : null
      )
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (kategori && kategori !== 'Semua') params.append('kategori', kategori)

      const res = await api.get('/user/formulir?' + params.toString())
      setFormulirList(res.data.data?.data || res.data.data || [])
      if (res.data.kategori_list) {
        setKategoriList(res.data.kategori_list)
      }
    } catch (err) {
      console.error('Failed to load user formulir list:', err)
    } finally {
      setLoading(false)
    }
  }, [search, kategori])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchData])

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
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
          <svg className="h-3 w-3 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 3C5.34315 3 4 4.34315 4 6V18C4 19.6569 5.34315 21 7 21H17C18.6569 21 20 19.6569 20 18V9.41421C20 8.6186 19.6839 7.85561 19.1213 7.29289L15.7071 3.87868C15.1444 3.31596 14.3814 3 13.5858 3H7Z" />
          </svg>
          PDF
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
        <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
        </svg>
        WORD ({f.toUpperCase()})
      </span>
    )
  }

  return (
    <UserLayout
      pageTitle="Unduh Formulir"
      subtitle="Unduh template formulir resmi (Word / PDF) untuk pengurusan administrasi di Banjar Saba Penatih."
    >
      <PageHeader
        title="Layanan Unduh Formulir & Template Dokumen"
        description="Silakan cari dan unduh berkas template formulir yang Anda butuhkan sebelum datang ke kantor Banjar Saba Penatih."
      />

      {/* Search & Category Pills */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs mb-8 space-y-4">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ketik nama formulir yang Anda cari (contoh: KTP, KK, Pernikahan, Usaha, dsb)..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Kategori Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 mr-1">Kategori:</span>
          <button
            type="button"
            onClick={() => setKategori('Semua')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              kategori === 'Semua'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
          {['Kependudukan', 'Surat Keterangan', 'Pernikahan', 'Kematian', 'Pertanahan & Usaha', 'Lainnya'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setKategori(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                kategori === cat
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Formulir Warga */}
      {loading ? (
        <LoadingSpinner message="Mencari template formulir..." />
      ) : formulirList.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-slate-700">Formulir Tidak Ditemukan</h3>
          <p className="text-xs text-slate-400 mt-1">
            Tidak ada formulir yang sesuai dengan kata kunci atau kategori yang Anda pilih.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {formulirList.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition group"
            >
              <div>
                {/* Header Card */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex rounded-lg bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-100">
                    {item.kategori}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {getFormatBadge(item.file_format)}
                  </div>
                </div>

                {/* Judul & Kode */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug">
                  {item.nama_formulir}
                </h3>
                {item.kode_formulir && (
                  <span className="inline-block mt-1 font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    Kode: {item.kode_formulir}
                  </span>
                )}

                {/* Deskripsi Singkat */}
                <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-2">
                  {item.deskripsi || 'Formulir resmi administrasi Banjar Saba Penatih.'}
                </p>

                {/* Info File & Unduhan */}
                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                  <span>Ukuran: <strong className="text-slate-600 font-mono">{formatFileSize(item.file_size)}</strong></span>
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {item.download_count || 0}x diunduh
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(item)}
                  disabled={downloadingId === item.id}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 py-2.5 px-3 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                  title="Unduh Berkas Template"
                >
                  {downloadingId === item.id ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Mengunduh...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Unduh (.{(item.file_format || 'doc').toLowerCase()})</span>
                    </>
                  )}
                </button>

                {item.persyaratan && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFormulir(item)
                      setDetailModalOpen(true)
                    }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                    title="Lihat Persyaratan Dokumen"
                  >
                    <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail Persyaratan */}
      {detailModalOpen && selectedFormulir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="inline-flex rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-100 mb-1">
                  {selectedFormulir.kategori}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedFormulir.nama_formulir}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {selectedFormulir.deskripsi && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Keterangan:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                  {selectedFormulir.deskripsi}
                </p>
              </div>
            )}

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Persyaratan & Dokumen yang Perlu Disiapkan:
              </span>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4 text-xs leading-relaxed text-slate-800 whitespace-pre-line">
                {selectedFormulir.persyaratan}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => handleDownload(selectedFormulir)}
                disabled={downloadingId === selectedFormulir.id}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {downloadingId === selectedFormulir.id ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Mengunduh...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Template Berkas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  )
}
