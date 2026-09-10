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
  // Kolom Kondisional Status Kependudukan
  tanggal_meninggal?: string | null
  tempat_meninggal?: string | null
  akta_kematian?: string | null
  tanggal_pindah?: string | null
  alamat_tujuan?: string | null
  daerah_asal?: string | null
  tujuan_menetap?: string | null
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

export interface Wilayah {
  id: number
  kode_wilayah: string
  nama_wilayah: string
  jenis_wilayah: 'Dusun' | 'RW' | 'RT' | 'Lingkungan' | string
  kepala_wilayah: string
  nomor_telepon?: string | null
  jumlah_kk: number
  jumlah_penduduk: number
  luas_wilayah?: number | string | null
  latitude: number | string
  longitude: number | string
  deskripsi?: string | null
  warna_marker?: string
  created_at?: string
  updated_at?: string
}

export interface Berita {
  id: number
  judul: string
  slug: string
  kategori: 'Pengumuman' | 'Kegiatan Desa' | 'Bantuan Sosial' | 'Kesehatan' | 'Pembangunan' | string
  ringkasan: string
  konten: string
  gambar?: string | null
  status: 'Published' | 'Draft' | 'Archived'
  penulis: string
  tanggal_publikasi: string
  views: number
  created_at?: string
  updated_at?: string
}

export interface AnggotaKkSpasial {
  id: number
  nama_lengkap: string
  nik: string
  status_dalam_keluarga: string
  jenis_kelamin?: string | null
  pekerjaan?: string | null
  nomor_telepon?: string | null
  foto_profil?: string | null
  alamat?: string | null
  latitude?: number | null
  longitude?: number | null
  alamat_lokasi_ini?: string | null
}

export interface KkMarker {
  id: string
  kk_id: number | null
  nomor_kk: string
  nama_kepala_keluarga: string
  alamat_keluarga: string
  latitude: number
  longitude: number
  alamat_lokasi: string
  is_split: boolean
  tipe_marker: 'kk_bersama' | 'kk_utama' | 'kk_terpisah' | 'warga_mandiri' | string
  is_kepala_keluarga_here: boolean
  total_anggota_kk: number
  jumlah_anggota_di_lokasi: number
  anggota_di_lokasi: AnggotaKkSpasial[]
  anggota_lokasi_lain: AnggotaKkSpasial[]
  total_titik_kk: number
}

export interface PetaAdminStats {
  total_kk: number
  total_kk_satu_lokasi: number
  total_kk_terpencar: number
  total_titik_marker_kk: number
  total_penduduk_terpetakan: number
  total_fasilitas_umum: number
}

export interface PetaAdminData {
  kk_markers: KkMarker[]
  wilayah_list: Wilayah[]
  stats: PetaAdminStats
}

export interface TitikHunianKk {
  index: number
  status_label: string
  is_kepala_keluarga: boolean
  alamat: string
  latitude?: number | null
  longitude?: number | null
  jumlah_jiwa: number
  anggota: {
    id: number
    nama_lengkap: string
    nik: string
    status_dalam_keluarga: string
    alamat?: string | null
    nomor_telepon?: string | null
    pekerjaan?: string | null
  }[]
}

export interface SebaranKkWilayah {
  id: number
  nomor_kk: string
  nama_kepala_keluarga: string
  alamat_keluarga: string
  is_split: boolean
  status_spasial: string
  total_anggota: number
  jumlah_titik: number
  titik_hunian: TitikHunianKk[]
}

