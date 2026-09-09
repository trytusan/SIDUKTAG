import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api from '../../../../src/lib/api'
import { Bantuan } from '../../../../src/types'

export default function AdminJenisBantuanDetail() {
  const router = useRouter()
  const { id } = router.query
  const [program, setProgram] = useState<Bantuan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchDetail() {
      try {
        const res = await api.get('/admin/jenis-bantuan/' + id)
        if (res.data) {
          setProgram(res.data)
        }
      } catch (err) {
        console.error('Failed to load detail program bantuan:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading || !program) {
    return (
      <AdminLayout pageTitle="Detail Program Bantuan">
        <LoadingSpinner message="Memuat informasi program bantuan..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title={`Detail: ${program.nama_program} — SIDUKTAG`}
      pageTitle="Detail Program Bantuan"
      subtitle={`${program.jenis_bantuan} • Status: ${program.status_bantuan}`}
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
            <Link href="/admin/jenis-bantuan" className="hover:text-emerald-600 transition">
              Master Program Bantuan
            </Link>
          </li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold">{program.nama_program}</li>
        </ol>
      </nav>

      {/* Header Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900">{program.nama_program}</h2>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                program.status_bantuan === 'Aktif'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {program.status_bantuan}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Jenis: {program.jenis_bantuan}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/jenis-bantuan"
            className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </Link>

          <Link
            href={`/admin/jenis-bantuan/${program.id}/edit`}
            className="inline-flex items-center rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Program
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-slate-400 font-medium">Sumber Bantuan / Anggaran</span>
            <p className="font-bold text-slate-800 text-sm mt-1">{program.sumber_bantuan || 'Dana Desa / APBD'}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-slate-400 font-medium">Kuota Penerima</span>
            <p className="font-bold text-emerald-600 text-sm mt-1">
              {program.kuota_penerima ? `${program.kuota_penerima} Keluarga / Warga` : 'Tidak Dibatasi'}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-slate-400 font-medium">Tanggal Mulai</span>
            <p className="font-bold text-slate-800 text-sm mt-1">{program.tanggal_mulai || 'Belum Ditentukan'}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <span className="text-slate-400 font-medium">Tanggal Selesai</span>
            <p className="font-bold text-slate-800 text-sm mt-1">{program.tanggal_selesai || 'Berjalan'}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs">
          <span className="text-slate-400 font-medium block mb-1">Deskripsi & Kriteria Program:</span>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
            {program.deskripsi || 'Tidak ada keterangan tambahan untuk program ini.'}
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}

