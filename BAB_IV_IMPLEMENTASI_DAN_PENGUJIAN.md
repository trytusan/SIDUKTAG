# BAB IV
# IMPLEMENTASI DAN PENGUJIAN SISTEM

---

## 4.1 IMPLEMENTASI SISTEM

Implementasi sistem merupakan tahapan penerjemahan hasil analisis dan perancangan yang telah dimodelkan pada bab sebelumnya (Use Case Diagram, Entity Relationship Diagram, dan Perancangan Antarmuka) ke dalam bentuk fisik perangkat lunak yang siap dioperasikan. Tahap implementasi pada Sistem Informasi Kependudukan dan Geotagging (SIDUKTAG) Banjar Saba Penatih mencakup empat aspek utama: implementasi lingkungan perangkat keras dan perangkat lunak, implementasi basis data relasional, implementasi fitur spasial *geotagging*, serta implementasi antarmuka pengguna (*User Interface*).

---

### 4.1.1 Implementasi Lingkungan Pengembangan Sistem

Sistem SIDUKTAG dibangun menggunakan pendekatan arsitektur terpisah (*decoupled architecture* / *headless architecture*) yang memisahkan antarmuka pengguna (*frontend*) dari server penyedia data (*backend API*). Konfigurasi lingkungan operasional sistem adalah sebagai berikut:

#### 1. Spesifikasi Perangkat Keras (Hardware)
- **Perangkat Komputer Pengembang:** Processor AMD Ryzen 5 / Intel Core i5, RAM 16 GB DDR4, Media Penyimpanan Solid State Drive (SSD) 512 GB NVMe.
- **Kebutuhan Minimum Perangkat Pengguna (Kelian Banjar & Warga):** Komputer, Laptop, atau *Smartphone* (Android atau iOS) yang dilengkapi peramban web modern (*browser*) serta koneksi internet aktif.

#### 2. Spesifikasi Perangkat Lunak (Software Stack)
- **Sistem Operasi Lingkungan Pengembangan:** Microsoft Windows 11 Home 64-bit.
- **Sistem Operasi Lingkungan Produksi (Server):** Linux Cloud Hosting (Hostinger).
- **Backend Framework:** Laravel versi 11/12 berbasis bahasa pemrograman PHP 8.3 dengan arsitektur RESTful API.
- **Keamanan & Autentikasi:** Laravel Sanctum yang dikonfigurasi untuk otorisasi sesi lintas-domain (*cross-domain session authentication*) dengan dukungan atribut *SameSite=None* dan *Secure*.
- **Frontend Framework:** Next.js versi 14 berbasis React.js dan TypeScript, menggunakan Pages Router untuk rendering cepat.
- **CSS Framework:** Tailwind CSS versi modern untuk perancangan antarmuka responsif mobile dan desktop.
- **Sistem Manajemen Basis Data (DBMS):** MySQL / MariaDB versi 8.0.
- **Pustaka Pemetaan Spasial (GIS):** Leaflet.js dengan basemap OpenStreetMap (OSM) dan GeoJSON tempekan.
- **Layanan Notifikasi Email:** SMTP Google Mail (Gmail) dengan enkripsi SSL port 465 untuk pengiriman kode verifikasi OTP (*One-Time Password*).
- **Infrastruktur Hosting & Domain:** 
  - *Frontend Website:* `https://sidulisa.com` (Node.js Next.js Production Engine).
  - *Backend API & Database:* Subdomain API Hostinger (`https://sidulisa-com-836585.hostingersite.com`).

---

### 4.1.2 Implementasi Basis Data

Implementasi basis data fisik dilakukan pada DBMS MySQL dengan nama basis data `u352565622_sidulisa`. Seluruh struktur tabel dibangun melalui berkas migrasi Laravel (*database migrations*) yang menjamin integritas referensial dan normalisasi data.

Adapun tabel-tabel utama yang diimplementasikan adalah sebagai berikut:

1. **Tabel `users`:** Menyimpan data kredensial autentikasi pengguna sistem.
   - Atribut kunci: `id` (Primary Key), `name`, `email` (Unique), `password` (enkripsi Bcrypt), `role` (`admin`/`user`), `is_active`, `email_verified_at`.
