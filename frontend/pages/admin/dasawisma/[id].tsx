import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import Table from '../../../src/components/ui/table'
import LoadingSpinner from '../../../src/components/ui/loading'
import ConfirmModal from '../../../src/components/modal/Confirm'
import { useAlert } from '../../../src/context/AlertContext'
import api from '../../../src/lib/api'
import { Dasawisma, Penduduk } from '../../../src/types'

export default function AdminDasawismaDetail() {
  const router = useRouter()
  const { id } = router.query
  const { showAlert } = useAlert()

  const [dasawisma, setDasawisma] = useState<Dasawisma | null>(null)
  const [anggota, setAnggota] = useState<Penduduk[]>([])
  const [loading, setLoading] = useState(true)

  // Modal Tambah Anggota
  const [showAddModal, setShowAddModal] = useState(false)
  const [availableResidents, setAvailableResidents] = useState<Penduduk[]>([])
  const [selectedResidentIds, setSelectedResidentIds] = useState<number[]>([])
  const [loadingResidents, setLoadingResidents] = useState(false)
  const [savingAssign, setSavingAssign] = useState(false)
  const [searchResident, setSearchResident] = useState('')

  // Lepas Anggota
  const [removeTarget, setRemoveTarget] = useState<Penduduk | null>(null)
  const [removing, setRemoving] = useState(false)

  async function fetchDetail() {
    if (!id) return
    setLoading(true)
    try {
      const res = await api.get(`/admin/dasawisma/${id}`)
      setDasawisma(res.data.dasawisma)
      setAnggota(res.data.anggota || [])
    } catch (err) {
      console.error('Failed to load dasawisma detail:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  // Load Warga yang belum memiliki Dasawisma saat modal dibuka
  const openAddMemberModal = async () => {
    setShowAddModal(true)
    setSelectedResidentIds([])
    setLoadingResidents(true)
    try {
      // Ambil daftar penduduk (default max 100 warga yang belum punya dasawisma)
      const res = await api.get('/admin/penduduk?hanya_kepala_keluarga=0')
      const all: Penduduk[] = res.data.penduduk?.data || []
      // Filter warga yang belum berada di kelompok ini
      const filtered = all.filter((p) => Number(p.dasawisma_id) !== Number(id))
      setAvailableResidents(filtered)
    } catch (err) {
      console.error('Failed to load residents for assignment:', err)
    } finally {
      setLoadingResidents(false)
    }
  }

  const toggleSelectResident = (rId: number) => {
    setSelectedResidentIds((prev) =>
      prev.includes(rId) ? prev.filter((i) => i !== rId) : [...prev, rId]
    )
  }

  const handleSaveAssign = async () => {
    if (selectedResidentIds.length === 0) return
    setSavingAssign(true)
    try {
      await api.post(`/admin/dasawisma/${id}/assign-anggota`, {
        penduduk_ids: selectedResidentIds,
      })
      showAlert({
        type: 'success',
        title: 'Berhasil Ditambahkan!',
        message: `${selectedResidentIds.length} warga berhasil dimasukkan ke kelompok ini.`,
      })
      setShowAddModal(false)
      fetchDetail()
    } catch (err) {
      showAlert({
        type: 'error',
        title: 'Gagal Menambahkan',
        message: 'Terjadi kesalahan saat menambahkan anggota ke kelompok.',
      })
    } finally {
      setSavingAssign(false)
    }
  }

  const handleRemoveMember = async () => {
    if (!removeTarget) return
    setRemoving(true)
    try {
      await api.post(`/admin/dasawisma/${id}/assign-anggota`, {
        remove_penduduk_id: removeTarget.id,
      })
      showAlert({
        type: 'success',
        title: 'Berhasil Dilepas!',
        message: `${removeTarget.nama_lengkap} berhasil dilepaskan dari kelompok ini.`,
      })
      setRemoveTarget(null)
      fetchDetail()
    } catch (err) {
      showAlert({
        type: 'error',
        title: 'Gagal Melepaskan',
        message: 'Terjadi kesalahan saat melepaskan anggota.',
      })
    } finally {
      setRemoving(false)
    }
  }

  if (loading || !dasawisma) {
    return (
      <AdminLayout pageTitle="Detail Dasawisma">
        <LoadingSpinner message="Memuat detail kelompok dasawisma..." />
      </AdminLayout>
    )
  }

  const filteredAvailableResidents = availableResidents.filter((p) => {
    const q = searchResident.toLowerCase()
    return (
      p.nama_lengkap.toLowerCase().includes(q) ||
      p.nik.includes(q) ||
      p.nomor_kk.includes(q)
    )
  })

  return (
    <AdminLayout pageTitle={`Kelompok ${dasawisma.nama_dasawisma}`} subtitle="Daftar warga dan kepala keluarga binaan">
      <PageHeader
        title={dasawisma.nama_dasawisma}
        description={`Ketua Kelompok: ${dasawisma.ketua_dasawisma || 'Belum Ditentukan'} | Total Anggota: ${anggota.length} Warga`}
        actions={[
          {
            label: 'Kembali ke Daftar',
            href: '/admin/dasawisma',
            variant: 'secondary',
          },
          {
            label: 'Tambah Warga ke Kelompok',
            onClick: openAddMemberModal,
            variant: 'primary',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            ),
          },
        ]}
      />

      {/* Ringkasan Informasi Kelompok */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-sky-50/40 p-6 shadow-xs mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <span className="text-xs text-slate-500 font-medium">Ketua / Koordinator PKK</span>
          <p className="mt-1 font-bold text-slate-800 text-base">{dasawisma.ketua_dasawisma || '-'}</p>
          {dasawisma.nomor_telepon_ketua && (
            <p className="text-xs text-slate-500 mt-0.5">Kontak: {dasawisma.nomor_telepon_ketua}</p>
          )}
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium">Wilayah Cakupan / Gang</span>
          <p className="mt-1 text-slate-700 text-sm font-medium">{dasawisma.keterangan || '-'}</p>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium">Kekuatan Anggota</span>
          <p className="mt-1 text-indigo-700 font-bold text-base">{anggota.length} Warga Terdaftar</p>
        </div>
      </div>

      {/* Tabel Anggota Kelompok */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Daftar Anggota Warga ({anggota.length})</h3>
        </div>

        <Table
          columns={[
            {
              key: 'no',
              label: 'No',
              className: 'w-12 text-center',
              render: (_: any, idx: number) => (
                <span className="text-xs text-slate-500 font-semibold">{idx + 1}</span>
              ),
            },
            {
              key: 'nama_lengkap',
              label: 'Nama Warga (NIK)',
              render: (item: Penduduk) => (
                <div>
                  <p className="font-semibold text-slate-800">{item.nama_lengkap}</p>
                  <p className="text-xs text-slate-400">NIK: {item.nik}</p>
                </div>
              ),
            },
            {
              key: 'nomor_kk',
              label: 'No. Kartu Keluarga',
              render: (item: Penduduk) => (
                <div>
                  <p className="font-medium text-slate-800">{item.nomor_kk || '-'}</p>
                  <p className="text-xs text-slate-400">{item.status_dalam_keluarga || '-'}</p>
                </div>
              ),
            },
            {
              key: 'jenis_kelamin',
              label: 'JK',
              render: (item: Penduduk) => item.jenis_kelamin || '-',
            },
            {
              key: 'alamat_lengkap',
              label: 'Alamat Tinggal',
              render: (item: Penduduk) => (
                <p className="text-xs text-slate-600 line-clamp-2">{item.alamat_lengkap || '-'}</p>
              ),
            },
            {
              key: 'actions',
              label: 'Aksi',
              className: 'w-36 text-right',
              render: (item: Penduduk) => (
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/penduduk/${item.id}`}
                    className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Profil
                  </Link>
                  <button
                    type="button"
                    onClick={() => setRemoveTarget(item)}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                  >
                    Lepas
                  </button>
                </div>
              ),
            },
          ]}
          data={anggota}
          emptyMessage="Belum ada anggota yang dimasukkan ke kelompok Dasawisma ini. Klik tombol 'Tambah Warga ke Kelompok' di atas untuk memilih warga."
        />
      </div>

      {/* Modal Tambah Warga */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tambahkan Warga ke {dasawisma.nama_dasawisma}
                </h3>
                <p className="text-xs text-slate-500">Centang warga yang ingin dimasukkan ke dalam kelompok ini</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchResident}
                onChange={(e) => setSearchResident(e.target.value)}
                placeholder="Cari nama warga, NIK, atau No. KK..."
                className="w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <svg className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {loadingResidents ? (
              <LoadingSpinner message="Memuat daftar warga..." />
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 border border-slate-100 rounded-2xl p-2 max-h-80">
                {filteredAvailableResidents.length === 0 ? (
                  <p className="text-center py-8 text-xs text-slate-400">
                    Tidak ada warga yang cocok atau seluruh warga sudah terdaftar di kelompok ini.
                  </p>
                ) : (
                  filteredAvailableResidents.map((p) => {
                    const isSelected = selectedResidentIds.includes(p.id)
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleSelectResident(p.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectResident(p.id)}
                            className="h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{p.nama_lengkap}</p>
                            <p className="text-[11px] text-slate-400">
                              NIK: {p.nik} • KK: {p.nomor_kk} ({p.status_dalam_keluarga || 'Anggota'})
                            </p>
                          </div>
                        </div>

                        {p.dasawisma && (
                          <span className="text-[10px] rounded-md bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-amber-700 font-semibold">
                            Pindah dari: {p.dasawisma.nama_dasawisma}
                          </span>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                <strong>{selectedResidentIds.length}</strong> warga dipilih
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveAssign}
                  disabled={savingAssign || selectedResidentIds.length === 0}
                  className="rounded-2xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {savingAssign ? 'Menyimpan...' : `Masukkan ke Kelompok (${selectedResidentIds.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Lepas Anggota */}
      <ConfirmModal
        isOpen={removeTarget !== null}
        title="Lepas Warga dari Kelompok?"
        message={`Apakah Anda yakin ingin melepaskan "${removeTarget?.nama_lengkap}" dari kelompok ${dasawisma.nama_dasawisma}? Data warga tetap aman dan hanya status kelompok dasawismanya yang dikosongkan.`}
        confirmText="Ya, Lepaskan"
        cancelText="Batal"
        variant="danger"
        loading={removing}
        onConfirm={handleRemoveMember}
        onCancel={() => setRemoveTarget(null)}
      />
    </AdminLayout>
  )
}
