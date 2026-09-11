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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const endpoint = id ? `/user/kartu-keluarga/${id}` : '/user/kartu-keluarga'
        const res = await api.get(endpoint)
        setKartuKeluarga(res.data?.kartuKeluarga || res.data?.kartu_keluarga || res.data?.data || null)
        setPenduduk(res.data?.penduduk || null)
      } catch (err) {
        console.error('Failed to load KK:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

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
      />

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
        <h3 className="text-lg font-bold text-slate-800">Daftar Anggota Keluarga Terdaftar</h3>
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
                <span className="font-semibold text-slate-800">{item.nama_lengkap}</span>
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
          ]}
          data={anggota}
          emptyMessage="Belum ada data anggota keluarga lain dalam nomor KK ini."
        />
      </div>
    </UserLayout>
  )
}
