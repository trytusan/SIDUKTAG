export interface User {
  id: number
  name: string
  email: string
  telepon?: string | null
  jabatan?: string | null
  role: 'admin' | 'user'
  is_active: boolean
  penduduk?: Penduduk | null
  created_at?: string
  updated_at?: string
}

export interface Penduduk {
  id: number
  user_id?: number | null
  nama_lengkap: string
  nik: string
  nomor_kk: string
  nomor_ktp?: string | null
  tempat_lahir?: string | null
  tanggal_lahir?: string | null
  jenis_kelamin?: 'Laki-laki' | 'Perempuan' | string | null
  agama?: string | null
  status_perkawinan?: string | null
  pekerjaan?: string | null
  pendidikan_terakhir?: string | null
  kategori_umur?: string | null
  status_dalam_keluarga?: string | null
  status_kependudukan?: 'Tetap' | 'Pendatang' | 'Pindah' | 'Meninggal' | string | null
  nomor_telepon?: string | null
  alamat_lengkap?: string | null
  foto_profil?: string | null
  dokumen_pendukung?: string | null
  latitude?: string | number | null
  longitude?: string | number | null
  is_profile_completed: boolean
  kartu_keluarga?: KartuKeluarga | null
  kartuKeluarga?: KartuKeluarga | null
  created_at?: string
  updated_at?: string
}

export interface KartuKeluarga {
  id: number
  nomor_kk: string
  nama_kepala_keluarga: string
  alamat_keluarga: string
  rt?: string | null
  rw?: string | null
  jumlah_anggota: number
  latitude?: string | number | null
  longitude?: string | number | null
  anggota?: Penduduk[]
  anggota_count?: number
  created_at?: string
  updated_at?: string
}

export interface JenisSurat {
  id: number
  nama: string
  slug: string
  deskripsi?: string | null
  template_file?: string | null
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface PengajuanSurat {
  id: number
  user_id: number
  penduduk_id: number
  jenis_surat_id: number
  nomor_pengajuan: string
  nama_pemohon: string
  nik: string
  jenis_surat_nama: string
  keperluan: string
  tanggal_pengajuan: string
  tanggal_pengesahan?: string | null
  status: 'Menunggu' | 'Diproses' | 'Selesai' | 'Ditolak'
  catatan_operator?: string | null
  dokumen_pendukung?: string | null
  file_hasil_surat?: string | null
  penduduk?: Penduduk
  jenis_surat?: JenisSurat
  jenisSurat?: JenisSurat
  lampiran?: any[]
  riwayat_status?: any[]
  riwayatStatus?: any[]
  created_at?: string
  updated_at?: string
}

export interface Bantuan {
  id: number
  nama_program: string
  jenis_bantuan: string
  deskripsi?: string | null
  tanggal_mulai?: string | null
  tanggal_selesai?: string | null
  status_bantuan: 'Aktif' | 'Nonaktif' | 'Selesai'
  kuota_penerima?: number | null
  sumber_bantuan?: string | null
  penerima_count?: number
  created_at?: string
  updated_at?: string
}

export interface BantuanPenerima {
  id: number
  bantuan_id: number
  penduduk_id: number
  tanggal_menerima?: string | null
  status_penerima: 'Menunggu' | 'Diterima' | 'Ditolak' | 'Selesai'
  catatan?: string | null
  bantuan?: Bantuan
  penduduk?: Penduduk
  created_at?: string
  updated_at?: string
}

export interface PaginatedResponse<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number | null
  last_page: number
  last_page_url: string
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}

