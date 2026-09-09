import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import PageHeader from '../../../../src/components/ui/page-header'
import FormSelect from '../../../../src/components/form/select'
import FormTextarea from '../../../../src/components/form/textarea'
import FormFile from '../../../../src/components/form/file'
import AlertError from '../../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../../src/components/ui/loading'
import ConfirmModal from '../../../../src/components/modal/Confirm'
import { useAlert } from '../../../../src/context/AlertContext'
import api from '../../../../src/lib/api'
import { PengajuanSurat } from '../../../../src/types'

export default function AdminPengajuanSuratVerifikasi() {
  const router = useRouter()
  const { id } = router.query
  const { showAlert } = useAlert()
  const [surat, setSurat] = useState<PengajuanSurat | null>(null)
  const [loadingInitial, setLoadingInitial] = useState(true)

  const [status, setStatus] = useState('Diproses')
  const [catatanOperator, setCatatanOperator] = useState('')
  const [fileHasilSurat, setFileHasilSurat] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!id) return
    async function fetchVerifikasi() {
      try {
        const res = await api.get('/admin/pengajuan-surat/' + id + '/verifikasi')
        const s: PengajuanSurat = res.data.pengajuanSurat
        setSurat(s)
        if (s) {
          setStatus(s.status)
          setCatatanOperator(s.catatan_operator || '')
        }
      } catch (err) {
        console.error('Failed to load verifikasi data:', err)
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchVerifikasi()
  }, [id])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirm(true)
  }

  const handleExecuteSave = async () => {
    setSubmitting(true)
    setError(null)
    setValidationErrors({})

    try {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('status', status)
      formData.append('catatan_operator', catatanOperator)
      if (fileHasilSurat) {
        formData.append('file_hasil_surat', fileHasilSurat)
      }

      await api.post('/admin/pengajuan-surat/' + id + '/verifikasi', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setShowConfirm(false)
      router.push('/admin/pengajuan-surat')
      showAlert({
        type: 'success',
        title: 'Status Berhasil Diperbarui!',
        message: 'Status verifikasi pengajuan surat telah berhasil disimpan.',
        onClose: () => router.push('/admin/pengajuan-surat'),
      })
    } catch (err: any) {
      setShowConfirm(false)
      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors)
      }
      setError(err?.response?.data?.message || 'Gagal menyimpan status verifikasi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial || !surat) {
    return (
      <AdminLayout pageTitle="Verifikasi Pengajuan Surat">
        <LoadingSpinner message="Memuat formulir verifikasi surat..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout pageTitle="Verifikasi Surat" subtitle={'Pemohon: ' + surat.nama_pemohon}>
      <PageHeader
        title="Formulir Verifikasi Surat"
        description="Perbarui status permohonan, beri catatan, atau unggah file surat yang telah ditandatangani"
        actions={[
          {
            label: 'Batal & Kembali',
            href: '/admin/pengajuan-surat',
            variant: 'secondary',
          },
        ]}
      />

      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="mb-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 space-y-1">
          <p>
            <span className="font-semibold text-slate-700">No. Pengajuan:</span> {surat.nomor_pengajuan}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Pemohon:</span> {surat.nama_pemohon} (NIK: {surat.nik})
          </p>
          <p>
            <span className="font-semibold text-slate-700">Jenis Surat:</span> {surat.jenis_surat?.nama || surat.jenis_surat_nama}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Keperluan:</span> {surat.keperluan}
          </p>
        </div>

        <AlertError message={error} errors={validationErrors} />

        <form onSubmit={handleFormSubmit} className="mt-4 space-y-5">
          <FormSelect
            label="Ubah Status Pengajuan"
            name="status"
            value={status}
            onChange={(e: any) => setStatus(e.target.value)}
            options={[
              { value: 'Menunggu', label: 'Menunggu Verifikasi' },
              { value: 'Diproses', label: 'Sedang Diproses' },
              { value: 'Selesai', label: 'Selesai (Surat Terbit)' },
              { value: 'Ditolak', label: 'Ditolak (Berkas Tidak Lengkap / Tidak Sesuai)' },
            ]}
            required
            error={validationErrors.status?.[0]}
          />

          <FormTextarea
            label="Catatan Verifikator / Operator"
            name="catatan_operator"
            value={catatanOperator}
            onChange={(e) => setCatatanOperator(e.target.value)}
            rows={3}
            placeholder="Berikan alasan jika ditolak, atau instruksi pengambilan jika selesai..."
            error={validationErrors.catatan_operator?.[0]}
          />

          <FormFile
            label="Unggah Berkas Surat Selesai (PDF/Scan)"
            accept="application/pdf,image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) setFileHasilSurat(e.target.files[0])
            }}
            helperText="Unggah hasil cetak / scan surat yang sudah ditandatangani dan dicap resmi"
            error={validationErrors.file_hasil_surat?.[0]}
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
              {submitting ? 'Menyimpan...' : 'Simpan Status Verifikasi'}
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Konfirmasi Perubahan Status Surat"
        message="Apakah Anda yakin ingin menyimpan perubahan status verifikasi pengajuan surat ini?"
        confirmText="Ya, Simpan Status"
        cancelText="Batal / Cek Kembali"
        variant="primary"
        loading={submitting}
        onConfirm={handleExecuteSave}
        onCancel={() => setShowConfirm(false)}
      />
    </AdminLayout>
  )
}
