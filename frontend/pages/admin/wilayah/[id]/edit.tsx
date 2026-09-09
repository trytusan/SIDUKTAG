import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AdminLayout from '../../../../src/components/layouts/admin'
import FormInput from '../../../../src/components/form/input'
import FormSelect from '../../../../src/components/form/select'
import FormTextarea from '../../../../src/components/form/textarea'
import AlertSuccess from '../../../../src/components/ui/alert-success'
import AlertError from '../../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../../src/components/ui/loading'
import ConfirmModal from '../../../../src/components/modal/Confirm'
import { useAlert } from '../../../../src/context/AlertContext'
import api from '../../../../src/lib/api'
import { Wilayah } from '../../../../src/types'

// Dynamically import Leaflet Map Picker with SSR disabled
const FormMapPicker = dynamic(
  () => import('../../../../src/components/maps/form-map-picker'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-slate-100 border border-slate-200">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
          <span className="text-xs">Memuat Peta Pemilih Lokasi Tempat Umum...</span>
        </div>
      </div>
    ),
  }
)

const KATEGORI_TEMPAT_UMUM = [
  { value: 'Balai Banjar / Balai Warga', label: '🏛️ Balai Banjar / Balai Warga', defaultColor: '#10b981' },
  { value: 'Kantor Desa / Pelayanan Publik', label: '🏢 Kantor Desa / Pelayanan Publik', defaultColor: '#2563eb' },
  { value: 'Kesehatan (Puskesmas / Posyandu)', label: '🏥 Kesehatan (Puskesmas / Posyandu)', defaultColor: '#ef4444' },
  { value: 'Pendidikan (Sekolah / PAUD)', label: '🏫 Pendidikan (Sekolah / PAUD)', defaultColor: '#8b5cf6' },
  { value: 'Tempat Ibadah (Pura / Masjid)', label: '⛩️ Tempat Ibadah (Pura / Masjid)', defaultColor: '#f59e0b' },
  { value: 'Sarana Olahraga & Rekreasi', label: '⚽ Sarana Olahraga & Rekreasi', defaultColor: '#06b6d4' },
  { value: 'Pasar & Sentra Ekonomi Desa', label: '🛒 Pasar & Sentra Ekonomi Desa', defaultColor: '#ec4899' },
  { value: 'Keamanan (Pos Ronda / Babinsa)', label: '🛡️ Keamanan (Pos Ronda / Babinsa)', defaultColor: '#0f172a' },
  { value: 'Fasilitas Umum Lainnya', label: '📍 Fasilitas Umum Lainnya', defaultColor: '#64748b' },
]

const PRESET_COLORS = [
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Dark Slate', hex: '#0f172a' },
]

