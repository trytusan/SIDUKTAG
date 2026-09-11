import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import UserLayout from '../../../src/components/layouts/user'
import PageHeader from '../../../src/components/ui/page-header'
import FormInput from '../../../src/components/form/input'
import FormTextarea from '../../../src/components/form/textarea'
import FormSelect from '../../../src/components/form/select'
import FormRadio from '../../../src/components/form/radio'
import FormFile from '../../../src/components/form/file'
import AlertSuccess from '../../../src/components/ui/alert-success'
import AlertError from '../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../src/components/ui/loading'
import api, { getStorageUrl } from '../../../src/lib/api'
import { Penduduk } from '../../../src/types'
import { useAuth } from '../../../src/context/AuthContext'
import { DAFTAR_PEKERJAAN_DUKCAPIL } from '../../../src/constants/dukcapil'

export default function UserPengaturanProfil() {
  const { refreshUser } = useAuth()
  const [penduduk, setPenduduk] = useState<Penduduk | null>(null)
  const [loadingInitial, setLoadingInitial] = useState(true)

  const [formData, setFormData] = useState({
    nama_lengkap: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: 'Laki-laki',
    agama: 'Islam',
    status_perkawinan: 'Belum Kawin',
    pekerjaan: '',
    pendidikan_terakhir: 'SMA / Sederajat',
    nomor_telepon: '',
    alamat_lengkap: '',
  })
  const [fotoProfil, setFotoProfil] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    async function fetchProfil() {
      try {
        const res = await api.get('/user/pengaturan/profil')
        const p: Penduduk = res.data.penduduk
        setPenduduk(p)
        if (p) {
          setFormData({
            nama_lengkap: p.nama_lengkap || '',
            tempat_lahir: p.tempat_lahir || '',
            tanggal_lahir: p.tanggal_lahir ? p.tanggal_lahir.substring(0, 10) : '',
            jenis_kelamin: p.jenis_kelamin || 'Laki-laki',
            agama: p.agama || 'Islam',
            status_perkawinan: p.status_perkawinan || 'Belum Kawin',
            pekerjaan: p.pekerjaan || '',
            pendidikan_terakhir: p.pendidikan_terakhir || 'SMA / Sederajat',
            nomor_telepon: p.nomor_telepon || '',
            alamat_lengkap: p.alamat_lengkap || '',
          })
        }
      } catch (err) {
        console.error('Failed to load profil:', err)
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchProfil()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccess(null)
    setError(null)
    setValidationErrors({})

    try {
      const payload = new FormData()
      Object.entries(formData).forEach(([k, v]) => {
        payload.append(k, v)
      })
      if (fotoProfil) {
        payload.append('foto_profil', fotoProfil)
      }

      const res = await api.post('/user/pengaturan/profil', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setSuccess(res.data.message || 'Profil berhasil diperbarui.')
      await refreshUser()
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal memperbarui profil.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial) {
    return (
      <UserLayout pageTitle="Pengaturan Profil">
        <LoadingSpinner message="Memuat informasi profil..." />
      </UserLayout>
    )
  }

  return (
    <UserLayout pageTitle="Pengaturan" subtitle="Kelola informasi data kependudukan dan akun">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <Link
          href="/user/pengaturan/profil"
          className="border-b-2 border-emerald-600 px-6 py-3 text-sm font-bold text-emerald-600"
        >
          Profil Kependudukan
        </Link>
        <Link
          href="/user/pengaturan/akun"
          className="border-b-2 border-transparent px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          Informasi Akun
        </Link>
        <Link
          href="/user/pengaturan/password"
          className="border-b-2 border-transparent px-6 py-3 text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          Ganti Password
        </Link>
      </div>

      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Edit Profil Data Diri</h2>
          <p className="mt-1 text-xs text-slate-500">Perbarui data kependudukan Anda yang tersimpan di sistem</p>
        </div>

        <AlertSuccess message={success} onClose={() => setSuccess(null)} />
        <AlertError message={error} errors={validationErrors} onClose={() => setError(null)} />

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="rounded-2xl bg-slate-50 p-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400">NIK (Permanen)</span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{penduduk?.nik || '-'}</p>
            </div>
            <div>
              <span className="text-slate-400">Nomor KK (Permanen)</span>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{penduduk?.nomor_kk || '-'}</p>
            </div>
          </div>

          <FormFile
            label="Foto Profil"
            accept="image/*"
            currentFileUrl={penduduk?.foto_profil ? getStorageUrl(penduduk.foto_profil) : null}
            onChange={(e) => {
              if (e.target.files?.[0]) setFotoProfil(e.target.files[0])
            }}
            helperText="Format: JPG, PNG, WEBP (Maksimal 2MB)"
            error={validationErrors.foto_profil?.[0]}
          />

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
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormSelect
              label="Pekerjaan (Standar Dukcapil)"
              name="pekerjaan"
              value={formData.pekerjaan}
              onChange={handleChange}
              options={DAFTAR_PEKERJAAN_DUKCAPIL}
              placeholder="Pilih Klasifikasi Pekerjaan..."
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

          <FormInput
            label="Nomor Telepon / WhatsApp"
            name="nomor_telepon"
            value={formData.nomor_telepon}
            onChange={handleChange}
          />

          <FormTextarea
            label="Alamat Tempat Tinggal"
            name="alamat_lengkap"
            value={formData.alamat_lengkap}
            onChange={handleChange}
            rows={3}
          />

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </UserLayout>
  )
}
