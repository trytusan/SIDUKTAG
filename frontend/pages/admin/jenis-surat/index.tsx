import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import Table from '../../../src/components/ui/table'
import StatusBadge from '../../../src/components/ui/status-badge'
import SearchBox from '../../../src/components/table/search-box'
import FilterBar from '../../../src/components/table/filter-bar'
import Pagination from '../../../src/components/utils/pagination'
import LoadingSpinner from '../../../src/components/ui/loading'
import ConfirmModal from '../../../src/components/modal/Confirm'
import api from '../../../src/lib/api'
import { JenisSurat, PaginatedResponse } from '../../../src/types'

export default function AdminJenisSuratIndex() {
  const [data, setData] = useState<PaginatedResponse<JenisSurat> | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function fetchJenisSurat(p = 1, s = search) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', String(p))
      if (s) params.append('search', s)

      const res = await api.get('/admin/jenis-surat?' + params.toString())
      setData(res.data.jenisSurat)
      setPage(p)
    } catch (err) {
      console.error('Failed to load jenis surat:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJenisSurat(1, search)
  }, [search])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await api.delete('/admin/jenis-surat/' + deleteId)
      setDeleteId(null)
      fetchJenisSurat(page, search)
    } catch (err) {
      alert('Gagal menghapus jenis surat.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout pageTitle="Master Jenis Surat" subtitle="Kelola daftar jenis template surat keterangan yang dapat diajukan warga">
      <PageHeader
        title="Master Jenis Surat"
        description="Tambah atau edit jenis surat keterangan yang tersedia"
        actions={[
          {
            label: 'Tambah Jenis Surat',
            href: '/admin/jenis-surat/create',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            ),
          },
        ]}
      />

      <FilterBar onReset={() => setSearch('')}>
        <SearchBox
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder="Cari nama atau kode jenis surat..."
        />
      </FilterBar>

      {loading ? (
        <LoadingSpinner message="Memuat master jenis surat..." />
      ) : (
        <div className="space-y-4">
          <Table
            columns={[
              {
                key: 'nama',
                label: 'Nama Jenis Surat',
                render: (item: JenisSurat) => (
                  <div>
                    <p className="font-semibold text-slate-800">{item.nama}</p>
                    <p className="text-xs text-slate-400">Kode: {item.slug || '-'}</p>
                  </div>
                ),
              },
              {
                key: 'deskripsi',
                label: 'Deskripsi',
                render: (item: JenisSurat) => item.deskripsi || '-',
              },
              {
                key: 'is_active',
                label: 'Status',
                render: (item: JenisSurat) => (
                  <StatusBadge variant={item.is_active ? 'success' : 'danger'}>
                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                  </StatusBadge>
                ),
              },
              {
                key: 'actions',
                label: 'Aksi',
                render: (item: JenisSurat) => (
                  <div className="flex items-center gap-2">
                    <Link
                      href={'/admin/jenis-surat/' + item.id + '/edit'}
                      className="rounded-xl bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"
                      title="Edit Jenis Surat"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      title="Hapus Jenis Surat"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ),
              },
            ]}
            data={data?.data || []}
            emptyMessage="Belum ada data jenis surat."
          />

          {data && (
            <Pagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              total={data.total}
              from={data.from}
              to={data.to}
              onPageChange={(p) => fetchJenisSurat(p, search)}
            />
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Hapus Jenis Surat"
        message="Apakah Anda yakin ingin menghapus jenis surat ini?"
        confirmText="Hapus Sekarang"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  )
}
