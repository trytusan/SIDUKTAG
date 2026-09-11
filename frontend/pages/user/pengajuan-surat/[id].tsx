import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import UserLayout from '../../../src/components/layouts/user'
import PageHeader from '../../../src/components/ui/page-header'
import StatusBadge from '../../../src/components/ui/status-badge'
import LoadingSpinner from '../../../src/components/ui/loading'
import api, { getStorageUrl } from '../../../src/lib/api'
import { PengajuanSurat } from '../../../src/types'

export default function UserPengajuanSuratDetail() {
  const router = useRouter()
  const { id } = router.query
  const [surat, setSurat] = useState<PengajuanSurat | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchDetail() {
      try {
        const res = await api.get('/user/pengajuan-surat/' + id)
        setSurat(res.data?.surat || res.data?.data || res.data)
      } catch (err) {
        console.error('Failed to load detail surat:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (loading || !surat) {
    return (
      <UserLayout pageTitle="Detail Pengajuan Surat">
        <LoadingSpinner message="Memuat detail pengajuan surat..." />
      </UserLayout>
    )
  }

  const fileHasilUrl = surat.file_hasil_surat ? getStorageUrl(surat.file_hasil_surat) : null
  const dokumenPendukungUrl = surat.dokumen_pendukung ? getStorageUrl(surat.dokumen_pendukung) : null

  return (
    <UserLayout pageTitle="Detail Pengajuan Surat" subtitle={'Nomor: ' + surat.nomor_pengajuan}>
      <PageHeader
        title="Detail Pengajuan Surat"
        description={'Status saat ini: ' + surat.status}
        actions={[
          {
            label: 'Kembali ke Daftar',
            href: '/user/pengajuan-surat',
            variant: 'secondary',
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs text-slate-400">Nomor Pengajuan</span>
              <p className="text-lg font-bold text-slate-800">{surat.nomor_pengajuan}</p>
            </div>
            <StatusBadge>{surat.status}</StatusBadge>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <span className="text-xs text-slate-500">Jenis Surat</span>
              <p className="mt-1 font-semibold text-slate-800">
                {surat.jenis_surat?.nama || surat.jenis_surat_nama}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <span className="text-xs text-slate-500">Tanggal Pengajuan</span>
              <p className="mt-1 font-semibold text-slate-800">{surat.tanggal_pengajuan}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <span className="text-xs text-slate-500">Nama Pemohon</span>
              <p className="mt-1 font-semibold text-slate-800">{surat.nama_pemohon}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <span className="text-xs text-slate-500">NIK Pemohon</span>
              <p className="mt-1 font-semibold text-slate-800">{surat.nik}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
              <span className="text-xs text-slate-500">Keperluan</span>
              <p className="mt-1 font-medium text-slate-800 leading-relaxed">{surat.keperluan}</p>
            </div>

            {surat.catatan_operator && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 sm:col-span-2">
                <span className="text-xs font-semibold text-amber-800">Catatan Petugas / Operator</span>
                <p className="mt-1 text-sm text-amber-900">{surat.catatan_operator}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800">Berkas & Unduhan</h3>

            <div>
              <span className="text-xs text-slate-500 block mb-1">Dokumen Pendukung Anda</span>
              {dokumenPendukungUrl ? (
                <a
                  href={dokumenPendukungUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 w-full justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span>Lihat Dokumen Terlampir</span>
                </a>
              ) : (
                <p className="text-xs text-slate-400 italic">Tidak ada lampiran.</p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">Hasil Surat Resmi</span>
              {surat.status === 'Selesai' && fileHasilUrl ? (
                <a
                  href={fileHasilUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 w-full justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Unduh Surat Selesai (PDF)</span>
                </a>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-center text-xs text-slate-500">
                  {surat.status === 'Ditolak'
                    ? 'Pengajuan ditolak oleh petugas.'
                    : 'Surat sedang diproses verifikasi oleh operator.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
