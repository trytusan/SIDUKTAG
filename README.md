# SIDUKTAG (Sistem Informasi Penduduk Terintegrasi)

**SIDUKTAG** adalah aplikasi manajemen kependudukan tingkat desa/kelurahan yang dirancang untuk mendigitalisasi layanan administrasi warga. Aplikasi ini mengintegrasikan data kependudukan, sistem pengajuan bantuan sosial yang dinamis, serta otomatisasi persuratan dalam satu platform.

## ✨ Fitur Unggulan

- **Manajemen Data Warga**: Pengelolaan data NIK dan KK yang terintegrasi dengan fitur pencarian cepat.
- **Sistem Pengajuan Bantuan**: Fitur pendaftaran bantuan sosial yang relasional (sinkronisasi otomatis antara jenis bantuan dan program bantuan).
- **Layanan Surat Digital**: Pengajuan surat mandiri oleh admin untuk warga dengan sistem nomor surat otomatis dan unggah berkas pendukung.
- **Reporting System**: Ekspor data laporan penerima bantuan ke format PDF yang siap cetak.
- **Keamanan Data**: Validasi input yang ketat dan sistem autentikasi user (Admin).

## 🛠️ Tech Stack

- **Framework:** [Laravel 11](https://laravel.com)
- **Language:** PHP 8.2+
- **Frontend:** Tailwind CSS & Blade Components
- **Database:** MySQL / MariaDB
- **PDF Engine:** Barryvdh Laravel DomPDF

## 📦 Panduan Instalasi

Pastikan Anda sudah menginstal **Composer**, **Node.js**, dan **XAMPP/Laragon** di perangkat Anda.

1. **Clone Repositori**
   ```bash
   git clone [https://github.com/trytusan/SIDUKTAG.git](https://github.com/trytusan/SIDUKTAG.git)
   cd SIDUKTAG
2. **Instalasi Library**
    composer install
    npm install && npm run dev
3. **Konfigurasi Environment**
    cp .env.example .env
    php artisan key:generate
4. **Migrasi Database & Seeding**
    php artisan migrate --seed
5. **Jalankan Server**
    php artisan serve