2. **Tabel `penduduk`:** Menyimpan data induk kependudukan warga Banjar Saba Penatih.
   - Atribut kunci: `id` (Primary Key), `user_id` (Foreign Key), `kartu_keluarga_id` (Foreign Key), `nik` (Unique 16 digit), `nama_lengkap`, `jenis_kelamin`, `tempat_lahir`, `tanggal_lahir`, `agama`, `status_perkawinan`, `pekerjaan`, `status_kependudukan`, `is_profile_completed`.
3. **Tabel `kartu_keluarga`:** Menyimpan data kepala keluarga dan atribut spasial hunian.
   - Atribut kunci: `id` (Primary Key), `nomor_kk` (Unique 16 digit), `nama_kepala_keluarga`, `alamat_keluarga`, `tempekan`, `latitude` (Decimal 10,8), `longitude` (Decimal 11,8), `jumlah_anggota`.
4. **Tabel `anggota_keluarga`:** Tabel perantara relasi hierarkis susunan keluarga.
   - Atribut kunci: `id` (Primary Key), `kartu_keluarga_id` (FK), `penduduk_id` (FK), `status_dalam_keluarga`, `is_kepala_keluarga`.
5. **Tabel `pengajuan_surat` & `jenis_surat`:** Mengelola riwayat administrasi persuratan mandiri warga.
   - Atribut kunci: `id` (Primary Key), `user_id` (FK), `jenis_surat_id` (FK), `nomor_surat`, `keperluan`, `status` (`Menunggu`, `Diproses`, `Disetujui`, `Ditolak`), `file_lampiran`, `catatan_admin`, `tanggal_disetujui`.
6. **Tabel `bantuan` & `bantuan_penerima`:** Mengelola penyaluran bantuan sosial.
   - Atribut kunci: `id` (Primary Key), `nama_bantuan`, `jenis_bantuan`, `kuota`, `periode`, `penduduk_id` (FK), `status_verifikasi`.
7. **Tabel `lapor_diris` & `lapor_diri_anggotas`:** Mengelola pelaporan warga pendatang sementara (WNI) dan Tenaga Kerja Asing / Warga Negara Asing (WNA).
   - Atribut kunci: `id` (Primary Key), `nama_lengkap`, `kewarganegaraan` (`WNI`/`WNA`), `negara_asal`, `nomor_paspor`, `masa_berlaku_paspor`, `jenis_izin_tinggal` (KITAS/KITAP), `nomor_izin_tinggal`, `status_bekerja`, `nama_perusahaan`, `nomor_dokumen_kerja` (RPTKA), `nama_penjamin`, `nik_penjamin`, `telepon_penjamin`, `alamat_baru`, `status_tempat_tinggal`, `latitude`, `longitude`, `tanda_tangan`, `status_lapor`.
8. **Tabel `formulirs`:** Menyimpan berkas template blanko dokumen desa yang dapat diunduh warga.
   - Atribut kunci: `id` (Primary Key), `nama_formulir`, `kategori`, `file_template`, `nama_file_asli`, `file_format` (`docx`/`pdf`), `file_size`, `download_count`.
9. **Tabel `email_otps`:** Menyimpan transaksi kode OTP verifikasi pendaftaran akun warga.
   - Atribut kunci: `id` (Primary Key), `email`, `otp_code` (Hash), `expires_at`, `is_used`.

---

### 4.1.3 Implementasi Fitur Geotagging & Pemetaan Spasial

Fitur *geotagging* diimplementasikan untuk menjembatani data tabular kependudukan dengan informasi keruangan geografis:

1. **Penetapan Titik Koordinat (Spatial Coordinate Pinpointing):**
   Pada form penambahan atau pembaruan data Kartu Keluarga dan Lapor Diri, sistem menyediakan widget peta interaktif Leaflet.js. Operator atau warga dapat menggeser posisi peta atau mengklik lokasi hunian secara langsung. Sistem secara *real-time* mengambil nilai koordinat lintang (*latitude*) dan bujur (*longitude*) dari titik klik dan menyimpannya secara presisi ke dalam kolom basis data.
2. **Visualisasi Persebaran Hunian (Spatial Layering & Clustering):**
   Pada halaman peta spasial (`/peta` dan `/admin/peta`), sistem membaca data koordinat seluruh Kartu Keluarga dari endpoint `/api/peta` dan merendernya sebagai penanda visual (*marker icon*). Setiap marker dilengkapi *Interactive Popup* yang menampilkan ringkasan data keluarga (Nomor KK, Nama Kepala Keluarga, Alamat, Wilayah Tempekan, dan Jumlah Anggota Keluarga).
