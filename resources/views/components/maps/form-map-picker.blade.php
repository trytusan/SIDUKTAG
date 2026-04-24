@props([
    'label' => 'Pilih Lokasi',
    'name' => 'location',
    'latitude' => '',
    'longitude' => '',
    'address' => '',
    'mapId' => 'map-picker',
    'height' => 'h-80',
])

<div class="space-y-4">
    <div>
        <label class="mb-2 block text-sm font-medium text-slate-700">
            {{ $label }}
        </label>
        <p class="text-xs text-slate-500">
            Klik pada peta untuk menentukan titik lokasi, atau isi koordinat secara manual.
        </p>
    </div>

    <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div class="grid grid-cols-1 lg:grid-cols-3">
            
            <div class="lg:col-span-2">
                <div
                    id="{{ $mapId }}"
                    class="flex {{ $height }} w-full items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50"
                >
                    <div class="text-center">
                        <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
                            </svg>
                        </div>
                        <h3 class="text-sm font-semibold text-slate-700">Area Peta</h3>
                        <p class="mt-1 max-w-xs text-xs text-slate-500">
                            Hubungkan komponen ini dengan Leaflet atau Google Maps untuk memilih lokasi secara interaktif.
                        </p>
                    </div>
                </div>
            </div>

            <div class="border-t border-slate-200 p-5 lg:border-l lg:border-t-0">
                <div class="space-y-4">
                    <div>
                        <label class="mb-2 block text-sm font-medium text-slate-700">
                            Latitude
                        </label>
                        <input
                            type="text"
                            name="{{ $name }}[latitude]"
                            value="{{ old($name.'.latitude', $latitude) }}"
                            placeholder="-6.200000"
                            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        >
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium text-slate-700">
                            Longitude
                        </label>
                        <input
                            type="text"
                            name="{{ $name }}[longitude]"
                            value="{{ old($name.'.longitude', $longitude) }}"
                            placeholder="106.816666"
                            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        >
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium text-slate-700">
                            Alamat / Keterangan Lokasi
                        </label>
                        <textarea
                            name="{{ $name }}[address]"
                            rows="4"
                            placeholder="Masukkan alamat atau deskripsi lokasi"
                            class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        >{{ old($name.'.address', $address) }}</textarea>
                    </div>

                    <div class="flex gap-3">
                        <button
                            type="button"
                            class="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Gunakan Lokasi Saya
                        </button>
                        <button
                            type="button"
                            class="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Simpan Titik
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>