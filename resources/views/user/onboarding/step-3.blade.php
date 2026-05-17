<x-layouts.app title="Dokumen & Lokasi">

    <div class="min-h-screen bg-slate-100 px-4 py-8">
        <div class="mx-auto max-w-7xl">

            <div class="mb-6 text-center">
                <h1 class="text-2xl font-bold text-slate-800">Lengkapi Data Diri</h1>
                <p class="mt-1 text-sm text-slate-500">
                    Lengkapi dokumen dan lokasi Anda sebelum masuk dashboard
                </p>
            </div>

            <div class="mb-6">
                <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Data Pribadi</span>
                    <span>Alamat & Keluarga</span>
                    <span class="font-semibold text-emerald-600">Dokumen & Lokasi</span>
                </div>
                <div class="h-2 w-full rounded-full bg-slate-200">
                    <div class="h-2 w-full rounded-full bg-emerald-500"></div>
                </div>
            </div>

            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <form action="{{ route('user.onboarding.step-3.store') }}" method="POST" enctype="multipart/form-data"
                    class="space-y-6">
                    @csrf

                    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                            <label class="mb-3 block text-sm font-medium text-slate-800">
                                Foto Profil
                            </label>

                            <input type="file" name="foto_profil" accept="image/*"
                                class="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm @error('foto_profil') border-red-400 @enderror">

                            <p class="mt-2 text-xs text-slate-500">
                                Gunakan foto yang jelas dan terbaru
                            </p>

                            @error('foto_profil')
                                <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                            <label class="mb-3 block text-sm font-medium text-slate-800">
                                Dokumen Pendukung (KTP)
                            </label>

                            <input type="file" name="dokumen" accept="image/*,.pdf"
                                class="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm @error('dokumen') border-red-400 @enderror">

                            <p class="mt-2 text-xs text-slate-500">
                                Bisa berupa foto KTP atau dokumen lain
                            </p>

                            @error('dokumen')
                                <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>

                    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <h3 class="mb-4 text-sm font-semibold text-slate-800">
                            Lokasi Rumah (Geotagging)
                        </h3>

                        <div id="map" class="mb-4 h-64 w-full rounded-2xl border border-slate-300 shadow-inner z-0">
                        </div>

                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label class="mb-2 block text-sm text-slate-600">Latitude</label>
                                <input type="text" name="latitude" id="lat"
                                    value="{{ old('latitude', $data['latitude'] ?? '') }}" readonly
                                    class="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-400 @error('latitude') border-red-400 @enderror">
                                @error('latitude') <p class="mt-2 text-sm text-red-500">{{ $message }}</p> @enderror
                            </div>

                            <div>
                                <label class="mb-2 block text-sm text-slate-600">Longitude</label>
                                <input type="text" name="longitude" id="lng"
                                    value="{{ old('longitude', $data['longitude'] ?? '') }}" readonly
                                    class="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-emerald-400 @error('longitude') border-red-400 @enderror">
                                @error('longitude') <p class="mt-2 text-sm text-red-500">{{ $message }}</p> @enderror
                            </div>
                        </div>

                        <p class="mt-3 text-xs text-slate-500 italic">
                            *Klik pada peta atau geser pin untuk menentukan lokasi rumah Anda dengan tepat.
                        </p>
                    </div>

                    <div class="flex items-center justify-between">
                        <a href="{{ route('user.onboarding.step-2') }}"
                            class="text-sm font-medium text-slate-600 transition hover:text-slate-800">
                            ← Kembali
                        </a>

                        <button type="submit"
                            class="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                            Selesai ✔
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

</x-layouts.app>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Lokasi default (Buleleng/Bali atau sesuai data lama)
        let latVal = "{{ old('latitude', $data['latitude'] ?? '') }}";
        let lngVal = "{{ old('longitude', $data['longitude'] ?? '') }}";

        let initialLat = latVal ? parseFloat(latVal) : -8.1176;
        let initialLng = lngVal ? parseFloat(lngVal) : 115.0903;

        // 1. Inisialisasi Peta
        const map = L.map('map').setView([initialLat, initialLng], latVal ? 18 : 13);

        // 2. Layer Peta
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // 3. Marker yang bisa digeser
        let marker = L.marker([initialLat, initialLng], {
            draggable: true
        }).addTo(map);

        // Fungsi Update Input
        function updateFields(lat, lng) {
            document.getElementById('lat').value = lat.toFixed(8);
            document.getElementById('lng').value = lng.toFixed(8);
        }

        // 4. Event: Marker digeser
        marker.on('dragend', function (e) {
            let position = marker.getLatLng();
            updateFields(position.lat, position.lng);
        });

        // 5. Event: Klik Peta
        map.on('click', function (e) {
            marker.setLatLng(e.latlng);
            updateFields(e.latlng.lat, e.latlng.lng);
        });

        // Fix Map Rendering
        setTimeout(() => { map.invalidateSize(); }, 500);
    });
</script>