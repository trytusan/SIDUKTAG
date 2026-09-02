import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import AdminLayout from '../../../../src/components/layouts/admin'
import PageHeader from '../../../../src/components/ui/page-header'
import FormInput from '../../../../src/components/form/input'
import FormTextarea from '../../../../src/components/form/textarea'
import FormSelect from '../../../../src/components/form/select'
import FormRadio from '../../../../src/components/form/radio'
import FormFile from '../../../../src/components/form/file'
import AlertError from '../../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api, { getStorageUrl } from '../../../../src/lib/api'
import { Penduduk } from '../../../../src/types'

const FormMapPicker = dynamic(
  () => import('../../../../src/components/maps/form-map-picker'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 text-xs">
        Memuat peta...
      </div>
    ),
  }
)

export default function AdminPendudukEdit() {
  const router = useRouter()
  const { id } = router.query
  const [penduduk, setPenduduk] = useState<Penduduk | null>(null)
  const [loadingInitial, setLoadingInitial] = useState(true)

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
    nomor_telepon: '',
    alamat_lengkap: '',
  })
  const [coords, setCoords] = useState({
    latitude: '-6.2088',
    longitude: '106.8456',
  })
  const [fotoProfil, setFotoProfil] = useState<File | null>(null)
  const [dokumen, setDokumen] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!id) return
    async function fetchEdit() {
      try {
        const res = await api.get('/admin/penduduk/' + id + '/edit')
        const p: Penduduk = res.data.penduduk
        setPenduduk(p)
        if (p) {
          setFormData({
            nama_lengkap: p.nama_lengkap || '',
            nik: p.nik || '',
            nomor_kk: p.nomor_kk || '',
            tempat_lahir: p.tempat_lahir || '',
            tanggal_lahir: p.tanggal_lahir ? p.tanggal_lahir.substring(0, 10) : '',
            jenis_kelamin: p.jenis_kelamin || 'Laki-laki',
            agama: p.agama || 'Islam',
            status_perkawinan: p.status_perkawinan || 'Belum Kawin',
            pekerjaan: p.pekerjaan || '',
            pendidikan_terakhir: p.pendidikan_terakhir || 'SMA / Sederajat',
            status_dalam_keluarga: p.status_dalam_keluarga || 'Kepala Keluarga',
            status_kependudukan: p.status_kependudukan || 'Tetap',
            nomor_telepon: p.nomor_telepon || '',
            alamat_lengkap: p.alamat_lengkap || '',
          })
          if (p.latitude && p.longitude) {
            setCoords({
              latitude: String(p.latitude),
              longitude: String(p.longitude),
            })
          }
        }
      } catch (err) {
        console.error('Failed to load edit data:', err)
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchEdit()
  }, [id])

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
      payload.append('_method', 'PUT')
      Object.entries(formData).forEach(([k, v]) => {
        payload.append(k, v)
      })
      payload.append('latitude', coords.latitude)
      payload.append('longitude', coords.longitude)
      if (fotoProfil) payload.append('foto_profil', fotoProfil)
      if (dokumen) payload.append('dokumen', dokumen)

      await api.post('/admin/penduduk/' + id, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      router.push('/admin/penduduk')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal memperbarui data penduduk.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial || !penduduk) {
    return (
      <AdminLayout pageTitle="Edit Penduduk">
        <LoadingSpinner message="Memuat form edit data penduduk..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout pageTitle="Edit Penduduk" subtitle={'Ubah data ' + penduduk.nama_lengkap}>
      <PageHeader
        title="Formulir Edit Penduduk"
        description="Perbarui informasi data diri, keluarga, atau koordinat lokasi"
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
                maxLength={16}
                required
                error={validationErrors.nik?.[0]}
              />

              <FormInput
                label="Nomor Kartu Keluarga (No. KK)"
                name="nomor_kk"
                value={formData.nomor_kk}
                onChange={handleChange}
                maxLength={16}
                required
                error={validationErrors.nomor_kk?.[0]}
              />
            </div>

            <FormInput
              label="Nama Lengkap"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              required
              error={validationErrors.nama_lengkap?.[0]}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Tempat Lahir"
                name="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={handleChange}
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
                currentFileUrl={penduduk.foto_profil ? getStorageUrl(penduduk.foto_profil) : null}
                onChange={(e) => {
                  if (e.target.files?.[0]) setFotoProfil(e.target.files[0])
                }}
              />

              <FormFile
                label="Dokumen Pendukung (KK/KTP)"
                accept="image/*,application/pdf"
                currentFileUrl={penduduk.dokumen_pendukung ? getStorageUrl(penduduk.dokumen_pendukung) : null}
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
                label="Perbarui Titik Lokasi Rumah Warga"
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
              {submitting ? 'Menyimpan...' : 'Perbarui Data Penduduk'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
