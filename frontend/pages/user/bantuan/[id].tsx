import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import UserLayout from '../../../src/components/layouts/user'
import PageHeader from '../../../src/components/ui/page-header'
import StatusBadge from '../../../src/components/ui/status-badge'
import LoadingSpinner from '../../../src/components/ui/loading'
import api, { getStorageUrl } from '../../../src/lib/api'
import { BantuanPenerima } from '../../../src/types'

export default function UserBantuanDetail() {
  const router = useRouter()
  const { id } = router.query
  const [bantuan, setBantuan] = useState<BantuanPenerima | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchDetail() {
      try {
        const res = await api.get('/user/bantuan/' + id)
        setBantuan(res.data?.bantuan || res.data?.data || res.data)
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
      <UserLayout pageTitle="Detail Bantuan Sosial">
        <LoadingSpinner message="Memuat informasi bantuan..." />
      </UserLayout>
    )
  }

  const program = bantuan.bantuan

  return (
    <UserLayout pageTitle="Detail Bantuan Sosial" subtitle={program?.nama_program || 'Program Bantuan'}>
      <PageHeader
        title="Detail Penerima Bantuan"
        description={'Status: ' + bantuan.status_penerima}
        actions={[
          {
            label: 'Kembali ke Daftar',
            href: '/user/bantuan',
            variant: 'secondary',
          },
        ]}
      />

      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{program?.nama_program}</h3>
            <p className="text-xs text-slate-500">Jenis: {program?.jenis_bantuan || '-'}</p>
          </div>
          <StatusBadge>{bantuan.status_penerima}</StatusBadge>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
          <div className="rounded-2xl bg-slate-50 p-4">
            <span className="text-xs text-slate-500">Sumber Bantuan</span>
            <p className="mt-1 font-semibold text-slate-800">{program?.sumber_bantuan || '-'}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <span className="text-xs text-slate-500">Tanggal Diterima</span>
            <p className="mt-1 font-semibold text-slate-800">{bantuan.tanggal_menerima || 'Belum Disalurkan'}</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
            <span className="text-xs text-slate-500">Deskripsi Program</span>
            <p className="mt-1 text-slate-700 leading-relaxed">{program?.deskripsi || '-'}</p>
          </div>

          {bantuan.catatan && (
            <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
              <span className="text-xs text-slate-500">Catatan / Keterangan</span>
              <p className="mt-1 text-slate-700 leading-relaxed">{bantuan.catatan}</p>
            </div>
          )}
        </div>

        {/* Bagian Barcode & Surat Undangan Pengambilan */}
        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-sky-50/40 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Surat Undangan & Barcode Pengambilan</h4>
                <p className="text-xs text-slate-500">Bukti resmi verifikasi pengambilan bantuan di lokasi penyaluran</p>
              </div>
            </div>

            {bantuan.barcode_pengambilan && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                Barcode Siap Digunakan
              </span>
            )}
          </div>

          {bantuan.nomor_undangan && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white border border-slate-200/80 p-4 shadow-2xs">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Nomor Registrasi / Barcode Undangan</span>
                <p className="mt-0.5 font-mono text-base sm:text-lg font-bold text-slate-800 tracking-wider">
                  {bantuan.nomor_undangan}
                </p>
              </div>
              <span className="text-xs text-slate-500 max-w-xs text-left sm:text-right">
                Cocokkan kode ini dengan data verifikasi petugas di lokasi.
              </span>
            </div>
          )}

          {bantuan.barcode_pengambilan ? (
            <div className="space-y-4">
              {bantuan.barcode_pengambilan.toLowerCase().endsWith('.pdf') ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-rose-200/80 bg-rose-50/40 p-5">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md shadow-rose-500/20">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">Dokumen Undangan Resmi (PDF)</h5>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Surat panggilan / undangan pengambilan bantuan resmi dari instansi terkait.
                      </p>
                    </div>
                  </div>
                  <a
                    href={getStorageUrl(bantuan.barcode_pengambilan)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700 active:scale-95"
                  >
                    <span>Buka / Unduh Surat (PDF)</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4 text-xs text-emerald-900 flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="leading-relaxed">
                      <strong>Petunjuk Pengambilan:</strong> Tunjukkan barcode di bawah ini langsung dari layar ponsel Anda kepada petugas penyalur saat jadwal pembagian bantuan di Balai Banjar atau Kantor Pos. Pastikan kecerahan layar ponsel Anda mencukupi agar barcode dapat dipindai (discan) dengan cepat.
                    </p>
                  </div>

                  {/* Frame Barcode Prominen */}
                  <div className="mx-auto max-w-sm rounded-3xl border-2 border-slate-200 bg-white p-5 text-center shadow-md">
                    <div className="overflow-hidden rounded-2xl bg-slate-50 p-3 border border-slate-100 flex items-center justify-center">
                      <img
                        src={getStorageUrl(bantuan.barcode_pengambilan)}
                        alt="Barcode Pengambilan Bantuan"
                        className="max-h-72 w-auto max-w-full object-contain mx-auto select-none"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <a
                        href={getStorageUrl(bantuan.barcode_pengambilan)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Perbesar / Unduh Gambar Barcode</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-5 text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h5 className="text-xs font-bold text-slate-700">Surat Undangan Fisik / Barcode Sedang Diproses</h5>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Anda telah terdaftar sebagai penerima program bantuan ini. Operator Lingkungan Saba akan segera mengunggah surat undangan atau barcode digital setelah dokumen resmi diterima dari instansi penyalur.
              </p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  )
}
