import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import UserLayout from '../../../src/components/layouts/user'
import PageHeader from '../../../src/components/ui/page-header'
import Table from '../../../src/components/ui/table'
import StatusBadge from '../../../src/components/ui/status-badge'
import LoadingSpinner from '../../../src/components/ui/loading'
import api from '../../../src/lib/api'
import { KartuKeluarga, Penduduk } from '../../../src/types'
import { sortFamilyMembers, getFamilyRoleBadgeClass } from '../../../src/utils/familyOrder'

const MapPreview = dynamic(
  () => import('../../../src/components/maps/map-preview'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-48 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 text-xs">
        Memuat peta...
      </div>
    ),
  }
)

export default function UserKartuKeluargaPage() {
  const router = useRouter()
  const { id } = router.query
  const [kartuKeluarga, setKartuKeluarga] = useState<KartuKeluarga | null>(null)
  const [penduduk, setPenduduk] = useState<Penduduk | null>(null)
  const [isKepalaKeluarga, setIsKepalaKeluarga] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Penduduk | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const endpoint = id ? `/user/kartu-keluarga/${id}` : '/user/kartu-keluarga'
      const res = await api.get(endpoint)
      const kk = res.data?.kartuKeluarga || res.data?.kartu_keluarga || res.data?.data || null
      const pend = res.data?.penduduk || null
      setKartuKeluarga(kk)
      setPenduduk(pend)
      setIsKepalaKeluarga(
        res.data?.is_kepala_keluarga ??
        (pend?.status_dalam_keluarga === 'Kepala Keluarga')
      )
    } catch (err) {
      console.error('Failed to load KK:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleDeleteAnggota = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setActionError(null)
    setActionSuccess(null)

    try {
      const res = await api.delete(`/user/kartu-keluarga/anggota/${deleteTarget.id}`)
      setActionSuccess(res.data?.message || 'Anggota keluarga berhasil dihapus.')
      setDeleteTarget(null)
      await fetchData()
    } catch (err: any) {
      setActionError(err?.response?.data?.message || 'Gagal menghapus anggota keluarga.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <UserLayout pageTitle="Kartu Keluarga">
        <LoadingSpinner message="Memuat data Kartu Keluarga..." />
      </UserLayout>
    )
  }

  const anggota = sortFamilyMembers(kartuKeluarga?.anggota || [])

  return (
    <UserLayout pageTitle="Kartu Keluarga" subtitle="Informasi susunan anggota keluarga Anda">
      <PageHeader
        title="Data Kartu Keluarga"
        description={`Nomor KK: ${kartuKeluarga?.nomor_kk || penduduk?.nomor_kk || '-'}`}
        actions={
          isKepalaKeluarga
            ? [
                {
                  label: '+ Tambah Anggota Keluarga',
                  href: '/user/kartu-keluarga/tambah-anggota',
                  variant: 'primary',
                },
              ]
            : undefined
        }
      />

      {actionSuccess && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>✓</span>
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {actionError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{actionError}</span>
          </div>
          <button
            onClick={() => setActionError(null)}
            className="text-rose-600 hover:text-rose-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Role Banner */}
      {isKepalaKeluarga ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-emerald-600 p-2.5 text-white shrink-0 shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950">Akses Pengelolaan Kepala Keluarga</h4>
              <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                Anda tercatat sebagai <strong>Kepala Keluarga</strong>. Anda memiliki kewenangan untuk menambahkan data anggota keluarga baru ke dalam Kartu Keluarga ini.
              </p>
            </div>
          </div>
          <Link
            href="/user/kartu-keluarga/tambah-anggota"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-95 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Anggota Keluarga</span>
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 flex items-center gap-3 text-xs text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Penambahan anggota keluarga ke dalam susunan Kartu Keluarga hanya dapat dilakukan oleh <strong>Kepala Keluarga ({kartuKeluarga?.nama_kepala_keluarga || 'Kepala KK'})</strong>.
          </span>
        </div>
      )}

      {/* Info Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-800">Ringkasan Keluarga</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <span className="text-xs text-slate-500">Nama Kepala Keluarga</span>
              <p className="mt-1 font-semibold text-slate-800">
                {kartuKeluarga?.nama_kepala_keluarga || '-'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <span className="text-xs text-slate-500">Nomor Kartu Keluarga</span>
              <p className="mt-1 font-semibold text-slate-800">
                {kartuKeluarga?.nomor_kk || '-'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
              <span className="text-xs text-slate-500">Alamat Tempat Tinggal</span>
              <p className="mt-1 font-semibold text-slate-800">
                {kartuKeluarga?.alamat_keluarga || penduduk?.alamat_lengkap || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Map Preview */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 mb-3">Lokasi Tempat Tinggal</h3>
          {penduduk?.latitude && penduduk?.longitude ? (
            <MapPreview
              latitude={penduduk.latitude}
              longitude={penduduk.longitude}
              title={kartuKeluarga?.nama_kepala_keluarga || 'Rumah Keluarga'}
              height={180}
            />
          ) : (
            <div className="rounded-2xl bg-slate-50 p-6 text-center text-xs text-slate-400">
              Titik lokasi belum ditentukan.
            </div>
          )}
        </div>
      </div>

      {/* Anggota Keluarga Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Daftar Anggota Keluarga Terdaftar</h3>
            <p className="text-xs text-slate-500">
              Total {anggota.length} anggota tercatat dalam Kartu Keluarga ini
            </p>
          </div>
          {isKepalaKeluarga && (
            <Link
              href="/user/kartu-keluarga/tambah-anggota"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-95 self-start sm:self-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>+ Tambah Anggota</span>
            </Link>
          )}
        </div>

        <Table
          columns={[
            {
              key: 'no',
              label: 'No',
              className: 'w-16 text-center',
              render: (_: any, idx: number) => {
                const isKepala = idx === 0
                const isIstri = idx === 1
                return (
                  <div className="flex items-center justify-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        isKepala
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-200'
                          : isIstri
                          ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-200'
                          : 'bg-slate-100 text-slate-700 font-semibold'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </div>
                )
              },
            },
            {
              key: 'nama_lengkap',
              label: 'Nama Lengkap',
              render: (item: Penduduk) => (
                <div>
                  <span className="font-semibold text-slate-800">{item.nama_lengkap}</span>
                  {item.nomor_telepon && (
                    <div className="text-xs text-slate-400 font-normal">{item.nomor_telepon}</div>
                  )}
                </div>
              ),
            },
            { key: 'nik', label: 'NIK' },
            { key: 'jenis_kelamin', label: 'Jenis Kelamin' },
            {
              key: 'status_dalam_keluarga',
              label: 'Hubungan',
              render: (item: Penduduk) => (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs border ${getFamilyRoleBadgeClass(
                    item.status_dalam_keluarga
                  )}`}
                >
                  {item.status_dalam_keluarga || '-'}
                </span>
              ),
            },
            {
              key: 'status_kependudukan',
              label: 'Status',
              render: (item: Penduduk) => <StatusBadge>{item.status_kependudukan || 'Tetap'}</StatusBadge>,
            },
            ...(isKepalaKeluarga
              ? [
                  {
                    key: 'aksi',
                    label: 'Aksi',
                    className: 'w-24 text-center',
                    render: (item: Penduduk) => {
                      if (item.status_dalam_keluarga === 'Kepala Keluarga' || item.id === penduduk?.id) {
                        return <span className="text-xs text-slate-400 font-medium">Kepala KK</span>
                      }
                      return (
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 active:scale-95"
                          title="Hapus dari KK"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Hapus</span>
                        </button>
                      )
                    },
                  },
                ]
              : []),
          ]}
          data={anggota}
          emptyMessage="Belum ada data anggota keluarga lain dalam nomor KK ini."
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="rounded-2xl bg-rose-100 p-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800">Hapus Anggota Keluarga?</h4>
                <p className="text-xs text-slate-500">Konfirmasi tindakan penghapusan</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong>{deleteTarget.nama_lengkap}</strong> (NIK: {deleteTarget.nik}) dari Kartu Keluarga Anda?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-2xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteAnggota}
                className="rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus Anggota'}
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  )
}
