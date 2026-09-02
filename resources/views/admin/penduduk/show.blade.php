<x-layouts.admin title="Detail Data Penduduk" pageTitle="Detail Data Penduduk" user="Administrator">
    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Data Penduduk', 'url' => route('admin.penduduk.index')],
        ['label' => 'Detail Data']
    ]" />
    <x-slot name="header">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <nav class="flex mb-2" aria-label="Breadcrumb">
                    <ol class="flex items-center space-x-2 text-sm text-slate-500">
                        <li><a href="{{ route('admin.penduduk.index') }}"
                                class="hover:text-emerald-600 transition">Penduduk</a></li>
                        <li><svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z">
                                </path>
                            </svg></li>
                        <li class="text-slate-800 font-medium">Detail Profil</li>
                    </ol>
                </nav>
                <h2 class="text-2xl font-bold tracking-tight text-slate-900">
                    Informasi Penduduk
                </h2>
            </div>
            <div class="flex items-center gap-3">
                <a href="{{ route('admin.penduduk.index') }}"
                    class="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition">
                    <svg class="mr-2 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Kembali
                </a>
                <a href="{{ route('admin.penduduk.edit', $penduduk->id) }}"
                    class="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition">
                    <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                    </svg>
                    Edit Profil
                </a>
            </div>
        </div>
    </x-slot>

    <div class="py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">

                <div class="lg:col-span-1">
                    <div class="sticky top-8 space-y-6">
                        <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <div class="relative h-32 bg-gradient-to-br from-emerald-500 to-teal-600"></div>
                            <div class="relative -mt-16 flex justify-center">
                                @if($penduduk->foto_profil)
                                    <img src="{{ asset('storage/' . $penduduk->foto_profil) }}"
                                        class="h-32 w-32 rounded-3xl object-cover border-4 border-white shadow-lg">
                                @else
                                    <div
                                        class="flex h-32 w-32 items-center justify-center rounded-3xl bg-slate-100 text-4xl font-black text-slate-400 border-4 border-white shadow-lg">
                                        {{ strtoupper(substr($penduduk->nama_lengkap, 0, 1)) }}
                                    </div>
                                @endif
                            </div>
                            <div class="px-6 pt-4 pb-8 text-center">
                                <h3 class="text-xl font-bold text-slate-900">{{ $penduduk->nama_lengkap }}</h3>
                                <p class="text-sm font-medium text-slate-500">{{ $penduduk->nik }}</p>
                                <div class="mt-4 flex flex-wrap justify-center gap-2">
                                    <span
                                        class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                        {{ $penduduk->status_kependudukan }}
                                    </span>
                                    <span
                                        class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                        {{ $penduduk->kategori_umur }}
                                    </span>
                                </div>
                            </div>
                            <div class="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-slate-500 font-medium">Status Profil</span>
                                    <div class="flex items-center text-emerald-600 font-bold">
                                        <svg class="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clip-rule="evenodd"></path>
                                        </svg>
                                        Terverifikasi
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h4 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Informasi Sistem
                            </h4>
                            <div class="space-y-4">
                                <div class="flex items-start gap-3">
                                    <div class="p-2 bg-slate-100 rounded-lg text-slate-500">
                                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-500">Terdaftar Pada</p>
                                        <p class="text-sm font-semibold text-slate-700">
                                            {{ $penduduk->created_at->translatedFormat('d M Y, H:i') }}
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <div class="p-2 bg-slate-100 rounded-lg text-slate-500">
                                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                                            </path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-500">Pembaruan Terakhir</p>
                                        <p class="text-sm font-semibold text-slate-700">
                                            {{ $penduduk->updated_at->diffForHumans() }}
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-start gap-3">
                                    <div class="p-2 bg-slate-100 rounded-lg text-slate-500">
                                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-500 font-medium">Dokumen Pendukung</p>
                                        @if($penduduk->dokumen_pendukung)
                                            <a href="{{ \Illuminate\Support\Facades\Storage::url($penduduk->dokumen_pendukung) }}"
                                                target="_blank" class="text-sm font-bold text-emerald-600 hover:underline">
                                                Lihat Dokumen &rarr;
                                            </a>
                                        @else
                                            <p class="text-sm font-semibold text-slate-400 italic">Tidak ada file yang
                                                diunggah</p>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="p-1">
                            <a href="{{ route('admin.penduduk.export.pdf', ['id' => $penduduk->id]) }}" target="_blank"
                                class="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 px-4 py-3 text-sm font-bold text-slate-400 hover:border-emerald-300 hover:text-emerald-600 transition">
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z">
                                    </path>
                                </svg>
                                Cetak Biodata Penduduk
                            </a>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-2 space-y-6">
                    <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div class="border-b border-slate-100 px-7 py-5">
                            <h4 class="text-lg font-bold text-slate-900">Data Identitas</h4>
                        </div>
                        <div class="p-7">
                            <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Nomor Kartu
                                        Keluarga</p>
                                    <p class="mt-1 font-semibold text-slate-700">{{ $penduduk->nomor_kk }}</p>
                                </div>
                                <div>
                                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Jenis Kelamin
                                    </p>
                                    <p class="mt-1 font-semibold text-slate-700">{{ $penduduk->jenis_kelamin }}</p>
                                </div>
                                <div>
                                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Tempat,
                                        Tanggal Lahir</p>
                                    <p class="mt-1 font-semibold text-slate-700">{{ $penduduk->tempat_lahir }},
                                        {{ \Carbon\Carbon::parse($penduduk->tanggal_lahir)->translatedFormat('d F Y') }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Agama</p>
                                    <p class="mt-1 font-semibold text-slate-700">{{ $penduduk->agama ?? '-' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div class="border-b border-slate-100 px-7 py-5">
                            <h4 class="text-lg font-bold text-slate-900">Informasi Sosial & Pekerjaan</h4>
                        </div>
                        <div class="p-7">
                            <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Pekerjaan</p>
                                    <p class="mt-1 font-semibold text-slate-700">{{ $penduduk->pekerjaan ?? '-' }}</p>
                                </div>
                                <div>
                                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Pendidikan
                                        Terakhir</p>
                                    <p class="mt-1 font-semibold text-slate-700">
                                        {{ $penduduk->pendidikan_terakhir ?? '-' }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Status
                                        Perkawinan</p>
                                    <p class="mt-1 font-semibold text-slate-700">
                                        {{ $penduduk->status_perkawinan ?? '-' }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Status dalam
                                        Keluarga</p>
                                    <p class="mt-1 font-semibold text-slate-700">
                                        {{ $penduduk->status_dalam_keluarga ?? '-' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <{{-- Bagian Kontak & Lokasi --}} <div
                        class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div class="border-b border-slate-100 px-7 py-5">
                            <h4 class="text-lg font-bold text-slate-900">Kontak & Lokasi</h4>
                        </div>
                        <div class="p-7">
                            <div class="space-y-6">
                                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Nomor
                                            Telepon</p>
                                        <p class="mt-1 font-semibold text-slate-700">
                                            {{ $penduduk->nomor_telepon ?? '-' }}</p>
                                    </div>

                                    {{-- Tambahan Link Google Maps --}}
                                    <div>
                                        <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Titik
                                            Koordinat</p>
                                        @if($penduduk->latitude && $penduduk->longitude)
                                            <a href="https://www.google.com/maps/search/?api=1&query={{ $penduduk->latitude }},{{ $penduduk->longitude }}"
                                                target="_blank"
                                                class="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition hover:underline">
                                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Lihat di Google Maps
                                            </a>
                                        @else
                                            <p class="mt-1 text-sm font-medium text-slate-400 italic">Koordinat belum
                                                ditandai</p>
                                        @endif
                                    </div>
                                </div>

                                <div>
                                    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Alamat Lengkap
                                    </p>
                                    <p class="mt-1 font-medium leading-relaxed text-slate-600 italic">
                                        "{{ $penduduk->alamat_lengkap ?? 'Alamat belum diisi' }}"
                                    </p>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>
</x-layouts.admin>