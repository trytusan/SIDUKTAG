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
import { Dasawisma, KartuKeluarga, Penduduk } from '../../../src/types'

export default function AdminDasawismaDetail() {
  const router = useRouter()
  const { id } = router.query
  const { showAlert } = useAlert()

  const [dasawisma, setDasawisma] = useState<Dasawisma | null>(null)
  const [keluargaList, setKeluargaList] = useState<KartuKeluarga[]>([])
  const [loading, setLoading] = useState(true)

  // Expand state per KK id
  const [expandedKkId, setExpandedKkId] = useState<number | null>(null)

  // Modal Tambah Kartu Keluarga
  const [showAddModal, setShowAddModal] = useState(false)
  const [availableKK, setAvailableKK] = useState<KartuKeluarga[]>([])
  const [selectedKkIds, setSelectedKkIds] = useState<number[]>([])
  const [loadingKK, setLoadingKK] = useState(false)
  const [savingAssign, setSavingAssign] = useState(false)
  const [searchKK, setSearchKK] = useState('')

  // Lepas KK
  const [removeTarget, setRemoveTarget] = useState<KartuKeluarga | null>(null)
  const [removing, setRemoving] = useState(false)

  async function fetchDetail() {
    if (!id) return
    setLoading(true)
    try {
      const res = await api.get(`/admin/dasawisma/${id}`)
      setDasawisma(res.data.dasawisma)
      setKeluargaList(res.data.keluarga || [])
    } catch (err) {
      console.error('Failed to load dasawisma detail:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetail()
  }, [id])

  // Load Kartu Keluarga yang belum memiliki Dasawisma saat modal dibuka
  const openAddKkModal = async () => {
    setShowAddModal(true)
    setSelectedKkIds([])
    setLoadingKK(true)
    try {
      const res = await api.get('/admin/dasawisma/available-keluarga')
      setAvailableKK(res.data || [])
    } catch (err) {
      console.error('Failed to load available KK for assignment:', err)
    } finally {
      setLoadingKK(false)
    }
  }

  const toggleSelectKK = (kkId: number) => {
    setSelectedKkIds((prev) =>
      prev.includes(kkId) ? prev.filter((i) => i !== kkId) : [...prev, kkId]
    )
  }

  const handleSaveAssign = async () => {
    if (selectedKkIds.length === 0) return
    setSavingAssign(true)
    try {
      await api.post(`/admin/dasawisma/${id}/assign-keluarga`, {
        kartu_keluarga_ids: selectedKkIds,
      })
      showAlert({
        type: 'success',
        title: 'Berhasil Ditambahkan!',
        message: `${selectedKkIds.length} Kartu Keluarga berhasil dimasukkan ke kelompok ini.`,
      })
      setShowAddModal(false)
      fetchDetail()
    } catch (err) {
      showAlert({
        type: 'error',
        title: 'Gagal Menambahkan',
        message: 'Terjadi kesalahan saat menambahkan Kartu Keluarga ke kelompok.',
      })
    } finally {
      setSavingAssign(false)
    }
  }

  const handleRemoveKeluarga = async () => {
    if (!removeTarget) return
    setRemoving(true)
    try {
      await api.post(`/admin/dasawisma/${id}/assign-keluarga`, {
        remove_kartu_keluarga_id: removeTarget.id,
      })
      showAlert({
        type: 'success',
        title: 'Berhasil Dilepas!',
        message: `KK ${removeTarget.nama_kepala_keluarga} berhasil dilepaskan dari kelompok ini.`,
      })
      setRemoveTarget(null)
      fetchDetail()
    } catch (err) {
      showAlert({
        type: 'error',
        title: 'Gagal Melepaskan',
        message: 'Terjadi kesalahan saat melepaskan Kartu Keluarga.',
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

  const filteredAvailableKK = availableKK.filter((k) => {
    const q = searchKK.toLowerCase()
    return (
      k.nama_kepala_keluarga?.toLowerCase().includes(q) ||
      k.nomor_kk?.includes(q) ||
      k.alamat_keluarga?.toLowerCase().includes(q)
    )
  })

  // Hitung total jiwa dari semua KK di kelompok ini
  const totalJiwa = keluargaList.reduce((acc, curr) => {
    const membersCount = curr.anggota ? curr.anggota.length : (curr.jumlah_anggota || 0)
    return acc + membersCount
  }, 0)

  const isFull = keluargaList.length >= 10

  return (
    <AdminLayout pageTitle={`Kelompok ${dasawisma.nama_dasawisma}`} subtitle="Daftar 10 Kartu Keluarga binaan">
      <PageHeader
        title={dasawisma.nama_dasawisma}
        description={`Ketua Kelompok: ${dasawisma.ketua_dasawisma || 'Belum Ditentukan'} | Kapasitas: ${keluargaList.length} / 10 KK (${totalJiwa} Jiwa)`}
        actions={[
          {
            label: 'Kembali ke Daftar',
            href: '/admin/dasawisma',
            variant: 'secondary',
          },
          {
            label: 'Tambah KK ke Kelompok',
            onClick: openAddKkModal,
            variant: 'primary',
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            ),
          },
        ]}
      />

      {/* Ringkasan Informasi Kelompok */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-sky-50/40 p-6 shadow-xs mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <span className="text-xs text-slate-500 font-medium">Ketua / Koordinator PKK</span>
          <p className="mt-1 font-bold text-slate-800 text-base">{dasawisma.ketua_dasawisma || '-'}</p>
          {dasawisma.nomor_telepon_ketua && (
            <p className="text-xs text-slate-500 mt-0.5">Kontak: {dasawisma.nomor_telepon_ketua}</p>
          )}
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium">Cakupan Wilayah / Song Rumah</span>
          <p className="mt-1 text-slate-700 text-sm font-medium">{dasawisma.keterangan || '-'}</p>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium">Kapasitas Kartu Keluarga (KK)</span>
          <div className="mt-1 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold ${
              isFull
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700'
            }`}>
              {keluargaList.length} / 10 KK
            </span>
            {isFull && (
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-lg">
                Ideal (Penuh)
              </span>
            )}
          </div>
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium">Total Jiwa Terbina</span>
          <p className="mt-1 text-indigo-700 font-bold text-base">{totalJiwa} Jiwa Warga</p>
        </div>
      </div>

      {/* Tabel Kartu Keluarga */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">
            Daftar Kartu Keluarga binaan ({keluargaList.length} KK)
          </h3>
          <span className="text-xs text-slate-500">
            *1 Kelompok Dasawisma idealnya terdiri dari 10 KK bertetangga persong rumah
          </span>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4">Kepala Keluarga & No. KK</th>
                <th className="py-3.5 px-4">Alamat Rumah</th>
                <th className="py-3.5 px-4 text-center">Jumlah Anggota</th>
                <th className="py-3.5 px-4 text-right w-44">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {keluargaList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-slate-400">
                    Belum ada Kartu Keluarga yang dimasukkan ke kelompok Dasawisma ini. Klik tombol Tambah KK ke Kelompok di atas.
                  </td>
                </tr>
              ) : (
                keluargaList.map((kk, idx) => {
                  const isExpanded = expandedKkId === kk.id
                  const memberCount = kk.anggota ? kk.anggota.length : (kk.jumlah_anggota || 0)

                  return (
                    <React.Fragment key={kk.id}>
                      <tr className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4 text-center text-xs text-slate-400 font-semibold">
                          {idx + 1}
                        </td>
                        <td className="py-3.5 px-4">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{kk.nama_kepala_keluarga}</p>
                            <p className="text-xs text-indigo-600 font-medium">No. KK: {kk.nomor_kk}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-600">
                          {kk.alamat_keluarga || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setExpandedKkId(isExpanded ? null : kk.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/80 px-2.5 py-1 text-xs font-semibold text-slate-700 transition"
                            title="Klik untuk melihat anggota keluarga"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {memberCount} Jiwa
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-3 w-3 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/kartu-keluarga/${kk.id}`}
                              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                              Detail KK
                            </Link>
                            <button
                              type="button"
                              onClick={() => setRemoveTarget(kk)}
                              className="rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                              title="Lepaskan KK ini dari Dasawisma"
                            >
                              Lepas KK
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Family Members Section */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-b border-slate-200">
                          <td colSpan={5} className="p-4 pl-14">
                            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
                              <h4 className="text-xs font-bold text-slate-700 mb-2">
                                Rincian Anggota Keluarga (KK {kk.nomor_kk}):
                              </h4>
                              {kk.anggota && kk.anggota.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {kk.anggota.map((ang: Penduduk) => (
                                    <div key={ang.id} className="p-2 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                                      <div>
                                        <p className="text-xs font-bold text-slate-800">{ang.nama_lengkap}</p>
                                        <p className="text-[11px] text-slate-500">NIK: {ang.nik}</p>
                                      </div>
                                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                                        <span className="rounded-md bg-indigo-50 text-indigo-700 px-1.5 py-0.5 font-semibold">
                                          {ang.status_dalam_keluarga || 'Anggota'}
                                        </span>
                                        <span>{ang.jenis_kelamin || '-'}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-400 italic">Belum ada data rincian anggota keluarga terdaftar.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Kartu Keluarga */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tambahkan Kartu Keluarga ke {dasawisma.nama_dasawisma}
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih Kartu Keluarga (KK) yang belum terdaftar di Dasawisma mana pun (Maksimal target 10 KK)
                </p>
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
                value={searchKK}
                onChange={(e) => setSearchKK(e.target.value)}
                placeholder="Cari nama Kepala Keluarga, No. KK, atau Alamat..."
                className="w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <svg className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {loadingKK ? (
              <LoadingSpinner message="Memuat daftar Kartu Keluarga..." />
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 border border-slate-100 rounded-2xl p-2 max-h-80">
                {filteredAvailableKK.length === 0 ? (
                  <p className="text-center py-8 text-xs text-slate-400">
                    Tidak ada Kartu Keluarga yang cocok atau seluruh KK sudah terdaftar di kelompok Dasawisma.
                  </p>
                ) : (
                  filteredAvailableKK.map((kk) => {
                    const isSelected = selectedKkIds.includes(kk.id)
                    return (
                      <div
                        key={kk.id}
                        onClick={() => toggleSelectKK(kk.id)}
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
                            onChange={() => toggleSelectKK(kk.id)}
                            className="h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{kk.nama_kepala_keluarga}</p>
                            <p className="text-[11px] text-slate-500">
                              No. KK: {kk.nomor_kk} • Alamat: {kk.alamat_keluarga || '-'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold rounded-lg bg-slate-100 text-slate-700 px-2 py-1">
                          {kk.jumlah_anggota || 0} Jiwa
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                <strong>{selectedKkIds.length}</strong> KK dipilih (Total setelah tambah: {keluargaList.length + selectedKkIds.length} / 10 KK)
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
                  disabled={savingAssign || selectedKkIds.length === 0}
                  className="rounded-2xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {savingAssign ? 'Menyimpan...' : `Tambahkan (${selectedKkIds.length} KK)`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Lepas KK */}
      <ConfirmModal
        isOpen={removeTarget !== null}
        title="Lepas Kartu Keluarga dari Dasawisma?"
        message={`Apakah Anda yakin ingin melepaskan KK "${removeTarget?.nama_kepala_keluarga}" (No. KK: ${removeTarget?.nomor_kk}) dari kelompok ${dasawisma.nama_dasawisma}? Seluruh anggota keluarga di KK tersebut akan dilepaskan status dasawismanya secara bersamaan.`}
        confirmText="Ya, Lepaskan KK"
        cancelText="Batal"
        variant="danger"
        loading={removing}
        onConfirm={handleRemoveKeluarga}
        onCancel={() => setRemoveTarget(null)}
      />
    </AdminLayout>
  )
}