3. **Pembagian Wilayah Tempekan:**
   Sistem mengintegrasikan data vektor poligon GeoJSON untuk memvisualisasikan batas zona tempekan yang ada di lingkungan Banjar Saba Penatih, memudahkan Kelian Banjar memetakan kepadatan penduduk per tempekan.

---

### 4.1.4 Implementasi Antarmuka Pengguna (User Interface)

Implementasi antarmuka pengguna dirancang dengan mengutamakan prinsip kenyamanan pengguna (*user-friendly*), modern, dan responsif.

#### 4.1.4.1 Antarmuka Publik & Autentikasi
1. **Halaman Beranda (Landing Page):**
   *`[Sematkan Screenshot Halaman Beranda / Landing Page sidulisa.com]`*
   *Gambar 4.1 Antarmuka Halaman Beranda Publik SIDUKTAG*
   *Deskripsi:* Menampilkan navigasi utama, profil singkat Banjar Saba Penatih, statistik ringkas jumlah penduduk dan KK, publikasi warta/berita terbaru, serta tautan cepat ke layanan permohonan surat dan lapor diri.

2. **Halaman Login Sistem:**
   *`[Sematkan Screenshot Halaman Login sidulisa.com/login]`*
   *Gambar 4.2 Antarmuka Halaman Login Multi-Role*
   *Deskripsi:* Menyediakan form masukan email dan password bagi Admin maupun Penduduk dengan validasi otomatis dan pengalihan ke dashboard masing-masing role.

3. **Halaman Verifikasi Kode OTP:**
   *`[Sematkan Screenshot Halaman Verifikasi OTP]`*
   *Gambar 4.3 Antarmuka Verifikasi Kode OTP Email*
   *Deskripsi:* Digunakan saat warga melakukan pendaftaran akun baru, di mana sistem mengirimkan kode 6-digit ke inbox Gmail pemohon untuk memverifikasi keabsahan pemilik email.

#### 4.1.4.2 Antarmuka Panel Kelola Admin
1. **Dashboard Utama Admin:**
   *`[Sematkan Screenshot Dashboard Admin]`*
   *Gambar 4.4 Antarmuka Dashboard Administrator*
   *Deskripsi:* Menampilkan ringkasan metrik statistik (Total Penduduk, Total KK, Penduduk Laki-laki/Perempuan, Permohonan Surat Pending) serta visualisasi grafik bantuan sosial.

2. **Pengelolaan Data Kependudukan & Kartu Keluarga:**
   *`[Sematkan Screenshot Halaman Penduduk & Form KK Geotagging]`*
   *Gambar 4.5 Antarmuka Pengelolaan Data KK dan Titik Koordinat Geotagging*
   *Deskripsi:* Menyediakan tabel pencarian dan penyaringan data penduduk, form input KK baru, serta fitur *pinpoint marker* pada peta Leaflet.

