from locust import HttpUser, task, between

class SiduktagUser(HttpUser):
    # Waktu jeda acak antar aktivitas simulasi pengguna (1 - 3 detik)
    wait_time = between(1, 3)

    @task(3)
    def view_landing_page(self):
        """Pengguna mengakses halaman utama / landing page"""
        self.client.get("/", name="[Page] Landing Page")

    @task(2)
    def view_login_page(self):
        """Pengguna mengakses halaman login"""
        self.client.get("/login", name="[Page] Login Page")

    @task(3)
    def view_peta_page(self):
        """Pengguna mengakses halaman visualisasi peta spasial"""
        self.client.get("/peta", name="[Page] Peta Spasial")

    @task(2)
    def view_berita_page(self):
        """Pengguna mengakses halaman berita/pengumuman"""
        self.client.get("/berita", name="[Page] Berita")

    @task(4)
    def get_api_berita(self):
        """Simulasi memuat data berita dari API"""
        self.client.get("https://sidulisa-com-836585.hostingersite.com/api/berita", name="[API] Get Berita")

    @task(3)
    def get_api_peta(self):
        """Simulasi memuat titik spasial kependudukan dari API"""
        self.client.get("https://sidulisa-com-836585.hostingersite.com/api/peta", name="[API] Get Peta Spasial")

