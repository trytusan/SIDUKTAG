import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import api from '../../../src/lib/api'
import { useAuth } from '../../../src/context/AuthContext'
import FormInput from '../../../src/components/form/input'
import FormSelect from '../../../src/components/form/select'
import FormRadio from '../../../src/components/form/radio'
import AlertError from '../../../src/components/ui/alert-error'
import { DAFTAR_PEKERJAAN_DUKCAPIL, STATUS_HUBUNGAN_KELUARGA } from '../../../src/constants/dukcapil'

interface KartuKeluargaOption {
  id?: number
  nomor_kk: string
  nama_kepala_keluarga: string
  alamat_keluarga?: string
  jumlah_anggota?: number
}

export default function OnboardingStep1() {
  const router = useRouter()
  const { user, isProfileCompleted, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nik: '',
    status_dalam_keluarga: 'Kepala Keluarga',
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

  // State opsi KK terdaftar untuk anggota selain Kepala Keluarga
  const [kkOptions, setKkOptions] = useState<KartuKeluargaOption[]>([])
  const [loadingKk, setLoadingKk] = useState(false)
  const [inputModeKk, setInputModeKk] = useState<'select' | 'manual'>('select')

  // Muat opsi KK dari API
  const fetchKkOptions = useCallback(async () => {
    setLoadingKk(true)
    try {
      const res = await api.get('/api/kartu-keluarga/options')
      const data = res.data
      const list = Array.isArray(data) ? data : (data?.options || data?.kartu_keluarga || [])
      setKkOptions(list)
    } catch (err) {
      console.error('Gagal mengambil daftar Kartu Keluarga:', err)
    } finally {
      setLoadingKk(false)
    }
  }, [])

  useEffect(() => {
    fetchKkOptions()
  }, [fetchKkOptions])

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

  // Restore dari cache sessionStorage jika sebelumnya warga sudah mengisi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('onboarding_step1')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setFormData((prev) => ({ ...prev, ...parsed }))
        } catch (e) {}
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusKeluargaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setFormData((prev) => ({
      ...prev,
      status_dalam_keluarga: val,
      // Jika beralih ke bukan Kepala Keluarga dan sebelumnya belum memilih KK, reset no kk
      nomor_kk: val === 'Kepala Keluarga' ? prev.nomor_kk : (inputModeKk === 'select' ? '' : prev.nomor_kk),
    }))
    if (val !== 'Kepala Keluarga' && kkOptions.length === 0) {
      fetchKkOptions()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      await api.post('/user/onboarding/step-1', formData)
      // Cache di sessionStorage untuk langkah berikutnya
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

  const isKepalaKeluarga = formData.status_dalam_keluarga === 'Kepala Keluarga'

  return (
    <div className="min-h-screen bg-slate-100/90 py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <Head>
        <title>Langkah 1: Data Pokok — SIDUKTAG</title>
      </Head>

      <div className="mx-auto max-w-2xl">
        {/* Progress Stepper (Warm Slate Theme) */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-600/30">
                1
              </div>
              <span className="mt-2 text-xs font-bold text-emerald-700">Data Pokok</span>
            </div>
            <div className="h-1 flex-1 bg-slate-200 mx-3 rounded-full"></div>
            <div className="flex flex-col items-center opacity-60">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-slate-300 bg-white text-slate-500 font-bold shadow-sm">
                2
              </div>
              <span className="mt-2 text-xs font-medium text-slate-500">Alamat & Kontak</span>
            </div>
            <div className="h-1 flex-1 bg-slate-200 mx-3 rounded-full"></div>
            <div className="flex flex-col items-center opacity-60">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-slate-300 bg-white text-slate-500 font-bold shadow-sm">
                3
              </div>
              <span className="mt-2 text-xs font-medium text-slate-500">Dokumen & Lokasi</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/60">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 mb-2">
              Langkah 1 dari 3
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Lengkapi Data Kependudukan</h2>
            <p className="mt-1 text-sm text-slate-500">
              Silakan isi formulir identitas kependudukan Anda sesuai KTP/KK yang sah.
            </p>
          </div>

          <AlertError message={error} errors={validationErrors} />

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* 1. Nama Lengkap */}
            <FormInput
              label="Nama Lengkap (Sesuai KTP)"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              required
              error={validationErrors.nama_lengkap?.[0]}
            />

            {/* 2. NIK */}
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

            {/* 3. Status Hubungan dalam Keluarga & No. KK (Validasi Hierarki) */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
              <FormSelect
                label="Status Hubungan dalam Keluarga (SHDK)"
                name="status_dalam_keluarga"
                value={formData.status_dalam_keluarga}
                onChange={handleStatusKeluargaChange}
                options={STATUS_HUBUNGAN_KELUARGA}
                placeholder="Pilih Hubungan dalam Keluarga..."
                required
                error={validationErrors.status_dalam_keluarga?.[0]}
                helperText="Pilih peran Anda dalam keluarga terlebih dahulu agar sistem dapat menyesuaikan pemeriksaan Nomor KK."
              />

              {/* Logika No KK Dinamis */}
              {isKepalaKeluarga ? (
                <div className="space-y-1">
                  <FormInput
                    label="Nomor Kartu Keluarga (No. KK)"
                    name="nomor_kk"
                    value={formData.nomor_kk}
                    onChange={handleChange}
                    placeholder="Masukkan 16 digit Nomor KK"
                    maxLength={16}
                    required
                    error={validationErrors.nomor_kk?.[0]}
                    helperText="Sebagai Kepala Keluarga, Anda berhak mendaftarkan nomor KK baru atau memasukkan nomor KK keluarga Anda."
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4 sm:p-5 space-y-3">
                  <div className="flex items-start gap-2.5 text-sky-900 text-xs sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <span className="font-bold text-sky-950">Wajib Menginduk ke KK Terdaftar:</span>
                      <p className="mt-0.5 text-sky-800 text-xs">
                        Sebagai anggota keluarga (<span className="font-semibold">{formData.status_dalam_keluarga}</span>), Nomor KK Anda harus sudah didaftarkan terlebih dahulu di Desa Bungkulan oleh Kepala Keluarga.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="text-xs font-bold text-slate-700">
                      Pilih / Masukkan No. KK Terdaftar <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setInputModeKk(inputModeKk === 'select' ? 'manual' : 'select')}
                      className="text-xs text-emerald-700 hover:text-emerald-800 underline font-semibold transition"
                    >
                      {inputModeKk === 'select' ? 'Ketik Manual No. KK' : 'Pilih dari Dropdown KK Desa'}
                    </button>
                  </div>

                  {inputModeKk === 'select' ? (
                    <div>
                      <FormSelect
                        name="nomor_kk"
                        value={formData.nomor_kk}
                        onChange={handleChange}
                        placeholder={loadingKk ? 'Memuat daftar KK desa...' : '-- Pilih Nomor KK & Kepala Keluarga --'}
                        options={kkOptions.map((kk) => ({
                          value: kk.nomor_kk,
                          label: `${kk.nomor_kk} — Kel. ${kk.nama_kepala_keluarga || 'Belum Diatur'} (${kk.alamat_keluarga || 'Desa Bungkulan'})`,
                        }))}
                        required
                        error={validationErrors.nomor_kk?.[0]}
                      />
                      {kkOptions.length === 0 && !loadingKk && (
                        <div className="mt-2 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/80 p-2.5 text-xs text-amber-800">
                          <span>Belum ada KK yang terdaftar di database desa atau belum termuat.</span>
                          <button
                            type="button"
                            onClick={() => fetchKkOptions()}
                            className="ml-2 inline-flex items-center gap-1 font-semibold text-amber-900 underline hover:text-amber-950"
                          >
                            Muat Ulang
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <FormInput
                        name="nomor_kk"
                        value={formData.nomor_kk}
                        onChange={handleChange}
                        placeholder="Ketik 16 digit Nomor KK yang sudah terdaftar di desa"
                        maxLength={16}
                        required
                        error={validationErrors.nomor_kk?.[0]}
                        helperText="Nomor KK harus sudah terdaftar di sistem. Jika belum ada, minta Kepala Keluarga untuk mendaftar terlebih dahulu."
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. Tempat & Tanggal Lahir */}
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

            {/* 5. Jenis Kelamin */}
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

            {/* 6. Agama & Status Perkawinan */}
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

            {/* 7. Pekerjaan & Pendidikan */}
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

            {/* Tombol Lanjut */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition duration-200 hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
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
