import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AuthLayout from '../src/components/layouts/auth'
import { aktivasiAkun } from '../src/lib/auth'
import { useAuth } from '../src/context/AuthContext'

export default function AktivasiAkunPage() {
  const router = useRouter()
  const { setAuthUser } = useAuth()

  const [formData, setFormData] = useState({
    nik: '',
    tanggal_lahir: '',
    nomor_kk: '',
    password: '',
    password_confirmation: '',
  })

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (router.query.nik && typeof router.query.nik === 'string') {
      setFormData((prev) => ({ ...prev, nik: router.query.nik as string }))
    }
  }, [router.query])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    setFieldErrors({})

    if (formData.password !== formData.password_confirmation) {
      setErrorMessage('Konfirmasi kata sandi baru tidak sesuai.')
      setLoading(false)
      return
    }

    try {
      const res = await aktivasiAkun(formData)
      setSuccessMessage(res?.message || 'Akun berhasil diaktifkan! Mengalihkan ke dashboard...')

      if (res?.user) {
        setAuthUser(res.user, res.role || 'user', true)
      }

      setTimeout(() => {
        router.replace(res?.redirect || '/user/dashboard')
      }, 1500)
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setFieldErrors(err.response.data.errors)
      }
      setErrorMessage(
        err?.response?.data?.message ||
        err?.message ||
        'Gagal mengaktifkan akun. Silakan periksa kesesuaian data identitas Anda.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Aktivasi Akun Warga — SIDULISA">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-10 shadow-sm max-w-lg mx-auto">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Aktivasi Akun Warga</h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Verifikasi identitas dan buat kata sandi untuk akun yang didaftarkan oleh Operator Lingkungan Saba.
          </p>
        </div>

        {successMessage && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-start gap-2.5">
            <span className="text-base text-emerald-600">✓</span>
            <div>{successMessage}</div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700 flex items-start gap-2.5">
            <span className="text-base text-rose-600">⚠️</span>
            <div>{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
              Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nik"
              value={formData.nik}
              onChange={handleChange}
              placeholder="16 Digit NIK"
              maxLength={16}
              inputMode="numeric"
              required
              className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            />
            {fieldErrors.nik && (
              <p className="mt-1 text-xs text-rose-600">{fieldErrors.nik[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Tanggal Lahir <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 outline-none transition duration-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              {fieldErrors.tanggal_lahir && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.tanggal_lahir[0]}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Nomor KK <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="nomor_kk"
                value={formData.nomor_kk}
                onChange={handleChange}
                placeholder="16 digit / 4 digit akhir"
                inputMode="numeric"
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition duration-200 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
              {fieldErrors.nomor_kk && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.nomor_kk[0]}</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Buat Kata Sandi Akun Baru
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Kata Sandi Baru (Min. 8 karakter) <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 8 karakter"
                minLength={8}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.password[0]}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Ulangi Kata Sandi Baru <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Ketik ulang kata sandi"
                minLength={8}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition duration-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition duration-200 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Memverifikasi Identitas...</span>
              </div>
            ) : (
              'Simpan Password & Masuk Akun'
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-slate-500">
          <p>
            Sudah memiliki kata sandi?{' '}
            <Link href="/login" className="font-bold text-emerald-700 hover:text-emerald-800">
              Masuk di sini
            </Link>
          </p>
          <p>
            Belum pernah didaftarkan oleh operator?{' '}
            <Link href="/register" className="font-bold text-slate-700 hover:text-slate-900">
              Registrasi Akun Baru
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
