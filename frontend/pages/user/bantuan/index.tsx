import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import UserLayout from '../../../src/components/layouts/user'
import PageHeader from '../../../src/components/ui/page-header'
import Table from '../../../src/components/ui/table'
import StatusBadge from '../../../src/components/ui/status-badge'
import Pagination from '../../../src/components/utils/pagination'
import LoadingSpinner from '../../../src/components/ui/loading'
import api from '../../../src/lib/api'
import { BantuanPenerima, PaginatedResponse } from '../../../src/types'

export default function UserBantuanIndex() {
  const [data, setData] = useState<PaginatedResponse<BantuanPenerima> | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)


  async function fetchBantuan(p = 1) {
    setLoading(true)
    try {
      const res = await api.get(`/user/bantuan?page=${p}`)
      setData(res.data)
      setPage(p)
    } catch (err) {
      console.error('Failed to load bantuan:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBantuan(1)
  }, [])

  return (
    <UserLayout pageTitle="Bantuan Sosial" subtitle="Status penerimaan program bantuan sosial">
      <PageHeader
        title="Daftar Bantuan Sosial"
        description="Daftar program bantuan sosial yang Anda terima atau terdaftar melalui Pemerintah Desa"
      />

      <div className="mb-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-xs text-emerald-900 flex items-start gap-3 shadow-xs">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="space-y-0.5">
          <p className="font-bold text-emerald-950">Informasi Penerima Bantuan</p>
          <p className="text-emerald-800/90 leading-relaxed">
            Penetapan dan penyaluran bantuan sosial ditentukan langsung oleh Pemerintah Desa berdasarkan hasil musyawarah dan verifikasi data terpadu. Warga dapat memantau status keikutsertaan bantuan yang terdaftar pada tabel di bawah.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Memuat daftar bantuan sosial..." />
      ) : (
        <div className="space-y-4">
          <Table
            columns={[
              {
                key: 'nama_program',
                label: 'Nama Program',
                render: (item: BantuanPenerima) => (
                  <div>
                    <p className="font-semibold text-slate-800">{item.bantuan?.nama_program || '-'}</p>
                    <p className="text-xs text-slate-400">{item.bantuan?.jenis_bantuan || '-'}</p>
                  </div>
                ),
              },
              {
                key: 'sumber_bantuan',
                label: 'Sumber Dana',
                render: (item: BantuanPenerima) => item.bantuan?.sumber_bantuan || '-',
              },
              {
                key: 'tanggal_menerima',
                label: 'Tanggal Diterima',
                render: (item: BantuanPenerima) => item.tanggal_menerima || '-',
              },
              {
                key: 'status_penerima',
                label: 'Status',
                render: (item: BantuanPenerima) => (
                  <StatusBadge>{item.status_penerima}</StatusBadge>
                ),
              },
              {
                key: 'actions',
                label: 'Aksi',
                render: (item: BantuanPenerima) => (
                  <Link
                    href={`/user/bantuan/${item.id}`}
                    className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Detail
                  </Link>
                ),
              },
            ]}
            data={data?.data || []}
            emptyMessage="Anda belum terdaftar dalam program bantuan sosial desa."
          />

          {data && (
            <Pagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              total={data.total}
              from={data.from}
              to={data.to}
              onPageChange={(p) => fetchBantuan(p)}
            />
          )}
        </div>
      )}
    </UserLayout>
  )
}
