import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import FormInput from '../../../src/components/form/input'
import FormTextarea from '../../../src/components/form/textarea'
import FormSelect from '../../../src/components/form/select'
import FormRadio from '../../../src/components/form/radio'
import FormFile from '../../../src/components/form/file'
import AlertError from '../../../src/components/ui/alert-error'
import api from '../../../src/lib/api'

const FormMapPicker = dynamic(
  () => import('../../../src/components/maps/form-map-picker'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 text-xs">
        Memuat peta...
      </div>
    ),
  }
)

export default function AdminPendudukCreate() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nik: '',
    nomor_kk: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: 'Laki-laki',
    agama: 'Islam',
    status_perkawinan: 'Belum Kawin',
    pekerjaan: '',
    pendidikan_terakhir: 'SMA / Sederajat',
    status_dalam_keluarga: 'Kepala Keluarga',
    status_kependudukan: 'Tetap',
    tanggal_meninggal: '',
    tempat_meninggal: '',
    tanggal_pindah: '',
    alamat_tujuan: '',
    daerah_asal: '',
    tujuan_menetap: '',
    nomor_telepon: '',
    alamat_lengkap: '',
  })
  const [coords, setCoords] = useState({
    latitude: '-6.2088',
    longitude: '106.8456',
  })
  const [fotoProfil, setFotoProfil] = useState<File | null>(null)
  const [dokumen, setDokumen] = useState<File | null>(null)
  const [aktaKematian, setAktaKematian] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setValidationErrors({})

    try {
      const payload = new FormData()
      Object.entries(formData).forEach(([k, v]) => {
        payload.append(k, v)
      })
      payload.append('latitude', coords.latitude)
      payload.append('longitude', coords.longitude)
      if (fotoProfil) payload.append('foto_profil', fotoProfil)
      if (dokumen) payload.append('dokumen', dokumen)
      if (formData.status_kependudukan === 'Meninggal' && aktaKematian) {
        payload.append('akta_kematian', aktaKematian)
      }

      await api.post('/admin/penduduk', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      router.push('/admin/penduduk')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal menambahkan data penduduk.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout pageTitle="Tambah Penduduk" subtitle="Pencatatan data warga baru ke dalam basis data">
      <PageHeader
        title="Formulir Tambah Penduduk"
        description="Lengkapi identitas, data keluarga, berkas, dan titik lokasi rumah"
        actions={[
          {
            label: 'Batal & Kembali',
            href: '/admin/penduduk',
            variant: 'secondary',
          },
        ]}
      />

      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <AlertError message={error} errors={validationErrors} />

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
              1. Identitas Pokok
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Nomor Induk Kependudukan (NIK)"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="16 Digit NIK"
                maxLength={16}
                required
                error={validationErrors.nik?.[0]}
              />

              <FormInput
                label="Nomor Kartu Keluarga (No. KK)"
                name="nomor_kk"
                value={formData.nomor_kk}
                onChange={handleChange}
                placeholder="16 Digit Nomor KK"
                maxLength={16}
                required
                error={validationErrors.nomor_kk?.[0]}
              />
            </div>

            <FormInput
              label="Nama Lengkap (Sesuai KTP/Akta)"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              placeholder="Nama lengkap warga"
              required
              error={validationErrors.nama_lengkap?.[0]}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Tempat Lahir"
                name="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={handleChange}
                placeholder="Kota/Kabupaten"
              />

              <FormInput
                label="Tanggal Lahir"
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleChange}
              />
            </div>

            <FormRadio
              label="Jenis Kelamin"
              name="jenis_kelamin"
              options={[
                { value: 'Laki-laki', label: 'Laki-laki' },
                { value: 'Perempuan', label: 'Perempuan' },
              ]}
              selectedValue={formData.jenis_kelamin}
              onChange={(e) => setFormData((prev) => ({ ...prev, jenis_kelamin: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
              2. Data Sosial & Domisili
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormSelect
                label="Agama"
                name="agama"
                value={formData.agama}
                onChange={handleChange}
                options={['Islam', 'Kristen Protestan', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']}
              />

              <FormSelect
                label="Status Perkawinan"
                name="status_perkawinan"
                value={formData.status_perkawinan}
                onChange={handleChange}
                options={['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati']}
              />

              <FormSelect
                label="Status Kependudukan"
                name="status_kependudukan"
                value={formData.status_kependudukan}
                onChange={handleChange}
                options={['Tetap', 'Pendatang', 'Pindah', 'Meninggal']}
              />
            </div>

            {/* Form Dinamis: Meninggal */}
            {formData.status_kependudukan === 'Meninggal' && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 space-y-4 transition-all">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <svg className="h-5 w-5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Informasi Kematian (Status: Meninggal)</span>
                </div>
                <p className="text-xs text-rose-600/90">
                  Wajib mengisi tanggal dan tempat/keterangan meninggal. Bukti akta kematian bersifat opsional dan dapat disusulkan.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Tanggal Meninggal *"
                    type="date"
                    name="tanggal_meninggal"
                    value={formData.tanggal_meninggal}
                    onChange={handleChange}
                    required
                    error={validationErrors.tanggal_meninggal?.[0]}
                  />
                  <FormInput
                    label="Keterangan / Tempat Meninggal *"
                    name="tempat_meninggal"
                    value={formData.tempat_meninggal}
                    onChange={handleChange}
                    placeholder="Contoh: RSUD Sambas / Sakit Tua / Rumah Duka"
                    required
                    error={validationErrors.tempat_meninggal?.[0]}
                  />
                </div>
                <div>
                  <FormFile
                    label="Bukti Akta Meninggal (Opsional / Dapat Menyusul)"
                    name="akta_kematian"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAktaKematian(e.target.files[0])
                      }
                    }}
                    helperText="Format berkas yang didukung: PDF, JPG, JPEG, atau PNG (Maks. 4 MB)"
                    error={validationErrors.akta_kematian?.[0]}
                  />
                </div>
              </div>
            )}

            {/* Form Dinamis: Pindah */}
            {formData.status_kependudukan === 'Pindah' && (
              <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-5 space-y-4 transition-all">
                <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
                  <svg className="h-5 w-5 text-sky-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span>Informasi Kepindahan (Status: Pindah)</span>
                </div>
                <p className="text-xs text-sky-600/90">
                  Wajib mengisi tanggal pindah dan alamat lengkap tujuan kepindahan.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Tanggal Pindah *"
                    type="date"
                    name="tanggal_pindah"
                    value={formData.tanggal_pindah}
                    onChange={handleChange}
                    required
                    error={validationErrors.tanggal_pindah?.[0]}
                  />
                  <FormTextarea
                    label="Alamat Tujuan *"
                    name="alamat_tujuan"
                    value={formData.alamat_tujuan}
                    onChange={handleChange}
                    placeholder="Contoh: Jl. Gajah Mada No. 10, Pontianak Barat, Kota Pontianak"
                    rows={2}
                    required
                    error={validationErrors.alamat_tujuan?.[0]}
                  />
                </div>
              </div>
            )}

            {/* Form Dinamis: Pendatang */}
            {formData.status_kependudukan === 'Pendatang' && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-4 transition-all">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <svg className="h-5 w-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Informasi Warga Pendatang (Status: Pendatang)</span>
                </div>
                <p className="text-xs text-emerald-600/90">
                  Wajib mengisi asal daerah dan alasan/tujuan menetap di wilayah ini.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Daerah Asal *"
                    name="daerah_asal"
                    value={formData.daerah_asal}
                    onChange={handleChange}
                    placeholder="Contoh: Kab. Singkawang, Kalimantan Barat"
                    required
                    error={validationErrors.daerah_asal?.[0]}
                  />
                  <FormInput
                    label="Tujuan Menetap *"
                    name="tujuan_menetap"
                    value={formData.tujuan_menetap}
                    onChange={handleChange}
                    placeholder="Contoh: Bekerja di Perkebunan / Menikah / Mengikuti Keluarga"
                    required
                    error={validationErrors.tujuan_menetap?.[0]}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Pekerjaan"
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
              />

              <FormSelect
                label="Pendidikan Terakhir"
                name="pendidikan_terakhir"
                value={formData.pendidikan_terakhir}
                onChange={handleChange}
                options={[
                  'Tidak / Belum Sekolah',
                  'SD / Sederajat',
                  'SMP / Sederajat',
                  'SMA / Sederajat',
                  'Diploma (D1-D4)',
                  'Sarjana (S1)',
                  'Magister (S2)',
                  'Doktor (S3)',
                ]}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelect
                label="Status Hubungan dalam Keluarga"
                name="status_dalam_keluarga"
                value={formData.status_dalam_keluarga}
                onChange={handleChange}
                options={[
                  'Kepala Keluarga',
                  'Suami',
                  'Istri',
                  'Anak',
                  'Menantu',
                  'Cucu',
                  'Orang Tua',
                  'Mertua',
                  'Famili Lain',
                ]}
                required
              />

              <FormInput
                label="Nomor Telepon / HP"
                name="nomor_telepon"
                value={formData.nomor_telepon}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <FormTextarea
              label="Alamat Lengkap"
              name="alamat_lengkap"
              value={formData.alamat_lengkap}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
              3. Berkas & Lokasi Geotagging
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormFile
                label="Foto Profil"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFotoProfil(e.target.files[0])
                }}
              />

              <FormFile
                label="Dokumen Pendukung (KK/KTP)"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) setDokumen(e.target.files[0])
                }}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
              <FormMapPicker
                latitude={coords.latitude}
                longitude={coords.longitude}
                onChange={(c) => setCoords(c)}
                label="Tandai Titik Lokasi Rumah Warga"
                height={320}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/admin/penduduk"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Penduduk'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
