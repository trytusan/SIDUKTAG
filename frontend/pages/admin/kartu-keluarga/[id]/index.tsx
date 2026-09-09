import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import Table from '../../../../src/components/ui/table'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api from '../../../../src/lib/api'
import { KartuKeluarga, Penduduk } from '../../../../src/types'

export default function AdminKartuKeluargaDetail() {
  const router = useRouter()
  const { id } = router.query
  const [kartuKeluarga, setKartuKeluarga] = useState<KartuKeluarga | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchDetail() {
      try {
        const res = await api.get('/admin/kartu-keluarga/' + id)
        const data = res.data?.kartuKeluarga || res.data?.kartu_keluarga || res.data?.data || res.data
        setKartuKeluarga(data)
      } catch (err) {
        console.error('Failed to load detail KK:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading || !kartuKeluarga) {
    return (
      <AdminLayout pageTitle="Detail Kartu Keluarga">
        <LoadingSpinner message="Memuat detail Kartu Keluarga..." />
      </AdminLayout>
    )
  }

  const anggota = kartuKeluarga.anggota || []

  return (
    <AdminLayout pageTitle="Detail Kartu Keluarga" subtitle={'No. KK: ' + kartuKeluarga.nomor_kk}>
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
            <Link href="/admin/kartu-keluarga" className="hover:text-emerald-600 transition">
              Kartu Keluarga
            </Link>
          </li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold">Detail Kartu Keluarga</li>
        </ol>
      </nav>

      {/* Header Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            KK {kartuKeluarga.nama_kepala_keluarga}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">No. KK: {kartuKeluarga.nomor_kk}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/kartu-keluarga"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition"
          >
            <svg className="mr-2 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </Link>

          <Link
            href={'/admin/kartu-keluarga/' + kartuKeluarga.id + '/edit'}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit KK
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Data Kepala Keluarga */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-800">Data Kepala Keluarga</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 text-sm">
            <div>
              <p className="text-xs font-medium text-slate-500">Nama Kepala Keluarga</p>
              <p className="mt-1 font-semibold text-slate-800">{kartuKeluarga.nama_kepala_keluarga}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Nomor KK</p>
              <p className="mt-1 font-semibold text-slate-800">{kartuKeluarga.nomor_kk}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs font-medium text-slate-500">Alamat Keluarga</p>
              <p className="mt-1 font-semibold text-slate-800 italic">
                &ldquo;{kartuKeluarga.alamat_keluarga || '-'}&rdquo;
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Jumlah Anggota Keluarga</p>
              <p className="mt-1 font-semibold text-slate-800">
                {kartuKeluarga.jumlah_anggota || anggota.length} Orang
              </p>
            </div>
          </div>
        </div>

        {/* Daftar Anggota Keluarga */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Daftar Anggota Keluarga</h2>
            <p className="text-xs text-slate-500">Seluruh anggota yang terdaftar dalam KK ini</p>
          </div>

          <Table
            columns={[
              {
                key: 'no',
                label: 'No',
                className: 'w-12 text-center',
                render: (_: any, idx: number) => (
                  <span className="text-xs text-slate-500 font-semibold">{idx + 1}</span>
                ),
              },
              {
                key: 'nama_lengkap',
                label: 'Nama',
                render: (item: Penduduk) => (
                  <span className="font-semibold text-slate-800">{item.nama_lengkap}</span>
                ),
              },
              { key: 'nik', label: 'NIK' },
              { key: 'status_dalam_keluarga', label: 'Status dalam Keluarga' },
              { key: 'jenis_kelamin', label: 'Jenis Kelamin' },
              {
                key: 'actions',
                label: 'Aksi',
                className: 'text-center',
                render: (item: Penduduk) => (
                  <Link
                    href={'/admin/penduduk/' + item.id}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600 transition hover:bg-sky-100"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Lihat Detail</span>
                  </Link>
                ),
              },
            ]}
            data={anggota}
            emptyMessage="Belum ada anggota keluarga yang terdaftar."
          />
        </div>
      </div>
    </AdminLayout>
  )
}
