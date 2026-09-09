import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import api, { getBeritaImageUrl, DEFAULT_BERITA_FALLBACK } from '../../src/lib/api'
import { Berita } from '../../src/types'

const KATEGORI_OPTIONS = [
  'Semua',
  'Pengumuman',
  'Kegiatan Desa',
  'Bantuan Sosial',
  'Kesehatan',
  'Pembangunan',
]

export default function PublicBeritaIndex() {
  const [beritaList, setBeritaList] = useState<Berita[]>([])
  const [search, setSearch] = useState('')
  const [selectedKategori, setSelectedKategori] = useState('Semua')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBerita() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedKategori !== 'Semua') {
          params.append('kategori', selectedKategori)
        }
        if (search.trim()) {
          params.append('search', search.trim())
        }

        const res = await api.get('/api/berita?' + params.toString())
        if (res.data?.berita && Array.isArray(res.data.berita)) {
          setBeritaList(res.data.berita)
        }
      } catch (err) {
        console.warn('Gagal memuat berita:', err)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchBerita()
    }, 250)

    return () => clearTimeout(timer)
  }, [search, selectedKategori])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Head>
        <title>Berita & Informasi Desa — SIDUKTAG</title>
        <meta
          name="description"
          content="Pusat informasi, pengumuman kependudukan, dan agenda kegiatan resmi masyarakat desa."
        />
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

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-xs text-slate-400 font-medium" aria-label="Breadcrumb">
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
            <li className="text-white font-semibold">Semua Berita & Informasi</li>
          </ol>
        </nav>

        {/* Hero Banner Section */}
        <div className="mb-10 rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-sky-950/40 p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Pusat Informasi & Pengumuman Warga
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Kabar & Pengumuman Desa
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Dapatkan update informasi resmi seputar kegiatan kemasyarakatan, agenda pemerintahan, layanan kependudukan, dan transparansi bantuan sosial.
            </p>
          </div>

          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Search and Category Filter Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-lg">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul atau topik berita..."
                className="w-full rounded-2xl border border-white/15 bg-white/5 pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 backdrop-blur-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Menampilkan <span className="font-bold text-white">{beritaList.length}</span> artikel berita
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {KATEGORI_OPTIONS.map((kat) => (
              <button
                key={kat}
                type="button"
                onClick={() => setSelectedKategori(kat)}
                className={`rounded-2xl px-4 py-2 text-xs font-semibold transition duration-150 ${
                  selectedKategori === kat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : beritaList.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5A3.375 3.375 0 0010.125 2.25H5.625A2.625 2.625 0 003 4.875v14.25a2.625 2.625 0 002.625 2.625h12.75A2.625 2.625 0 0021 19.125v-1.5a3.375 3.375 0 00-1.5-2.812Z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Tidak Ada Berita Ditemukan</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {search || selectedKategori !== 'Semua'
                ? 'Tidak ada artikel yang sesuai dengan kriteria pencarian atau kategori yang dipilih.'
                : 'Belum ada pengumuman yang dipublikasikan oleh administrator saat ini.'}
            </p>
            {(search || selectedKategori !== 'Semua') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSelectedKategori('Semua')
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beritaList.map((item) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug || item.id}`}
                className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/40 hover:bg-white/[0.08] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                <div>
                  <div className="h-48 w-full rounded-2xl overflow-hidden bg-slate-900 mb-4 border border-white/10 relative">
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
                    <span className="absolute top-3 left-3 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 shadow-sm">
                      {item.kategori}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2.5">
                    <span>{item.tanggal_publikasi}</span>
                    <span>&bull;</span>
                    <span>{item.penulis}</span>
                    {Number(item.views) > 0 && (
                      <>
                        <span>&bull;</span>
                        <span>{item.views} views</span>
                      </>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition line-clamp-2 leading-snug">
                    {item.judul}
                  </h3>
                  <p className="mt-2.5 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {item.ringkasan}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span>Baca Selengkapnya</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} SIDUKTAG. Sistem Informasi Kependudukan & Geotagging.
      </footer>
    </div>
  )
}

