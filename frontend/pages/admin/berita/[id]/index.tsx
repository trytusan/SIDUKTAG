import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api, { getBeritaImageUrl, DEFAULT_BERITA_FALLBACK } from '../../../../src/lib/api'
import { Berita } from '../../../../src/types'

export default function AdminBeritaDetail() {
  const router = useRouter()
  const { id } = router.query
  const [berita, setBerita] = useState<Berita | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchDetail() {
      try {
        const res = await api.get('/admin/berita/' + id)
        if (res.data?.berita) {
          setBerita(res.data.berita)
        }
      } catch (err) {
        console.error('Failed to load detail berita:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading || !berita) {
    return (
      <AdminLayout pageTitle="Detail Berita & Informasi">
        <LoadingSpinner message="Memuat artikel berita..." />
      </AdminLayout>
    )
  }

  const gambarUrl = getBeritaImageUrl(berita.gambar, berita.kategori)

  return (
    <AdminLayout
      title={`Detail: ${berita.judul} — SIDUKTAG`}
      pageTitle="Detail Berita & Informasi"
      subtitle={`${berita.kategori} • Oleh ${berita.penulis || 'Admin'}`}
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
            <Link href="/admin/berita" className="hover:text-emerald-600 transition">
              Berita & Informasi
            </Link>
          </li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold line-clamp-1 max-w-xs">{berita.judul}</li>
        </ol>
      </nav>

      {/* Header Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
              {berita.kategori}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                berita.status === 'Published'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {berita.status}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{berita.judul}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/berita"
            className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </Link>

          <Link
            href={`/admin/berita/${berita.id}/edit`}
            className="inline-flex items-center rounded-2xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-600 transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Berita
          </Link>

          <Link
            href={`/berita/${berita.slug || berita.id}`}
            target="_blank"
            className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Tinjau di Portal Warga
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Article Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            {/* Banner Image */}
            <div className="rounded-2xl overflow-hidden aspect-video w-full border border-slate-200 bg-slate-50 relative shadow-sm">
              <img
                src={gambarUrl}
                alt={berita.judul}
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

            {/* Ringkasan */}
            {berita.ringkasan && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-xs text-emerald-950 font-medium leading-relaxed">
                <strong className="block text-emerald-900 mb-1">Ringkasan Berita:</strong>
                {berita.ringkasan}
              </div>
            )}

            {/* Full Content */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                Isi Konten Publikasi
              </h3>
              <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-line space-y-4">
                {berita.konten}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Metadata */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Informasi Publikasi
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Penulis</span>
                <span className="font-semibold text-slate-800">{berita.penulis || 'Admin Desa'}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tanggal Rilis</span>
                <span className="font-semibold text-slate-800">
                  {new Date(berita.tanggal_publikasi).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Pembaca</span>
                <span className="font-bold text-emerald-600 font-mono">{berita.views} Views</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Slug URL</span>
                <span className="font-mono text-slate-700 text-[11px] truncate max-w-[150px]">
                  {berita.slug || '-'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">ID Berita</span>
                <span className="font-mono text-slate-700">#{berita.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

