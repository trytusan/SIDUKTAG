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
  const [jenisList, setJenisList] = useState<string[]>([])
  const [loadingInitial, setLoadingInitial] = useState(true)

  const [wargaSearch, setWargaSearch] = useState('')
  const [filterJenis, setFilterJenis] = useState('')

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
        const pList = res.data.listPenduduk || res.data.penduduk || []
        const progList = res.data.allPrograms || res.data.program || []
        const jList = res.data.listJenis || res.data.jenis_bantuan || []
        setPendudukList(pList)
        setAllPrograms(progList)
        setJenisList(Array.isArray(jList) ? jList : [])
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

  // Filter warga berdasarkan pencarian nama/NIK
  const filteredPenduduk = pendudukList.filter((p) => {
    if (!wargaSearch.trim()) return true
    const q = wargaSearch.toLowerCase()
    return (p.nama_lengkap || '').toLowerCase().includes(q) || (p.nik || '').includes(q)
  })

  // Filter program berdasarkan jenis bantuan yang dipilih
  const filteredPrograms = allPrograms.filter((b) => {
    if (!filterJenis) return true
    return b.jenis_bantuan === filterJenis
  })

  const selectedPenduduk = pendudukList.find((p) => String(p.id) === String(pendudukId))
  const selectedProgram = allPrograms.find((b) => String(b.id) === String(bantuanId))

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

        {/* Notifikasi jika data penduduk atau program masih kosong */}
        {pendudukList.length === 0 && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-center justify-between">
            <span>Belum ada data warga terdaftar di sistem.</span>
            <Link href="/admin/penduduk/create" className="font-bold underline hover:text-amber-950">
              + Tambah Penduduk
            </Link>
          </div>
        )}

        {allPrograms.length === 0 && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-center justify-between">
            <span>Belum ada program bantuan aktif. Silakan buat program/jenis bantuan terlebih dahulu.</span>
            <Link href="/admin/jenis-bantuan/create" className="font-bold underline hover:text-amber-950">
              + Buat Program Bantuan
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Bagian 1: Pilih Warga Penerima */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800">
                1. Pilih Warga Penerima <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">
                {pendudukList.length} warga terdata
              </span>
            </div>

            {/* Input pencarian warga cepat */}
            {pendudukList.length > 5 && (
              <input
                type="text"
                placeholder="Ketik NIK atau nama untuk menyaring warga..."
                value={wargaSearch}
                onChange={(e) => setWargaSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500"
              />
            )}

            <FormSelect
              name="penduduk_id"
              value={pendudukId}
              onChange={(e) => setPendudukId(e.target.value)}
              options={filteredPenduduk.map((p) => ({
                value: p.id,
                label: `${p.nik} - ${p.nama_lengkap} (${p.status_dalam_keluarga || 'Warga'})`,
              }))}
              placeholder={filteredPenduduk.length === 0 ? '-- Warga tidak ditemukan --' : '-- Pilih Warga Penerima --'}
              required
              error={validationErrors.penduduk_id?.[0]}
            />

            {selectedPenduduk && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-900 flex items-center gap-2">
                <svg className="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  Warga terpilih: <strong>{selectedPenduduk.nama_lengkap}</strong> (NIK: {selectedPenduduk.nik}, KK: {selectedPenduduk.nomor_kk || '-'})
                </span>
              </div>
            )}
          </div>

          {/* Bagian 2: Pilih Program & Jenis Bantuan */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800">
                2. Pilih Program & Jenis Bantuan <span className="text-red-500">*</span>
              </label>
              <Link href="/admin/jenis-bantuan/create" className="text-xs text-emerald-600 font-bold hover:underline">
                + Buat Program Baru
              </Link>
            </div>

            {/* Filter Jenis Bantuan */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormSelect
                label="Filter Jenis Bantuan (Opsional)"
                value={filterJenis}
                onChange={(e) => {
                  setFilterJenis(e.target.value)
                  setBantuanId('') // reset program saat filter berubah
                }}
                options={[
                  { value: '', label: '-- Semua Jenis Bantuan --' },
                  ...Array.from(new Set(allPrograms.map((p) => p.jenis_bantuan).filter(Boolean))).map((jb) => ({
                    value: jb,
                    label: `Jenis: ${jb}`,
                  })),
                ]}
                placeholder="-- Semua Jenis Bantuan --"
              />

              <FormSelect
                label="Program Bantuan Spesifik"
                name="bantuan_id"
                value={bantuanId}
                onChange={(e) => setBantuanId(e.target.value)}
                options={filteredPrograms.map((b) => ({
                  value: b.id,
                  label: `${b.nama_program} [Jenis: ${b.jenis_bantuan}]`,
                }))}
                placeholder={filteredPrograms.length === 0 ? '-- Program tidak ditemukan --' : '-- Pilih Program Bantuan --'}
                required
                error={validationErrors.bantuan_id?.[0]}
              />
            </div>

            {selectedProgram && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3 text-xs text-blue-900 space-y-1">
                <p>
                  Program: <strong>{selectedProgram.nama_program}</strong> | Jenis:{' '}
                  <span className="font-semibold text-blue-700">{selectedProgram.jenis_bantuan}</span>
                </p>
                <p className="text-[11px] text-blue-700">
                  Sumber: {selectedProgram.sumber_bantuan || 'Pemerintah'} | Kuota: {selectedProgram.kuota_penerima ? `${selectedProgram.kuota_penerima} jiwa` : 'Tidak dibatasi'}
                </p>
              </div>
            )}
          </div>

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
