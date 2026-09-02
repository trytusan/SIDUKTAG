import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import api from '../../../src/lib/api'
import FormInput from '../../../src/components/form/input'
import FormTextarea from '../../../src/components/form/textarea'
import FormSelect from '../../../src/components/form/select'
import AlertError from '../../../src/components/ui/alert-error'

export default function OnboardingStep2() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    alamat: '',
    nomor_telepon: '',
    status_dalam_keluarga: 'Kepala Keluarga',
    status_kependudukan: 'Tetap',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

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
                error={validationErrors.status_dalam_keluarga?.[0]}
              />

              <FormSelect
                label="Status Kependudukan"
                name="status_kependudukan"
                value={formData.status_kependudukan}
                onChange={handleChange}
                options={['Tetap', 'Pendatang', 'Pindah']}
                required
                error={validationErrors.status_kependudukan?.[0]}
              />
            </div>

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
