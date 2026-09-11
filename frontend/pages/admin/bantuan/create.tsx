import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import FormSelect from '../../../src/components/form/select'
import FormInput from '../../../src/components/form/input'
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
  const [catatan, setCatatan] = useState('')
  const [catatanOperator, setCatatanOperator] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    async function init() {
      try {
        const res = await api.get('/admin/bantuan/create')
        setPendudukList(res.data.listPenduduk || [])
        setAllPrograms(res.data.allPrograms || [])
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
      await api.post('/admin/bantuan', {
        penduduk_id: pendudukId,
        bantuan_id: bantuanId,
        status_penerima: statusPenerima,
        status_verifikasi: statusVerifikasi,
        tanggal_verifikasi: tanggalVerifikasi || null,
        tanggal_menerima: statusPenerima === 'Selesai' ? tanggalMenerima : (tanggalMenerima || null),
        catatan,
        catatan_operator: catatanOperator,
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
