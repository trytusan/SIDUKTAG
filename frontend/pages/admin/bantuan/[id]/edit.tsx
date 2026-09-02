import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import PageHeader from '../../../../src/components/ui/page-header'
import FormSelect from '../../../../src/components/form/select'
import FormInput from '../../../../src/components/form/input'
import FormTextarea from '../../../../src/components/form/textarea'
import AlertError from '../../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../../src/components/ui/loading'
import api from '../../../../src/lib/api'
import { Penduduk, Bantuan, BantuanPenerima } from '../../../../src/types'

export default function AdminBantuanEdit() {
  const router = useRouter()
  const { id } = router.query
  const [bantuanData, setBantuanData] = useState<BantuanPenerima | null>(null)
  const [pendudukList, setPendudukList] = useState<Penduduk[]>([])
  const [allPrograms, setAllPrograms] = useState<Bantuan[]>([])
  const [loadingInitial, setLoadingInitial] = useState(true)

  const [pendudukId, setPendudukId] = useState('')
  const [bantuanId, setBantuanId] = useState('')
  const [statusPenerima, setStatusPenerima] = useState('Diterima')
  const [tanggalMenerima, setTanggalMenerima] = useState('')
  const [catatan, setCatatan] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!id) return
    async function fetchEdit() {
      try {
        const res = await api.get('/admin/bantuan/' + id + '/edit')
        const bp: BantuanPenerima = res.data.bantuan
        setBantuanData(bp)
        setPendudukList(res.data.listPenduduk || [])
        setAllPrograms(res.data.allPrograms || [])
        if (bp) {
          setPendudukId(String(bp.penduduk_id))
          setBantuanId(String(bp.bantuan_id))
          setStatusPenerima(bp.status_penerima)
          setTanggalMenerima(bp.tanggal_menerima ? bp.tanggal_menerima.substring(0, 10) : '')
          setCatatan(bp.catatan || '')
        }
      } catch (err) {
        console.error('Failed to load edit bantuan:', err)
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchEdit()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setValidationErrors({})

    try {
      await api.put('/admin/bantuan/' + id, {
        penduduk_id: pendudukId,
        bantuan_id: bantuanId,
        status_penerima: statusPenerima,
        tanggal_menerima: tanggalMenerima || null,
        catatan,
      })

      router.push('/admin/bantuan')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal memperbarui data penerima bantuan.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial || !bantuanData) {
    return (
      <AdminLayout pageTitle="Edit Penerima Bantuan">
        <LoadingSpinner message="Memuat form edit penerima bantuan..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout pageTitle="Edit Penerima Bantuan" subtitle={'Warga: ' + (bantuanData.penduduk?.nama_lengkap || '-')}>
      <PageHeader
        title="Formulir Edit Penerima Bantuan"
        description="Perbarui status verifikasi, tanggal penerimaan, atau catatan"
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
            label="Warga Penerima"
            name="penduduk_id"
            value={pendudukId}
            onChange={(e) => setPendudukId(e.target.value)}
            options={pendudukList.map((p) => ({
              value: p.id,
              label: p.nik + ' - ' + p.nama_lengkap,
            }))}
            required
            error={validationErrors.penduduk_id?.[0]}
          />

          <FormSelect
            label="Program Bantuan"
            name="bantuan_id"
            value={bantuanId}
            onChange={(e) => setBantuanId(e.target.value)}
            options={allPrograms.map((b) => ({
              value: b.id,
              label: b.nama_program + ' (' + b.jenis_bantuan + ')',
            }))}
            required
            error={validationErrors.bantuan_id?.[0]}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormSelect
              label="Status Penerima"
              name="status_penerima"
              value={statusPenerima}
              onChange={(e: any) => setStatusPenerima(e.target.value)}
              options={['Menunggu', 'Diterima', 'Ditolak', 'Selesai']}
              required
              error={validationErrors.status_penerima?.[0]}
            />

            <FormInput
              label="Tanggal Penyaluran"
              type="date"
              name="tanggal_menerima"
              value={tanggalMenerima}
              onChange={(e) => setTanggalMenerima(e.target.value)}
              error={validationErrors.tanggal_menerima?.[0]}
            />
          </div>

          <FormTextarea
            label="Catatan Verifikasi / Penyaluran"
            name="catatan"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            rows={3}
            error={validationErrors.catatan?.[0]}
          />

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
              {submitting ? 'Menyimpan...' : 'Perbarui Data Penerima'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
