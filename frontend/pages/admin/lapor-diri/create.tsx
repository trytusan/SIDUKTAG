import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import FormInput from '../../../src/components/form/input'
import FormTextarea from '../../../src/components/form/textarea'
import FormSelect from '../../../src/components/form/select'
import AlertError from '../../../src/components/ui/alert-error'
import { useAlert } from '../../../src/context/AlertContext'
import api from '../../../src/lib/api'
import { DAFTAR_PEKERJAAN_DUKCAPIL, STATUS_HUBUNGAN_KELUARGA } from '../../../src/constants/dukcapil'
import SignaturePad from '../../../src/components/form/signature-pad'

const FormMapPicker = dynamic(
  () => import('../../../src/components/maps/form-map-picker'),
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
  nama: string
  nik?: string
  nomor_paspor?: string
  tempat_lahir: string
  tanggal_lahir: string
  hubungan_keluarga: string
}

export default function AdminLaporDiriCreate() {
  const router = useRouter()
  const { showAlert } = useAlert()

  const [formData, setFormData] = useState({
    // Status Kewarganegaraan
    kewarganegaraan: 'WNI',

    // Bagian A: Data Pribadi
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

    // Khusus WNA
    negara_asal: '',
    nomor_paspor: '',
    masa_berlaku_paspor: '',
    jenis_izin_tinggal: 'KITAS',
    nomor_izin_tinggal: '',
    masa_berlaku_izin: '',

    // Status Bekerja
    status_bekerja: 'Bekerja',
    nama_perusahaan: '',
    jabatan_pekerjaan: '',
    nomor_dokumen_kerja: '',

    // Penjamin / Sponsor WNA
    nama_penjamin: '',
    kategori_penjamin: 'Perorangan (WNI)',
    nik_penjamin: '',
    telepon_penjamin: '',
    alamat_penjamin: '',

    // Bagian B: Data Tempat Tinggal Baru
    alamat_baru: '',
    tanggal_mulai_tinggal: new Date().toISOString().split('T')[0],
    status_tempat_tinggal: 'Kost',
    nama_pemilik_rumah: '',
    nomor_kontak_pemilik: '',

    // Bagian C: Data Asal
    alamat_asal: '',
    rt_rw_asal: '',
    kelurahan_asal: '',
    kecamatan_asal: '',
    kota_kabupaten_asal: '',

    // Status & Catatan
    tanggal_lapor: new Date().toISOString().split('T')[0],
    catatan: '',
  })

  const isWna = formData.kewarganegaraan === 'WNA'

  // Geotagging Banjar Saba Penatih
  const [coords, setCoords] = useState({
    latitude: '-8.623347',
    longitude: '115.240787',
  })

  // Bagian D: Anggota Keluarga Ikut Pindah
  const [anggotaList, setAnggotaList] = useState<AnggotaItem[]>([])

  // Bagian E: Dokumen Kelengkapan
  const [checklist, setChecklist] = useState({
    // WNI
    lampiran_ktp: true,
    lampiran_kk: true,
    lampiran_surat_pindah: false,
    // WNA (Tanpa Pasfoto)
    lampiran_paspor: true,
    lampiran_kitas_kitap: true,
    lampiran_surat_permohonan: false,
    lampiran_ktp_penjamin: false,
    lampiran_dokumen_kerja: false,
    lampiran_dokumen_lainnya: false,
  })

  const [signatureData, setSignatureData] = useState<string | File | null>(null)
  const [lampiranTtd, setLampiranTtd] = useState(false)

  const [files, setFiles] = useState<{
    file_ktp: File | null
    file_kk: File | null
    file_surat_pindah: File | null
    file_paspor: File | null
    file_kitas_kitap: File | null
    file_surat_permohonan: File | null
    file_ktp_penjamin: File | null
    file_dokumen_kerja: File | null
    file_dokumen_lainnya: File | null
  }>({
    file_ktp: null,
    file_kk: null,
    file_surat_pindah: null,
    file_paspor: null,
    file_kitas_kitap: null,
    file_surat_permohonan: null,
    file_ktp_penjamin: null,
    file_dokumen_kerja: null,
    file_dokumen_lainnya: null,
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [field]: e.target.files![0] }))
    } else {
      setFiles((prev) => ({ ...prev, [field]: null }))
    }
  }

  // Helper Dinamis Anggota Keluarga
  const handleAddAnggota = () => {
    setAnggotaList((prev) => [
      ...prev,
      {
        nama: '',
        nik: '',
        nomor_paspor: '',
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

      // Tambahkan Form Data Utama
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== undefined) {
          fd.append(key, String(val))
        }
      })

      // Tambahkan Koordinat
      if (coords.latitude) fd.append('latitude', coords.latitude)
      if (coords.longitude) fd.append('longitude', coords.longitude)

      // Tambahkan Checklist Dokumen WNI
      fd.append('lampiran_ktp', checklist.lampiran_ktp ? '1' : '0')
      fd.append('lampiran_kk', checklist.lampiran_kk ? '1' : '0')
      fd.append('lampiran_surat_pindah', checklist.lampiran_surat_pindah ? '1' : '0')

      // Tambahkan Checklist Dokumen WNA
      fd.append('lampiran_paspor', checklist.lampiran_paspor ? '1' : '0')
      fd.append('lampiran_kitas_kitap', checklist.lampiran_kitas_kitap ? '1' : '0')
      fd.append('lampiran_surat_permohonan', checklist.lampiran_surat_permohonan ? '1' : '0')
      fd.append('lampiran_ktp_penjamin', checklist.lampiran_ktp_penjamin ? '1' : '0')
      fd.append('lampiran_dokumen_kerja', checklist.lampiran_dokumen_kerja ? '1' : '0')
      fd.append('lampiran_dokumen_lainnya', checklist.lampiran_dokumen_lainnya ? '1' : '0')

      fd.append('lampiran_ttd', lampiranTtd || signatureData ? '1' : '0')

      // Tambahkan File Dokumen jika diupload
      if (files.file_ktp) fd.append('file_ktp', files.file_ktp)
      if (files.file_kk) fd.append('file_kk', files.file_kk)
      if (files.file_surat_pindah) fd.append('file_surat_pindah', files.file_surat_pindah)
      if (files.file_paspor) fd.append('file_paspor', files.file_paspor)
      if (files.file_kitas_kitap) fd.append('file_kitas_kitap', files.file_kitas_kitap)
      if (files.file_surat_permohonan) fd.append('file_surat_permohonan', files.file_surat_permohonan)
      if (files.file_ktp_penjamin) fd.append('file_ktp_penjamin', files.file_ktp_penjamin)
      if (files.file_dokumen_kerja) fd.append('file_dokumen_kerja', files.file_dokumen_kerja)
      if (files.file_dokumen_lainnya) fd.append('file_dokumen_lainnya', files.file_dokumen_lainnya)

      if (signatureData) {
        if (typeof signatureData === 'string') {
          fd.append('tanda_tangan_data', signatureData)
        } else {
          fd.append('file_tanda_tangan', signatureData)
        }
      }

      // Tambahkan Anggota Keluarga
      anggotaList.forEach((ang, idx) => {
        if (ang.nama.trim()) {
          fd.append(`anggota[${idx}][nama]`, ang.nama)
          if (ang.nik) fd.append(`anggota[${idx}][nik]`, ang.nik)
          if (ang.nomor_paspor) fd.append(`anggota[${idx}][nomor_paspor]`, ang.nomor_paspor)
          if (ang.tempat_lahir) fd.append(`anggota[${idx}][tempat_lahir]`, ang.tempat_lahir)
          if (ang.tanggal_lahir) fd.append(`anggota[${idx}][tanggal_lahir]`, ang.tanggal_lahir)
          if (ang.hubungan_keluarga) fd.append(`anggota[${idx}][hubungan_keluarga]`, ang.hubungan_keluarga)
        }
      })

      const res = await api.post('/admin/lapor-diri', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      showAlert({
        type: 'success',
        title: 'Berhasil Disimpan!',
        message: 'Data formulir lapor diri berhasil ditambahkan.',
      })

      const createdId = res.data?.data?.id
      if (createdId) {
        router.push(`/admin/lapor-diri/${createdId}`)
      } else {
        router.push('/admin/lapor-diri')
      }
    } catch (err: any) {
      console.error('Gagal menyimpan lapor diri:', err)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
        setError('Terdapat kesalahan pengisian formulir. Silakan periksa kembali bagian yang ditandai merah.')
      } else {
        setError(err.response?.data?.message || 'Terjadi kesalahan sistem saat menyimpan data.')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout
      pageTitle="Tambah Formulir Lapor Diri"
      subtitle="Input data formulir fisik lapor diri warga baru di Banjar Saba Penatih"
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
            <li className="text-slate-800 font-semibold">Tambah Baru</li>
          </ol>
        </nav>
        <PageHeader
          title="Tambah Formulir Lapor Diri"
          description="Input data warga baru yang telah mengisi formulir fisik dan melapor ke kantor Banjar Saba Penatih."
        />
      </div>

      {error && <AlertError message={error} errors={validationErrors} onClose={() => setError(null)} />}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* PILIHAN KEWARGANEGARAAN (WNI / WNA) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Status Kewarganegaraan Pelapor <span className="text-rose-500">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-4">
            Pilih status kewarganegaraan pelapor untuk menyesuaikan isian identitas (KTP/KK untuk WNI atau Paspor/Izin Tinggal untuk WNA).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, kewarganegaraan: 'WNI' }))}
              className={`flex items-start gap-4 rounded-2xl p-4 text-left transition border-2 ${
                formData.kewarganegaraan === 'WNI'
                  ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
              }`}
            >
              <div
                className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border ${
                  formData.kewarganegaraan === 'WNI'
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {formData.kewarganegaraan === 'WNI' && (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900">Warga Negara Indonesia (WNI)</span>
                <p className="text-xs text-slate-500 mt-1">
                  Warga negara Indonesia dengan identitas KTP dan Kartu Keluarga (KK).
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, kewarganegaraan: 'WNA' }))}
              className={`flex items-start gap-4 rounded-2xl p-4 text-left transition border-2 ${
                formData.kewarganegaraan === 'WNA'
                  ? 'border-blue-600 bg-blue-50/50 text-slate-900 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
              }`}
            >
              <div
                className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border ${
                  formData.kewarganegaraan === 'WNA'
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {formData.kewarganegaraan === 'WNA' && (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900">Warga Negara Asing (WNA)</span>
                <p className="text-xs text-slate-500 mt-1">
                  Warga negara asing pemegang Paspor, KITAS / KITAP, dengan penjamin/sponsor & status kerja.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* BAGIAN A: DATA PRIBADI */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold ${
                isWna ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                A
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  DATA PRIBADI PELAPOR ({isWna ? 'WARGA NEGARA ASING' : 'WNI'})
                </h2>
                <p className="text-xs text-slate-500">Identitas utama pemohon lapor diri warga baru</p>
              </div>
            </div>
            <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ${
              isWna ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {isWna ? 'Status: WNA' : 'Status: WNI'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-2">
              <FormInput
                label={`Nama Lengkap Sesuai ${isWna ? 'Paspor' : 'KTP'}`}
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                placeholder={isWna ? 'Contoh: John Michael Smith' : 'Contoh: I Putu Agus Sudarmawan'}
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

            {/* Khusus WNA: Negara Asal */}
            {isWna && (
              <div>
                <FormInput
                  label="Negara Asal / Kewarganegaraan"
                  name="negara_asal"
                  value={formData.negara_asal}
                  onChange={handleChange}
                  placeholder="Contoh: Australia / Japan / Germany"
                  required={isWna}
                  error={validationErrors.negara_asal?.[0]}
                />
              </div>
            )}

            <div>
              <FormInput
                label="Tempat Lahir"
                name="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={handleChange}
                placeholder={isWna ? 'Kota / Negara Kelahiran' : 'Contoh: Denpasar'}
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
                label={`Agama ${isWna ? '(Opsional)' : ''}`}
                name="agama"
                value={formData.agama}
                onChange={handleChange}
                required={!isWna}
                error={validationErrors.agama?.[0]}
                options={[
                  { value: 'Hindu', label: 'Hindu' },
                  { value: 'Islam', label: 'Islam' },
                  { value: 'Kristen Protestan', label: 'Kristen Protestan' },
                  { value: 'Katolik', label: 'Katolik' },
                  { value: 'Buddha', label: 'Buddha' },
                  { value: 'Konghucu', label: 'Konghucu' },
                  { value: 'Lainnya', label: 'Lainnya' },
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
                label={`Pekerjaan ${isWna ? '(Opsional)' : ''}`}
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
                placeholder="Pilih atau cari pekerjaan"
                required={!isWna}
                error={validationErrors.pekerjaan?.[0]}
                options={DAFTAR_PEKERJAAN_DUKCAPIL}
              />
            </div>

            {/* Identitas Dokumen WNI vs WNA */}
            {!isWna ? (
              <>
                <div>
                  <FormInput
                    label="Nomor Induk Kependudukan (NIK)"
                    name="nik"
                    value={formData.nik}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                      setFormData((prev) => ({ ...prev, nik: val }))
                    }}
                    placeholder="16 digit NIK"
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
                    placeholder="16 digit Nomor KK (opsional)"
                    maxLength={16}
                    helperText={formData.nomor_kk ? `${formData.nomor_kk.length}/16 digit` : 'Sesuai KK asal / KK baru'}
                    error={validationErrors.nomor_kk?.[0]}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <FormInput
                    label="Nomor Paspor"
                    name="nomor_paspor"
                    value={formData.nomor_paspor}
                    onChange={handleChange}
                    placeholder="Contoh: E12345678"
                    required={isWna}
                    error={validationErrors.nomor_paspor?.[0]}
                  />
                </div>

                <div>
                  <FormInput
                    label="Masa Berlaku Paspor"
                    name="masa_berlaku_paspor"
                    type="date"
                    value={formData.masa_berlaku_paspor}
                    onChange={handleChange}
                    error={validationErrors.masa_berlaku_paspor?.[0]}
                  />
                </div>

                <div>
                  <FormSelect
                    label="Jenis Izin Tinggal Keimigrasian"
                    name="jenis_izin_tinggal"
                    value={formData.jenis_izin_tinggal}
                    onChange={handleChange}
                    options={[
                      { value: 'KITAS', label: 'KITAS (Kartu Izin Tinggal Terbatas)' },
                      { value: 'KITAP', label: 'KITAP (Kartu Izin Tinggal Tetap)' },
                      { value: 'VITAS', label: 'VITAS (Visa Tinggal Terbatas)' },
                      { value: 'Visa Kunjungan / VOA', label: 'Visa Kunjungan / VOA' },
                      { value: 'Lainnya', label: 'Lainnya' },
                    ]}
                  />
                </div>

                <div>
                  <FormInput
                    label="Nomor Izin Tinggal / KITAS / KITAP"
                    name="nomor_izin_tinggal"
                    value={formData.nomor_izin_tinggal}
                    onChange={handleChange}
                    placeholder="Nomor dokumen izin tinggal"
                    error={validationErrors.nomor_izin_tinggal?.[0]}
                  />
                </div>

                <div>
                  <FormInput
                    label="Masa Berlaku Izin Tinggal"
                    name="masa_berlaku_izin"
                    type="date"
                    value={formData.masa_berlaku_izin}
                    onChange={handleChange}
                    error={validationErrors.masa_berlaku_izin?.[0]}
                  />
                </div>

                <div>
                  <FormInput
                    label="NIK / SKTT Dukcapil (Jika Ada)"
                    name="nik"
                    value={formData.nik}
                    onChange={handleChange}
                    placeholder="Surat Keterangan Tempat Tinggal (SKTT)"
                    error={validationErrors.nik?.[0]}
                  />
                </div>
              </>
            )}

            <div>
              <FormInput
                label="No. Telepon / WhatsApp Pelapor"
                name="nomor_telepon"
                value={formData.nomor_telepon}
                onChange={handleChange}
                placeholder="Contoh: +62 812 3456 7890"
                error={validationErrors.nomor_telepon?.[0]}
              />
            </div>
          </div>
        </div>

        {/* KHUSUS WNA: STATUS BEKERJA & DOKUMEN KERJA */}
        {isWna && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50/20 p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-blue-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  💼
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">STATUS BEKERJA & DOKUMEN KETENAGAKERJAAN (TKA)</h2>
                  <p className="text-xs text-slate-500">
                    Pencatatan status keaktifan bekerja dan dokumen izin kerja WNA di Indonesia
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold ${
                formData.status_bekerja === 'Bekerja'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}>
                {formData.status_bekerja === 'Bekerja' ? '● Aktif Bekerja' : `Status: ${formData.status_bekerja}`}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <FormSelect
                  label="Status Bekerja di Indonesia"
                  name="status_bekerja"
                  value={formData.status_bekerja}
                  onChange={handleChange}
                  options={[
                    { value: 'Bekerja', label: 'Bekerja (Tenaga Kerja Asing / TKA)' },
                    { value: 'Tidak Bekerja', label: 'Tidak Bekerja / Ikut Pasangan / Pensiunan' },
                    { value: 'Pelajar/Mahasiswa', label: 'Pelajar / Mahasiswa' },
                    { value: 'Wisatawan/Turis', label: 'Wisatawan / Wisatawan Jangka Panjang' },
                    { value: 'Lainnya', label: 'Lainnya' },
                  ]}
                />
              </div>

              {formData.status_bekerja === 'Bekerja' && (
                <>
                  <div>
                    <FormInput
                      label="Nama Perusahaan / Pemberi Kerja"
                      name="nama_perusahaan"
                      value={formData.nama_perusahaan}
                      onChange={handleChange}
                      placeholder="Contoh: PT. Bali Digital Solutions"
                      required={formData.status_bekerja === 'Bekerja'}
                      error={validationErrors.nama_perusahaan?.[0]}
                    />
                  </div>

                  <div>
                    <FormInput
                      label="Jabatan / Posisi Kerja"
                      name="jabatan_pekerjaan"
                      value={formData.jabatan_pekerjaan}
                      onChange={handleChange}
                      placeholder="Contoh: General Manager / Specialist"
                      required={formData.status_bekerja === 'Bekerja'}
                      error={validationErrors.jabatan_pekerjaan?.[0]}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FormInput
                      label="Nomor Dokumen Kerja (RPTKA / Notifikasi Kemenaker)"
                      name="nomor_dokumen_kerja"
                      value={formData.nomor_dokumen_kerja}
                      onChange={handleChange}
                      placeholder="Nomor pengesahan RPTKA atau Notifikasi Ketenagakerjaan"
                      error={validationErrors.nomor_dokumen_kerja?.[0]}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* KHUSUS WNA: PENJAMIN / SPONSOR */}
        {isWna && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-sm font-bold text-purple-700">
                🤝
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-800">DATA PENJAMIN / SPONSOR WNA</h2>
                <p className="text-xs text-slate-500">
                  WNA wajib memiliki penjamin/sponsor perorangan WNI atau perusahaan/lembaga penjamin
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <FormInput
                  label="Nama Penjamin / Sponsor"
                  name="nama_penjamin"
                  value={formData.nama_penjamin}
                  onChange={handleChange}
                  placeholder="Nama lengkap penjamin / penanggung jawab"
                  error={validationErrors.nama_penjamin?.[0]}
                />
              </div>

              <div>
                <FormSelect
                  label="Kategori Penjamin"
                  name="kategori_penjamin"
                  value={formData.kategori_penjamin}
                  onChange={handleChange}
                  options={[
                    { value: 'Perorangan (WNI)', label: 'Perorangan (WNI)' },
                    { value: 'Perusahaan / Korporasi', label: 'Perusahaan / Korporasi' },
                    { value: 'Lembaga Pendidikan', label: 'Lembaga Pendidikan' },
                    { value: 'Yayasan / Organisasi', label: 'Yayasan / Organisasi' },
                    { value: 'Lainnya', label: 'Lainnya' },
                  ]}
                />
              </div>

              <div>
                <FormInput
                  label="NIK Penjamin (Jika Perorangan WNI)"
                  name="nik_penjamin"
                  value={formData.nik_penjamin}
                  onChange={handleChange}
                  placeholder="16 digit NIK Penjamin"
                  error={validationErrors.nik_penjamin?.[0]}
                />
              </div>

              <div>
                <FormInput
                  label="Nomor Telepon / Kontak Penjamin"
                  name="telepon_penjamin"
                  value={formData.telepon_penjamin}
                  onChange={handleChange}
                  placeholder="Contoh: 081234567890"
                  error={validationErrors.telepon_penjamin?.[0]}
                />
              </div>

              <div className="sm:col-span-2">
                <FormInput
                  label="Alamat Penjamin / Kantor Sponsor"
                  name="alamat_penjamin"
                  value={formData.alamat_penjamin}
                  onChange={handleChange}
                  placeholder="Alamat domisili penjamin atau alamat kantor perusahaan penjamin"
                  error={validationErrors.alamat_penjamin?.[0]}
                />
              </div>
            </div>
          </div>
        )}

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
                placeholder="Contoh: Jl. Trenggana Gang Melati No. 12, Lingkungan Saba, Kelurahan Penatih"
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
                    placeholder="Nama pemilik tempat tinggal"
                    error={validationErrors.nama_pemilik_rumah?.[0]}
                  />
                </div>

                <div>
                  <FormInput
                    label="Nomor Kontak Pemilik Rumah / Kos"
                    name="nomor_kontak_pemilik"
                    value={formData.nomor_kontak_pemilik}
                    onChange={handleChange}
                    placeholder="Contoh: 081987654321"
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
              <p className="mb-3 text-xs text-slate-500">
                Klik pada peta atau geser pin marker ke lokasi tempat tinggal warga baru di lingkungan Banjar Saba Penatih.
              </p>
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
                placeholder="Contoh: Jl. Melati No. 45, Banjar Tengah"
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
                placeholder="Contoh: RT 03 / RW 02"
                error={validationErrors.rt_rw_asal?.[0]}
              />
            </div>

            <div>
              <FormInput
                label="Kelurahan / Desa Asal"
                name="kelurahan_asal"
                value={formData.kelurahan_asal}
                onChange={handleChange}
                placeholder="Contoh: Dangin Puri"
                error={validationErrors.kelurahan_asal?.[0]}
              />
            </div>

            <div>
              <FormInput
                label="Kecamatan Asal"
                name="kecamatan_asal"
                value={formData.kecamatan_asal}
                onChange={handleChange}
                placeholder="Contoh: Denpasar Utara"
                error={validationErrors.kecamatan_asal?.[0]}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <FormInput
                label="Kota / Kabupaten Asal"
                name="kota_kabupaten_asal"
                value={formData.kota_kabupaten_asal}
                onChange={handleChange}
                placeholder="Contoh: Kota Denpasar / Kab. Tabanan"
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
                Klik tombol &quot;+ Tambah Anggota&quot; di atas jika pelapor pindah bersama istri, anak, atau anggota keluarga lainnya.
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
                        label={isWna ? 'Nomor Paspor / NIK' : 'NIK (16 digit)'}
                        value={isWna ? (ang.nomor_paspor || ang.nik || '') : (ang.nik || '')}
                        onChange={(e) => {
                          const val = e.target.value
                          if (isWna) {
                            handleAnggotaChange(idx, 'nomor_paspor', val)
                          } else {
                            handleAnggotaChange(idx, 'nik', val.replace(/\D/g, '').slice(0, 16))
                          }
                        }}
                        placeholder={isWna ? 'Nomor Paspor' : 'NIK 16 digit'}
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

        {/* BAGIAN E: DOKUMEN CHECKLIST & UPLOAD (TANPA PASFOTO) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700">
                E
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  DOKUMEN YANG DILAMPIRKAN ({isWna ? 'PERSYARATAN WNA' : 'PERSYARATAN WNI'})
                </h2>
                <p className="text-xs text-slate-500">
                  Pemeriksaan fisik dokumen yang diserahkan dan unggah berkas pindaian (opsional)
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              ℹ️ Tanpa Pasfoto Sesuai Ketentuan
            </span>
          </div>

          {!isWna ? (
            /* DOKUMEN WNI */
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
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Upload Berkas KTP (JPG/PNG/PDF, Max 4MB)
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
                    <span className="text-sm font-bold text-slate-800">Fotokopi Kartu Keluarga</span>
                    <p className="text-xs text-slate-500">Kartu Keluarga asal / terbaru</p>
                  </div>
                </label>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Upload Berkas KK (JPG/PNG/PDF, Max 4MB)
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
                    <p className="text-xs text-slate-500">Dari desa/kelurahan daerah asal</p>
                  </div>
                </label>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Upload Berkas Surat (JPG/PNG/PDF, Max 4MB)
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
          ) : (
            /* DOKUMEN WNA SESUAI KETENTUAN (TANPA PASFOTO) */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* 1. Paspor */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="lampiran_paspor"
                    checked={checklist.lampiran_paspor}
                    onChange={handleChecklistChange}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-800">1. Fotokopi Paspor</span>
                    <p className="text-xs text-slate-500">Halaman identitas & visa/stempel izin masuk</p>
                  </div>
                </label>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Upload Berkas Paspor</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={(e) => handleFileChange(e, 'file_paspor')}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* 2. KITAS / KITAP */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="lampiran_kitas_kitap"
                    checked={checklist.lampiran_kitas_kitap}
                    onChange={handleChecklistChange}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-800">2. Dokumen KITAS / KITAP</span>
                    <p className="text-xs text-slate-500">Kartu izin tinggal terbatas/tetap atau e-ITAS</p>
                  </div>
                </label>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Upload Berkas KITAS/KITAP</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={(e) => handleFileChange(e, 'file_kitas_kitap')}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* 3. Surat Permohonan / Pernyataan Sponsor */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="lampiran_surat_permohonan"
                    checked={checklist.lampiran_surat_permohonan}
                    onChange={handleChecklistChange}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-800">3. Surat Permohonan / Jaminan</span>
                    <p className="text-xs text-slate-500">Surat permohonan dari sponsor / penjamin</p>
                  </div>
                </label>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Upload Surat Permohonan</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={(e) => handleFileChange(e, 'file_surat_permohonan')}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* 4. KTP Penjamin */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="lampiran_ktp_penjamin"
                    checked={checklist.lampiran_ktp_penjamin}
                    onChange={handleChecklistChange}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-800">4. KTP / Identitas Penjamin</span>
                    <p className="text-xs text-slate-500">Identitas KTP WNI penjamin / legalitas sponsor</p>
                  </div>
                </label>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Upload KTP Penjamin</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={(e) => handleFileChange(e, 'file_ktp_penjamin')}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* 5. Dokumen Pendukung Bekerja (RPTKA/Notifikasi Kemenaker) */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="lampiran_dokumen_kerja"
                    checked={checklist.lampiran_dokumen_kerja}
                    onChange={handleChecklistChange}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-800">5. Dokumen Kerja (RPTKA/Kemenaker)</span>
                    <p className="text-xs text-slate-500">Notifikasi Kemenaker / RPTKA pemberi kerja</p>
                  </div>
                </label>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Upload Dokumen Kerja</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={(e) => handleFileChange(e, 'file_dokumen_kerja')}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* 6. Dokumen Pendukung Lainnya */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="lampiran_dokumen_lainnya"
                    checked={checklist.lampiran_dokumen_lainnya}
                    onChange={handleChecklistChange}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-800">6. Dokumen Pendukung Lainnya</span>
                    <p className="text-xs text-slate-500">Buku nikah / surat keterangan / penunjang</p>
                  </div>
                </label>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Upload Dokumen Lainnya</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={(e) => handleFileChange(e, 'file_dokumen_lainnya')}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tanda Tangan Pelapor Component */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <SignaturePad
              label="Tanda Tangan Pelapor (Digital / Upload Berkas)"
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
            href="/admin/lapor-diri"
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className={`flex items-center justify-center gap-2 rounded-2xl px-8 py-3 text-sm font-semibold text-white shadow-md focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 transition ${
              isWna
                ? 'bg-blue-600 shadow-blue-600/20 hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700 focus:ring-emerald-500'
            }`}
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
                Menyimpan Formulir...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isWna ? 'Simpan Formulir WNA' : 'Simpan Formulir Lapor Diri'}
              </>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  )
}
