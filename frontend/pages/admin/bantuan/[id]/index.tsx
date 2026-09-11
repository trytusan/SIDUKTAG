import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import PageHeader from '../../../../src/components/ui/page-header'
import StatusBadge from '../../../../src/components/ui/status-badge'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api from '../../../../src/lib/api'
import { BantuanPenerima } from '../../../../src/types'

export default function AdminBantuanDetail() {
  const router = useRouter()
  const { id } = router.query
  const [bantuan, setBantuan] = useState<BantuanPenerima | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchDetail() {
      try {
        const res = await api.get('/admin/bantuan/' + id)
        setBantuan(res.data.bantuan)
      } catch (err) {
        console.error('Failed to load detail bantuan:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading || !bantuan) {
    return (
      <AdminLayout pageTitle="Detail Penerima Bantuan">
        <LoadingSpinner message="Memuat informasi penerima bantuan..." />
      </AdminLayout>
    )
  }

  const p = bantuan.penduduk
  const b = bantuan.bantuan

  return (
    <AdminLayout pageTitle="Detail Penerima Bantuan" subtitle={'Warga: ' + (p?.nama_lengkap || '-')}>
      <PageHeader
        title="Detail Penerima Bantuan Sosial"
        description={'Status: ' + bantuan.status_penerima}
        actions={[
          {
            label: 'Kembali',
            href: '/admin/bantuan',
            variant: 'secondary',
          },
          {
            label: 'Edit Status / Catatan',
            href: '/admin/bantuan/' + bantuan.id + '/edit',
            variant: 'primary',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ),
          },
        ]}
      />

      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{b?.nama_program}</h3>
            <p className="text-xs text-slate-500">Jenis Program: {b?.jenis_bantuan || '-'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold border ${
                bantuan.status_verifikasi === 'Terverifikasi'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : bantuan.status_verifikasi === 'Ditolak'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {bantuan.status_verifikasi || 'Menunggu Verifikasi'}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold border ${
                bantuan.status_penerima === 'Selesai'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : bantuan.status_penerima === 'Diterima'
                  ? 'bg-sky-100 text-sky-800 border-sky-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {bantuan.status_penerima === 'Diterima' ? 'Disetujui (Siap Salur)' : bantuan.status_penerima === 'Selesai' ? 'Selesai (Sudah Diambil)' : bantuan.status_penerima}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
          <div className="rounded-2xl bg-slate-50 p-4">
            <span className="text-xs text-slate-500">Nama Penerima</span>
            <p className="mt-1 font-semibold text-slate-800">{p?.nama_lengkap || '-'}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <span className="text-xs text-slate-500">NIK Penerima</span>
            <p className="mt-1 font-semibold text-slate-800">{p?.nik || '-'}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <span className="text-xs text-slate-500">Nomor Kartu Keluarga</span>
            <p className="mt-1 font-semibold text-slate-800">{p?.nomor_kk || '-'}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <span className="text-xs text-slate-500">Sumber Dana Program</span>
            <p className="mt-1 text-slate-800 font-semibold">{b?.sumber_bantuan || '-'}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <span className="text-xs text-slate-500">Tanggal Verifikasi Berkas</span>
            <p className="mt-1 font-semibold text-slate-800">{bantuan.tanggal_verifikasi || 'Belum Diverifikasi'}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <span className="text-xs text-slate-500">Tanggal Pengambilan / Penyerahan Fisik</span>
            <p className="mt-1 font-semibold text-slate-800">{bantuan.tanggal_menerima || 'Belum Diambil / Belum Disalurkan'}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
            <span className="text-xs text-slate-500">Alamat Tempat Tinggal</span>
            <p className="mt-1 text-slate-800">{p?.alamat_lengkap || '-'}</p>
          </div>

          {bantuan.catatan_operator && (
            <div className="rounded-2xl bg-blue-50/60 border border-blue-100 p-4 sm:col-span-2">
              <span className="text-xs font-semibold text-blue-700">Catatan Operator / Verifikator</span>
              <p className="mt-1 text-slate-700 leading-relaxed text-sm">{bantuan.catatan_operator}</p>
            </div>
          )}

          {bantuan.catatan && (
            <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
              <span className="text-xs text-slate-500">Catatan Pengambilan / Penerima</span>
              <p className="mt-1 text-slate-700 leading-relaxed">{bantuan.catatan}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
