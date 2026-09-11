import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import api from '../../../src/lib/api'
import FormInput from '../../../src/components/form/input'
import FormTextarea from '../../../src/components/form/textarea'
import FormSelect from '../../../src/components/form/select'
import AlertError from '../../../src/components/ui/alert-error'
import { STATUS_HUBUNGAN_KELUARGA } from '../../../src/constants/dukcapil'

export default function OnboardingStep2() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    alamat: '',
    nomor_telepon: '',
    status_dalam_keluarga: 'Kepala Keluarga',
    status_kependudukan: 'Tetap',
    tanggal_masuk: '',
    masa_berlaku: '',
    nomor_surat_tanda_lapor: '',
    daerah_asal: '',
    tujuan_menetap: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('onboarding_step2')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setFormData((prev) => ({ ...prev, ...parsed }))
        } catch (e) {}
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      await api.post('/user/onboarding/step-2', formData)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('onboarding_step2', JSON.stringify(formData))
      }
      router.push('/user/onboarding/step-3')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal menyimpan data langkah 2.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Langkah 2: Alamat & Kontak — SIDUKTAG</title>
      </Head>

      <div className="mx-auto max-w-2xl">
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Link href="/user/onboarding/step-1" className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 font-bold text-slate-950 shadow-lg">
                ✓
              </div>
              <span className="mt-2 text-xs font-semibold text-emerald-400">Data Pokok</span>
            </Link>
            <div className="h-0.5 flex-1 bg-emerald-500 mx-3"></div>
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 font-bold text-slate-950 shadow-lg shadow-emerald-500/30">
                2
              </div>
              <span className="mt-2 text-xs font-semibold text-emerald-400">Alamat & Kontak</span>
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
            <h2 className="text-2xl font-bold text-white">Alamat & Informasi Domisili</h2>
            <p className="mt-1 text-sm text-slate-400">
              Lengkapi informasi tempat tinggal dan nomor kontak yang dapat dihubungi.
            </p>
          </div>

          <AlertError message={error} errors={validationErrors} />

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <FormTextarea
              label="Alamat Lengkap (Jalan / Dusun / RT / RW)"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              rows={3}
              placeholder="Contoh: Jl. Merpati No. 12 RT 02 / RW 04 Dusun Krajan"
              required
              error={validationErrors.alamat?.[0]}
            />

            <FormInput
              label="Nomor Telepon / WhatsApp Aktif"
              type="tel"
              name="nomor_telepon"
              value={formData.nomor_telepon}
              onChange={handleChange}
              placeholder="Contoh: 081234567890"
              error={validationErrors.nomor_telepon?.[0]}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelect
                label="Status Hubungan dalam Keluarga"
                name="status_dalam_keluarga"
                value={formData.status_dalam_keluarga}
                onChange={handleChange}
                options={STATUS_HUBUNGAN_KELUARGA}
                placeholder="Pilih Hubungan dalam Keluarga..."
                required
                error={validationErrors.status_dalam_keluarga?.[0]}
              />

              <FormSelect
                label="Status Kependudukan"
                name="status_kependudukan"
                value={formData.status_kependudukan}
                onChange={handleChange}
                options={['Tetap', 'Pendatang', 'Pendatang Sementara', 'Pindah']}
                required
                error={validationErrors.status_kependudukan?.[0]}
              />
            </div>

            {/* Form Dinamis: Pendatang */}
            {formData.status_kependudukan === 'Pendatang' && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-5 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <svg className="h-5 w-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Informasi Warga Pendatang (Domisili Baru)</span>
                </div>
                <p className="text-xs text-emerald-300/80">
                  Wajib mengisi daerah asal dan tujuan/alasan menetap di wilayah ini.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Daerah Asal *"
                    name="daerah_asal"
                    value={formData.daerah_asal}
                    onChange={handleChange}
                    placeholder="Contoh: Kab. Singkawang, Kalbar"
                    required
                    error={validationErrors.daerah_asal?.[0]}
                  />
                  <FormInput
                    label="Tujuan Menetap *"
                    name="tujuan_menetap"
                    value={formData.tujuan_menetap}
                    onChange={handleChange}
                    placeholder="Contoh: Bekerja / Menikah / Ikut Keluarga"
                    required
                    error={validationErrors.tujuan_menetap?.[0]}
                  />
                </div>
              </div>
            )}

            {/* Form Dinamis: Pendatang Sementara */}
            {formData.status_kependudukan === 'Pendatang Sementara' && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-5 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <svg className="h-5 w-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Informasi Pendatang Sementara (Izin Tinggal Sementara)</span>
                </div>
                <p className="text-xs text-amber-300/80">
                  Wajib mengisi tanggal masuk/kedatangan, masa berlaku izin tinggal, daerah asal, dan tujuan menetap.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormInput
                    label="Tanggal Masuk / Kedatangan *"
                    type="date"
                    name="tanggal_masuk"
                    value={formData.tanggal_masuk}
                    onChange={handleChange}
                    required
                    error={validationErrors.tanggal_masuk?.[0]}
                  />
                  <FormInput
                    label="Masa Berlaku Izin Tinggal *"
                    type="date"
                    name="masa_berlaku"
                    value={formData.masa_berlaku}
                    onChange={handleChange}
                    required
                    error={validationErrors.masa_berlaku?.[0]}
                  />
                  <FormInput
                    label="Nomor Surat Tanda Lapor / SKTT"
                    name="nomor_surat_tanda_lapor"
                    value={formData.nomor_surat_tanda_lapor}
                    onChange={handleChange}
                    placeholder="Contoh: 470/123/Desa/2026"
                    error={validationErrors.nomor_surat_tanda_lapor?.[0]}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    label="Daerah Asal *"
                    name="daerah_asal"
                    value={formData.daerah_asal}
                    onChange={handleChange}
                    placeholder="Contoh: Kab. Singkawang, Kalbar"
                    required
                    error={validationErrors.daerah_asal?.[0]}
                  />
                  <FormInput
                    label="Tujuan Menetap *"
                    name="tujuan_menetap"
                    value={formData.tujuan_menetap}
                    onChange={handleChange}
                    placeholder="Contoh: Bekerja Proyek / Pendidikan"
                    required
                    error={validationErrors.tujuan_menetap?.[0]}
                  />
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <Link
                href="/user/onboarding/step-1"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
              >
                &larr; Kembali
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30 transition duration-200 hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Lanjut ke Langkah 3'}
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
