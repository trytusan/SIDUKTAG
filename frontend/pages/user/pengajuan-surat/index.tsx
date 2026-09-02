import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import UserLayout from '../../../src/components/layouts/user'
import PageHeader from '../../../src/components/ui/page-header'
import Table from '../../../src/components/ui/table'
import StatusBadge from '../../../src/components/ui/status-badge'
import Pagination from '../../../src/components/utils/pagination'
import LoadingSpinner from '../../../src/components/ui/loading'
import api from '../../../src/lib/api'
import { PengajuanSurat, PaginatedResponse } from '../../../src/types'

export default function UserPengajuanSuratIndex() {
  const [data, setData] = useState<PaginatedResponse<PengajuanSurat> | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  async function fetchSurat(p = 1) {
    setLoading(true)
    try {
      const res = await api.get(`/user/pengajuan-surat?page=${p}`)
      setData(res.data)
      setPage(p)
    } catch (err) {
      console.error('Failed to load pengajuan surat:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurat(1)
  }, [])

  return (
    <UserLayout pageTitle="Pengajuan Surat" subtitle="Daftar permohonan surat keterangan Anda">
      <PageHeader
        title="Riwayat Pengajuan Surat"
        description="Pantau proses verifikasi dan unduh surat yang sudah selesai"
        actions={[
          {
            label: 'Buat Pengajuan Baru',
            href: '/user/pengajuan-surat/create',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            ),
          },
        ]}
      />

      {loading ? (
        <LoadingSpinner message="Memuat pengajuan surat..." />
      ) : (
        <div className="space-y-4">
          <Table
            columns={[
              { key: 'nomor_pengajuan', label: 'No. Pengajuan' },
              { key: 'jenis_surat_nama', label: 'Jenis Surat' },
              { key: 'keperluan', label: 'Keperluan' },
              { key: 'tanggal_pengajuan', label: 'Tanggal Pengajuan' },
              {
                key: 'status',
                label: 'Status',
                render: (item: PengajuanSurat) => <StatusBadge>{item.status}</StatusBadge>,
              },
              {
                key: 'actions',
                label: 'Aksi',
                render: (item: PengajuanSurat) => (
                  <Link
                    href={`/user/pengajuan-surat/${item.id}`}
                    className="inline-flex items-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Detail
                  </Link>
                ),
              },
            ]}
            data={data?.data || []}
            emptyMessage="Anda belum pernah mengajukan surat keterangan."
          />

          {data && (
            <Pagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              total={data.total}
              from={data.from}
              to={data.to}
              onPageChange={(p) => fetchSurat(p)}
            />
          )}
        </div>
      )}
    </UserLayout>
  )
}
