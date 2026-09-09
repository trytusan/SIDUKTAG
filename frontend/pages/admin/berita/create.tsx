import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../src/components/layouts/admin'
import PageHeader from '../../../src/components/ui/page-header'
import FormInput from '../../../src/components/form/input'
import FormSelect from '../../../src/components/form/select'
import FormTextarea from '../../../src/components/form/textarea'
import AlertSuccess from '../../../src/components/ui/alert-success'
import AlertError from '../../../src/components/ui/alert-error'
import { Berita } from '../../../src/types'
import { useAuth } from '../../../src/context/AuthContext'
import api from '../../../src/lib/api'

const SAMPLE_IMAGES = [
  { label: 'Musyawarah Desa', url: 'https://images.unsplash.com/photo-1524813686514-a57563d77d46?w=800&auto=format&fit=crop&q=60' },
  { label: 'Pelayanan Publik', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=60' },
  { label: 'Bantuan Sosial', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=60' },
  { label: 'Gotong Royong', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60' },
]

export default function AdminBeritaCreate() {
  const router = useRouter()
  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const todayStr = new Date().toISOString().split('T')[0]

  const [formData, setFormData] = useState({
    judul: '',
    slug: '',
    kategori: 'Pengumuman',
    ringkasan: '',
    konten: '',
    gambar: SAMPLE_IMAGES[0].url,
    status: 'Published',
    penulis: user?.name || 'Admin Administrator',
    tanggal_publikasi: todayStr,
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg(null)

    if (!formData.judul || !formData.ringkasan || !formData.konten) {
      setErrorMsg('Harap isi judul, ringkasan, dan konten berita lengkap.')
      setSubmitting(false)
      return
    }

    try {
      await api.post('/admin/berita', formData)
      setSuccessMsg('Berita berhasil disimpan dan dipublikasikan ke database! Mengalihkan...')
      setTimeout(() => {
        router.push('/admin/berita')
      }, 1000)
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal menyimpan berita ke server.'
      setErrorMsg(msg)
      setSubmitting(false)
    }
  }

  return (
    <AdminLayout
      title="Tambah Berita & Informasi — SIDUKTAG"
      pageTitle="Tambah Berita"
      subtitle="Publikasikan pengumuman penting, rilis informasi bantuan, atau dokumentasi kegiatan"
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
          <li className="text-slate-800 font-semibold">Tambah Berita</li>
        </ol>
      </nav>

      <PageHeader
        title="Formulir Publikasi Berita"
        description="Lengkapi detail artikel, foto sampul, dan tentukan status penayangan"
        actions={[
          {
            label: 'Batal & Kembali',
            href: '/admin/berita',
            variant: 'secondary',
          },
        ]}
      />

      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        {successMsg && <AlertSuccess message={successMsg} />}
        {errorMsg && <AlertError message={errorMsg} />}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Main Article Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              1. Informasi Utama Artikel
            </h3>

            <FormInput
              label="Judul Berita / Pengumuman"
              name="judul"
              placeholder="Contoh: Penyaluran Bantuan Sembako Warga Lansia Tahap 2"
              value={formData.judul}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormSelect
                label="Kategori Artikel"
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                options={[
                  { value: 'Pengumuman', label: 'Pengumuman' },
                  { value: 'Kegiatan Desa', label: 'Kegiatan Desa' },
                  { value: 'Bantuan Sosial', label: 'Bantuan Sosial' },
                  { value: 'Kesehatan', label: 'Kesehatan' },
                  { value: 'Pembangunan', label: 'Pembangunan' },
                ]}
                required
              />

              <FormSelect
                label="Status Publikasi"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'Published', label: 'Terbitkan Sekarang (Published)' },
                  { value: 'Draft', label: 'Simpan sebagai Konsep (Draft)' },
                ]}
                required
              />

              <FormInput
                label="Tanggal Publikasi"
                name="tanggal_publikasi"
                type="date"
                value={formData.tanggal_publikasi}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Penulis / Sumber"
                name="penulis"
                placeholder="Nama penulis"
                value={formData.penulis}
                onChange={handleChange}
                required
              />

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  URL Slug (Otomatis)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  readOnly
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100/70 px-4 py-2.5 text-xs text-slate-500 font-mono"
                  placeholder="slug-otomatis-dari-judul"
                />
              </div>
            </div>
          </div>

          {/* Media / Thumbnail */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              2. Foto Sampul (Thumbnail)
            </h3>

            <div>
              <FormInput
                label="URL Gambar Sampul"
                name="gambar"
                placeholder="https://example.com/foto-berita.jpg"
                value={formData.gambar}
                onChange={handleChange}
              />

              {/* Sample Quick Pickers */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Contoh gambar siap pakai:</span>
                {SAMPLE_IMAGES.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, gambar: s.url }))}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Thumbnail Live Preview */}
            {formData.gambar && (
              <div className="rounded-2xl border border-slate-200 p-3 bg-slate-50/50">
                <span className="text-[11px] font-semibold text-slate-500 block mb-2">Pratinjau Sampul:</span>
                <div className="h-48 sm:h-64 w-full rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                  <img
                    src={formData.gambar}
                    alt="Preview Sampul"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback image on error
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=60'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content / Body */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
              3. Ringkasan & Isi Artikel
            </h3>

            <FormTextarea
              label="Ringkasan Singkat (Excerpt)"
              name="ringkasan"
              placeholder="Tuliskan 1-2 kalimat pengantar singkat yang menarik pembaca..."
              value={formData.ringkasan}
              onChange={handleChange}
              rows={2}
              required
            />

            <FormTextarea
              label="Konten Berita Lengkap"
              name="konten"
              placeholder="Tuliskan isi berita, jadwal pelaksanaan, lokasi, narasumber, dan informasi penting lainnya..."
              value={formData.konten}
              onChange={handleChange}
              rows={8}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/admin/berita"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition active:scale-95 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{submitting ? 'Menyimpan...' : 'Simpan & Publikasikan'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
