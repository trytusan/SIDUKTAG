import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import api from '../../../src/lib/api'
import { useAuth } from '../../../src/context/AuthContext'
import FormInput from '../../../src/components/form/input'
import FormSelect from '../../../src/components/form/select'
import FormRadio from '../../../src/components/form/radio'
import AlertError from '../../../src/components/ui/alert-error'

export default function OnboardingStep1() {
  const router = useRouter()
  const { user, isProfileCompleted, loading: authLoading } = useAuth()
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
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!authLoading && user) {
      if (isProfileCompleted) {
        router.replace('/user/dashboard')
      } else {
        setFormData((prev) => ({
          ...prev,
          nama_lengkap: prev.nama_lengkap || user.name || '',
        }))
      }
    }
  }, [user, isProfileCompleted, authLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      await api.post('/user/onboarding/step-1', formData)
      // Also cache in sessionStorage for Step 3 multi-part fallback
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('onboarding_step1', JSON.stringify(formData))
      }
      router.push('/user/onboarding/step-2')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal menyimpan data langkah 1.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Langkah 1: Data Pokok — SIDUKTAG</title>
      </Head>

      <div className="mx-auto max-w-2xl">
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 font-bold text-slate-950 shadow-lg shadow-emerald-500/30">
                1
              </div>
              <span className="mt-2 text-xs font-semibold text-emerald-400">Data Pokok</span>
            </div>
            <div className="h-0.5 flex-1 bg-slate-700 mx-3"></div>
            <div className="flex flex-col items-center opacity-40">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-600 bg-slate-800 text-slate-400 font-bold">
                2
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-400">Alamat & Kontak</span>
            </div>
            <div className="h-0.5 flex-1 bg-slate-700 mx-3"></div>
            <div className="flex flex-col items-center opacity-40">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-600 bg-slate-800 text-slate-400 font-bold">
                3
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-400">Dokumen & Lokasi</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-950 p-6 sm:p-10 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Lengkapi Data Kependudukan</h2>
            <p className="mt-1 text-sm text-slate-400">
              Silakan isi formulir identitas kependudukan Anda sesuai KTP/KK yang sah.
            </p>
          </div>

          <AlertError message={error} errors={validationErrors} />

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <FormInput
              label="Nama Lengkap (Sesuai KTP)"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              required
              error={validationErrors.nama_lengkap?.[0]}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Nomor Induk Kependudukan (NIK)"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="16 digit NIK"
                maxLength={16}
                required
                error={validationErrors.nik?.[0]}
              />

              <FormInput
                label="Nomor Kartu Keluarga (No. KK)"
                name="nomor_kk"
                value={formData.nomor_kk}
                onChange={handleChange}
                placeholder="16 digit Nomor KK"
                maxLength={16}
                required
                error={validationErrors.nomor_kk?.[0]}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Tempat Lahir"
                name="tempat_lahir"
                value={formData.tempat_lahir}
                onChange={handleChange}
                placeholder="Kota/Kabupaten kelahiran"
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
              <FormInput
                label="Pekerjaan"
                name="pekerjaan"
                value={formData.pekerjaan}
                onChange={handleChange}
                placeholder="Contoh: Karyawan Swasta, Wiraswasta"
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

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30 transition duration-200 hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Lanjut ke Langkah 2'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
