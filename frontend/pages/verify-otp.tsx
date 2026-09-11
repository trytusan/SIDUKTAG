import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AuthLayout from '../src/components/layouts/auth'
import { sendOtp, verifyOtp, resetPasswordWithOtp } from '../src/lib/auth'
import { useAuth } from '../src/context/AuthContext'

export default function VerifyOtpPage() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const isRegisterMode = router.query.type === 'register' || router.query.type === 'verify'

  const [email, setEmail] = useState<string>('')
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState<number>(60)
  const [isResending, setIsResending] = useState<boolean>(false)
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false)

  // Form atur ulang password baru
  const [password, setPassword] = useState<string>('')
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')
  const [isSubmittingPassword, setIsSubmittingPassword] = useState<boolean>(false)

  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const passwordInputRef = useRef<HTMLInputElement | null>(null)

  // Ambil email dari query parameter saat halaman dimuat
  useEffect(() => {
    if (router.isReady && router.query.email) {
      setEmail(router.query.email as string)
    }
  }, [router.isReady, router.query.email])

  // Timer hitung mundur kirim ulang OTP
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  // Auto fokus pada kotak input pertama saat dibuka
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  // Fokus otomatis ke input password baru saat OTP sukses terverifikasi
  useEffect(() => {
    if (isOtpVerified && passwordInputRef.current) {
      setTimeout(() => {
        passwordInputRef.current?.focus()
      }, 200)
    }
  }, [isOtpVerified])

  // Verifikasi otomatis begitu seluruh 6 digit terisi lengkap
  useEffect(() => {
    const fullCode = otp.join('')
    if (fullCode.length === 6 && otp.every((digit) => digit.trim() !== '') && email && !isOtpVerified && !isVerifying) {
      handleAutoVerify(fullCode)
    }
  }, [otp, email, isOtpVerified, isVerifying])

  // Handle perubahan nilai kotak digit OTP
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    // Jika digit terisi, otomatis pindah ke kotak berikutnya
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle tombol Backspace untuk kembali ke kotak sebelumnya
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle Paste langsung 6 digit sekaligus
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6)
    if (!pastedData) return

    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)

    // Fokus ke kotak setelah digit terakhir yang ditempel
    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  // Fungsi eksekusi verifikasi OTP
  const handleAutoVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otp.join('')

    if (!email) {
      setErrorMessage('Harap isi alamat email Anda terlebih dahulu.')
      return
    }

    if (code.length !== 6) {
      setErrorMessage('Harap lengkapi 6 digit kode OTP.')
      return
    }

    setIsVerifying(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      await verifyOtp(email, code)
      setIsOtpVerified(true)

      if (isRegisterMode) {
        setStatusMessage('✓ Email Anda Berhasil Diverifikasi! Akun warga telah aktif sepenuhnya. Mengalihkan ke Dashboard...')
        await refreshUser()
        setTimeout(() => {
          router.replace('/user/dashboard')
        }, 1500)
      } else {
        setStatusMessage('✓ Kode OTP Berhasil Diverifikasi! Silakan masukkan password baru Anda di bawah ini.')
      }
    } catch (err: any) {
      setIsOtpVerified(false)
      setErrorMessage(
        err?.response?.data?.message || 'Kode OTP salah atau telah kedaluwarsa. Silakan periksa kembali atau kirim ulang.'
      )
    } finally {
      setIsVerifying(false)
    }
  }

  // Kirim ulang kode OTP
  const handleResendOtp = async () => {
    if (!email) {
      setErrorMessage('Harap isi alamat email terlebih dahulu.')
      return
    }

    setIsResending(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      await sendOtp(email)
      setStatusMessage(`Kode OTP baru telah berhasil dikirimkan ke email ${email}.`)
      setCountdown(60) // Reset countdown 60 detik
      setOtp(['', '', '', '', '', '']) // Kosongkan kotak input
      setIsOtpVerified(false)
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || 'Gagal mengirim ulang kode OTP. Coba beberapa saat lagi.'
      )
    } finally {
      setIsResending(false)
    }
  }

  // Submit password baru setelah OTP terverifikasi
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullOtp = otp.join('')

    if (fullOtp.length !== 6) {
      setErrorMessage('Harap lengkapi 6 digit kode OTP.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password minimal harus 8 karakter.')
      return
    }

    if (password !== passwordConfirmation) {
      setErrorMessage('Konfirmasi password tidak cocok.')
      return
    }

    setIsSubmittingPassword(true)
    setErrorMessage(null)

    try {
      const res = await resetPasswordWithOtp({
        email,
        otp: fullOtp,
        password,
        password_confirmation: passwordConfirmation,
      })

      setStatusMessage(res?.message || 'Password berhasil diperbarui! Mengalihkan ke halaman login...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.password?.[0] ||
        'Gagal mengatur ulang password. Silakan coba kembali.'
      )
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  return (
    <AuthLayout title="Verifikasi Kode OTP — SIDUKTAG">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm max-w-md mx-auto">
        {/* Header Icon */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {isRegisterMode ? 'Verifikasi Email Akun' : 'Verifikasi OTP'}
          </h1>
          <p className="mt-1.5 text-xs text-slate-500 font-medium">
            {isRegisterMode
              ? 'Masukkan 6 digit kode OTP yang kami kirimkan ke email Anda untuk memverifikasi keaslian email sebelum mengakses dashboard.'
              : 'Masukkan 6 digit kode OTP yang kami kirimkan ke alamat email Anda.'}
          </p>
        </div>

        {/* Notifikasi Status & Error */}
        {statusMessage && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-800 flex items-start gap-2">
            <span className="font-bold text-sm">✓</span>
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-700 flex items-start gap-2">
            <span className="font-bold text-sm">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input Alamat Email jika belum ada di query */}
        <div className="mb-5">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
            Alamat Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            required
            className="w-full rounded-2xl border border-slate-300 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* 6-Digit OTP Boxes */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Kode OTP 6-Digit
            </label>
            <span className="text-[11px] text-slate-400">Berlaku 10 menit</span>
          </div>

          <div className="grid grid-cols-6 gap-2 sm:gap-2.5" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`h-13 w-full rounded-2xl border text-center text-xl font-extrabold transition outline-none shadow-xs ${
                  digit
                    ? isOtpVerified
                      ? 'border-emerald-600 bg-emerald-100/70 text-emerald-800 ring-2 ring-emerald-500/30'
                      : 'border-emerald-500 bg-emerald-50/60 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'border-slate-300 bg-slate-50/60 text-slate-900 focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20'
                }`}
              />
            ))}
          </div>

          {/* Status Loading Verifikasi */}
          {isVerifying && (
            <p className="mt-2.5 text-center text-xs font-semibold text-emerald-600 animate-pulse">
              Memverifikasi kode OTP...
            </p>
          )}

          {/* Tombol manual Verifikasi jika belum terverifikasi */}
          {!isOtpVerified && (
            <button
              type="button"
              onClick={() => handleAutoVerify()}
              disabled={isVerifying || otp.some((d) => !d.trim())}
              className="w-full mt-3.5 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {isVerifying ? 'Memverifikasi...' : 'Verifikasi Kode OTP'}
            </button>
          )}
        </div>

        {/* Pesan Sukses Verifikasi Akun Baru (Mode Pendaftaran/Onboarding) */}
        {isOtpVerified && isRegisterMode && (
          <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50/90 p-6 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-base font-extrabold text-emerald-950">Email Berhasil Diverifikasi!</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Email Anda telah terbukti aktif dan sah. Akun warga telah siap digunakan. Sedang mengalihkan Anda ke Dashboard...
            </p>
            <div className="pt-2">
              <Link href="/user/dashboard" className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition">
                <span>Buka Dashboard Sekarang</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        )}

        {/* Form Atur Ulang Password Baru (Muncul otomatis jika mode lupa password) */}
        {isOtpVerified && !isRegisterMode && (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 pt-4 border-t border-slate-200">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password Baru
              </label>
              <input
                ref={passwordInputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Ketik ulang password baru"
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50/60 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingPassword}
              className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {isSubmittingPassword ? 'Menyimpan Password...' : 'Simpan Password Baru & Masuk'}
            </button>
          </form>
        )}

        {/* Kirim Ulang OTP Section */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center justify-center gap-2 text-center text-xs text-slate-500">
          <div>
            Tidak menerima kode?{' '}
            {countdown > 0 ? (
              <span className="font-semibold text-slate-700">
                Kirim ulang dalam <span className="text-emerald-700 font-bold">{countdown} detik</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition"
              >
                {isResending ? 'Mengirim...' : 'Kirim Ulang Kode OTP'}
              </button>
            )}
          </div>

          <Link href="/login" className="mt-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition">
            &larr; Kembali ke Halaman Masuk
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
