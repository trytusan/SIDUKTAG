import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import FormSelect from '../../../src/components/form/select'
import FormInput from '../../../src/components/form/input'
import FormFile from '../../../src/components/form/file'
import FormTextarea from '../../../src/components/form/textarea'
import AlertError from '../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../src/components/ui/loading'
import api from '../../../src/lib/api'
import { Penduduk, Bantuan } from '../../../src/types'

export default function AdminBantuanCreate() {
  const router = useRouter()
  const [pendudukList, setPendudukList] = useState<Penduduk[]>([])
  const [allPrograms, setAllPrograms] = useState<Bantuan[]>([])
  const [loadingInitial, setLoadingInitial] = useState(true)

  const [pendudukId, setPendudukId] = useState('')
  const [bantuanId, setBantuanId] = useState('')
  const [statusPenerima, setStatusPenerima] = useState('Diterima')
  const [statusVerifikasi, setStatusVerifikasi] = useState('Terverifikasi')
  const [tanggalVerifikasi, setTanggalVerifikasi] = useState(new Date().toISOString().substring(0, 10))
  const [tanggalMenerima, setTanggalMenerima] = useState(new Date().toISOString().substring(0, 10))
  const [nomorUndangan, setNomorUndangan] = useState('')
  const [barcodeFile, setBarcodeFile] = useState<File | null>(null)
  const [catatan, setCatatan] = useState('')
  const [catatanOperator, setCatatanOperator] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    async function init() {
      try {
        const res = await api.get('/admin/bantuan/create')
        setPendudukList(res.data.listPenduduk || res.data.penduduk || [])
        setAllPrograms(res.data.allPrograms || res.data.program || [])
      } catch (err) {
        console.error('Failed to load init data:', err)
      } finally {
        setLoadingInitial(false)
      }
    }
    init()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setValidationErrors({})

    try {
      const formData = new FormData()
      formData.append('penduduk_id', pendudukId)
      formData.append('bantuan_id', bantuanId)
      formData.append('status_penerima', statusPenerima)
      formData.append('status_verifikasi', statusVerifikasi)
      if (tanggalVerifikasi) formData.append('tanggal_verifikasi', tanggalVerifikasi)
      const tglMenerimaVal = statusPenerima === 'Selesai' ? tanggalMenerima : (tanggalMenerima || '')
      if (tglMenerimaVal) formData.append('tanggal_menerima', tglMenerimaVal)
      if (nomorUndangan) formData.append('nomor_undangan', nomorUndangan)
      if (barcodeFile) formData.append('barcode_pengambilan', barcodeFile)
      if (catatan) formData.append('catatan', catatan)
      if (catatanOperator) formData.append('catatan_operator', catatanOperator)

      await api.post('/admin/bantuan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      router.push('/admin/bantuan')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal mencatat penerima bantuan.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial) {
    return (
      <AdminLayout pageTitle="Catat Penerima Bantuan">
        <LoadingSpinner message="Memuat formulir penerima bantuan..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout pageTitle="Catat Penerima Bantuan" subtitle="Daftarkan warga sebagai penerima program bantuan">
      <PageHeader
        title="Formulir Penerima Bantuan"
        description="Pilih warga, program bansos, dan status verifikasi penerima"
        actions={[
          {
            label: 'Batal & Kembali',
            href: '/admin/bantuan',
            variant: 'secondary',
          },
        ]}
      />

      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <AlertError message={error} errors={validationErrors} />

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <FormSelect
            label="Pilih Warga Penerima"
            name="penduduk_id"
            value={pendudukId}
            onChange={(e) => setPendudukId(e.target.value)}
            options={pendudukList.map((p) => ({
              value: p.id,
              label: p.nik + ' - ' + p.nama_lengkap,
            }))}
            placeholder="-- Pilih Warga Penerima --"
            required
            error={validationErrors.penduduk_id?.[0]}
          />

          <FormSelect
            label="Pilih Program Bantuan"
            name="bantuan_id"
            value={bantuanId}
            onChange={(e) => setBantuanId(e.target.value)}
            options={allPrograms.map((b) => ({
              value: b.id,
              label: b.nama_program + ' (' + b.jenis_bantuan + ')',
            }))}
            placeholder="-- Pilih Program Bantuan --"
            required
            error={validationErrors.bantuan_id?.[0]}
          />

          {/* Bagian Status Verifikasi & Realisasi */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Tahap 1: Verifikasi Kelayakan
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelect
                label="Status Verifikasi"
                name="status_verifikasi"
                value={statusVerifikasi}
                onChange={(e) => setStatusVerifikasi(e.target.value)}
                options={[
                  'Menunggu Verifikasi',
                  'Terverifikasi',
                  'Ditolak',
                ]}
                required
              />

              <FormInput
                label="Tanggal Verifikasi"
                type="date"
                name="tanggal_verifikasi"
                value={tanggalVerifikasi}
                onChange={(e) => setTanggalVerifikasi(e.target.value)}
              />
            </div>

            <FormTextarea
              label="Catatan Operator / Verifikator"
              name="catatan_operator"
              value={catatanOperator}
              onChange={(e) => setCatatanOperator(e.target.value)}
              rows={2}
              placeholder="Catatan hasil verifikasi berkas atau kondisi kelayakan warga..."
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Tahap 2: Status Penerima & Penyaluran Fisik
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelect
                label="Status Penerima (Realisasi)"
                name="status_penerima"
                value={statusPenerima}
                onChange={(e: any) => setStatusPenerima(e.target.value)}
                options={[
                  { value: 'Menunggu', label: 'Menunggu Verifikasi / Antrean' },
                  { value: 'Diterima', label: 'Disetujui (Siap Salur)' },
                  { value: 'Selesai', label: 'Selesai (Sudah Diambil/Diterima Fisik)' },
                  { value: 'Ditolak', label: 'Ditolak' },
                ]}
                required
                error={validationErrors.status_penerima?.[0]}
              />

              <FormInput
                label="Tanggal Pengambilan / Penyerahan Fisik"
                type="date"
                name="tanggal_menerima"
                value={tanggalMenerima}
                onChange={(e) => setTanggalMenerima(e.target.value)}
                helperText="Wajib diisi bila bantuan telah diserahkan (Selesai)"
                error={validationErrors.tanggal_menerima?.[0]}
              />
            </div>

            <FormTextarea
              label="Catatan Pengambilan / Penerima"
              name="catatan"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={2}
              placeholder="Catatan penyerahan bantuan, pihak yang mengambil, atau nomor tanda terima..."
              error={validationErrors.catatan?.[0]}
            />
          </div>

          {/* Bagian Barcode & Dokumen Undangan Pengambilan */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Tahap 3: Surat Undangan & Barcode Pengambilan (Bantuan Top-Down)
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Untuk bantuan resmi dari pemerintah/Kemensos/PT Pos, unggah surat undangan atau barcode pengambilan agar warga dapat langsung melihat dan menunjukkan barcode di ponsel saat pengambilan bantuan.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                label="Nomor Undangan / Kode Barcode"
                name="nomor_undangan"
                value={nomorUndangan}
                onChange={(e) => setNomorUndangan(e.target.value)}
                placeholder="Contoh: POS-2026-004521 / UND-019"
                error={validationErrors.nomor_undangan?.[0]}
                helperText="Opsional. Nomor unik barcode/undangan penyaluran"
              />

              <FormFile
                label="Unggah Barcode / Surat Undangan"
                name="barcode_pengambilan"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setBarcodeFile(e.target.files[0])
                  }
                }}
                error={validationErrors.barcode_pengambilan?.[0]}
                helperText="Format: JPG, PNG, WEBP, atau PDF (maks. 4MB)"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/admin/bantuan"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Penerima Bantuan'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
