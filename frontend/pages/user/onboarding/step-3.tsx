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
      <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-800 text-slate-400 text-xs">
        Memuat peta interaktif...
      </div>
    ),
  }
)

export default function OnboardingStep3() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [fotoProfil, setFotoProfil] = useState<File | null>(null)
  const [dokumen, setDokumen] = useState<File | null>(null)
  const [coords, setCoords] = useState<{ latitude: string; longitude: string }>({
    latitude: '-6.2088',
    longitude: '106.8456',
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

      await api.post('/user/onboarding/step-3', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('onboarding_step1')
        sessionStorage.removeItem('onboarding_step2')
      }

      await refreshUser()
      router.replace('/user/dashboard')
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
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Langkah 3: Dokumen & Geotagging — SIDUKTAG</title>
      </Head>

      <div className="mx-auto max-w-3xl">
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
            <Link href="/user/onboarding/step-2" className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 font-bold text-slate-950 shadow-lg">
                ✓
              </div>
              <span className="mt-2 text-xs font-semibold text-emerald-400">Alamat & Kontak</span>
            </Link>
            <div className="h-0.5 flex-1 bg-emerald-500 mx-3"></div>
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 font-bold text-slate-950 shadow-lg shadow-emerald-500/30">
                3
              </div>
              <span className="mt-2 text-xs font-semibold text-emerald-400">Dokumen & Lokasi</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-950 p-6 sm:p-10 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Unggah Berkas & Tag Lokasi Rumah</h2>
            <p className="mt-1 text-sm text-slate-400">
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
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
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
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
              >
                &larr; Kembali
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/30 transition duration-200 hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Menyelesaikan Pendaftaran...' : 'Selesai & Masuk ke Dashboard'}
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
