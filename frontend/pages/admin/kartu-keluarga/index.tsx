import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import Table from '../../../src/components/ui/table'
import SearchBox from '../../../src/components/table/search-box'
import FilterBar from '../../../src/components/table/filter-bar'
import Pagination from '../../../src/components/utils/pagination'
import LoadingSpinner from '../../../src/components/ui/loading'
import ConfirmModal from '../../../src/components/modal/Confirm'
import CardStat from '../../../src/components/ui/card-stat'
import { useAlert } from '../../../src/context/AlertContext'
import api from '../../../src/lib/api'
import { KartuKeluarga, PaginatedResponse } from '../../../src/types'

export default function AdminKartuKeluargaIndex() {
  const { showAlert } = useAlert()
  const [data, setData] = useState<PaginatedResponse<KartuKeluarga> | null>(null)
  const [stats, setStats] = useState<{ total_kk?: number; total_jiwa?: number; rata_rata?: number; kk_terisi?: number } | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function fetchKK(p = 1, s = search) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', String(p))
      if (s.trim()) params.append('search', s.trim())

      const res = await api.get('/admin/kartu-keluarga?' + params.toString())
      
      // PERBAIKAN: Sesuaikan dengan key 'kartu_keluarga' dari controller
      setData(res.data.kartu_keluarga || res.data)
      if (res.data.stats) {
        setStats(res.data.stats)
      }
      setPage(p)
    } catch (err) {
      console.error('Failed to load KK:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKK(1, search)
  }, [search])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await api.delete('/admin/kartu-keluarga/' + deleteId)
      setDeleteId(null)
      fetchKK(page, search)
      showAlert({
        type: 'delete',
        title: 'Berhasil Dihapus!',
        message: 'Data Kartu Keluarga telah berhasil dihapus.',
      })
    } catch (err) {
      alert('Gagal menghapus Kartu Keluarga.')
      showAlert({
        type: 'error',
        title: 'Gagal Menghapus',
        message: 'Terjadi kesalahan saat menghapus data Kartu Keluarga.',
      })
    } finally {
      setDeleting(false)
    }
  }

  const totalKK = stats?.total_kk ?? (data?.total || 0)
  const totalJiwa = stats?.total_jiwa ?? (data?.data ? data.data.reduce((sum, k) => sum + (Number(k.jumlah_anggota) || 0), 0) : 0)
  const rataRata = stats?.rata_rata ?? (data?.data && data.data.length > 0 ? (totalJiwa / data.data.length).toFixed(1) : '0')
  const kkTerisi = stats?.kk_terisi ?? (data?.data ? data.data.filter((k) => (Number(k.jumlah_anggota) || 0) > 0).length : 0)

  return (
    <AdminLayout pageTitle="Data Kartu Keluarga" subtitle="Kelola data Kartu Keluarga dan susunan anggota warga">
      <PageHeader
        title="Daftar Kartu Keluarga"
        description="Kelola data kepala keluarga, alamat, dan jumlah tanggungan"
        actions={[
          {
            label: 'Tambah Kartu Keluarga',
            href: '/admin/kartu-keluarga/create',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            ),
          },
        ]}
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <CardStat
          title="Total Kartu Keluarga"
          value={totalKK.toLocaleString('id-ID')}
          description="Kepala keluarga terdata di desa"
          variant="emerald"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <CardStat
          title="Total Jiwa Terdaftar"
          value={totalJiwa.toLocaleString('id-ID')}
          description="Akumulasi anggota seluruh KK"
          variant="blue"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <CardStat
          title="Rata-Rata Anggota"
          value={`${rataRata} Jiwa/KK`}
          description="Rata-rata tanggungan per keluarga"
          variant="amber"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />
        <CardStat
          title="KK Aktif & Terisi"
          value={kkTerisi.toLocaleString('id-ID')}
          description="KK dengan susunan anggota aktif"
          variant="violet"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />
      </div>

      <FilterBar onReset={() => setSearch('')}>
        <SearchBox
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder="Cari Nomor KK atau Nama Kepala Keluarga..."
        />
      </FilterBar>

      {loading ? (
        <LoadingSpinner message="Memuat data kartu keluarga..." />
      ) : (
        <div className="space-y-4">
          <Table
            columns={[
              {
                key: 'no',
                label: 'No',
                className: 'w-12 text-center',
                render: (_: any, idx: number) => {
                  const from = data?.from || 1
                  return <span className="text-xs text-slate-500 font-semibold">{from + idx}</span>
                },
              },
              { key: 'nomor_kk', label: 'Nomor KK' },
              {
                key: 'nama_kepala_keluarga',
                label: 'Kepala Keluarga',
                render: (item: KartuKeluarga) => (
                  <span className="font-semibold text-slate-800">{item.nama_kepala_keluarga}</span>
                ),
              },
              {
                key: 'alamat_keluarga',
                label: 'Alamat',
                render: (item: KartuKeluarga) => item.alamat_keluarga || '-',
              },
              {
                key: 'jumlah_anggota',
                label: 'Jumlah Anggota',
                render: (item: any) => ((item.anggota_count ?? item.jumlah_anggota ?? 0) + ' Jiwa'),
              },
              {
                key: 'actions',
                label: 'Aksi',
                render: (item: KartuKeluarga) => (
                  <div className="flex items-center gap-2">
                    <Link
                      href={'/admin/kartu-keluarga/' + item.id}
                      className="rounded-xl bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
                      title="Lihat Anggota Keluarga"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <Link
                      href={'/admin/kartu-keluarga/' + item.id + '/edit'}
                      className="rounded-xl bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"
                      title="Edit Data KK"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      title="Hapus KK"
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
            emptyMessage="Belum ada data Kartu Keluarga."
          />

          {data && (
            <Pagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              total={data.total}
              from={data.from}
              to={data.to}
              onPageChange={(p) => fetchKK(p, search)}
            />
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Hapus Kartu Keluarga"
        message="Apakah Anda yakin ingin menghapus data Kartu Keluarga ini?"
        confirmText="Hapus Sekarang"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  )
}