import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import FormSelect from '../../../src/components/form/select'
import FormTextarea from '../../../src/components/form/textarea'
import FormFile from '../../../src/components/form/file'
import AlertError from '../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../src/components/ui/loading'
import api from '../../../src/lib/api'
import { JenisSurat, Penduduk } from '../../../src/types'

export default function AdminPengajuanSuratCreate() {
  const router = useRouter()
  const [pendudukList, setPendudukList] = useState<Penduduk[]>([])
  const [jenisSuratList, setJenisSuratList] = useState<JenisSurat[]>([])
  const [loadingInitial, setLoadingInitial] = useState(true)

  const [pendudukId, setPendudukId] = useState('')
  const [jenisSuratId, setJenisSuratId] = useState('')
  const [keperluan, setKeperluan] = useState('')
  const [dokumen, setDokumen] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    async function init() {
      try {
        const res = await api.get('/admin/pengajuan-surat/create')
        setPendudukList(res.data.penduduk || [])
        setJenisSuratList(res.data.jenisSurat || [])
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
      formData.append('jenis_surat_id', jenisSuratId)
      formData.append('keperluan', keperluan)
      if (dokumen) {
        formData.append('dokumen_pendukung', dokumen)
      }

      await api.post('/admin/pengajuan-surat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      router.push('/admin/pengajuan-surat')
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal membuat pengajuan surat.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial) {
    return (
      <AdminLayout pageTitle="Buat Pengajuan Surat">
        <LoadingSpinner message="Memuat formulir pengajuan..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout pageTitle="Buat Pengajuan Surat" subtitle="Entri pengajuan surat manual dari loket pelayanan">
      <PageHeader
        title="Formulir Pengajuan Surat Manual"
        description="Pilih warga, jenis surat dan keperluan pembuatan surat"
        actions={[
          {
            label: 'Batal & Kembali',
            href: '/admin/pengajuan-surat',
            variant: 'secondary',
          },
        ]}
      />

      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <AlertError message={error} errors={validationErrors} />

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <FormSelect
            label="Pilih Penduduk / Pemohon"
            name="penduduk_id"
            value={pendudukId}
            onChange={(e) => setPendudukId(e.target.value)}
            options={pendudukList.map((p) => ({
              value: p.id,
              label: p.nik + ' - ' + p.nama_lengkap,
            }))}
            placeholder="-- Pilih Warga Pemohon --"
            required
            error={validationErrors.penduduk_id?.[0]}
          />

          <FormSelect
            label="Pilih Jenis Surat"
            name="jenis_surat_id"
            value={jenisSuratId}
            onChange={(e) => setJenisSuratId(e.target.value)}
            options={jenisSuratList.map((js) => ({ value: js.id, label: js.nama }))}
            placeholder="-- Pilih Jenis Surat Keterangan --"
            required
            error={validationErrors.jenis_surat_id?.[0]}
          />

          <FormTextarea
            label="Keperluan Pengajuan"
            name="keperluan"
            value={keperluan}
            onChange={(e) => setKeperluan(e.target.value)}
            rows={4}
            placeholder="Tuliskan keperluan pembuatan surat..."
            required
            error={validationErrors.keperluan?.[0]}
          />

          <FormFile
            label="Dokumen Pendukung (Opsional)"
            accept="image/*,application/pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) setDokumen(e.target.files[0])
            }}
            error={validationErrors.dokumen_pendukung?.[0]}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/admin/pengajuan-surat"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan Pengajuan'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
