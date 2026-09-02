import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import StatusBadge from '../../../../src/components/ui/status-badge'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api, { getStorageUrl } from '../../../../src/lib/api'
import { PengajuanSurat } from '../../../../src/types'

export default function AdminPengajuanSuratDetail() {
  const router = useRouter()
  const { id } = router.query
  const [surat, setSurat] = useState<PengajuanSurat | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchDetail() {
      try {
        const res = await api.get('/admin/pengajuan-surat/' + id)
        setSurat(res.data.pengajuanSurat)
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
      <AdminLayout pageTitle="Detail Pengajuan Surat">
        <LoadingSpinner message="Memuat detail permohonan surat..." />
      </AdminLayout>
    )
  }

  const fileHasilUrl = surat.file_hasil_surat ? getStorageUrl(surat.file_hasil_surat) : null
  const dokumenPendukungUrl = surat.dokumen_pendukung ? getStorageUrl(surat.dokumen_pendukung) : null

  return (
    <AdminLayout pageTitle="Detail Pengajuan Surat" subtitle={'Nomor: ' + surat.nomor_pengajuan}>
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
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li>
            <Link href="/admin/pengajuan-surat" className="hover:text-emerald-600 transition">
              Pengajuan Surat
            </Link>
          </li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold">Detail Pengajuan</li>
        </ol>
      </nav>

      <div className="space-y-6">
        {/* Card Informasi Pengajuan */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Informasi Pengajuan Surat</h2>
              <p className="text-xs text-slate-500 mt-0.5">Nomor Registrasi: {surat.nomor_pengajuan}</p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/admin/pengajuan-surat"
                className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Kembali
              </Link>

              {surat.status === 'Selesai' && (
                <Link
                  href={'/admin/pengajuan-surat/' + surat.id + '/cetak'}
                  target="_blank"
                  className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Cetak Surat
                </Link>
              )}

              <Link
                href={'/admin/pengajuan-surat/' + surat.id + '/verifikasi'}
                className="inline-flex items-center rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Update Status / Verifikasi
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500 font-medium">Nama Pemohon</p>
              <p className="mt-1 font-semibold text-slate-800">{surat.nama_pemohon}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500 font-medium">NIK</p>
              <p className="mt-1 font-semibold text-slate-800">{surat.nik}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500 font-medium">Jenis Surat</p>
              <p className="mt-1 font-semibold text-slate-800">
                {surat.jenis_surat?.nama || surat.jenis_surat_nama}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500 font-medium">Tanggal Pengajuan</p>
              <p className="mt-1 font-semibold text-slate-800">{surat.tanggal_pengajuan}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500 font-medium">Tanggal Pengesahan</p>
              <p className="mt-1 font-semibold text-slate-800">{surat.tanggal_pengesahan || '-'}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500 font-medium">Status Pengajuan</p>
              <div className="mt-1">
                <StatusBadge>{surat.status}</StatusBadge>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 xl:col-span-3">
              <p className="text-xs text-slate-500 font-medium">Keperluan Surat</p>
              <p className="mt-1 font-medium text-slate-800 leading-relaxed">{surat.keperluan}</p>
            </div>

            {surat.catatan_operator && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 xl:col-span-3">
                <p className="text-xs font-bold text-amber-800">Catatan Petugas / Operator</p>
                <p className="mt-1 text-sm text-amber-900 italic">&ldquo;{surat.catatan_operator}&rdquo;</p>
              </div>
            )}
          </div>
        </div>

        {/* Lampiran Dokumen & Hasil */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Dokumen Pemohon */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900">Dokumen Lampiran Pemohon</h3>
            <p className="text-xs text-slate-500">Berkas pendukung yang diunggah oleh warga saat mengajukan surat</p>

            <div className="pt-2">
              {dokumenPendukungUrl ? (
                <a
                  href={dokumenPendukungUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 w-full justify-center transition"
                >
                  <svg className="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span>Lihat Dokumen Pendukung (PDF/Foto)</span>
                </a>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-center text-xs text-slate-400 italic">
                  Tidak ada dokumen pendukung yang dilampirkan.
                </div>
              )}
            </div>
          </div>

          {/* File Hasil Surat */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900">Berkas Hasil Pengesahan Surat</h3>
            <p className="text-xs text-slate-500">File surat resmi yang sudah ditandatangani dan siap diunduh warga</p>

            <div className="pt-2">
              {fileHasilUrl ? (
                <a
                  href={fileHasilUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 w-full justify-center transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Unduh File Surat Resmi (PDF)</span>
                </a>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-4 text-center text-xs text-slate-400 italic">
                  {surat.status === 'Selesai'
                    ? 'Belum ada file scan surat diunggah.'
                    : 'Surat belum disahkan / diterbitkan.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
