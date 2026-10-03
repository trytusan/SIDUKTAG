import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import api from '../../../../src/lib/api'
import { LaporDiri } from '../../../../src/types'

export default function LaporDiriCetakPage() {
  const router = useRouter()
  const { id } = router.query
  const [data, setData] = useState<LaporDiri | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchData() {
      try {
        const res = await api.get('/admin/lapor-diri/' + id)
        setData(res.data.lapor_diri || res.data.data)
      } catch (err) {
        console.error('Failed to load lapor diri for print:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500 font-sans">
        Memuat lembar cetak formulir...
      </div>
    )
  }

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatShortDate = (dateStr?: string | null) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <>
      <Head>
        <title>Formulir Lapor Diri - {data.nama_lengkap}</title>
      </Head>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 1.2cm 1.5cm;
          }
          body {
            background: #fff !important;
            color: #000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .sheet-container {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* Floating Action Bar */}
      <div className="no-print fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Cetak Dokumen
        </button>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 transition"
        >
          Tutup
        </button>
      </div>

      <div className="min-h-screen bg-slate-100 py-6 sm:py-10 text-slate-900">
        <div className="sheet-container mx-auto max-w-[210mm] bg-white p-8 sm:p-12 shadow-md border border-slate-200 text-[11.5px] leading-relaxed font-sans">
          {/* Header Kop Surat */}
          <div className="text-center border-b-2 border-black pb-2 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider m-0">
              PEMERINTAH KOTA DENPASAR &bull; KECAMATAN DENPASAR TIMUR
            </h3>
            <h2 className="text-sm font-bold uppercase my-0.5 tracking-wide">
              BANJAR SABA KELURAHAN PENATIH
            </h2>
            <p className="text-[10px] text-slate-600 m-0">
              Sekretariat: Balai Banjar Saba, Penatih, Denpasar Timur, Kota Denpasar, Bali &bull; Kode Pos 80238
            </p>
          </div>

          <div className="text-center text-sm font-bold uppercase tracking-wider my-3">
            FORMULIR LAPOR DIRI WARGA BARU / PENDATANG
            {data.kewarganegaraan === 'WNA' ? ' (WARGA NEGARA ASING / WNA)' : ''}
          </div>

          {/* Bagian A: DATA PRIBADI */}
          <div className="font-bold text-xs uppercase mb-1">
            A. DATA PRIBADI {data.kewarganegaraan === 'WNA' ? '(WARGA NEGARA ASING)' : ''}
          </div>
          {data.kewarganegaraan === 'WNA' ? (
            <table className="w-full mb-2">
              <tbody>
                <tr>
                  <td className="w-5 align-top py-0.5">1.</td>
                  <td className="w-52 align-top py-0.5">Nama Lengkap (Sesuai Paspor)</td>
                  <td className="w-3 align-top py-0.5">:</td>
                  <td className="align-top py-0.5 font-bold uppercase">{data.nama_lengkap}</td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">2.</td>
                  <td className="align-top py-0.5">Kewarganegaraan / Negara Asal</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5 font-semibold text-slate-800">{data.negara_asal || 'Asing'}</td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">3.</td>
                  <td className="align-top py-0.5">Nomor Paspor</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5 font-mono font-bold">
                    {data.nomor_paspor || '-'}{' '}
                    {data.masa_berlaku_paspor && (
                      <span className="font-sans font-normal text-[10px] text-slate-600">
                        (Masa Berlaku s/d: {formatShortDate(data.masa_berlaku_paspor)})
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">4.</td>
                  <td className="align-top py-0.5">Jenis & No. Izin Tinggal</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">
                    {data.jenis_izin_tinggal || '-'}
                    {data.nomor_izin_tinggal ? ` (No: ${data.nomor_izin_tinggal})` : ''}
                    {data.masa_berlaku_izin ? ` - Berlaku s/d: ${formatShortDate(data.masa_berlaku_izin)}` : ''}
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">5.</td>
                  <td className="align-top py-0.5">Jenis Kelamin</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">
                    <span className="mr-4 inline-flex items-center gap-1.5">
                      <span
                        className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                          data.jenis_kelamin === 'Laki-Laki' ? 'bg-black text-white' : ''
                        }`}
                      >
                        {data.jenis_kelamin === 'Laki-Laki' ? '✓' : ''}
                      </span>
                      Laki-Laki
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                          data.jenis_kelamin === 'Perempuan' ? 'bg-black text-white' : ''
                        }`}
                      >
                        {data.jenis_kelamin === 'Perempuan' ? '✓' : ''}
                      </span>
                      Perempuan
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">6.</td>
                  <td className="align-top py-0.5">Tempat/ Tanggal Lahir</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">
                    {data.tempat_lahir || '-'}, {formatShortDate(data.tanggal_lahir)}
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">7.</td>
                  <td className="align-top py-0.5">Status Perkawinan</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">
                    {['Belum Kawin', 'Kawin', 'Cerai'].map((st) => (
                      <span key={st} className="mr-3 inline-flex items-center gap-1.5">
                        <span
                          className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                            (data.status_perkawinan || '').includes(st) ? 'bg-black text-white' : ''
                          }`}
                        >
                          {(data.status_perkawinan || '').includes(st) ? '✓' : ''}
                        </span>
                        {st}
                      </span>
                    ))}
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">8.</td>
                  <td className="align-top py-0.5">Status Bekerja di Indonesia</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">
                    <span className="font-bold text-slate-800">{data.status_bekerja || '-'}</span>
                    {data.status_bekerja === 'Bekerja' && (
                      <span className="block text-[10.5px] mt-0.5">
                        Pemberi Kerja: <strong>{data.nama_perusahaan || '-'}</strong> &bull; Posisi:{' '}
                        {data.jabatan_pekerjaan || '-'}
                        {data.nomor_dokumen_kerja ? ` (RPTKA: ${data.nomor_dokumen_kerja})` : ''}
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">9.</td>
                  <td className="align-top py-0.5">Penjamin / Sponsor di Bali</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">
                    {data.nama_penjamin ? (
                      <span>
                        <strong>{data.nama_penjamin}</strong> ({data.kategori_penjamin || 'Sponsor'})
                        {data.telepon_penjamin ? ` - Telp: ${data.telepon_penjamin}` : ''}
                        {data.alamat_penjamin ? ` &bull; Alamat: ${data.alamat_penjamin}` : ''}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">10.</td>
                  <td className="align-top py-0.5">Nomor Telp/ WhatsApp</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">{data.nomor_telepon || '-'}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full mb-2">
              <tbody>
                <tr>
                  <td className="w-5 align-top py-0.5">1.</td>
                  <td className="w-48 align-top py-0.5">Nama Lengkap</td>
                  <td className="w-3 align-top py-0.5">:</td>
                  <td className="align-top py-0.5 font-bold uppercase">{data.nama_lengkap}</td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">2.</td>
                  <td className="align-top py-0.5">Jenis Kelamin</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">
                    <span className="mr-4 inline-flex items-center gap-1.5">
                      <span
                        className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                          data.jenis_kelamin === 'Laki-Laki' ? 'bg-black text-white' : ''
                        }`}
                      >
                        {data.jenis_kelamin === 'Laki-Laki' ? '✓' : ''}
                      </span>
                      Laki-Laki
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                          data.jenis_kelamin === 'Perempuan' ? 'bg-black text-white' : ''
                        }`}
                      >
                        {data.jenis_kelamin === 'Perempuan' ? '✓' : ''}
                      </span>
                      Perempuan
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">3.</td>
                  <td className="align-top py-0.5">Tempat/ Tanggal Lahir</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">
                    {data.tempat_lahir}, {formatShortDate(data.tanggal_lahir)}
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">4.</td>
                  <td className="align-top py-0.5">Agama</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">{data.agama}</td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">5.</td>
                  <td className="align-top py-0.5">Status Perkawinan</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">
                    {['Belum Kawin', 'Kawin', 'Cerai Hidup', 'Cerai Mati'].map((st) => (
                      <span key={st} className="mr-3 inline-flex items-center gap-1.5">
                        <span
                          className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                            data.status_perkawinan === st ? 'bg-black text-white' : ''
                          }`}
                        >
                          {data.status_perkawinan === st ? '✓' : ''}
                        </span>
                        {st}
                      </span>
                    ))}
                  </td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">6.</td>
                  <td className="align-top py-0.5">Pekerjaan</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">{data.pekerjaan}</td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">7.</td>
                  <td className="align-top py-0.5">Nomor Induk Kependudukan (NIK)</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5 font-bold font-mono">{data.nik}</td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">8.</td>
                  <td className="align-top py-0.5">Nomor Kartu Keluarga (KK)</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5 font-mono">{data.nomor_kk || '-'}</td>
                </tr>
                <tr>
                  <td className="align-top py-0.5">9.</td>
                  <td className="align-top py-0.5">Nomor Telp/ Hp</td>
                  <td className="align-top py-0.5">:</td>
                  <td className="align-top py-0.5">{data.nomor_telepon || '-'}</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* Bagian B: DATA TEMPAT TINGGAL BARU */}
          <div className="font-bold text-xs uppercase mb-1 mt-2">
            B. DATA TEMPAT TINGGAL BARU (DI BANJAR SABA PENATIH)
          </div>
          <table className="w-full mb-2">
            <tbody>
              <tr>
                <td className="w-5 align-top py-0.5">1.</td>
                <td className="w-48 align-top py-0.5">Alamat Lengkap</td>
                <td className="w-3 align-top py-0.5">:</td>
                <td className="align-top py-0.5">{data.alamat_baru}</td>
              </tr>
              <tr>
                <td className="align-top py-0.5">2.</td>
                <td className="align-top py-0.5">Tanggal Tinggal di Alamat Baru</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">{formatShortDate(data.tanggal_mulai_tinggal)}</td>
              </tr>
              <tr>
                <td className="align-top py-0.5">3.</td>
                <td className="align-top py-0.5">Status Tempat Tinggal</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">
                  {['Milik Sendiri', 'Kontrak/Sewa', 'Numpang', 'Kost'].map((st) => (
                    <span key={st} className="mr-3 inline-flex items-center gap-1.5">
                      <span
                        className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                          data.status_tempat_tinggal === st ? 'bg-black text-white' : ''
                        }`}
                      >
                        {data.status_tempat_tinggal === st ? '✓' : ''}
                      </span>
                      {st}
                    </span>
                  ))}
                </td>
              </tr>
              <tr>
                <td className="align-top py-0.5">4.</td>
                <td className="align-top py-0.5">Nama Pemilik Rumah</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">{data.nama_pemilik_rumah || '-'}</td>
              </tr>
              <tr>
                <td className="align-top py-0.5">5.</td>
                <td className="align-top py-0.5">Nomor Kontak Pemilik Rumah</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">{data.nomor_kontak_pemilik || '-'}</td>
              </tr>
            </tbody>
          </table>

          {/* Bagian C: DATA ASAL */}
          <div className="font-bold text-xs uppercase mb-1 mt-2">C. DATA ASAL</div>
          <table className="w-full mb-2">
            <tbody>
              <tr>
                <td className="w-5 align-top py-0.5">1.</td>
                <td className="w-48 align-top py-0.5">Alamat Asal</td>
                <td className="w-3 align-top py-0.5">:</td>
                <td className="align-top py-0.5">{data.alamat_asal}</td>
              </tr>
              <tr>
                <td className="align-top py-0.5">2.</td>
                <td className="align-top py-0.5">RT/RW/ Lingkungan Asal</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">{data.rt_rw_asal || '-'}</td>
              </tr>
              <tr>
                <td className="align-top py-0.5">3.</td>
                <td className="align-top py-0.5">Kelurahan/Desa</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">{data.kelurahan_asal || '-'}</td>
              </tr>
              <tr>
                <td className="align-top py-0.5">4.</td>
                <td className="align-top py-0.5">Kecamatan</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">{data.kecamatan_asal || '-'}</td>
              </tr>
              <tr>
                <td className="align-top py-0.5">5.</td>
                <td className="align-top py-0.5">Kota/ Kabupaten</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">{data.kota_kabupaten_asal || '-'}</td>
              </tr>
            </tbody>
          </table>

          {/* Bagian D: DATA ANGGOTA KELUARGA YANG IKUT PINDAH */}
          <div className="font-bold text-xs uppercase mb-1 mt-2">
            D. DATA ANGGOTA KELUARGA YANG IKUT PINDAH
          </div>
          <table className="w-full border-collapse border border-black mb-3 text-[11px]">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-black py-1 px-2 text-center w-8">NO</th>
                <th className="border border-black py-1 px-2 text-left">Nama</th>
                <th className="border border-black py-1 px-2 text-center w-40">
                  {data.kewarganegaraan === 'WNA' ? 'No. Paspor / NIK' : 'NIK'}
                </th>
                <th className="border border-black py-1 px-2 text-left">Tempat, Tanggal Lahir</th>
                <th className="border border-black py-1 px-2 text-left w-32">Hubungan Keluarga</th>
              </tr>
            </thead>
            <tbody>
              {data.anggota && data.anggota.length > 0 ? (
                data.anggota.map((ang, idx) => (
                  <tr key={idx}>
                    <td className="border border-black py-1 px-2 text-center">{idx + 1}</td>
                    <td className="border border-black py-1 px-2 font-semibold">{ang.nama}</td>
                    <td className="border border-black py-1 px-2 text-center font-mono">
                      {ang.nomor_paspor ? `Paspor: ${ang.nomor_paspor}` : (ang.nik || '-')}
                    </td>
                    <td className="border border-black py-1 px-2">
                      {ang.tempat_lahir ? `${ang.tempat_lahir}, ` : ''}
                      {formatShortDate(ang.tanggal_lahir)}
                    </td>
                    <td className="border border-black py-1 px-2">{ang.hubungan_keluarga || '-'}</td>
                  </tr>
                ))
              ) : (
                [1, 2, 3].map((num) => (
                  <tr key={num}>
                    <td className="border border-black py-1 px-2 text-center text-slate-400">{num}</td>
                    <td className="border border-black py-1 px-2 text-slate-300">-</td>
                    <td className="border border-black py-1 px-2 text-center text-slate-300">-</td>
                    <td className="border border-black py-1 px-2 text-slate-300">-</td>
                    <td className="border border-black py-1 px-2 text-slate-300">-</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Bagian E: DOKUMEN YANG DILAMPIRKAN */}
          <div className="font-bold text-xs uppercase mb-1 mt-2">E. DOKUMEN YANG DILAMPIRKAN</div>
          {data.kewarganegaraan === 'WNA' ? (
            <table className="w-full mb-3 ml-2">
              <tbody>
                <tr>
                  <td className="w-6 py-0.5">
                    <span
                      className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                        data.lampiran_paspor ? 'bg-black text-white' : ''
                      }`}
                    >
                      {data.lampiran_paspor ? '✓' : ''}
                    </span>
                  </td>
                  <td className="py-0.5">1. Fotokopi Paspor Asing</td>
                </tr>
                <tr>
                  <td className="py-0.5">
                    <span
                      className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                        data.lampiran_kitas_kitap ? 'bg-black text-white' : ''
                      }`}
                    >
                      {data.lampiran_kitas_kitap ? '✓' : ''}
                    </span>
                  </td>
                  <td className="py-0.5">2. Fotokopi Izin Tinggal Terbatas / Tetap (KITAS / KITAP)</td>
                </tr>
                <tr>
                  <td className="py-0.5">
                    <span
                      className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                        data.lampiran_surat_permohonan ? 'bg-black text-white' : ''
                      }`}
                    >
                      {data.lampiran_surat_permohonan ? '✓' : ''}
                    </span>
                  </td>
                  <td className="py-0.5">3. Surat Permohonan / Pernyataan Sponsor / Penjamin</td>
                </tr>
                <tr>
                  <td className="py-0.5">
                    <span
                      className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                        data.lampiran_ktp_penjamin ? 'bg-black text-white' : ''
                      }`}
                    >
                      {data.lampiran_ktp_penjamin ? '✓' : ''}
                    </span>
                  </td>
                  <td className="py-0.5">4. Fotokopi KTP / Identitas Penjamin / Sponsor</td>
                </tr>
                <tr>
                  <td className="py-0.5">
                    <span
                      className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                        data.lampiran_dokumen_kerja ? 'bg-black text-white' : ''
                      }`}
                    >
                      {data.lampiran_dokumen_kerja ? '✓' : ''}
                    </span>
                  </td>
                  <td className="py-0.5">5. Dokumen Pendukung Kerja TKA (RPTKA / Kemenaker) (Bila Bekerja)</td>
                </tr>
                <tr>
                  <td className="py-0.5">
                    <span
                      className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                        data.lampiran_dokumen_lainnya ? 'bg-black text-white' : ''
                      }`}
                    >
                      {data.lampiran_dokumen_lainnya ? '✓' : ''}
                    </span>
                  </td>
                  <td className="py-0.5">6. Dokumen Pendukung Lainnya</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full mb-3 ml-2">
              <tbody>
                <tr>
                  <td className="w-6 py-0.5">
                    <span
                      className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                        data.lampiran_ktp ? 'bg-black text-white' : ''
                      }`}
                    >
                      {data.lampiran_ktp ? '✓' : ''}
                    </span>
                  </td>
                  <td className="py-0.5">1. Fotokopi Kartu Tanda Penduduk (KTP)</td>
                </tr>
                <tr>
                  <td className="py-0.5">
                    <span
                      className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                        data.lampiran_kk ? 'bg-black text-white' : ''
                      }`}
                    >
                      {data.lampiran_kk ? '✓' : ''}
                    </span>
                  </td>
                  <td className="py-0.5">2. Fotokopi Kartu Keluarga (KK)</td>
                </tr>
                <tr>
                  <td className="py-0.5">
                    <span
                      className={`inline-block w-3 h-3 border border-black text-[9px] font-bold text-center leading-[10px] ${
                        data.lampiran_surat_pindah ? 'bg-black text-white' : ''
                      }`}
                    >
                      {data.lampiran_surat_pindah ? '✓' : ''}
                    </span>
                  </td>
                  <td className="py-0.5">3. Surat Keterangan Pindah dari daerah asal (Jika Ada)</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* Bagian F: PERNYATAAN */}
          <div className="font-bold text-xs uppercase mb-1">F. PERNYATAAN</div>
          <div className="text-justify italic text-[11px] leading-relaxed mb-6">
            Dengan Ini saya menyatakan bahwa data yang saya isi adalah benar adanya. Jika dikemudian hari
            ditemukan ketidaksesuaian, saya bersedia bertanggung jawab sesuai dengan aturan yang berlaku.
          </div>

          {/* Tanda Tangan */}
          <table className="w-full text-center text-xs mt-6">
            <tbody>
              <tr>
                <td className="w-1/2 align-top">
                  Mengetahui,
                  <br />
                  <strong className="block mt-0.5">Kelian Banjar Saba Penatih</strong>
                  <div className="h-16"></div>
                  ( ___________________________ )
                </td>
                <td className="w-1/2 align-top">
                  Denpasar, {formatDate(data.tanggal_lapor)}
                  <br />
                  <span className="block mt-0.5">Pelapor,</span>
                  <div className="h-16"></div>
                  <strong className="underline uppercase">{data.nama_lengkap}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
