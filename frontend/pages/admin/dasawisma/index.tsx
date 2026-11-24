import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import CardStat from '../../../src/components/ui/card-stat'
import Table from '../../../src/components/ui/table'
import Pagination from '../../../src/components/utils/pagination'
import LoadingSpinner from '../../../src/components/ui/loading'
import FormInput from '../../../src/components/form/input'
import FormTextarea from '../../../src/components/form/textarea'
import AlertError from '../../../src/components/ui/alert-error'
import ConfirmModal from '../../../src/components/modal/Confirm'
import { useAlert } from '../../../src/context/AlertContext'
import api from '../../../src/lib/api'
import { Dasawisma, PaginatedResponse } from '../../../src/types'

export default function AdminDasawismaIndex() {
  const { showAlert } = useAlert()
  const [data, setData] = useState<PaginatedResponse<Dasawisma> | null>(null)
  const [stats, setStats] = useState<{
    total_dasawisma: number
    total_warga_terpetakan: number
    total_warga_belum_terpetakan: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // Modal State Create / Edit
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<Dasawisma | null>(null)
  const [namaDasawisma, setNamaDasawisma] = useState('')
  const [ketuaDasawisma, setKetuaDasawisma] = useState('')
  const [nomorTeleponKetua, setNomorTeleponKetua] = useState('')
  const [keterangan, setKeterangan] = useState('')
  const [modalSubmitting, setModalSubmitting] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Dasawisma | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function fetchDasawisma(p = 1, s = search) {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('page', String(p))
      if (s) params.append('search', s)

      const res = await api.get('/admin/dasawisma?' + params.toString())
      setData(res.data.dasawisma)
      setStats(res.data.stats)
      setPage(p)
    } catch (err) {
      console.error('Failed to load dasawisma data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDasawisma(1, search)
  }, [search])

  const openCreateModal = () => {
    setEditingItem(null)
    setNamaDasawisma('')
    setKetuaDasawisma('')
    setNomorTeleponKetua('')
    setKeterangan('')
    setModalError(null)
    setValidationErrors({})
    setShowModal(true)
  }

  const openEditModal = (item: Dasawisma) => {
    setEditingItem(item)
    setNamaDasawisma(item.nama_dasawisma)
    setKetuaDasawisma(item.ketua_dasawisma || '')
    setNomorTeleponKetua(item.nomor_telepon_ketua || '')
    setKeterangan(item.keterangan || '')
    setModalError(null)
    setValidationErrors({})
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setModalSubmitting(true)
    setModalError(null)
    setValidationErrors({})

    const payload = {
      nama_dasawisma: namaDasawisma,
      ketua_dasawisma: ketuaDasawisma || null,
      nomor_telepon_ketua: nomorTeleponKetua || null,
      keterangan: keterangan || null,
    }

    try {
      if (editingItem) {
        await api.put(`/admin/dasawisma/${editingItem.id}`, payload)
        showAlert({
          type: 'success',
          title: 'Berhasil Diperbarui!',
          message: `Kelompok ${namaDasawisma} berhasil diperbarui.`,
        })
      } else {
        await api.post('/admin/dasawisma', payload)
        showAlert({
          type: 'success',
          title: 'Berhasil Ditambahkan!',
          message: `Kelompok ${namaDasawisma} berhasil didaftarkan.`,
        })
      }
      setShowModal(false)
      fetchDasawisma(page, search)
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setModalError(err?.response?.data?.message || 'Gagal menyimpan data Dasawisma.')
    } finally {
      setModalSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/admin/dasawisma/${deleteTarget.id}`)
      setDeleteTarget(null)
      fetchDasawisma(page, search)
      showAlert({
        type: 'delete',
        title: 'Berhasil Dihapus!',
        message: `Kelompok ${deleteTarget.nama_dasawisma} berhasil dihapus.`,
      })
    } catch (err) {
      showAlert({
        type: 'error',
        title: 'Gagal Menghapus',
        message: 'Terjadi kesalahan saat menghapus kelompok Dasawisma.',
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout pageTitle="Kelola Dasawisma" subtitle="Master data pengelompokan keluarga binaan PKK Lingkungan Saba">
      <PageHeader
        title="Data Kelompok Dasawisma"
        description="Kelola kelompok binaan PKK Banjar Saba untuk memudahkan pemantauan dan penyaluran program"
        actions={[
          {
            label: 'Tambah Kelompok Dasawisma',
            onClick: openCreateModal,
            variant: 'primary',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            ),
          },
        ]}
      />

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <CardStat
          title="Total Kelompok Dasawisma"
          value={stats ? `${stats.total_dasawisma} Kelompok` : '-'}
          variant="violet"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <CardStat
          title="Warga Terpetakan"
          value={stats ? `${stats.total_warga_terpetakan} Orang` : '-'}
          variant="emerald"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <CardStat
          title="Belum Masuk Kelompok"
          value={stats ? `${stats.total_warga_belum_terpetakan} Orang` : '-'}
          variant="amber"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
      </div>

      {/* Pencarian */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm mb-5">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama kelompok dasawisma, ketua, atau keterangan wilayah..."
            className="w-full rounded-2xl border border-slate-300 bg-white pl-11 pr-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <svg className="absolute left-4 top-3 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Tabel Data Dasawisma */}
      {loading ? (
        <LoadingSpinner message="Memuat data kelompok dasawisma..." />
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
              {
                key: 'nama_dasawisma',
                label: 'Nama Kelompok Dasawisma',
                render: (item: Dasawisma) => (
                  <div>
                    <p className="font-bold text-slate-900">{item.nama_dasawisma}</p>
                    {item.keterangan && <p className="text-xs text-slate-400 mt-0.5">{item.keterangan}</p>}
                  </div>
                ),
              },
              {
                key: 'ketua_dasawisma',
                label: 'Ketua / Koordinator PKK',
                render: (item: Dasawisma) => (
                  <div>
                    <p className="font-medium text-slate-800">{item.ketua_dasawisma || 'Belum Ditentukan'}</p>
                    {item.nomor_telepon_ketua && (
                      <p className="text-xs text-slate-500 mt-0.5">Telp: {item.nomor_telepon_ketua}</p>
                    )}
                  </div>
                ),
              },
              {
                key: 'anggota_count',
                label: 'Jumlah Anggota',
                className: 'text-center',
                render: (item: Dasawisma) => (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {item.anggota_count || 0} Warga
                  </span>
                ),
              },
              {
                key: 'actions',
                label: 'Aksi',
                className: 'w-52 text-right',
                render: (item: Dasawisma) => (
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/dasawisma/${item.id}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                      title="Lihat anggota warga di kelompok ini"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Anggota
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="rounded-xl border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50 transition"
                      title="Edit Kelompok"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="rounded-xl border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100 transition"
                      title="Hapus Kelompok"
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
            emptyMessage="Belum ada data kelompok Dasawisma. Klik tombol Tambah Kelompok Dasawisma untuk mendaftarkan kelompok baru."
          />

          {data && (
            <Pagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              total={data.total}
              from={data.from}
              to={data.to}
              onPageChange={(p) => fetchDasawisma(p)}
            />
          )}
        </div>
      )}

      {/* Modal Tambah / Edit Dasawisma */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingItem ? 'Edit Kelompok Dasawisma' : 'Tambah Kelompok Dasawisma Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <AlertError message={modalError} errors={validationErrors} />

            <form onSubmit={handleSave} className="space-y-4">
              <FormInput
                label="Nama Kelompok Dasawisma"
                name="nama_dasawisma"
                value={namaDasawisma}
                onChange={(e) => setNamaDasawisma(e.target.value)}
                placeholder="Contoh: Dasawisma Melati 01 / Dasawisma Anggrek"
                required
                error={validationErrors.nama_dasawisma?.[0]}
                helperText="Nama unik kelompok binaan PKK"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Nama Ketua / Koordinator"
                  name="ketua_dasawisma"
                  value={ketuaDasawisma}
                  onChange={(e) => setKetuaDasawisma(e.target.value)}
                  placeholder="Contoh: Ibu Ni Wayan Suasti"
                  error={validationErrors.ketua_dasawisma?.[0]}
                />

                <FormInput
                  label="Nomor Telepon Ketua"
                  name="nomor_telepon_ketua"
                  value={nomorTeleponKetua}
                  onChange={(e) => setNomorTeleponKetua(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  error={validationErrors.nomor_telepon_ketua?.[0]}
                />
              </div>

              <FormTextarea
                label="Wilayah Cakupan / Keterangan"
                name="keterangan"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Cakupan rumah warga di Gang Kenanga dan sekitarnya..."
                rows={2}
                error={validationErrors.keterangan?.[0]}
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="rounded-2xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {modalSubmitting ? 'Menyimpan...' : editingItem ? 'Perbarui Kelompok' : 'Simpan Kelompok'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Hapus Kelompok Dasawisma?"
        message={`Apakah Anda yakin ingin menghapus kelompok "${deleteTarget?.nama_dasawisma}"? Warga yang tergabung di kelompok ini akan dilepaskan (tidak terhapus dari data kependudukan).`}
        confirmText="Ya, Hapus Kelompok"
        cancelText="Batal"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  )
}
