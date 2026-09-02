import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import PageHeader from '../../../../src/components/ui/page-header'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api from '../../../../src/lib/api'
import { PengajuanSurat } from '../../../../src/types'

export default function AdminPengajuanSuratCetak() {
  const router = useRouter()
  const { id } = router.query
  const [surat, setSurat] = useState<PengajuanSurat | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchCetak() {
      try {
        const res = await api.get('/admin/pengajuan-surat/' + id + '/cetak')
        setSurat(res.data.pengajuanSurat)
      } catch (err) {
        console.error('Failed to load cetak data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCetak()
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  if (loading || !surat) {
    return (
      <AdminLayout pageTitle="Cetak Surat">
        <LoadingSpinner message="Menyiapkan template cetak surat..." />
      </AdminLayout>
    )
  }

  const p = surat.penduduk

  return (
    <AdminLayout pageTitle="Cetak Surat Keterangan" subtitle={'Nomor: ' + surat.nomor_pengajuan}>
      <div className="print:hidden">
        <PageHeader
          title="Pratinjau Cetak Surat"
          description="Periksa format dan isi surat sebelum dicetak atau disimpan sebagai PDF"
          actions={[
            {
              label: 'Kembali',
              href: '/admin/pengajuan-surat/' + surat.id,
              variant: 'secondary',
            },
            {
              label: 'Cetak Sekarang (Print)',
              onClick: handlePrint,
              variant: 'primary',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              ),
            },
          ]}
        />
      </div>

      <div className="mx-auto max-w-3xl rounded-none bg-white p-12 text-slate-900 shadow-lg print:shadow-none print:p-0 print:m-0 border border-slate-200 print:border-none my-6">
        <div className="border-b-4 border-double border-slate-900 pb-4 text-center">
          <h2 className="text-base font-bold uppercase tracking-wider">Pemerintah Kabupaten / Kota</h2>
          <h1 className="text-xl font-black uppercase tracking-tight">Kecamatan / Kelurahan SIDUKTAG</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Jl. Pelayanan Publik No. 01, Telp: (021) 12345678, Kode Pos: 12345
          </p>
        </div>

        <div className="my-8 text-center">
          <h3 className="text-base font-bold uppercase underline decoration-2 underline-offset-4">
            {surat.jenis_surat?.nama || surat.jenis_surat_nama}
          </h3>
          <p className="text-xs text-slate-600 mt-1">Nomor: {surat.nomor_pengajuan}</p>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed indent-8">
          Yang bertanda tangan di bawah ini Kepala Desa / Lurah SIDUKTAG, dengan ini menerangkan bahwa:
        </p>

        <div className="my-5 ml-8 space-y-2 text-xs sm:text-sm">
          <div className="grid grid-cols-3">
            <span className="text-slate-600">Nama Lengkap</span>
            <span className="col-span-2 font-semibold text-slate-900">: {surat.nama_pemohon}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-slate-600">NIK</span>
            <span className="col-span-2 font-semibold text-slate-900">: {surat.nik}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-slate-600">Nomor KK</span>
            <span className="col-span-2 font-semibold text-slate-900">: {p?.nomor_kk || '-'}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-slate-600">Tempat / Tanggal Lahir</span>
            <span className="col-span-2 font-semibold text-slate-900">
              {': ' + (p?.tempat_lahir || '-') + ', ' + (p?.tanggal_lahir ? p.tanggal_lahir.substring(0, 10) : '-')}
            </span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-slate-600">Jenis Kelamin</span>
            <span className="col-span-2 font-semibold text-slate-900">: {p?.jenis_kelamin || '-'}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-slate-600">Pekerjaan</span>
            <span className="col-span-2 font-semibold text-slate-900">: {p?.pekerjaan || '-'}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="text-slate-600">Alamat Lengkap</span>
            <span className="col-span-2 font-semibold text-slate-900">: {p?.alamat_lengkap || '-'}</span>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
          <p className="indent-8">
            Orang tersebut di atas adalah benar-benar warga yang bertempat tinggal di wilayah kami dan surat keterangan ini dibuat untuk keperluan:{' '}
            <strong className="text-slate-950 font-semibold">{surat.keperluan}</strong>.
          </p>
          <p className="indent-8">
            Demikian surat keterangan ini diberikan kepada yang bersangkutan untuk dapat dipergunakan sebagaimana mestinya.
          </p>
        </div>

        <div className="mt-14 flex justify-end text-xs sm:text-sm text-center">
          <div className="w-56 space-y-1">
            <p>Dikeluarkan di: SIDUKTAG</p>
            <p className="pb-16">Pada tanggal: {surat.tanggal_pengesahan || surat.tanggal_pengajuan}</p>
            <p className="font-bold underline text-slate-950">KEPALA DESA / LURAH</p>
            <p className="text-[10px] text-slate-500">NIP. 19850101 201001 1 001</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
