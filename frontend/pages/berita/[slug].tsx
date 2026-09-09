import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import api, { getBeritaImageUrl, DEFAULT_BERITA_FALLBACK } from '../../src/lib/api'
import { Berita } from '../../src/types'

export default function PublicBeritaDetail() {
  const router = useRouter()
  const { slug } = router.query

  const [berita, setBerita] = useState<Berita | null>(null)
  const [related, setRelated] = useState<Berita[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!slug) return

    async function fetchDetail() {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get(`/api/berita/${slug}`)
        if (res.data?.berita) {
          setBerita(res.data.berita)
          if (Array.isArray(res.data.related)) {
            setRelated(res.data.related)
          }
        } else {
          setError('Artikel berita tidak ditemukan.')
        }
      } catch (err: any) {
        console.error('Failed to load berita detail:', err)
        setError('Gagal memuat artikel atau artikel tidak ditemukan.')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [slug])

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareWhatsApp = () => {
    if (typeof window !== 'undefined' && berita) {
      const text = encodeURIComponent(`*${berita.judul}*\n\nBaca selengkapnya di SIDUKTAG:\n${window.location.href}`)
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Head>
        <title>{berita ? `${berita.judul} — SIDUKTAG` : 'Detail Berita — SIDUKTAG'}</title>
        {berita && <meta name="description" content={berita.ringkasan} />}
      </Head>

      {/* Header / Navbar */}
      <header className="border-b border-white/10 px-6 py-5 sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 font-bold">
              S
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">SIDUKTAG</span>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400">Sistem Terintegrasi</p>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-slate-300 hover:text-white transition">
              Beranda
            </Link>
            <Link href="/berita" className="text-sm font-semibold text-emerald-400">
              Berita & Informasi
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 shadow-md transition hover:bg-emerald-400"
            >
              Daftar Warga
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-8 text-xs text-slate-400 font-medium" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-emerald-400 transition">
                Beranda
              </Link>
            </li>
            <li>
              <svg className="h-3.5 w-3.5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </li>
            <li>
              <Link href="/berita" className="hover:text-emerald-400 transition">
                Berita & Informasi
              </Link>
            </li>
            <li>
              <svg className="h-3.5 w-3.5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </li>
            <li className="text-slate-300 truncate max-w-[200px] sm:max-w-xs font-semibold">
              {berita ? berita.judul : 'Memuat...'}
            </li>
          </ol>
        </nav>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-8 w-1/4 rounded-2xl bg-white/10" />
            <div className="h-12 w-3/4 rounded-2xl bg-white/10" />
            <div className="h-4 w-1/3 rounded-xl bg-white/10" />
            <div className="h-96 w-full rounded-3xl bg-white/10" />
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-2/3 rounded bg-white/10" />
            </div>
          </div>
        ) : error || !berita ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{error || 'Artikel Tidak Ditemukan'}</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              Artikel yang Anda cari mungkin telah dihapus atau tautan tidak valid.
            </p>
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-md transition hover:bg-emerald-400"
            >
              &larr; Kembali ke Daftar Berita
            </Link>
          </div>
        ) : (
          <article className="space-y-8">
            {/* Header Meta */}
            <div>
              <div className="inline-block rounded-full bg-emerald-500/20 text-emerald-400 px-3.5 py-1 text-xs font-bold mb-4 border border-emerald-500/30">
                {berita.kategori}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
                {berita.judul}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pb-6 border-b border-white/10">
                <span>Oleh: <strong className="text-white">{berita.penulis}</strong></span>
                <span>&bull;</span>
                <span>{berita.tanggal_publikasi}</span>
                {Number(berita.views) > 0 && (
                  <>
                    <span>&bull;</span>
                    <span>{berita.views} Kali Dibaca</span>
                  </>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div className="h-72 sm:h-[420px] w-full rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl relative">
              <img
                src={getBeritaImageUrl(berita.gambar, berita.kategori)}
                alt={berita.judul}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = 'true'
                    target.src = DEFAULT_BERITA_FALLBACK
                  }
                }}
              />
            </div>

            {/* Ringkasan Kutipan */}
            <div className="rounded-2xl border-l-4 border-emerald-500 bg-white/5 p-5 sm:p-6 backdrop-blur-sm">
              <p className="text-sm sm:text-base text-slate-200 font-medium italic leading-relaxed">
                "{berita.ringkasan}"
              </p>
            </div>

            {/* Isi Konten Lengkap */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
              {berita.konten}
            </div>

            {/* Action Bar (Share & Back) */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link
                href="/berita"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
              >
                <span>&larr;</span>
                <span>Kembali ke Semua Berita</span>
              </Link>

              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-400 font-medium mr-1">Bagikan:</span>
                <button
                  type="button"
                  onClick={shareWhatsApp}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-3.5 py-2 text-xs font-bold transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 text-xs font-bold transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
                </button>
              </div>
            </div>

            {/* Related Articles Section */}
            {related.length > 0 && (
              <div className="pt-12 border-t border-white/10 space-y-6">
                <h3 className="text-xl font-bold text-white">Berita & Informasi Lainnya</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/berita/${rel.slug || rel.id}`}
                      className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-emerald-500/40 hover:bg-white/[0.08]"
                    >
                      <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-900 mb-3 border border-white/10 relative">
                        <img
                          src={getBeritaImageUrl(rel.gambar, rel.kategori)}
                          alt={rel.judul}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.currentTarget
                            if (!target.dataset.fallback) {
                              target.dataset.fallback = 'true'
                              target.src = DEFAULT_BERITA_FALLBACK
                            }
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 block mb-1">
                        {rel.kategori}
                      </span>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition line-clamp-2 leading-snug">
                        {rel.judul}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {rel.tanggal_publikasi}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} SIDUKTAG. Sistem Informasi Kependudukan & Geotagging.
      </footer>
    </div>
  )
}

