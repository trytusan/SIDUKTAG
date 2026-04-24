@props([
    'title' => 'Preview Lokasi',
    'latitude' => '',
    'longitude' => '',
    'address' => '',
    'mapId' => 'map-preview',
    'height' => 'h-72',
])

<div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <div class="border-b border-slate-200 px-6 py-4">
        <h3 class="text-base font-semibold text-slate-800">
            {{ $title }}
        </h3>
        <p class="mt-1 text-sm text-slate-500">
            Informasi titik lokasi yang tersimpan.
        </p>
    </div>

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
                    <h4 class="text-sm font-semibold text-slate-700">Preview Peta</h4>
                    <p class="mt-1 text-xs text-slate-500">
                        Tampilkan peta interaktif di area ini menggunakan Leaflet/Google Maps.
                    </p>
                </div>
            </div>
        </div>

        <div class="border-t border-slate-200 p-5 lg:border-l lg:border-t-0">
            <dl class="space-y-4">
                <div>
                    <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Latitude
                    </dt>
                    <dd class="mt-1 text-sm font-semibold text-slate-800">
                        {{ $latitude ?: '-' }}
                    </dd>
                </div>

                <div>
                    <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Longitude
                    </dt>
                    <dd class="mt-1 text-sm font-semibold text-slate-800">
                        {{ $longitude ?: '-' }}
                    </dd>
                </div>

                <div>
                    <dt class="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Alamat
                    </dt>
                    <dd class="mt-1 text-sm leading-6 text-slate-700">
                        {{ $address ?: '-' }}
                    </dd>
                </div>
            </dl>
        </div>
    </div>
</div>