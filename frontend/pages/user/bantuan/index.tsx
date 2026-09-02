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
    <UserLayout pageTitle="Bantuan Sosial" subtitle="Status keikutsertaan program bantuan sosial">
      <PageHeader
        title="Daftar Bantuan Sosial"
        description="Pantau program bantuan yang Anda ajukan atau terima"
        actions={[
          {
            label: 'Daftar Program Baru',
            href: '/user/bantuan/create',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            ),
          },
        ]}
      />

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
            emptyMessage="Belum ada riwayat pendaftaran program bantuan sosial."
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
