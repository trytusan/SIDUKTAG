import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import UserLayout from '../../../src/components/layouts/user'
import PageHeader from '../../../src/components/ui/page-header'
import FormSelect from '../../../src/components/form/select'
import FormTextarea from '../../../src/components/form/textarea'
import AlertError from '../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../src/components/ui/loading'
import api from '../../../src/lib/api'
import { Bantuan } from '../../../src/types'

export default function UserBantuanCreate() {
  const router = useRouter()
  const [programList, setProgramList] = useState<Bantuan[]>([])
  const [loadingInitial, setLoadingInitial] = useState(true)

  const [bantuanId, setBantuanId] = useState('')
  const [catatan, setCatatan] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    async function init() {
      try {
        const res = await api.get('/user/bantuan/create')
        setProgramList(res.data.programBantuan || [])
      } catch (err) {
        console.error('Failed to load bantuan programs:', err)
      } finally {
        setLoadingInitial(false)
      }
    }
    init()
  }, [])

  const selectedProgram = programList.find((p) => String(p.id) === String(bantuanId))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setValidationErrors({})

    try {
      await api.post('/user/bantuan', {
        bantuan_id: bantuanId,
        catatan,
      })

      router.push('/user/bantuan')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal mendaftar bantuan.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial) {
    return (
      <UserLayout pageTitle="Daftar Program Bantuan">
        <LoadingSpinner message="Memuat program bantuan aktif..." />
      </UserLayout>
    )
  }

  return (
    <UserLayout pageTitle="Daftar Bantuan Sosial" subtitle="Pendaftaran program bantuan pemerintah">
      <PageHeader
        title="Formulir Pengajuan Bantuan"
        description="Pilih program bantuan sosial yang tersedia"
      />

      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <AlertError message={error} errors={validationErrors} />

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <FormSelect
            label="Pilih Program Bantuan"
            name="bantuan_id"
            value={bantuanId}
            onChange={(e) => setBantuanId(e.target.value)}
            options={programList.map((p) => ({
              value: p.id,
              label: `${p.nama_program} (${p.jenis_bantuan})`,
            }))}
            placeholder="-- Pilih Program Bantuan Sosial --"
            required
            error={validationErrors.bantuan_id?.[0]}
          />

          {selectedProgram && (
            <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 text-xs text-emerald-900 space-y-1.5">
              <p className="font-bold text-sm text-emerald-800">{selectedProgram.nama_program}</p>
              <p>{selectedProgram.deskripsi || 'Tidak ada deskripsi rinci.'}</p>
              <div className="pt-2 flex flex-wrap gap-4 text-slate-600">
                <span>
                  <strong>Sumber:</strong> {selectedProgram.sumber_bantuan || '-'}
                </span>
                <span>
                  <strong>Kuota:</strong> {selectedProgram.kuota_penerima ? `${selectedProgram.kuota_penerima} Penerima` : 'Tidak Terbatas'}
                </span>
              </div>
            </div>
          )}

          <FormTextarea
            label="Catatan Pengajuan / Keterangan Kondisi Ekonomi (Opsional)"
            name="catatan"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            rows={4}
            placeholder="Tuliskan keterangan pendukung pengajuan bantuan sosial..."
            error={validationErrors.catatan?.[0]}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/user/bantuan"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Mengirim...' : 'Kirim Pendaftaran'}
            </button>
          </div>
        </form>
      </div>
    </UserLayout>
  )
}
