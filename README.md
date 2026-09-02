# SIDUKTAG

**Sistem Informasi Kependudukan Berbasis Geotagging**

Aplikasi pengelolaan data kependudukan, pemetaan lokasi tempat tinggal warga (geotagging GPS), pengajuan surat administrasi online, dan penyaluran bantuan sosial.

---

## 🛠️ Tech Stack

- **Backend**: Laravel 13 (REST API & Dual-Mode Controller)
- **Frontend**: Next.js 14 (TypeScript + Tailwind CSS + Leaflet Map)
- **Database**: MySQL

---

## 🚀 Cara Menjalankan

### 1. Backend (Laravel)
```bash
# Install dependensi
composer install

# Konfigurasi .env & Key
cp .env.example .env
php artisan key:generate

# Migrasi Database & Storage
php artisan migrate --seed
php artisan storage:link

# Jalankan Server (Port 8000)
php artisan serve
```

### 2. Frontend (Next.js)
```bash
cd frontend

# Install dependensi
npm install

# Jalankan Frontend (Port 3000)
npm run dev
```

---

## 🌐 Akses Aplikasi

- **Frontend (Next.js)**: [http://localhost:3000](http://localhost:3000)
  - Login: `http://localhost:3000/login`
  - Dashboard Admin: `http://localhost:3000/admin/dashboard`
  - Dashboard Warga: `http://localhost:3000/user/dashboard`
- **Backend API**: [http://localhost:8000](http://localhost:8000)

---

## 📄 Lisensi
[MIT License](LICENSE)