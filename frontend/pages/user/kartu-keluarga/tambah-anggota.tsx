import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import UserLayout from '../../../src/components/layouts/user'
import PageHeader from '../../../src/components/ui/page-header'
import FormInput from '../../../src/components/form/input'
import FormSelect from '../../../src/components/form/select'
import FormRadio from '../../../src/components/form/radio'
import FormFile from '../../../src/components/form/file'
import AlertError from '../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../src/components/ui/loading'
import api from '../../../src/lib/api'
import { KartuKeluarga, Penduduk } from '../../../src/types'
import { DAFTAR_PEKERJAAN_DUKCAPIL, STATUS_HUBUNGAN_KELUARGA } from '../../../src/constants/dukcapil'

export default function TambahAnggotaKeluargaPage() {
  const router = useRouter()
  const [kartuKeluarga, setKartuKeluarga] = useState<KartuKeluarga | null>(null)
  const [penduduk, setPenduduk] = useState<Penduduk | null>(null)
  const [isKepalaKeluarga, setIsKepalaKeluarga] = useState<boolean>(false)
  const [loadingInitial, setLoadingInitial] = useState(true)

  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nik: '',
    status_dalam_keluarga: 'Anak',
    jenis_kelamin: 'Laki-laki',
    tempat_lahir: '',
    tanggal_lahir: '',
    agama: 'Islam',
    status_perkawinan: 'Belum Kawin',
    pekerjaan: 'Pelajar / Mahasiswa',
    pendidikan_terakhir: 'SMA / Sederajat',
    nomor_telepon: '',
    email: '',
  })

  const [fotoProfil, setFotoProfil] = useState<File | null>(null)
  const [dokumenKtp, setDokumenKtp] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    async function init() {
      try {
        const res = await api.get('/user/kartu-keluarga')
        const kk = res.data?.kartuKeluarga || res.data?.kartu_keluarga || res.data?.data || null
        const pend = res.data?.penduduk || null
        setKartuKeluarga(kk)
        setPenduduk(pend)
        setIsKepalaKeluarga(
          res.data?.is_kepala_keluarga ??
          (pend?.status_dalam_keluarga === 'Kepala Keluarga')
        )
      } catch (err) {
        console.error('Failed to load KK info:', err)
      } finally {
        setLoadingInitial(false)
      }
    }
    init()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

      if (fotoProfil) payload.append('foto_profil', fotoProfil)
      if (dokumenKtp) payload.append('dokumen_ktp', dokumenKtp)

      await api.post('/user/kartu-keluarga/anggota', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      router.push('/user/kartu-keluarga')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal menambahkan anggota keluarga baru.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial) {
    return (
      <UserLayout pageTitle="Tambah Anggota Keluarga">
        <LoadingSpinner message="Memeriksa kewenangan Kepala Keluarga..." />
      </UserLayout>
    )
  }

  // Proteksi: Hanya Kepala Keluarga
  if (!isKepalaKeluarga) {
    return (
      <UserLayout pageTitle="Akses Ditolak" subtitle="Kewenangan Khusus Kepala Keluarga">
        <div className="mx-auto max-w-lg rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Kewenangan Terbatas</h2>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Hanya <strong>Kepala Keluarga</strong> yang berwenang menambahkan susunan anggota ke dalam Kartu Keluarga. Status Anda saat ini tercatat sebagai <strong>{penduduk?.status_dalam_keluarga || 'Anggota'}</strong>.
          </p>
          <div className="mt-6">
            <Link
              href="/user/kartu-keluarga"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-900"
            >
              &larr; Kembali ke Kartu Keluarga
            </Link>
          </div>
        </div>
      </UserLayout>
    )
  }

  // Filter pilihan status keluarga (tidak boleh memilih Kepala Keluarga lagi)
  const opsiStatusKeluarga = STATUS_HUBUNGAN_KELUARGA.filter(
    (item) => item !== 'Kepala Keluarga'
  )

  return (
    <UserLayout
      pageTitle="Tambah Anggota Keluarga"
      subtitle={`Pencatatan anggota baru untuk KK No. ${kartuKeluarga?.nomor_kk || '-'}`}
    >
      <PageHeader
        title="Formulir Anggota Keluarga"
        description="Lengkapi data identitas anggota yang ingin ditambahkan ke Kartu Keluarga Anda"
        actions={[
          {
            label: 'Batal & Kembali',
            href: '/user/kartu-keluarga',
            variant: 'secondary',
          },
        ]}
      />

      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <AlertError message={error} errors={validationErrors} />

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* Section 1: Informasi KK Terkunci */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Kartu Keluarga Induk (Otomatis Terkunci)</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl bg-white p-3 border border-emerald-100">
                <span className="text-slate-500">Nomor Kartu Keluarga</span>
                <p className="mt-0.5 font-bold text-slate-800">{kartuKeluarga?.nomor_kk || penduduk?.nomor_kk || '-'}</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-emerald-100">
                <span className="text-slate-500">Kepala Keluarga</span>
                <p className="mt-0.5 font-bold text-slate-800">{kartuKeluarga?.nama_kepala_keluarga || penduduk?.nama_lengkap || '-'}</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-emerald-100 sm:col-span-2">
                <span className="text-slate-500">Alamat Tempat Tinggal Keluarga</span>
                <p className="mt-0.5 font-semibold text-slate-700">
                  {kartuKeluarga?.alamat_keluarga || penduduk?.alamat_lengkap || '-'}
                </p>
                <p className="mt-1 text-[11px] text-emerald-700">
                  * Anggota baru akan otomatis mewarisi Nomor KK, alamat domisili, dan titik peta keluarga ini.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Identitas Pokok */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
              1. Identitas Anggota Keluarga
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelect
                label="Hubungan dalam Keluarga (SHDK) *"
                name="status_dalam_keluarga"
                value={formData.status_dalam_keluarga}
                onChange={handleChange}
                options={opsiStatusKeluarga}
                required
                error={validationErrors.status_dalam_keluarga?.[0]}
                helperText="Pilih hubungan anggota dengan Kepala Keluarga"
              />

              <FormInput
                label="Nomor Induk Kependudukan (NIK) *"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="16 Digit NIK"
                maxLength={16}
                inputMode="numeric"
                required
                error={validationErrors.nik?.[0]}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Nama Lengkap (Sesuai Akta / KTP) *"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                placeholder="Nama lengkap tanpa gelar singkatan"
                required
                error={validationErrors.nama_lengkap?.[0]}
              />

              <FormRadio
                label="Jenis Kelamin *"
                name="jenis_kelamin"
                selectedValue={formData.jenis_kelamin}
                onChange={handleChange}
                options={[
                  { value: 'Laki-laki', label: 'Laki-laki' },
                  { value: 'Perempuan', label: 'Perempuan' },
                ]}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Tempat Lahir"
                name="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={handleChange}
                placeholder="Kota / Kabupaten lahir"
                error={validationErrors.tempat_lahir?.[0]}
              />

              <FormInput
                label="Tanggal Lahir *"
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                required
                error={validationErrors.tanggal_lahir?.[0]}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelect
                label="Agama"
                name="agama"
                value={formData.agama}
                onChange={handleChange}
                options={['Islam', 'Kristen Protestan', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu']}
              />

              <FormSelect
                label="Status Perkawinan"
                name="status_perkawinan"
                value={formData.status_perkawinan}
                onChange={handleChange}
                options={['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati']}
              />
            </div>
          </div>

          {/* Section 3: Pendidikan & Pekerjaan */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
              2. Pekerjaan & Kontak
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelect
                label="Pekerjaan (Standar Dukcapil)"
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
                options={DAFTAR_PEKERJAAN_DUKCAPIL}
                placeholder="Pilih Pekerjaan..."
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
                  'Diploma (D1-D3)',
                  'Diploma 4 / Strata 1',
                  'Sarjana (S1)',
                  'Magister (S2)',
                  'Doktor (S3)',
                ]}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Nomor Telepon / HP (Opsional)"
                name="nomor_telepon"
                value={formData.nomor_telepon}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                error={validationErrors.nomor_telepon?.[0]}
              />

              <FormInput
                label="Email Anggota (Opsional)"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="anggota@email.com (opsional)"
                helperText="Akun login otomatis dibuat. Jika dikosongkan, menggunakan NIK@sidulisa.id"
                error={validationErrors.email?.[0]}
              />
            </div>
          </div>

          {/* Section 4: Berkas Dokumen (Opsional) */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
              3. Berkas Pendukung (Opsional)
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormFile
                label="Foto Profil (Opsional)"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFotoProfil(e.target.files[0])
                }}
                helperText="Format JPG, PNG (Maksimal 2 MB)"
              />

              <FormFile
                label="Dokumen KTP (Opsional)"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) setDokumenKtp(e.target.files[0])
                }}
                error={validationErrors.dokumen_ktp?.[0]}
                helperText="Format JPG, PNG, PDF (Maksimal 4 MB). Dokumen KK otomatis mengikuti KK Kepala Keluarga."
              />
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/user/kartu-keluarga"
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan Anggota...' : 'Simpan Anggota Keluarga'}
            </button>
          </div>
        </form>
      </div>
    </UserLayout>
  )
}
