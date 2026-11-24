import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import PageHeader from '../../../../src/components/ui/page-header'
import StatusBadge from '../../../../src/components/ui/status-badge'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api, { getStorageUrl } from '../../../../src/lib/api'
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

        {/* Berkas Barcode & Dokumen Undangan Pengambilan */}
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-100/70 pb-3">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <h4 className="font-bold text-slate-800">Surat Undangan & Barcode Pengambilan Bantuan</h4>
            </div>
            {bantuan.barcode_pengambilan && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                Tersedia
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs text-slate-500">Nomor Undangan / Kode Barcode</span>
              <p className="mt-1 font-mono font-bold text-slate-800 text-sm">
                {bantuan.nomor_undangan || '-'}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-500">Status Berkas Barcode</span>
              <p className="mt-1 text-xs font-semibold text-slate-700">
                {bantuan.barcode_pengambilan
                  ? 'Berkas digital telah terhubung ke dashboard warga'
                  : 'Belum diunggah oleh admin / operator'}
              </p>
            </div>
          </div>

          {bantuan.barcode_pengambilan ? (
            <div className="pt-2">
              {bantuan.barcode_pengambilan.toLowerCase().endsWith('.pdf') ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Surat Undangan Penyaluran Bantuan (PDF)</p>
                      <p className="text-[11px] text-slate-500">Telah terdistribusi ke akun warga penerima</p>
                    </div>
                  </div>
                  <a
                    href={getStorageUrl(bantuan.barcode_pengambilan)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                  >
                    <span>Buka PDF Dokumen</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              ) : (
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-bold text-slate-700">Pratinjau Barcode / Surat Undangan Fisik:</p>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={getStorageUrl(bantuan.barcode_pengambilan)}
                      alt="Barcode Pengambilan Bantuan"
                      className="max-h-56 max-w-full rounded-xl border border-slate-200 object-contain shadow-xs bg-white p-1"
                    />
                    <div className="space-y-2 text-xs text-slate-600">
                      <p>Barcode ini otomatis muncul di akun warga bersangkutan.</p>
                      <a
                        href={getStorageUrl(bantuan.barcode_pengambilan)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Buka / Unduh Ukuran Penuh</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-4 text-center">
              <p className="text-xs text-slate-500">
                Belum ada berkas barcode atau surat undangan. Anda dapat mengunggahnya dengan menekan tombol <strong>Edit Status / Catatan</strong> di kanan atas.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
