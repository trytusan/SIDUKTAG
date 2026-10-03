import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import LoadingSpinner from '../../../../src/components/ui/loading'
import ConfirmModal from '../../../../src/components/modal/Confirm'
import { useAlert } from '../../../../src/context/AlertContext'
import api, { getStorageUrl, downloadFile } from '../../../../src/lib/api'
import { Formulir } from '../../../../src/types'

export default function AdminFormulirDetail() {
  const router = useRouter()
  const { id } = router.query
  const { showAlert } = useAlert()

  const [formulir, setFormulir] = useState<Formulir | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!formulir) return
    setDownloading(true)
    const fallbackName = `${formulir.nama_formulir}.${formulir.file_format || 'docx'}`
    await downloadFile(`/admin/formulir/${formulir.id}/download`, fallbackName)
    setDownloading(false)
    setFormulir((prev) => (prev ? { ...prev, download_count: (prev.download_count || 0) + 1 } : null))
  }

  useEffect(() => {
    if (!id) return
    async function fetchDetail() {
      try {
        const res = await api.get('/admin/formulir/' + id)
        setFormulir(res.data.formulir || res.data.data)
      } catch (err) {
        console.error('Failed to load detail formulir:', err)
        showAlert({
          type: 'error',
          title: 'Gagal Memuat Data',
          message: 'Data formulir tidak ditemukan atau terjadi kesalahan server.',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id, showAlert])

  const handleDelete = async () => {
    if (!formulir) return
    setDeleting(true)
    try {
      await api.delete('/admin/formulir/' + formulir.id)
      showAlert({
        type: 'success',
        title: 'Berhasil Dihapus',
        message: 'Template formulir telah dihapus.',
      })
      router.push('/admin/formulir')
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

  if (loading || !formulir) {
    return (
      <AdminLayout pageTitle="Detail Formulir">
        <LoadingSpinner message="Memuat informasi formulir..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      pageTitle="Detail Template Formulir"
      subtitle={`${formulir.nama_formulir} (${formulir.kode_formulir || 'Tanpa Kode'})`}
    >
      {/* Breadcrumb & Actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/admin/formulir" className="hover:text-emerald-700 transition">
            Daftar Formulir
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{formulir.nama_formulir}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/formulir/${formulir.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-amber-600 transition shadow-xs"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Ubah Formulir</span>
          </Link>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-xs"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Hapus</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Detail Formulir & Persyaratan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="inline-flex rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-100 mb-2">
                  {formulir.kategori}
                </span>
                <h1 className="text-xl font-bold text-slate-900">{formulir.nama_formulir}</h1>
                {formulir.kode_formulir && (
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    Kode Formulir: <strong>{formulir.kode_formulir}</strong>
                  </p>
                )}
              </div>

              <div>
                {formulir.is_active ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Aktif di Portal Warga
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Nonaktif
                  </span>
                )}
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Deskripsi Dokumen
              </h3>
              <p className="text-xs leading-relaxed text-slate-700 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                {formulir.deskripsi || 'Tidak ada deskripsi tambahan.'}
              </p>
            </div>

            {/* Persyaratan */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Persyaratan & Berkas Pendukung yang Harus Disiapkan Warga
              </h3>
              {formulir.persyaratan ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs leading-relaxed text-slate-800 whitespace-pre-line">
                  {formulir.persyaratan}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Tidak ada rincian persyaratan khusus.</p>
              )}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Card Download Berkas Template */}
        <div className="space-y-6">
          <div className="rounded-3xl border-2 border-emerald-300 bg-emerald-50/30 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Berkas Template</p>
                <p className="text-sm font-black text-slate-900 uppercase">
                  {formulir.file_format || 'DOCX'} File
                </p>
              </div>
            </div>

            <div className="space-y-2 border-y border-emerald-100 py-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Ukuran Berkas:</span>
                <span className="font-mono font-bold text-slate-800">{formatFileSize(formulir.file_size)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Unduhan:</span>
                <span className="font-bold text-emerald-700">{formulir.download_count || 0} Kali</span>
              </div>
              <div className="flex justify-between">
                <span>Terakhir Diperbarui:</span>
                <span className="text-slate-500">
                  {formulir.updated_at ? new Date(formulir.updated_at).toLocaleDateString('id-ID') : '-'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {downloading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Mengunduh Berkas...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Berkas Template</span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-xs text-slate-500 space-y-2">
            <span className="font-bold text-slate-800 block">Informasi Petugas:</span>
            <p>
              Formulir ini dapat diunduh oleh warga secara mandiri melalui menu <strong>Unduh Formulir</strong> di dashboard warga Banjar Saba Penatih.
            </p>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Hapus Template Formulir"
        message={`Apakah Anda yakin ingin menghapus formulir "${formulir.nama_formulir}"?`}
        confirmText="Ya, Hapus"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </AdminLayout>
  )
}
