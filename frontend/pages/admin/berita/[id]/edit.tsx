import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../../src/components/layouts/admin'
import FormInput from '../../../../src/components/form/input'
import FormSelect from '../../../../src/components/form/select'
import FormTextarea from '../../../../src/components/form/textarea'
import AlertSuccess from '../../../../src/components/ui/alert-success'
import AlertError from '../../../../src/components/ui/alert-error'
import LoadingSpinner from '../../../../src/components/ui/loading'
import ConfirmModal from '../../../../src/components/modal/Confirm'
import { Berita } from '../../../../src/types'
import api from '../../../../src/lib/api'
import { useAlert } from '../../../../src/context/AlertContext'

const SAMPLE_IMAGES = [
  { label: 'Musyawarah Desa', url: 'https://images.unsplash.com/photo-1524813686514-a57563d77d46?w=800&auto=format&fit=crop&q=60' },
  { label: 'Pelayanan Publik', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=60' },
  { label: 'Bantuan Sosial', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=60' },
  { label: 'Gotong Royong', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60' },
]

export default function AdminBeritaEdit() {
  const { showAlert } = useAlert()
  const router = useRouter()
  const { id } = router.query

  const [loadingInitial, setLoadingInitial] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const [formData, setFormData] = useState({
    judul: '',
    slug: '',
    kategori: 'Pengumuman',
    ringkasan: '',
    konten: '',
    gambar: SAMPLE_IMAGES[0].url,
    status: 'Published',
    penulis: '',
    tanggal_publikasi: '',
  })

  useEffect(() => {
    if (!id) return
    async function fetchBerita() {
      try {
        const res = await api.get('/admin/berita/' + id)
        const b: Berita = res.data.berita
        if (b) {
          setFormData({
            judul: b.judul || '',
            slug: b.slug || '',
            kategori: b.kategori || 'Pengumuman',
            ringkasan: b.ringkasan || '',
            konten: b.konten || '',
            gambar: b.gambar || SAMPLE_IMAGES[0].url,
            status: b.status || 'Published',
            penulis: b.penulis || 'Admin Administrator',
            tanggal_publikasi: b.tanggal_publikasi || '',
          })
        }
      } catch (err) {
        console.error('Failed to load berita:', err)
        setErrorMsg('Gagal memuat data berita.')
      } finally {
        setLoadingInitial(false)
      }
    }
    fetchBerita()
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    if (name === 'judul') {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      setFormData((prev) => ({
        ...prev,
        judul: value,
        slug: generatedSlug,
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.judul || !formData.ringkasan || !formData.konten) {
      setErrorMsg('Harap isi judul, ringkasan, dan konten berita lengkap.')
      return
    }
    setErrorMsg(null)
    setShowConfirm(true)
  }

  const handleExecuteSave = async () => {
    setSubmitting(true)
    setErrorMsg(null)

    try {
      await api.put('/admin/berita/' + id, formData)
      setSuccessMsg('Artikel berita berhasil diperbarui!')
      setShowConfirm(false)
      setTimeout(() => {
        router.push('/admin/berita')
      }, 800)
      showAlert({
        type: 'success',
        title: 'Berhasil Diperbarui!',
        message: 'Artikel berita telah berhasil diperbarui.',
        onClose: () => router.push('/admin/berita'),
      })
    } catch (err: any) {
      setShowConfirm(false)
      const msg = err?.response?.data?.message || 'Gagal memperbarui berita ke server.'
      setErrorMsg(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingInitial) {
    return (
      <AdminLayout pageTitle="Edit Berita">
        <LoadingSpinner message="Memuat formulir edit berita..." />
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="Edit Berita — SIDUKTAG"
      pageTitle="Edit Berita & Informasi"
      subtitle={'Mengubah artikel: ' + formData.judul}
    >
      {/* Breadcrumb */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <li>
            <Link href="/admin/dashboard" className="hover:text-emerald-600 transition">
              Dashboard
            </Link>
          </li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li>
            <Link href="/admin/berita" className="hover:text-emerald-600 transition">
              Berita & Informasi
            </Link>
          </li>
          <li>
            <svg className="h-3.5 w-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
          </li>
          <li className="text-slate-800 font-semibold">Edit Berita</li>
        </ol>
      </nav>

      <div className="mx-auto max-w-4xl">
        {successMsg && <AlertSuccess message={successMsg} />}
        {errorMsg && <AlertError message={errorMsg} />}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Perbarui Isi Artikel Berita</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pastikan informasi akurat sebelum menyimpan perubahan publikasi
              </p>
            </div>

            <div className="space-y-5">
              <FormInput
                label="Judul Berita / Pengumuman *"
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                placeholder="Judul artikel..."
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Kategori *"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  options={[
                    'Pengumuman',
                    'Agenda Kegiatan',
                    'Bantuan Sosial',
                    'Pembangunan Desa',
                    'Layanan Warga',
                    'Kesehatan & Posyandu',
                  ]}
                  required
                />

                <FormSelect
                  label="Status Publikasi *"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={['Published', 'Draft', 'Archived']}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Penulis / Kontributor"
                  name="penulis"
                  value={formData.penulis}
                  onChange={handleChange}
                  placeholder="Nama penulis..."
                />

                <FormInput
                  label="Tanggal Publikasi *"
                  type="date"
                  name="tanggal_publikasi"
                  value={formData.tanggal_publikasi}
                  onChange={handleChange}
                  required
                />
              </div>

              <FormTextarea
                label="Ringkasan Singkat *"
                name="ringkasan"
                value={formData.ringkasan}
                onChange={handleChange}
                rows={2}
                placeholder="Ringkasan atau intro singkat berita..."
                required
              />

              <FormTextarea
                label="Konten Lengkap Berita *"
                name="konten"
                value={formData.konten}
                onChange={handleChange}
                rows={8}
                placeholder="Tuliskan isi berita secara lengkap di sini..."
                required
              />

              {/* Pilihan Gambar Sampul */}
              <div className="space-y-2">
                <FormInput
                  label="URL Gambar Sampul (Opsional)"
                  name="gambar"
                  value={formData.gambar}
                  onChange={handleChange}
                  placeholder="https://..."
                />
                <div className="text-xs text-slate-500 font-medium">Atau pilih dari galeri tema desa:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {SAMPLE_IMAGES.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setFormData((p) => ({ ...p, gambar: img.url }))}
                      className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition p-1 bg-slate-50 ${
                        formData.gambar === img.url ? 'border-emerald-600 scale-[1.02] shadow-sm' : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="h-16 w-full object-cover rounded-xl" />
                      <div className="text-[11px] font-semibold text-center mt-1.5 text-slate-700 truncate">{img.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/admin/berita"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 transition"
            >
              {submitting ? 'Menyimpan...' : 'Perbarui Berita'}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Konfirmasi Simpan Perubahan"
        message="Apakah Anda yakin data artikel berita yang diubah sudah benar dan ingin menyimpan perubahan ini ke sistem?"
        confirmText="Ya, Simpan Perubahan"
        cancelText="Batal / Cek Kembali"
        variant="primary"
        loading={submitting}
        onConfirm={handleExecuteSave}
        onCancel={() => setShowConfirm(false)}
      />
    </AdminLayout>
  )
}

