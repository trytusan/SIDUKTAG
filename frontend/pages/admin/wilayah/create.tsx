import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import FormInput from '../../../src/components/form/input'
import FormSelect from '../../../src/components/form/select'
import FormTextarea from '../../../src/components/form/textarea'
import AlertSuccess from '../../../src/components/ui/alert-success'
import AlertError from '../../../src/components/ui/alert-error'
import api from '../../../src/lib/api'

// Dynamically import Leaflet Map Picker with SSR disabled
const FormMapPicker = dynamic(
  () => import('../../../src/components/maps/form-map-picker'),
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
  { value: 'Balai Banjar / Balai Warga', label: '🏛️ Balai Banjar / Balai Warga', defaultColor: '#10b981', prefix: 'BLI' },
  { value: 'Kantor Desa / Pelayanan Publik', label: '🏢 Kantor Desa / Pelayanan Publik', defaultColor: '#2563eb', prefix: 'KTR' },
  { value: 'Kesehatan (Puskesmas / Posyandu)', label: '🏥 Kesehatan (Puskesmas / Posyandu)', defaultColor: '#ef4444', prefix: 'KSH' },
  { value: 'Pendidikan (Sekolah / PAUD)', label: '🏫 Pendidikan (Sekolah / PAUD)', defaultColor: '#8b5cf6', prefix: 'PDK' },
  { value: 'Tempat Ibadah (Pura / Masjid)', label: '⛩️ Tempat Ibadah (Pura / Masjid)', defaultColor: '#f59e0b', prefix: 'IBD' },
  { value: 'Sarana Olahraga & Rekreasi', label: '⚽ Sarana Olahraga & Rekreasi', defaultColor: '#06b6d4', prefix: 'OLR' },
  { value: 'Pasar & Sentra Ekonomi Desa', label: '🛒 Pasar & Sentra Ekonomi Desa', defaultColor: '#ec4899', prefix: 'PSR' },
  { value: 'Keamanan (Pos Ronda / Babinsa)', label: '🛡️ Keamanan (Pos Ronda / Babinsa)', defaultColor: '#0f172a', prefix: 'KMN' },
  { value: 'Fasilitas Umum Lainnya', label: '📍 Fasilitas Umum Lainnya', defaultColor: '#64748b', prefix: 'FAS' },
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

export default function AdminWilayahCreate() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nama_wilayah: '',
    jenis_wilayah: 'Balai Banjar / Balai Warga',
    kepala_wilayah: '',
    nomor_telepon: '',
    jam_operasional: 'Buka Setiap Hari (24 Jam)',
    latitude: '-8.0781358',
    longitude: '115.1536173',
    deskripsi: '',
    warna_marker: '#10b981',
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    if (!formData.nama_wilayah.trim() || !formData.kepala_wilayah.trim()) {
      setErrorMsg('Harap lengkapi nama tempat umum dan nama pengelola/penanggung jawab.')
      setSubmitting(false)
      return
    }

    // Gabungkan keterangan operasional ke deskripsi jika ada
    let finalDeskripsi = formData.deskripsi.trim()
    if (formData.jam_operasional) {
      finalDeskripsi = `[Jam Operasional: ${formData.jam_operasional}] ${finalDeskripsi}`.trim()
    }

    const payload = {
      nama_wilayah: formData.nama_wilayah.trim(),
      jenis_wilayah: formData.jenis_wilayah,
      kepala_wilayah: formData.kepala_wilayah.trim(),
      nomor_telepon: formData.nomor_telepon ? formData.nomor_telepon.trim() : null,
      jumlah_kk: 0, // Tempat umum tidak menampung KK hunian
      jumlah_penduduk: 0, // Tempat umum tidak memiliki jiwa penduduk tetap
      luas_wilayah: null,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      deskripsi: finalDeskripsi || null,
      warna_marker: formData.warna_marker,
    }

    try {
      await api.post('/admin/wilayah', payload)
      setSuccessMsg('Tempat umum / fasilitas wilayah berhasil ditambahkan! Mengalihkan...')
      setTimeout(() => {
        router.push('/admin/wilayah')
      }, 1000)
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal menyimpan data tempat umum ke server.'
      setErrorMsg(msg)
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout
      title="Tambah Tempat Umum — SIDUKTAG"
      pageTitle="Tambah Tempat Umum & Fasilitas Wilayah"
      subtitle="Pendaftaran titik koordinat lokasi fasilitas publik, balai banjar, tempat ibadah, kantor pelayanan, dan sarana umum desa"
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
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold">Tambah Tempat Umum</li>
        </ol>
      </nav>

      {/* Educational Notice */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs text-blue-900 shadow-xs">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs">
          🏛️
        </div>
        <div>
          <h4 className="font-bold text-blue-950">
            Formulir Khusus Tempat Umum & Fasilitas Publik Desa
          </h4>
          <p className="text-blue-800 mt-0.5 leading-relaxed">
            Formulir ini khusus untuk mendaftarkan titik fasilitas publik desa (balai banjar, puskesmas, wantilan, sekolah, pura/masjid, dan kantor pelayanan). Titik hunian rumah warga dan keluarga secara otomatis dipetakan melalui modul kependudukan dan onboarding warga.
          </p>
        </div>
      </div>

      <PageHeader
        title="Formulir Tempat Umum Baru"
        description="Masukkan identitas fasilitas publik, pengelola penanggung jawab, dan tetapkan titik spasial peta"
        actions={[
          {
            label: 'Batal & Kembali',
            href: '/admin/wilayah',
            variant: 'secondary',
          },
        ]}
      />

      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        {successMsg && <AlertSuccess message={successMsg} />}
        {errorMsg && <AlertError message={errorMsg} />}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Section 1: Identitas Tempat Umum */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              1. Identitas Tempat / Fasilitas Umum
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="sm:col-span-2">
                <FormInput
                  label="Nama Tempat / Fasilitas Umum"
                  name="nama_wilayah"
                  placeholder="Contoh: Balai Banjar Dinas Dauh Munduk / Wantilan Desa"
                  value={formData.nama_wilayah}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm:col-span-1">
                <FormSelect
                  label="Kategori / Jenis Tempat Umum"
                  name="jenis_wilayah"
                  value={formData.jenis_wilayah}
                  onChange={handleChange}
                  options={KATEGORI_TEMPAT_UMUM}
                  required
                />
              </div>

              <FormInput
                label="Pengelola / Penanggung Jawab"
                name="kepala_wilayah"
                placeholder="Contoh: Klian Banjar / Kepala Unit / Pengurus"
                value={formData.kepala_wilayah}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Nomor Telepon / Kontak Pengelola"
                name="nomor_telepon"
                placeholder="08xxxxxxxxxx"
                value={formData.nomor_telepon}
                onChange={handleChange}
              />

              <FormInput
                label="Jam Operasional / Keterangan Akses"
                name="jam_operasional"
                placeholder="Contoh: 24 Jam / Setiap Hari / 08.00 - 15.00"
                value={formData.jam_operasional}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section 2: Geotagging & Titik Koordinat Peta */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800">
                2. Titik Koordinat Spasial Peta (Geotagging)
              </h3>
              {/* Marker Color Picker */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Warna Pin:</span>
                <div className="flex items-center gap-1.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, warna_marker: c.hex }))}
                      className={`h-5 w-5 rounded-full transition ${
                        formData.warna_marker === c.hex
                          ? 'ring-2 ring-slate-900 ring-offset-2 scale-110'
                          : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <FormMapPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onChange={handleCoordsChange}
                label="Klik pada Peta untuk Menentukan Lokasi Presisi Tempat Umum Ini"
                height={340}
              />
            </div>
          </div>

          {/* Section 3: Deskripsi & Fasilitas Pendukung */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              3. Deskripsi, Fasilitas & Keterangan Tambahan
            </h3>
            <div className="mt-4">
              <FormTextarea
                label="Keterangan Fasilitas / Layanan Publik"
                name="deskripsi"
                placeholder="Tuliskan fasilitas yang tersedia (contoh: wantilan pertemuan kapasitas 200 orang, parkir roda dua & roda empat, toilet umum, wifi gratis desa, dsb)..."
                value={formData.deskripsi}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/admin/wilayah"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{submitting ? 'Menyimpan...' : 'Simpan Tempat Umum'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