export default function AdminWilayahEdit() {
  const router = useRouter()
  const { id } = router.query
  const { showAlert } = useAlert()

  const [loadingInitial, setLoadingInitial] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const [formData, setFormData] = useState({
    kode_wilayah: '',
    nama_wilayah: '',
    jenis_wilayah: 'Balai Banjar / Balai Warga',
    kepala_wilayah: '',
    nomor_telepon: '',
    latitude: '-8.0781358',
    longitude: '115.1536173',
    deskripsi: '',
    warna_marker: '#10b981',
  })

  useEffect(() => {
    if (!id) return
    async function fetchWilayah() {
      try {
        const res = await api.get('/admin/wilayah/' + id)
        const w: Wilayah = res.data.wilayah
        if (w) {
          setFormData({
            kode_wilayah: w.kode_wilayah || '',
            nama_wilayah: w.nama_wilayah || '',
            jenis_wilayah: w.jenis_wilayah || 'Balai Banjar / Balai Warga',
            kepala_wilayah: w.kepala_wilayah || '',
            nomor_telepon: w.nomor_telepon || '',
            latitude: String(w.latitude || '-8.0781358'),
            longitude: String(w.longitude || '115.1536173'),
            deskripsi: w.deskripsi || '',
            warna_marker: w.warna_marker || '#10b981',
          })
        }
      } catch (err) {
        console.error('Failed to load wilayah:', err)
        setErrorMsg('Gagal memuat data tempat umum.')
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchWilayah()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name === 'jenis_wilayah') {
      const selectedKat = KATEGORI_TEMPAT_UMUM.find((k) => k.value === value)
      setFormData((prev) => ({
        ...prev,
        jenis_wilayah: value,
        warna_marker: selectedKat ? selectedKat.defaultColor : prev.warna_marker,
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCoordsChange = (coords: { latitude: string; longitude: string }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: coords.latitude,
      longitude: coords.longitude,
    }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nama_wilayah.trim() || !formData.kepala_wilayah.trim()) {
      setErrorMsg('Harap lengkapi nama tempat umum dan nama pengelola/penanggung jawab.')
      return
    }
    setErrorMsg(null)
    setShowConfirm(true)
  }

  const handleExecuteSave = async () => {
    setSubmitting(true)
    setErrorMsg(null)

    const payload = {
      kode_wilayah: formData.kode_wilayah,
      nama_wilayah: formData.nama_wilayah.trim(),
      jenis_wilayah: formData.jenis_wilayah,
      kepala_wilayah: formData.kepala_wilayah.trim(),
      nomor_telepon: formData.nomor_telepon ? formData.nomor_telepon.trim() : null,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      deskripsi: formData.deskripsi.trim() || null,
      warna_marker: formData.warna_marker,
    }

    try {
      await api.put('/admin/wilayah/' + id, payload)
      setSuccessMsg('Data tempat umum / fasilitas berhasil diperbarui!')
      setShowConfirm(false)
      setTimeout(() => {
        router.push('/admin/wilayah')
      }, 800)
      showAlert({
        type: 'success',
        title: 'Berhasil Diperbarui!',
        message: 'Data tempat umum / fasilitas telah berhasil diperbarui.',
        onClose: () => router.push('/admin/wilayah'),
      })
    } catch (err: any) {
      setShowConfirm(false)
      const msg = err?.response?.data?.message || 'Gagal memperbarui data tempat umum.'
      setErrorMsg(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial) {
    return (
      <AdminLayout pageTitle="Edit Fasilitas Wilayah">
        <LoadingSpinner message="Memuat formulir edit tempat umum..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Edit Tempat Umum — SIDUKTAG"
      pageTitle="Edit Tempat Umum & Fasilitas Wilayah"
      subtitle={'Mengubah data: ' + formData.nama_wilayah}
    >
      {/* Breadcrumb */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <li>
            <Link href="/admin/dashboard" className="hover:text-emerald-600 transition">
              Dashboard
            </Link>
          </li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li>
            <Link href="/admin/wilayah" className="hover:text-emerald-600 transition">
              Data Wilayah
            </Link>
          </li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold">Edit Fasilitas</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-4xl">
        {successMsg && <AlertSuccess message={successMsg} />}
        {errorMsg && <AlertError message={errorMsg} />}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Card 1: Informasi Pokok Tempat Umum */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>📍</span> Informasi Tempat Umum & Fasilitas
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Perbarui detail nama, klasifikasi fasilitas desa, dan kontak pengelola
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormInput
                  label="Nama Tempat / Fasilitas Umum *"
                  name="nama_wilayah"
                  value={formData.nama_wilayah}
                  onChange={handleChange}
                  placeholder="Contoh: Balai Banjar Dauh Munduk, Lapangan Desa Tusan"
                  required
                />
              </div>

              <div>
                <FormSelect
                  label="Kategori / Jenis Tempat Umum *"
                  name="jenis_wilayah"
                  value={formData.jenis_wilayah}
                  onChange={handleChange}
                  options={KATEGORI_TEMPAT_UMUM}
                  required
                />
              </div>

              <div>
                <FormInput
                  label="Pengelola / Penanggung Jawab *"
                  name="kepala_wilayah"
                  value={formData.kepala_wilayah}
                  onChange={handleChange}
                  placeholder="Contoh: Kelian Banjar / Pengurus"
                  required
                />
              </div>

              <div>
                <FormInput
                  label="Nomor Telepon / Kontak Pengelola"
                  name="nomor_telepon"
                  value={formData.nomor_telepon}
                  onChange={handleChange}
                  placeholder="Contoh: 081234567890"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Warna Pin Marker di Peta
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="warna_marker"
                    value={formData.warna_marker}
                    onChange={handleChange}
                    className="h-10 w-16 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, warna_marker: c.hex }))}
                        className={`h-6 w-6 rounded-full border-2 transition ${
                          formData.warna_marker === c.hex ? 'border-slate-800 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <FormTextarea
                  label="Deskripsi / Catatan Fasilitas"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Informasi tambahan mengenai fasilitas ini..."
                />
              </div>
            </div>
          </div>

          {/* Card 2: Titik Koordinat Peta */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>🗺️</span> Lokasi Titik Koordinat Geografis
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Klik pada peta untuk menyesuaikan letak fasilitas secara akurat
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-slate-400">Lat:</span>
                <span className="font-bold text-slate-700">{Number(formData.latitude).toFixed(5)}</span>
                <span className="text-slate-400">Lng:</span>
                <span className="font-bold text-slate-700">{Number(formData.longitude).toFixed(5)}</span>
              </div>
            </div>

            <FormMapPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onChange={handleCoordsChange}
              label="Peta Penentuan Lokasi Fasilitas"
              height={360}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/admin/wilayah"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 transition"
            >
              {submitting ? 'Menyimpan...' : 'Perbarui Tempat Umum'}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Konfirmasi Simpan Perubahan"
        message="Apakah Anda yakin data tempat umum / fasilitas ini sudah sesuai dan ingin menyimpan perubahannya?"
        confirmText="Ya, Simpan Perubahan"
        cancelText="Batal / Cek Kembali"
        variant="primary"
        loading={submitting}
        onConfirm={handleExecuteSave}
        onCancel={() => setShowConfirm(false)}
      />
    </AdminLayout>
  )
}

