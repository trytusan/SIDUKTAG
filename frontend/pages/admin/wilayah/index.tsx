import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import Table from '../../../src/components/ui/table'
import CardStat from '../../../src/components/ui/card-stat'
import ConfirmModal from '../../../src/components/modal/Confirm'
import { useAlert } from '../../../src/context/AlertContext'
import { Wilayah, SebaranKkWilayah } from '../../../src/types'
import api from '../../../src/lib/api'

export default function AdminWilayahIndex() {
  const { showAlert } = useAlert()
  const [wilayahList, setWilayahList] = useState<Wilayah[]>([])
  const [sebaranKkList, setSebaranKkList] = useState<SebaranKkWilayah[]>([])
  const [stats, setStats] = useState<any>({
    total_wilayah: 0,
    total_dusun: 0,
    total_rw: 0,
    total_rt: 0,
    total_penduduk: 0,
    total_kk: 0,
    total_luas: 0,
    total_kk_satu_atap: 0,
    total_kk_terpencar: 0,
    total_titik_hunian: 0,
  })
  const [activeTab, setActiveTab] = useState<'wilayah' | 'persebaran_kk'>('wilayah')
  const [search, setSearch] = useState('')
  const [filterJenis, setFilterJenis] = useState('Semua')
  const [filterStatusSpasial, setFilterStatusSpasial] = useState<'Semua' | 'satu_atap' | 'terpencar'>('Semua')
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [detailModalWilayah, setDetailModalWilayah] = useState<Wilayah | null>(null)
  const [expandedKkId, setExpandedKkId] = useState<number | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/wilayah')
      if (res.data?.wilayah && Array.isArray(res.data.wilayah)) {
        setWilayahList(res.data.wilayah)
      } else {
        setWilayahList([])
      }

      if (res.data?.sebaran_kk && Array.isArray(res.data.sebaran_kk)) {
        setSebaranKkList(res.data.sebaran_kk)
      } else {
        setSebaranKkList([])
      }

      if (res.data?.stats) {
        setStats(res.data.stats)
      }
    } catch (err) {
      console.error('Failed to load wilayah:', err)
      setWilayahList([])
      setSebaranKkList([])
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
      await api.delete('/admin/wilayah/' + deleteId)
      setWilayahList((prev) => prev.filter((w) => w.id !== deleteId))
      showAlert({
        type: 'delete',
        title: 'Berhasil Dihapus!',
        message: 'Data tempat umum / fasilitas telah berhasil dihapus.',
      })
    } catch (err) {
      console.error('API delete failed:', err)
      showAlert({
        type: 'error',
        title: 'Gagal Menghapus',
        message: 'Terjadi kesalahan saat menghapus data wilayah.',
      })
    } finally {
      setDeleteId(null)
    }
  }

  // Filter Data Wilayah
  const filteredWilayah = wilayahList.filter((item) => {
    const matchJenis = filterJenis === 'Semua' || item.jenis_wilayah === filterJenis
    const matchSearch =
      item.nama_wilayah.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_wilayah.toLowerCase().includes(search.toLowerCase()) ||
      item.kepala_wilayah.toLowerCase().includes(search.toLowerCase())
    return matchJenis && matchSearch
  })

  // Filter Data Sebaran KK
  const filteredSebaranKk = sebaranKkList.filter((kk) => {
    const matchStatus =
      filterStatusSpasial === 'Semua' ||
      (filterStatusSpasial === 'satu_atap' && !kk.is_split) ||
      (filterStatusSpasial === 'terpencar' && kk.is_split)

    const q = search.toLowerCase()
    const matchSearch =
      !search.trim() ||
      kk.nomor_kk.toLowerCase().includes(q) ||
      kk.nama_kepala_keluarga.toLowerCase().includes(q) ||
      kk.alamat_keluarga.toLowerCase().includes(q) ||
      kk.titik_hunian.some((t) =>
        t.anggota.some((a) => a.nama_lengkap.toLowerCase().includes(q) || a.nik.includes(q))
      )

    return matchStatus && matchSearch
  })

  return (
    <AdminLayout
      title="Data Wilayah & Persebaran Hunian — SIDUKTAG"
      pageTitle="Data Wilayah & Persebaran Hunian"
      subtitle="Manajemen data pembagian wilayah, batas dusun, serta pengelompokan persebaran hunian KK"
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
          <li className="text-slate-500">Pemetaan Wilayah</li>
          <li className="text-slate-500">Peta Wilayah</li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold">Data Wilayah</li>
        </ol>
      </nav>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <CardStat
          title="Total Wilayah Terdata"
          value={stats.total_wilayah || wilayahList.length}
          description={`${stats.total_dusun || 0} Dusun, ${stats.total_rw || 0} RW, ${stats.total_rt || 0} RT`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <CardStat
          title="KK Satu Atap (Disatukan)"
          value={stats.total_kk_satu_atap || 0}
          description="Seluruh anggota di lokasi sama"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
            </svg>
          }
        />
        <CardStat
          title="KK Terpencar (Dipisahkan)"
          value={stats.total_kk_terpencar || 0}
          description="Anggota beda tempat tinggal"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <CardStat
          title="Total Titik Hunian Wilayah"
          value={stats.total_titik_hunian || 0}
          description="Titik domisili fisik warga"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          }
        />
      </div>

      {/* Prominent Educational Notice on Spatial Grouping Rules */}
      <div className="mb-4 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-emerald-50/70 p-5 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-bold text-slate-800">
              Prinsip Pengelompokan & Pemisahan Data Spasial Wilayah
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2 bg-white/80 rounded-2xl p-3 border border-emerald-200/80 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-emerald-950 block">Jika Lokasi Tempat Tinggal Sama (Satu Atap):</strong>
                  Seluruh anggota dalam 1 Kartu Keluarga yang tinggal di lokasi/koordinat yang sama <strong>dijadikan satu data hunian</strong> untuk efisiensi dan keakuratan sensus.
                </div>
              </div>
              <div className="flex items-start gap-2 bg-white/80 rounded-2xl p-3 border border-amber-200/80 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <div>
                  <strong className="text-amber-950 block">Jika Lokasi Tempat Tinggal Berbeda (Terpencar):</strong>
                  Jika ada anggota 1 KK yang tinggal terpisah (anak kos, merantau, beda rumah/dusun), <strong>datanya dipisahkan per masing-masing titik lokasi hunian</strong> agar data persebaran wilayah riil tetap presisi.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation & Filter Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('wilayah')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'wilayah'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏢 Wilayah Administrasi & Fasilitas ({wilayahList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('persebaran_kk')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'persebaran_kk'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👨‍👩‍👧‍👦 Rincian Persebaran Hunian KK ({sebaranKkList.length} KK)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/peta"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6.75V15m6-6v8.25m.503-14.406C14.713 2.39 13.376 2.25 12 2.25s-2.713.14-3.503.594l-4.5 2.571A1.5 1.5 0 003 6.72v11.558a1.5 1.5 0 002.003 1.407l4.497-2.57 5 2.857 4.5-2.571A1.5 1.5 0 0020 16.02V4.462a1.5 1.5 0 00-1.497-1.407l-3.003.539z" />
              </svg>
              <span>Buka Peta Spasial</span>
            </Link>

            {activeTab === 'wilayah' && (
              <Link
                href="/admin/wilayah/create"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Tambah Wilayah</span>
              </Link>
            )}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={
                activeTab === 'wilayah'
                  ? 'Cari nama wilayah, kode, atau kepala...'
                  : 'Cari No KK, kepala keluarga, atau nama anggota...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {activeTab === 'wilayah' ? (
            <div className="w-52">
              <select
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-3.5 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Semua">Semua Jenis Wilayah</option>
                <option value="Dusun">Dusun</option>
                <option value="RW">Rukun Warga (RW)</option>
                <option value="RT">Rukun Tetangga (RT)</option>
                <option value="Lingkungan">Lingkungan</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {[
                { id: 'Semua', label: 'Semua KK' },
                { id: 'satu_atap', label: '🟢 Satu Atap (Disatukan)' },
                { id: 'terpencar', label: '🟠 Terpencar (Dipisahkan)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterStatusSpasial(f.id as any)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    filterStatusSpasial === f.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TAB 1: WILAYAH ADMINISTRASI */}
        {activeTab === 'wilayah' && (
          <Table
            columns={[
              {
                key: 'nama_wilayah',
                label: 'Wilayah & Kode',
                render: (w: Wilayah) => (
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: w.warna_marker || '#10b981' }}
                    />
                    <div>
                      <span className="font-bold text-slate-800 text-sm">{w.nama_wilayah}</span>
                      <p className="text-[11px] font-mono text-emerald-600 font-semibold">{w.kode_wilayah}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: 'jenis_wilayah',
                label: 'Tingkat',
                render: (w: Wilayah) => (
                  <span className="inline-block rounded-xl bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                    {w.jenis_wilayah}
                  </span>
                ),
              },
              {
                key: 'kepala_wilayah',
                label: 'Kepala Wilayah',
                render: (w: Wilayah) => (
                  <div>
                    <span className="font-medium text-slate-800">{w.kepala_wilayah}</span>
                    <p className="text-[11px] text-slate-400">{w.nomor_telepon || '-'}</p>
                  </div>
                ),
              },
              {
                key: 'jumlah_kk',
                label: 'Data Kependudukan',
                render: (w: Wilayah) => (
                  <div className="text-xs">
                    <span className="font-bold text-slate-700">{w.jumlah_kk} KK</span>
                    <span className="text-slate-400"> &bull; </span>
                    <span className="text-slate-600">{w.jumlah_penduduk} Jiwa</span>
                  </div>
                ),
              },
              {
                key: 'luas_wilayah',
                label: 'Luas',
                render: (w: Wilayah) => (
                  <span className="text-xs text-slate-600 font-medium">
                    {w.luas_wilayah ? `${w.luas_wilayah} Ha` : '-'}
                  </span>
                ),
              },
              {
                key: 'latitude',
                label: 'Titik Koordinat',
                render: (w: Wilayah) => (
                  <div className="text-xs">
                    <span className="font-mono text-slate-500">
                      {Number(w.latitude).toFixed(4)}, {Number(w.longitude).toFixed(4)}
                    </span>
                    <div>
                      <a
                        href={`https://www.google.com/maps?q=${w.latitude},${w.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-semibold text-emerald-600 hover:underline"
                      >
                        Buka Google Maps &rarr;
                      </a>
                    </div>
                  </div>
                ),
              },
              {
                key: 'id',
                label: 'Aksi',
                className: 'text-right',
                render: (w: Wilayah) => (
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={'/admin/wilayah/' + w.id}
                      className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                      title="Lihat Detail Lengkap"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>

                    <Link
                      href={'/admin/wilayah/' + w.id + '/edit'}
                      className="rounded-xl p-2 text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition"
                      title="Edit Fasilitas / Tempat Umum"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteId(w.id)}
                      className="rounded-xl p-2 text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                      title="Hapus Wilayah"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredWilayah}
            emptyMessage="Belum ada data wilayah yang sesuai."
          />
        )}

        {/* TAB 2: RINCIAN PERSEBARAN HUNIAN KK (PENJELASAN LOKASI SAMA VS BEDA) */}
        {activeTab === 'persebaran_kk' && (
          <div className="space-y-3">
            {filteredSebaranKk.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">
                Tidak ada data KK yang sesuai dengan pencarian atau filter.
              </div>
            ) : (
              filteredSebaranKk.map((kk) => {
                const isExpanded = expandedKkId === kk.id

                return (
                  <div
                    key={kk.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-xs transition hover:border-slate-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-bold text-white shadow-sm ${
                            !kk.is_split ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-amber-600 shadow-amber-600/20'
                          }`}
                        >
                          {!kk.is_split ? '1📍' : `${kk.jumlah_titik}📍`}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-800">
                              Keluarga: {kk.nama_kepala_keluarga}
                            </h4>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                !kk.is_split
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {!kk.is_split
                                ? '🟢 Satu Tempat Tinggal (Data Disatukan)'
                                : `🟠 Beda Tempat Tinggal (Dipisahkan Jadi ${kk.jumlah_titik} Titik)`}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 font-mono mt-0.5">
                            No. KK: <span className="text-slate-800 font-semibold">{kk.nomor_kk}</span> &bull;{' '}
                            Total Anggota: <span className="text-slate-800 font-semibold">{kk.total_anggota} Jiwa</span>
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            📍 Alamat KK Terdaftar: <span className="text-slate-700 font-medium">{kk.alamat_keluarga}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/kartu-keluarga/${kk.id}`}
                          className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                        >
                          Detail KK
                        </Link>
                        <button
                          type="button"
                          onClick={() => setExpandedKkId(isExpanded ? null : kk.id)}
                          className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
                        >
                          {isExpanded ? 'Tutup Rincian' : `Lihat ${kk.jumlah_titik} Titik Hunian`}
                        </button>
                      </div>
                    </div>

                    {/* Breakdown of residence locations (Titik Hunian) */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                        <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                          <span>Daftar Titik Tempat Tinggal Anggota Keluarga:</span>
                          <span className="text-[11px] font-normal text-slate-500">
                            ({!kk.is_split ? 'Seluruh anggota tinggal di satu tempat' : 'Anggota tersebar di beberapa lokasi'})
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {kk.titik_hunian.map((titik) => (
                            <div
                              key={titik.index}
                              className={`rounded-2xl p-3.5 border text-xs space-y-2 ${
                                titik.is_kepala_keluarga
                                  ? 'bg-blue-50/50 border-blue-200'
                                  : 'bg-slate-50/70 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                  <span>Titik #{titik.index}:</span>
                                  <span className="text-[11px] font-semibold text-slate-600">
                                    {titik.status_label}
                                  </span>
                                </span>
                                <span className="font-bold rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-700">
                                  {titik.jumlah_jiwa} Jiwa
                                </span>
                              </div>

                              <div className="text-[11px] text-slate-600">
                                <strong>Alamat:</strong> {titik.alamat}
                              </div>

                              {titik.latitude && titik.longitude && (
                                <div className="text-[10px] font-mono text-slate-400">
                                  GPS: {titik.latitude}, {titik.longitude}
                                </div>
                              )}

                              <div className="pt-2 border-t border-slate-200/60">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                  Anggota di titik ini:
                                </span>
                                <ul className="space-y-1">
                                  {titik.anggota.map((a) => (
                                    <li key={a.id} className="flex items-center justify-between text-[11px]">
                                      <span className="font-semibold text-slate-800">{a.nama_lengkap}</span>
                                      <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                                        {a.status_dalam_keluarga}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Modal Detail Wilayah */}
      {detailModalWilayah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  {detailModalWilayah.jenis_wilayah} &bull; {detailModalWilayah.kode_wilayah}
                </span>
                <h3 className="text-lg font-bold text-slate-800">{detailModalWilayah.nama_wilayah}</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalWilayah(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-slate-400 font-medium">Kepala Wilayah</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{detailModalWilayah.kepala_wilayah}</p>
                <p className="text-slate-500 mt-1">{detailModalWilayah.nomor_telepon || 'Tidak ada nomor telepon'}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-slate-400 font-medium">Luas Wilayah</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{detailModalWilayah.luas_wilayah || '-'} Ha</p>
                <p className="text-slate-500 mt-1">Estimasi cakupan wilayah</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-slate-400 font-medium">Jumlah Kepala Keluarga</span>
                <p className="font-bold text-emerald-600 text-base mt-0.5">{detailModalWilayah.jumlah_kk} KK</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="text-slate-400 font-medium">Total Penduduk</span>
                <p className="font-bold text-emerald-600 text-base mt-0.5">{detailModalWilayah.jumlah_penduduk} Jiwa</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 text-xs">
              <span className="text-slate-400 font-medium">Deskripsi & Potensi Wilayah:</span>
              <p className="text-slate-700 mt-1 leading-relaxed">
                {detailModalWilayah.deskripsi || 'Belum ada deskripsi wilayah.'}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-medium">Koordinat Geografis:</span>
                <p className="font-mono text-slate-700 mt-0.5">
                  {detailModalWilayah.latitude}, {detailModalWilayah.longitude}
                </p>
              </div>
              <a
                href={`https://www.google.com/maps?q=${detailModalWilayah.latitude},${detailModalWilayah.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-700"
              >
                Lihat di Maps &rarr;
              </a>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModalWilayah(null)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
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
        title="Hapus Data Wilayah"
        message="Apakah Anda yakin ingin menghapus data wilayah ini? Titik sebaran dan relasi wilayah ini akan terhapus dari daftar."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  )
}
