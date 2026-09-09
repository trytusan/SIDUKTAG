import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api, { getStorageUrl } from '../../../../src/lib/api'
import { JenisSurat } from '../../../../src/types'

export default function AdminJenisSuratDetail() {
  const router = useRouter()
  const { id } = router.query
  const [jenisSurat, setJenisSurat] = useState<JenisSurat | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchDetail() {
      try {
        const res = await api.get('/admin/jenis-surat/' + id)
        if (res.data?.jenisSurat) {
          setJenisSurat(res.data.jenisSurat)
        }
      } catch (err) {
        console.error('Failed to load detail jenis surat:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading || !jenisSurat) {
    return (
      <AdminLayout pageTitle="Detail Jenis Surat">
        <LoadingSpinner message="Memuat informasi jenis surat..." />
      </AdminLayout>
    )
  }

  const templateUrl = jenisSurat.template_file ? getStorageUrl(jenisSurat.template_file) : null

  return (
    <AdminLayout
      title={`Detail: ${jenisSurat.nama} — SIDUKTAG`}
      pageTitle="Detail Jenis Surat"
      subtitle={`Master Template Layanan Surat Desa`}
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
          <li>
            <Link href="/admin/jenis-surat" className="hover:text-emerald-600 transition">
              Master Jenis Surat
            </Link>
          </li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold">{jenisSurat.nama}</li>
        </ol>
      </nav>

      {/* Header Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900">{jenisSurat.nama}</h2>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                jenisSurat.is_active
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {jenisSurat.is_active ? '🟢 Aktif' : '⚪ Nonaktif'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Kode / Slug: {jenisSurat.slug || '-'}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/jenis-surat"
            className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </Link>

          <Link
            href={`/admin/jenis-surat/${jenisSurat.id}/edit`}
            className="inline-flex items-center rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Jenis Surat
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Nama Dokumen Surat
            </span>
            <p className="text-base font-bold text-slate-900">{jenisSurat.nama}</p>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Deskripsi & Persyaratan
            </span>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {jenisSurat.deskripsi || 'Tidak ada deskripsi atau persyaratan khusus.'}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Berkas Template Surat
            </span>
            {templateUrl ? (
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <span className="font-semibold text-slate-800 text-xs">Template Resmi</span>
                    <p className="text-[11px] text-slate-400 font-mono">{jenisSurat.template_file}</p>
                  </div>
                </div>
                <a
                  href={templateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-700 transition"
                >
                  Unduh Template
                </a>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-400 text-center">
                Belum ada berkas template yang diunggah untuk jenis surat ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

