import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import api from '../../../src/lib/api'
import { useAuth } from '../../../src/context/AuthContext'
import FormFile from '../../../src/components/form/file'
import AlertError from '../../../src/components/ui/alert-error'

// Dynamically import Leaflet Map Picker to prevent SSR errors
const FormMapPicker = dynamic(
  () => import('../../../src/components/maps/form-map-picker'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 text-xs">
        Memuat peta interaktif...
      </div>
    ),
  }
)

export default function OnboardingStep3() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const [fotoProfil, setFotoProfil] = useState<File | null>(null)
  const [dokumen, setDokumen] = useState<File | null>(null)
  const [coords, setCoords] = useState<{ latitude: string; longitude: string }>({
    latitude: '-8.0781358',
    longitude: '115.1536173',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationErrors({})

    try {
      const formData = new FormData()
      if (fotoProfil) {
        formData.append('foto_profil', fotoProfil)
      }
      if (dokumen) {
        formData.append('dokumen', dokumen)
      }
      formData.append('latitude', coords.latitude)
      formData.append('longitude', coords.longitude)

      // Attach sessionStorage payloads if available
      if (typeof window !== 'undefined') {
        const s1 = sessionStorage.getItem('onboarding_step1')
        const s2 = sessionStorage.getItem('onboarding_step2')
        if (s1) formData.append('step1', s1)
        if (s2) formData.append('step2', s2)
      }

      const res = await api.post('/user/onboarding/step-3', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('onboarding_step1')
        sessionStorage.removeItem('onboarding_step2')
      }

      await refreshUser()
      const targetEmail = res.data?.email || user?.email || ''
      router.replace(`/verify-otp?email=${encodeURIComponent(targetEmail)}&type=register`)
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal menyelesaikan pendaftaran profil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100/90 py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <Head>
        <title>Langkah 3: Dokumen & Geotagging — SIDUKTAG</title>
      </Head>

      <div className="mx-auto max-w-3xl">
        {/* Progress Stepper (Warm Slate Theme) */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Link href="/user/onboarding/step-1" className="flex flex-col items-center group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-600/30 transition group-hover:scale-105">
                ✓
              </div>
              <span className="mt-2 text-xs font-bold text-emerald-700">Data Pokok</span>
            </Link>
            <div className="h-1 flex-1 bg-emerald-500 mx-3 rounded-full"></div>
            <Link href="/user/onboarding/step-2" className="flex flex-col items-center group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-600/30 transition group-hover:scale-105">
                ✓
              </div>
              <span className="mt-2 text-xs font-bold text-emerald-700">Alamat & Kontak</span>
            </Link>
            <div className="h-1 flex-1 bg-emerald-500 mx-3 rounded-full"></div>
            <div className="flex flex-col items-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-600/30">
                3
              </div>
              <span className="mt-2 text-xs font-bold text-emerald-700">Dokumen & Lokasi</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/60">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 mb-2">
              Langkah 3 dari 3
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Unggah Berkas & Tag Lokasi Rumah</h2>
            <p className="mt-1 text-sm text-slate-500">
              Unggah foto diri, foto KK/KTP serta tandai titik koordinat rumah Anda pada peta.
            </p>
          </div>

          <AlertError message={error} errors={validationErrors} />

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <FormFile
                  label="Foto Profil (Opsional)"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setFotoProfil(e.target.files[0])
                  }}
                  helperText="Format: JPG, PNG, WEBP (Maksimal 2MB)"
                  error={validationErrors.foto_profil?.[0]}
                />
              </div>

              <div>
                <FormFile
                  label="Dokumen KK / KTP (Opsional)"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setDokumen(e.target.files[0])
                  }}
                  helperText="Format: JPG, PNG, PDF (Maksimal 4MB)"
                  error={validationErrors.dokumen?.[0]}
                />
              </div>
            </div>

            {/* Geotagging Map Picker */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <FormMapPicker
                latitude={coords.latitude}
                longitude={coords.longitude}
                onChange={(c) => setCoords(c)}
                label="Tandai Lokasi Rumah (Geotagging Presisi)"
                height={320}
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Link
                href="/user/onboarding/step-2"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                &larr; Kembali
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition duration-200 hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Menyelesaikan Pendaftaran...' : 'Selesai & Lanjut ke Verifikasi Email'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
