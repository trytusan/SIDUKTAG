import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import UserLayout from '../../../src/components/layouts/user'
import PageHeader from '../../../src/components/ui/page-header'
import StatusBadge from '../../../src/components/ui/status-badge'
import LoadingSpinner from '../../../src/components/ui/loading'
import api from '../../../src/lib/api'
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
      <UserLayout pageTitle="Detail Bantuan Sosial">
        <LoadingSpinner message="Memuat informasi bantuan..." />
      </UserLayout>
    )
  }

  const program = bantuan.bantuan

  return (
    <UserLayout pageTitle="Detail Bantuan Sosial" subtitle={program?.nama_program || 'Program Bantuan'}>
      <PageHeader
        title="Detail Pendaftaran Bantuan"
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
              <span className="text-xs text-slate-500">Catatan Pengajuan</span>
              <p className="mt-1 text-slate-700 leading-relaxed">{bantuan.catatan}</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  )
}
