import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AdminLayout from '../../../../src/components/layouts/admin'
import PageHeader from '../../../../src/components/ui/page-header'
import FormInput from '../../../../src/components/form/input'
import FormTextarea from '../../../../src/components/form/textarea'
import FormSelect from '../../../../src/components/form/select'
import AlertError from '../../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../../src/components/ui/loading'
import { useAlert } from '../../../../src/context/AlertContext'
import api, { getStorageUrl } from '../../../../src/lib/api'
import { DAFTAR_PEKERJAAN_DUKCAPIL, STATUS_HUBUNGAN_KELUARGA } from '../../../../src/constants/dukcapil'
import SignaturePad from '../../../../src/components/form/signature-pad'

const FormMapPicker = dynamic(
  () => import('../../../../src/components/maps/form-map-picker'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 text-xs">
        Memuat peta Banjar Saba Penatih...
      </div>
    ),
  }
)

interface AnggotaItem {
  id?: number
  nama: string
  nik: string
  tempat_lahir: string
  tanggal_lahir: string
  hubungan_keluarga: string
}

export default function AdminLaporDiriEdit() {
  const router = useRouter()
  const { id } = router.query
  const { showAlert } = useAlert()

  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    jenis_kelamin: 'Laki-Laki',
    tempat_lahir: '',
    tanggal_lahir: '',
    agama: 'Hindu',
    status_perkawinan: 'Belum Kawin',
    pekerjaan: '',
    nik: '',
    nomor_kk: '',
    nomor_telepon: '',

    alamat_baru: '',
    tanggal_mulai_tinggal: '',
    status_tempat_tinggal: 'Kost',
    nama_pemilik_rumah: '',
    nomor_kontak_pemilik: '',

    alamat_asal: '',
    rt_rw_asal: '',
    kelurahan_asal: '',
    kecamatan_asal: '',
    kota_kabupaten_asal: '',

    tanggal_lapor: '',
    status_lapor: 'Terdaftar',
    catatan: '',
  })

  const [coords, setCoords] = useState({
    latitude: '-8.623347',
    longitude: '115.240787',
  })

  const [anggotaList, setAnggotaList] = useState<AnggotaItem[]>([])
  const [checklist, setChecklist] = useState({
    lampiran_ktp: false,
    lampiran_kk: false,
    lampiran_surat_pindah: false,
  })

  const [existingFiles, setExistingFiles] = useState<{
    file_ktp?: string | null
    file_kk?: string | null
    file_surat_pindah?: string | null
  }>({})

  const [signatureData, setSignatureData] = useState<string | File | null>(null)
  const [lampiranTtd, setLampiranTtd] = useState(false)
  const [existingSignature, setExistingSignature] = useState<string | null>(null)

  const [files, setFiles] = useState<{
    file_ktp: File | null
    file_kk: File | null
    file_surat_pindah: File | null
  }>({
    file_ktp: null,
    file_kk: null,
    file_surat_pindah: null,
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!id) return
    async function fetchData() {
      try {
        const res = await api.get('/admin/lapor-diri/' + id)
        const d = res.data.lapor_diri || res.data.data
        if (d) {
          setFormData({
            nama_lengkap: d.nama_lengkap || '',
            jenis_kelamin: d.jenis_kelamin || 'Laki-Laki',
            tempat_lahir: d.tempat_lahir || '',
            tanggal_lahir: d.tanggal_lahir ? d.tanggal_lahir.split('T')[0] : '',
            agama: d.agama || 'Hindu',
            status_perkawinan: d.status_perkawinan || 'Belum Kawin',
            pekerjaan: d.pekerjaan || '',
            nik: d.nik || '',
            nomor_kk: d.nomor_kk || '',
            nomor_telepon: d.nomor_telepon || '',

            alamat_baru: d.alamat_baru || '',
            tanggal_mulai_tinggal: d.tanggal_mulai_tinggal ? d.tanggal_mulai_tinggal.split('T')[0] : '',
            status_tempat_tinggal: d.status_tempat_tinggal || 'Kost',
            nama_pemilik_rumah: d.nama_pemilik_rumah || '',
            nomor_kontak_pemilik: d.nomor_kontak_pemilik || '',

            alamat_asal: d.alamat_asal || '',
            rt_rw_asal: d.rt_rw_asal || '',
            kelurahan_asal: d.kelurahan_asal || '',
            kecamatan_asal: d.kecamatan_asal || '',
            kota_kabupaten_asal: d.kota_kabupaten_asal || '',

            tanggal_lapor: d.tanggal_lapor ? d.tanggal_lapor.split('T')[0] : '',
            status_lapor: d.status_lapor || 'Terdaftar',
            catatan: d.catatan || '',
          })

          if (d.latitude && d.longitude) {
            setCoords({
              latitude: String(d.latitude),
              longitude: String(d.longitude),
            })
          }

          setChecklist({
            lampiran_ktp: Boolean(d.lampiran_ktp),
            lampiran_kk: Boolean(d.lampiran_kk),
            lampiran_surat_pindah: Boolean(d.lampiran_surat_pindah),
          })

          setExistingFiles({
            file_ktp: d.file_ktp,
            file_kk: d.file_kk,
            file_surat_pindah: d.file_surat_pindah,
          })

          setLampiranTtd(Boolean(d.lampiran_ttd || d.tanda_tangan))
          if (d.tanda_tangan) {
            setExistingSignature(getStorageUrl(d.tanda_tangan))
          }

          if (d.anggota && Array.isArray(d.anggota)) {
            setAnggotaList(
              d.anggota.map((ang: any) => ({
                id: ang.id,
                nama: ang.nama || '',
                nik: ang.nik || '',
                tempat_lahir: ang.tempat_lahir || '',
                tanggal_lahir: ang.tanggal_lahir ? ang.tanggal_lahir.split('T')[0] : '',
                hubungan_keluarga: ang.hubungan_keluarga || 'Istri',
              }))
            )
          }
        }
      } catch (err) {
        console.error('Failed to load lapor diri for edit:', err)
        setError('Gagal memuat data formulir lapor diri.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleChecklistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setChecklist((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'file_ktp' | 'file_kk' | 'file_surat_pindah'
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [field]: e.target.files![0] }))
    } else {
      setFiles((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleAddAnggota = () => {
    setAnggotaList((prev) => [
      ...prev,
      {
        nama: '',
        nik: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        hubungan_keluarga: 'Istri',
      },
    ])
  }

  const handleRemoveAnggota = (index: number) => {
    setAnggotaList((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAnggotaChange = (index: number, field: keyof AnggotaItem, value: string) => {
    setAnggotaList((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setValidationErrors({})

    try {
      const fd = new FormData()
      fd.append('_method', 'PUT')

      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== undefined) {
          fd.append(key, String(val))
        }
      })

      if (coords.latitude) fd.append('latitude', coords.latitude)
      if (coords.longitude) fd.append('longitude', coords.longitude)

      fd.append('lampiran_ktp', checklist.lampiran_ktp ? '1' : '0')
      fd.append('lampiran_kk', checklist.lampiran_kk ? '1' : '0')
      fd.append('lampiran_surat_pindah', checklist.lampiran_surat_pindah ? '1' : '0')
      fd.append('lampiran_ttd', lampiranTtd || signatureData || existingSignature ? '1' : '0')

      if (files.file_ktp) fd.append('file_ktp', files.file_ktp)
      if (files.file_kk) fd.append('file_kk', files.file_kk)
      if (files.file_surat_pindah) fd.append('file_surat_pindah', files.file_surat_pindah)

      if (signatureData) {
        if (typeof signatureData === 'string') {
          fd.append('tanda_tangan_data', signatureData)
        } else {
          fd.append('file_tanda_tangan', signatureData)
        }
      }

      anggotaList.forEach((ang, idx) => {
        if (ang.nama.trim()) {
          fd.append(`anggota[${idx}][nama]`, ang.nama)
          if (ang.nik) fd.append(`anggota[${idx}][nik]`, ang.nik)
          if (ang.tempat_lahir) fd.append(`anggota[${idx}][tempat_lahir]`, ang.tempat_lahir)
          if (ang.tanggal_lahir) fd.append(`anggota[${idx}][tanggal_lahir]`, ang.tanggal_lahir)
          if (ang.hubungan_keluarga) fd.append(`anggota[${idx}][hubungan_keluarga]`, ang.hubungan_keluarga)
        }
      })

      await api.post(`/admin/lapor-diri/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      showAlert({
        type: 'success',
        title: 'Berhasil Diperbarui!',
        message: 'Data formulir lapor diri warga baru berhasil disimpan.',
      })

      router.push(`/admin/lapor-diri/${id}`)
    } catch (err: any) {
      console.error('Gagal memperbarui lapor diri:', err)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
        setError('Terdapat kesalahan pengisian formulir. Silakan periksa kembali bagian yang ditandai merah.')
      } else {
        setError(err.response?.data?.message || 'Terjadi kesalahan sistem saat memperbarui data.')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout pageTitle="Edit Lapor Diri">
        <LoadingSpinner message="Memuat data formulir..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      pageTitle="Edit Formulir Lapor Diri"
      subtitle={`Perbarui data pelapor: ${formData.nama_lengkap}`}
    >
      <div className="mb-6">
        <nav className="flex mb-2" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <li>
              <Link href="/admin/dashboard" className="hover:text-emerald-600 transition">
                Dashboard
              </Link>
            </li>
            <li>
              <span className="text-slate-300">/</span>
            </li>
            <li>
              <Link href="/admin/lapor-diri" className="hover:text-emerald-600 transition">
                Lapor Diri Warga Baru
              </Link>
            </li>
            <li>
              <span className="text-slate-300">/</span>
            </li>
            <li>
              <Link href={`/admin/lapor-diri/${id}`} className="hover:text-emerald-600 transition">
                {formData.nama_lengkap || 'Detail'}
              </Link>
            </li>
            <li>
              <span className="text-slate-300">/</span>
            </li>
            <li className="text-slate-800 font-semibold">Edit</li>
          </ol>
        </nav>
        <PageHeader
          title="Edit Formulir Lapor Diri"
          description="Perbarui isi formulir lapor diri warga baru di Banjar Saba Penatih."
        />
      </div>

      {error && <AlertError message={error} errors={validationErrors} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BAGIAN A: DATA PRIBADI */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700">
              A
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">DATA PRIBADI PELAPOR</h2>
              <p className="text-xs text-slate-500">Identitas utama warga baru pemohon lapor diri</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-2">
              <FormInput
                label="Nama Lengkap Sesuai KTP"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                required
                error={validationErrors.nama_lengkap?.[0]}
              />
            </div>

            <div>
              <FormSelect
                label="Jenis Kelamin"
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                required
                error={validationErrors.jenis_kelamin?.[0]}
                options={[
                  { value: 'Laki-Laki', label: 'Laki-Laki' },
                  { value: 'Perempuan', label: 'Perempuan' },
                ]}
              />
            </div>

            <div>
              <FormInput
                label="Tempat Lahir"
                name="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={handleChange}
                required
                error={validationErrors.tempat_lahir?.[0]}
              />
            </div>

            <div>
              <FormInput
                label="Tanggal Lahir"
                name="tanggal_lahir"
                type="date"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                required
                error={validationErrors.tanggal_lahir?.[0]}
              />
            </div>

            <div>
              <FormSelect
                label="Agama"
                name="agama"
                value={formData.agama}
                onChange={handleChange}
                required
                error={validationErrors.agama?.[0]}
                options={[
                  { value: 'Hindu', label: 'Hindu' },
                  { value: 'Islam', label: 'Islam' },
                  { value: 'Kristen Protestan', label: 'Kristen Protestan' },
                  { value: 'Katolik', label: 'Katolik' },
                  { value: 'Buddha', label: 'Buddha' },
                  { value: 'Konghucu', label: 'Konghucu' },
                ]}
              />
            </div>

            <div>
              <FormSelect
                label="Status Perkawinan"
                name="status_perkawinan"
                value={formData.status_perkawinan}
                onChange={handleChange}
                required
                error={validationErrors.status_perkawinan?.[0]}
                options={[
                  { value: 'Belum Kawin', label: 'Belum Kawin' },
                  { value: 'Kawin', label: 'Kawin' },
                  { value: 'Cerai Hidup', label: 'Cerai Hidup' },
                  { value: 'Cerai Mati', label: 'Cerai Mati' },
                ]}
              />
            </div>

            <div>
              <FormSelect
                label="Pekerjaan"
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
                required
                error={validationErrors.pekerjaan?.[0]}
                options={DAFTAR_PEKERJAAN_DUKCAPIL}
              />
            </div>

            <div>
              <FormInput
                label="Nomor Induk Kependudukan (NIK)"
                name="nik"
                value={formData.nik}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                  setFormData((prev) => ({ ...prev, nik: val }))
                }}
                maxLength={16}
                required
                helperText={`${formData.nik.length}/16 digit`}
                error={validationErrors.nik?.[0]}
              />
            </div>

            <div>
              <FormInput
                label="Nomor Kartu Keluarga (KK)"
                name="nomor_kk"
                value={formData.nomor_kk}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                  setFormData((prev) => ({ ...prev, nomor_kk: val }))
                }}
                maxLength={16}
                helperText={formData.nomor_kk ? `${formData.nomor_kk.length}/16 digit` : 'Sesuai KK'}
                error={validationErrors.nomor_kk?.[0]}
              />
            </div>

            <div>
              <FormInput
                label="No. Telepon / WhatsApp"
                name="nomor_telepon"
                value={formData.nomor_telepon}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                error={validationErrors.nomor_telepon?.[0]}
              />
            </div>
          </div>
        </div>

        {/* BAGIAN B: DATA TEMPAT TINGGAL BARU */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700">
              B
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">DATA TEMPAT TINGGAL BARU DI BANJAR SABA PENATIH</h2>
              <p className="text-xs text-slate-500">Detail lokasi hunian dan status tempat tinggal di lingkungan Banjar</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormTextarea
                label="Alamat Lengkap di Banjar Saba Penatih"
                name="alamat_baru"
                value={formData.alamat_baru}
                onChange={handleChange}
                rows={2}
                required
                error={validationErrors.alamat_baru?.[0]}
              />
            </div>

            <div>
              <FormInput
                label="Tanggal Mulai Tinggal"
                name="tanggal_mulai_tinggal"
                type="date"
                value={formData.tanggal_mulai_tinggal}
                onChange={handleChange}
                error={validationErrors.tanggal_mulai_tinggal?.[0]}
              />
            </div>

            <div>
              <FormSelect
                label="Status Tempat Tinggal"
                name="status_tempat_tinggal"
                value={formData.status_tempat_tinggal}
                onChange={handleChange}
                required
                error={validationErrors.status_tempat_tinggal?.[0]}
                options={[
                  { value: 'Kost', label: 'Kost' },
                  { value: 'Kontrak/Sewa', label: 'Kontrak / Sewa' },
                  { value: 'Milik Sendiri', label: 'Milik Sendiri' },
                  { value: 'Numpang', label: 'Numpang (Keluarga/Kerabat)' },
                ]}
              />
            </div>

            {formData.status_tempat_tinggal !== 'Milik Sendiri' && (
              <>
                <div>
                  <FormInput
                    label="Nama Pemilik Rumah / Kos"
                    name="nama_pemilik_rumah"
                    value={formData.nama_pemilik_rumah}
                    onChange={handleChange}
                    error={validationErrors.nama_pemilik_rumah?.[0]}
                  />
                </div>

                <div>
                  <FormInput
                    label="Nomor Kontak Pemilik Rumah / Kos"
                    name="nomor_kontak_pemilik"
                    value={formData.nomor_kontak_pemilik}
                    onChange={handleChange}
                    error={validationErrors.nomor_kontak_pemilik?.[0]}
                  />
                </div>
              </>
            )}

            {/* Geotagging Map Picker */}
            <div className="sm:col-span-2 mt-2">
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Titik Koordinat Lokasi Rumah (Geotagging Saba Penatih)
              </label>
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <FormMapPicker
                  latitude={coords.latitude}
                  longitude={coords.longitude}
                  onChange={(c) => setCoords(c)}
                  height={320}
                />
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs font-mono text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span>Latitude: <strong className="text-emerald-700">{coords.latitude || '-'}</strong></span>
                <span>Longitude: <strong className="text-emerald-700">{coords.longitude || '-'}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* BAGIAN C: DATA ASAL */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700">
              C
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">DATA DAERAH ASAL</h2>
              <p className="text-xs text-slate-500">Alamat domisili asal sebelum pindah ke Banjar Saba Penatih</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3">
              <FormTextarea
                label="Alamat Asal Lengkap"
                name="alamat_asal"
                value={formData.alamat_asal}
                onChange={handleChange}
                rows={2}
                required
                error={validationErrors.alamat_asal?.[0]}
              />
            </div>

            <div>
              <FormInput
                label="RT / RW / Lingkungan / Dusun"
                name="rt_rw_asal"
                value={formData.rt_rw_asal}
                onChange={handleChange}
                error={validationErrors.rt_rw_asal?.[0]}
              />
            </div>

            <div>
              <FormInput
                label="Kelurahan / Desa Asal"
                name="kelurahan_asal"
                value={formData.kelurahan_asal}
                onChange={handleChange}
                error={validationErrors.kelurahan_asal?.[0]}
              />
            </div>

            <div>
              <FormInput
                label="Kecamatan Asal"
                name="kecamatan_asal"
                value={formData.kecamatan_asal}
                onChange={handleChange}
                error={validationErrors.kecamatan_asal?.[0]}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <FormInput
                label="Kota / Kabupaten Asal"
                name="kota_kabupaten_asal"
                value={formData.kota_kabupaten_asal}
                onChange={handleChange}
                error={validationErrors.kota_kabupaten_asal?.[0]}
              />
            </div>
          </div>
        </div>

        {/* BAGIAN D: ANGGOTA KELUARGA YANG IKUT PINDAH */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700">
                D
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-800">DATA ANGGOTA KELUARGA YANG IKUT PINDAH</h2>
                <p className="text-xs text-slate-500">
                  Daftar keluarga (istri, anak, famili) yang turut bertempat tinggal bersama pelapor
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddAnggota}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Anggota
            </button>
          </div>

          {anggotaList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
              <p className="text-sm font-medium text-slate-500">
                Belum ada anggota keluarga tambahan yang didaftarkan.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Klik tombol &quot;+ Tambah Anggota&quot; di atas jika pelapor pindah bersama keluarga lainnya.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {anggotaList.map((ang, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl border border-slate-200 bg-slate-50/40 p-5 transition hover:border-slate-300"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                      Anggota #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAnggota(idx)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
                    >
                      Hapus Baris
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                      <FormInput
                        label="Nama Anggota"
                        value={ang.nama}
                        onChange={(e) => handleAnggotaChange(idx, 'nama', e.target.value)}
                        placeholder="Nama lengkap"
                        required
                      />
                    </div>
                    <div>
                      <FormInput
                        label="NIK (16 digit)"
                        value={ang.nik}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                          handleAnggotaChange(idx, 'nik', val)
                        }}
                        placeholder="NIK 16 digit"
                        maxLength={16}
                      />
                    </div>
                    <div>
                      <FormInput
                        label="Tempat Lahir"
                        value={ang.tempat_lahir}
                        onChange={(e) => handleAnggotaChange(idx, 'tempat_lahir', e.target.value)}
                        placeholder="Tempat lahir"
                      />
                    </div>
                    <div>
                      <FormInput
                        label="Tanggal Lahir"
                        type="date"
                        value={ang.tanggal_lahir}
                        onChange={(e) => handleAnggotaChange(idx, 'tanggal_lahir', e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-5">
                      <FormSelect
                        label="Hubungan Keluarga"
                        value={ang.hubungan_keluarga}
                        onChange={(e) => handleAnggotaChange(idx, 'hubungan_keluarga', e.target.value)}
                        options={STATUS_HUBUNGAN_KELUARGA}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BAGIAN E: DOKUMEN CHECKLIST & UPLOAD */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700">
              E
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800">DOKUMEN YANG DILAMPIRKAN</h2>
              <p className="text-xs text-slate-500">
                Pemeriksaan fisik dokumen yang diserahkan dan unggah berkas pindaian baru jika ingin memperbarui
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Checklist 1: KTP */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="lampiran_ktp"
                  checked={checklist.lampiran_ktp}
                  onChange={handleChecklistChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-sm font-bold text-slate-800">Fotokopi KTP</span>
                  <p className="text-xs text-slate-500">Kartu Tanda Penduduk pelapor</p>
                </div>
              </label>
              {existingFiles.file_ktp && (
                <div className="mt-3">
                  <a
                    href={getStorageUrl(existingFiles.file_ktp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <span>Berkas KTP saat ini tersedia</span>
                  </a>
                </div>
              )}
              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Ganti Berkas KTP (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={(e) => handleFileChange(e, 'file_ktp')}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
            </div>

            {/* Checklist 2: KK */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="lampiran_kk"
                  checked={checklist.lampiran_kk}
                  onChange={handleChecklistChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-sm font-bold text-slate-800">Fotokopi KK</span>
                  <p className="text-xs text-slate-500">Kartu Keluarga asal / terbaru</p>
                </div>
              </label>
              {existingFiles.file_kk && (
                <div className="mt-3">
                  <a
                    href={getStorageUrl(existingFiles.file_kk)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <span>Berkas KK saat ini tersedia</span>
                  </a>
                </div>
              )}
              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Ganti Berkas KK (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={(e) => handleFileChange(e, 'file_kk')}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
            </div>

            {/* Checklist 3: Surat Pindah */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="lampiran_surat_pindah"
                  checked={checklist.lampiran_surat_pindah}
                  onChange={handleChecklistChange}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-sm font-bold text-slate-800">Surat Keterangan Pindah</span>
                  <p className="text-xs text-slate-500">Dari daerah asal</p>
                </div>
              </label>
              {existingFiles.file_surat_pindah && (
                <div className="mt-3">
                  <a
                    href={getStorageUrl(existingFiles.file_surat_pindah)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <span>Berkas Surat Pindah saat ini tersedia</span>
                  </a>
                </div>
              )}
              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Ganti Berkas Surat (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={(e) => handleFileChange(e, 'file_surat_pindah')}
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
            </div>
          </div>

          {/* Tanda Tangan Pelapor Component */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <SignaturePad
              label="Tanda Tangan Pelapor (Digital / Upload Berkas)"
              initialUrl={existingSignature}
              onChange={(val) => {
                setSignatureData(val)
                if (val) setLampiranTtd(true)
              }}
              onChecklistChange={(checked) => setLampiranTtd(checked)}
              isChecklistChecked={lampiranTtd}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <FormInput
                label="Tanggal Pelaporan ke Kantor Banjar"
                name="tanggal_lapor"
                type="date"
                value={formData.tanggal_lapor}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <FormInput
                label="Catatan Tambahan Admin (Opsional)"
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
                placeholder="Catatan verifikasi atau keterangan khusus"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT ACTIONS */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end border-t border-slate-200 pt-6">
          <Link
            href={`/admin/lapor-diri/${id}`}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 transition"
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Menyimpan Perubahan...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Simpan Perubahan Formulir
              </>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
