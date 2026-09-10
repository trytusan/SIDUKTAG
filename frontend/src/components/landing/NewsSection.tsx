import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import api, { getBeritaImageUrl, DEFAULT_BERITA_FALLBACK } from '../../lib/api'
import { Berita } from '../../types'

interface NewsSectionProps {
  isAdmin?: boolean
}

export default function NewsSection({ isAdmin = false }: NewsSectionProps) {
  const [beritaList, setBeritaList] = useState<Berita[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBerita() {
      try {
        const res = await api.get('/api/berita?limit=6')
        if (res.data?.berita && Array.isArray(res.data.berita)) {
          setBeritaList(res.data.berita)
        }
      } catch (err) {
        console.warn('Gagal memuat berita:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBerita()
  }, [])

  return (
    <section className="mt-24 w-full text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-[11px] font-bold text-sky-800 mb-2 shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Publikasi Informasi Warga
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Kabar & Pengumuman Desa Terkini
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Informasi agenda kegiatan, pengumuman kependudukan, dan bansos langsung dari sistem desa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/berita"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition flex items-center gap-1.5 shrink-0 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 px-4 py-2 rounded-2xl shadow-xs"
          >
            <span>Lihat Semua Berita</span>
            <span>&rarr;</span>
          </Link>
          {isAdmin && (
            <Link
              href="/admin/berita"
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 transition flex items-center gap-1.5 shrink-0 bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 px-4 py-2 rounded-2xl shadow-xs"
            >
              <span>Kelola Berita</span>
              <span>&rarr;</span>
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-100 border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : beritaList.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H5.625A2.625 2.625 0 003 4.875v14.25a2.625 2.625 0 002.625 2.625h12.75A2.625 2.625 0 0021 19.125v-1.5a3.375 3.375 0 00-1.5-2.812Z" />
            </svg>
          </div>
          <h4 className="text-base font-bold text-slate-900">Belum Ada Pengumuman Terbaru</h4>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Pengumuman dan publikasi informasi desa akan ditampilkan di sini setelah dipublikasikan oleh administrator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beritaList.map((item) => (
            <Link
              key={item.id}
              href={`/berita/${item.slug || item.id}`}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:border-emerald-300 hover:shadow-md hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-100 mb-4 border border-slate-100 relative">
                  <img
                    src={getBeritaImageUrl(item.gambar, item.kategori)}
                    alt={item.judul}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.currentTarget
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = 'true'
                        target.src = DEFAULT_BERITA_FALLBACK
                      }
                    }}
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-emerald-800 shadow-xs border border-emerald-100">
                    {item.kategori}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                  <span>{item.tanggal_publikasi}</span>
                  <span>&bull;</span>
                  <span>{item.penulis}</span>
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition line-clamp-2 leading-snug">
                  {item.judul}
                </h3>
                <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.ringkasan}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>Baca Selengkapnya</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