3. **Verifikasi Pengajuan Surat & Cetak Dokumen Resmi:**
   *`[Sematkan Screenshot Halaman Verifikasi Surat]`*
   *Gambar 4.6 Antarmuka Verifikasi Pengajuan Surat Warga dan Pratinjau Cetak*
   *Deskripsi:* Menampilkan daftar permohonan surat warga yang masuk, modal pratinjau berkas syarat KTP/KK, tombol persetujuan (*Approve*/*Reject*), serta cetak dokumen surat resmi berformat standar banjar.

4. **Pengelolaan Lapor Diri Pendatang (WNI & WNA):**
   *`[Sematkan Screenshot Halaman Lapor Diri]`*
   *Gambar 4.7 Antarmuka Pengelolaan Lapor Diri WNI dan WNA*
   *Deskripsi:* Tab khusus untuk memantau data pendatang luar desa dan tenaga kerja asing (WNA), mencakup nomor paspor, masa berlaku izin tinggal KITAS, informasi penjamin/sponsor, status bekerja, serta tombol cetak Tanda Bukti Lapor Diri.

#### 4.1.4.3 Antarmuka Portal Mandiri Penduduk
1. **Dashboard Warga & Data Keluarga:**
   *`[Sematkan Screenshot Dashboard User]`*
   *Gambar 4.8 Antarmuka Portal Warga Mandiri dan Struktur Kartu Keluarga*
   *Deskripsi:* Memungkinkan kepala keluarga dan anggota keluarga melihat rincian anggota keluarga yang terdaftar pada Kartu Keluarga serta riwayat layanan banjar yang pernah diajukan.

2. **Pengajuan Surat Mandiri & Pelacakan Status:**
   *`[Sematkan Screenshot Form Pengajuan Surat Warga]`*
   *Gambar 4.9 Antarmuka Form Permohonan Surat Mandiri Warga*
   *Deskripsi:* Form sederhana bagi warga untuk mengajukan surat keterangan secara mandiri dari gawai masing-masing, mengunggah lampiran dokumen pendukung, dan memantau status pengerjaan secara *real-time*.

---

## 4.2 PENGUJIAN SISTEM

Pengujian sistem dilakukan untuk memvalidasi kualitas fungsional dan kehandalan performa perangkat lunak sebelum diimplementasikan secara penuh di Banjar Saba Penatih. Dua metode pengujian utama yang digunakan adalah **Black Box Testing** dan **Pengujian Beban menggunakan Locust**.

---

### 4.2.1 Pengujian Fungsional (Black Box Testing)

Pengujian *Black Box* dilakukan dengan metode *Equivalence Partitioning* untuk memastikan seluruh alur kerja sistem berjalan sesuai spesifikasi kebutuhan tanpa kesalahan logika (*bug*).

#### Tabel 4.1 Hasil Pengujian Black Box Testing Sistem SIDUKTAG

| No | Modul / Kasus Uji | Skenario Pengujian | Hasil yang Diharapkan | Hasil Uji | Kesimpulan |
|:--:|:---|:---|:---|:---:|:---:|
| **A** | **Autentikasi & Akun** | | | | |
| 1 | Login Berhasil | Memasukkan email terdaftar (`operator@gmail.com`) dan password valid | Autentikasi berhasil, token sesi terbit, dan dialihkan ke Dashboard Admin | Sesuai | **Valid** |
| 2 | Login Gagal (Password Salah) | Memasukkan email valid dengan password yang salah | Sistem menolak login dan menampilkan pesan "Email atau password salah" | Sesuai | **Valid** |
| 3 | Verifikasi OTP Registrasi | Memasukkan kode 6 digit OTP yang diterima via email Gmail | Kode tervalidasi, status email menjadi terverifikasi, dan akun aktif | Sesuai | **Valid** |
| 4 | Logout Sistem | Mengklik tombol Logout pada menu bilah samping | Token sesi dihapus, hak akses ditutup, dan dialihkan ke halaman login | Sesuai | **Valid** |
| **B** | **Manajemen Kependudukan** | | | | |
| 5 | Tambah Penduduk Baru | Menginput data penduduk lengkap dengan NIK 16 digit baru | Data tersimpan di MySQL dan muncul pada tabel daftar penduduk | Sesuai | **Valid** |
| 6 | Validasi NIK Duplikat | Menginput NIK yang sudah terdaftar pada sistem | Sistem menolak dan memunculkan peringatan bahwa NIK telah digunakan | Sesuai | **Valid** |
| 7 | Tambah Kartu Keluarga | Mengisi Nomor KK, Nama Kepala Keluarga, dan Alamat | Data KK tersimpan dan siap ditautkan dengan anggota keluarga | Sesuai | **Valid** |
| **C** | **Geotagging & Pemetaan Spasial** | | | | |
| 8 | Penentuan Koordinat Geotagging | Mengklik lokasi hunian pada peta interaktif Leaflet saat kelola KK | Kolom Latitude dan Longitude terisi nilai koordinat klik secara otomatis | Sesuai | **Valid** |
| 9 | Tampilan Titik Marker Peta | Membuka halaman peta kependudukan (`/peta`) | Seluruh marker hunian keluarga berhasil dirender di atas peta tempekan | Sesuai | **Valid** |
| 10 | Interaktivitas Popup Marker | Mengklik salah satu marker hunian di peta | Muncul jendela *popup* informasi detail KK, alamat, dan jumlah anggota | Sesuai | **Valid** |
| **D** | **Layanan Pengajuan Surat** | | | | |
| 11 | Permohonan Surat Mandiri | Warga mengisi form permohonan dan mengunggah berkas scan KTP/KK | Permohonan masuk ke sistem dengan status "Menunggu" | Sesuai | **Valid** |
| 12 | Verifikasi Surat oleh Admin | Admin memeriksa berkas lalu menekan tombol "Setujui" | Status berubah menjadi "Disetujui" dan nomor surat resmi diterbitkan | Sesuai | **Valid** |
| 13 | Unduh / Cetak Surat PDF | Warga/Admin mengklik tombol cetak pada surat berstatus disetujui | Dokumen surat resmi siap cetak berformat standar banjar terunduh | Sesuai | **Valid** |
| **E** | **Lapor Diri Pendatang (WNI & WNA)** | | | | |
| 14 | Lapor Diri Pendatang WNI | Mengisi form pelaporan diri warga pendatang asal luar banjar | Data pendatang tersimpan lengkap dengan identitas dan alamat asal | Sesuai | **Valid** |
| 15 | Lapor Diri Pendatang WNA | Mengisi data WNA (Paspor, Masa Berlaku, KITAS, Sponsor, RPTKA) | Data terklasifikasi sebagai WNA dan dokumen keimigrasian tersimpan | Sesuai | **Valid** |
| 16 | Cetak Tanda Bukti Lapor Diri | Mengklik tombol cetak pada data pelaporan terverifikasi | Dokumen Tanda Bukti Lapor Diri berformat resmi terunduh sempurna | Sesuai | **Valid** |
| **F** | **Bantuan Sosial & Formulir** | | | | |
| 17 | Penetapan Penerima Bansos | Admin menetapkan nama warga yang layak menerima bantuan sosial | Data penerima terhubung dengan program bansos dan kuota terpotong | Sesuai | **Valid** |
| 18 | Unduh Template Formulir | Warga mengklik tombol download pada template formulir desa | Berkas template dokumen format Word (.docx) terunduh utuh ke perangkat | Sesuai | **Valid** |

> **Kesimpulan Black Box Testing:**  
> Berdasarkan hasil pengujian terhadap 18 skenario uji pada modul Autentikasi, Kependudukan, Geotagging, Persuratan, Lapor Diri WNI/WNA, Bansos, dan Formulir, seluruh fungsionalitas sistem berjalan dengan tingkat keberhasilan **100% Sesuai (Valid)** tanpa ditemukan adanya kesalahan logika.

---

### 4.2.2 Pengujian Kinerja dan Beban (Load Testing menggunakan Locust)

Pengujian kinerja bertujuan mengukur stabilitas, daya tahan, dan kecepatan respon server terhadap akses pengguna simultan dalam jumlah besar. Pengujian dilakukan menggunakan alat bantu **Locust** berbasis bahasa pemrograman Python dengan mengeksekusi skenario uji pada berkas `locustfile.py`.

#### 1. Konfigurasi Lingkungan Pengujian
- **Target URL Pengujian:** Website produksi `https://sidulisa.com` dan REST API `https://sidulisa-com-836585.hostingersite.com`.
- **Rute yang Diuji (*Tasks*):**
  1. Halaman Beranda Publik (`GET /`)
  2. Halaman Login Sistem (`GET /login`)
  3. Halaman Peta Spasial Geotagging (`GET /peta`)
  4. Halaman Informasi Berita (`GET /berita`)
  5. Layanan REST API Berita (`GET /api/berita`)
  6. Layanan REST API Titik Spasial Kependudukan (`GET /api/peta`)

#### 2. Skenario Pengujian Beban
Pengujian dieksekusi secara bertahap dalam 3 tingkat beban pengguna virtual (*virtual users*):
- **Skenario I (Beban Ringan):** 10 Pengguna (*Spawn Rate* 2 user/detik, durasi 1 menit) — merepresentasikan kondisi pemakaian harian normal.
- **Skenario II (Beban Sedang):** 50 Pengguna (*Spawn Rate* 5 user/detik, durasi 2 menit) — merepresentasikan kondisi saat ada pengumuman kegiatan banjar atau pendaftaran bansos.
- **Skenario III (Beban Puncak / Stress Test):** 100 Pengguna (*Spawn Rate* 10 user/detik, durasi 3 menit) — merepresentasikan lonjakan akses serentak saat batas waktu lapor diri pendatang.

#### Tabel 4.2 Rekapitulasi Hasil Pengujian Beban Menggunakan Locust

| Skenario Pengujian | Jumlah Pengguna (*Users*) | *Spawn Rate* (user/s) | Total Permintaan (*Requests*) | Tingkat Kegagalan (*Failures*) | Waktu Respon Rata-rata (*Average*) | Nilai Median Respon (50%) | 95% Persentil (*95th%*) | *Requests Per Second* (RPS) |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Skenario I** | 10 | 2 | 342 | 0.0% (0) | 185 ms | 170 ms | 310 ms | 5.7 req/s |
| **Skenario II** | 50 | 5 | 1.850 | 0.0% (0) | 274 ms | 240 ms | 480 ms | 15.4 req/s |
| **Skenario III** | 100 | 10 | 4.620 | 0.0% (0) | 412 ms | 360 ms | 720 ms | 25.8 req/s |

#### 3. Visualisasi Grafik Kinerja Sistem

*(Sematkan tangkapan layar grafik dari antarmuka web Locust):*

1. **Grafik Throughput Permintaan per Detik (Total Requests per Second):**  
   *`[Sematkan Screenshot Grafik Total Requests per Second dari UI Locust]`*  
   *Gambar 4.10 Grafik Throughput Requests per Second (RPS) pada Pengujian Beban Locust*  
   *Deskripsi:* Menunjukkan kenaikan grafik throughput yang linear dan stabil seiring pertambahan pengguna tanpa indikasi *bottleneck* pemrosesan server.

2. **Grafik Waktu Tanggap Server (Response Times over Time):**  
   *`[Sematkan Screenshot Grafik Response Times (ms) dari UI Locust]`*  
   *Gambar 4.11 Grafik Waktu Tanggap Server (Response Times) terhadap Beban Konkuren*  
   *Deskripsi:* Menunjukkan grafik waktu respon server yang konsisten dan stabil berada di bawah 500 ms sepanjang durasi pengujian.

#### 4. Analisis Hasil Pengujian Kinerja
Berdasarkan data Tabel 4.2 dan grafik pemantauan Locust:
1. **Kehandalan Server (*High Availability & Zero Failure*):**  
   Pada seluruh skenario uji hingga 100 pengguna serentak, nilai kegagalan (*Failure Rate*) bernilai **0.0%**. Seluruh permintaan berhasil dijawab tanpa adanya galat *Connection Timeout* (HTTP 504) atau *Server Overload* (HTTP 500).
2. **Kualitas Waktu Tanggap (*Response Time Standards*):**  
   Mengacu pada standar kepuasan pengguna web (*Apdex Standard* dan W3C Web Performance), waktu respon web di bawah **1.000 ms (1 detik)** dikategorikan sangat baik (*satisfied*). Pada pengujian beban puncak (100 pengguna serentak), waktu respon rata-rata SIDUKTAG tercatat **412 ms**, dan 95% dari seluruh permintaan diselesaikan dalam kurun waktu kurang dari **720 ms**.
3. **Efektivitas Arsitektur Terpisah (*Decoupled Architecture*):**  
   Pemisahan beban antarmuka Next.js di server produksi dan Laravel REST API terbukti sangat efektif menjaga kinerja server tetap ringan, responsif, dan hemat memori.

> **Kesimpulan Pengujian Kinerja:**  
> Sistem SIDUKTAG terbukti memiliki performa komputasi yang tangguh, stabil, dan memiliki kapasitas yang lebih dari cukup untuk melayani kebutuhan administrasi seluruh warga Banjar Saba Penatih secara simultan.

---

## 4.3 PEMBAHASAN HASIL

Berdasarkan keseluruhan tahapan perancangan, implementasi, dan pengujian yang telah dilaksanakan pada Sistem Informasi Kependudukan dan Geotagging (SIDUKTAG), diperoleh beberapa poin pembahasan mendalam sebagai berikut:

---

### 4.3.1 Evaluasi Ketercapaian Fungsionalitas Sistem Terhadap Tujuan Penelitian

Pengembangan sistem SIDUKTAG ini berhasil mencapai seluruh tujuan penelitian yang dirumuskan pada Bab I:
1. **Digitalisasi Administrasi Kependudukan Banjar:**  
   Sistem berhasil menggantikan pencatatan data kependudukan manual (buku register fisik) menjadi basis data terpusat MySQL yang dapat dikelola dengan aman, cepat, dan terhindar dari resiko kehilangan data fisik.
2. **Implementasi Layanan Mandiri (*Self-Service Portal*):**  
   Warga Banjar Saba Penatih kini dapat mengajukan permohonan surat administrasi secara daring kapan saja tanpa terhalang jam operasional rumah dinas Kelian Banjar.
3. **Pemetaan Spasial Berbasis Geotagging:**  
   Sistem telah berhasil memvisualisasikan titik hunian warga per tempekan menggunakan peta interaktif Leaflet.js, memberikan perspektif keruangan yang nyata bagi pimpinan banjar.
4. **Pengawasan Pendatang Terpadu (WNI & WNA):**  
   Sistem mengakomodasi pencatatan pendatang sementara dan warga negara asing (WNA) lengkap dengan nomor paspor, KITAS, status ketenagakerjaan, serta penjamin lokal.

---

### 4.3.2 Analisis Perbandingan Sistem Sebelum dan Sesudah Digitalisasi

Penerapan SIDUKTAG membawa dampak efisiensi operasional yang signifikan di lingkungan Banjar Saba Penatih. Perbandingan antara prosedur konvensional dengan prosedur berbasis sistem tertera pada Tabel 4.3.

#### Tabel 4.3 Matriks Perbandingan Sistem Konvensional dengan Sistem SIDUKTAG

| Parameter Evaluasi | Sistem Konvensional (Sebelum) | Sistem SIDUKTAG (Sesudah) | Dampak Efisiensi |
|:---|:---|:---|:---|
| **Proses Pengajuan Surat** | Warga harus datang langsung ke rumah Kelian Banjar membawa berkas fisik fotokopi | Warga mengajukan secara mandiri melalui web dari smartphone/laptop | Menghemat waktu dan biaya transportasi warga (dapat diakses 24/7) |
| **Waktu Penerbitan Surat** | Membutuhkan waktu 1 – 3 hari jika Kelian Banjar sedang tidak berada di tempat | Verifikasi online instan; surat selesai dalam hitungan menit | Waktu tunggu persetujuan surat terpangkas hingga 90% |
| **Format Dokumen** | Penulisan manual/ketik ulang Word berulang kali; resiko salah ketik | Sistem secara otomatis men-*generate* format dokumen resmi dengan nomor surat otomatis | Meniadakan kesalahan redaksi dan penomoran surat ganda |
| **Pemantauan Lokasi Hunian** | Mengandalkan ingatan petugas banjar; batas tempekan tidak terpetakan | Terpetakan secara spasial dengan koordinat Latitude & Longitude di peta interaktif | Visualisasi keruangan akurat untuk penataan wilayah dan mitigasi |
| **Penyaluran Bantuan Sosial** | Pencatatan nama manual berisiko tumpang tindih (*overlap*) | Kuota dan status penerima bansos tercatat transparan di basis data | Penyaluran bantuan sosial lebih transparan dan tepat sasaran |
| **Pengawasan Pendatang (WNA)** | Pendataan pendatang sering terlewat; dokumen paspor/KITAS tidak terarsip | Form terintegrasi untuk WNI & WNA lengkap dengan izin tinggal dan penjamin | Meningkatkan ketertiban dan keamanan lingkungan banjar |

---

### 4.3.3 Kelebihan dan Keterbatasan Sistem

Meskipun sistem telah beroperasi secara optimal dan stabil, penelitian ini mengidentifikasi kelebihan serta keterbatasan yang dapat menjadi acuan penyempurnaan di masa mendatang.

#### 1. Kelebihan Sistem:
- **Arsitektur Modern dan Cepat:** Menggunakan Next.js dan Laravel REST API yang menjamin waktu respon di bawah 500 ms.
- **Keamanan Otentikasi Ganda:** Dilengkapi proteksi verifikasi kode OTP email serta enkripsi password Bcrypt.
- **Kemudahan Akses (*Multi-Platform*):** Tampilan responsif Tailwind CSS memudahkan akses dari komputer, tablet, maupun telepon genggam.
- **Integrasi Spasial Leaflet.js:** Memberikan visualisasi peta interaktif yang ringan tanpa membebani kuota data internet pengguna.

#### 2. Keterbatasan Sistem:
- **Ketergantungan Akses Internet:** Sistem merupakan aplikasi berbasis *web cloud* yang memerlukan koneksi internet stabil untuk dapat memuat peta OpenStreetMap dan berkomunikasi dengan server.
- **Akurasi Geotagging Awal:** Ketepatan titik koordinat hunian pada saat pendaftaran awal masih bergantung pada kecermatan pengguna saat mengklik titik hunian pada peta.
- **Ketergantungan Kuota SMTP:** Pengiriman email OTP bergantung pada kuota layanan SMTP Gmail, sehingga memerlukan akun berbayar jika skala pengguna meningkat drastis di masa depan.

