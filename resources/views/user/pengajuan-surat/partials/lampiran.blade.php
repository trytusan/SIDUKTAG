<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-5">
        <h2 class="text-lg font-bold text-slate-800">Lampiran Dokumen</h2>
        <p class="text-sm text-slate-500">Dokumen pendukung yang Anda unggah</p>
    </div>

    @if($surat->dokumen_pendukung)
        @php
            $filePath = asset('storage/' . $surat->dokumen_pendukung);
            $extension = strtolower(pathinfo($surat->dokumen_pendukung, PATHINFO_EXTENSION));
            $isImage = in_array($extension, ['jpg', 'jpeg', 'png', 'webp']);
            $isPdf = $extension === 'pdf';
        @endphp

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                @if($isImage)
                    <img
                        src="{{ $filePath }}"
                        alt="Lampiran Dokumen"
                        class="h-64 w-full object-cover"
                    >
                @elseif($isPdf)
                    <div class="flex h-64 flex-col items-center justify-center px-6 text-center">
                        <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19.5 14.25v-8.625a3.375 3.375 0 0 0-3.375-3.375h-8.25A3.375 3.375 0 0 0 4.5 5.625v12.75a3.375 3.375 0 0 0 3.375 3.375h8.25A3.375 3.375 0 0 0 19.5 18.375V16.5M9 12h6m-6 3h3m-3-6h6" />
                            </svg>
                        </div>
                        <p class="text-sm font-semibold text-slate-800">Dokumen PDF</p>
                        <p class="mt-1 text-xs text-slate-500">Klik tombol unduh untuk melihat file lengkap.</p>
                    </div>
                @else
                    <div class="flex h-64 flex-col items-center justify-center px-6 text-center">
                        <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200 text-slate-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19.5 14.25v-8.625a3.375 3.375 0 0 0-3.375-3.375h-8.25A3.375 3.375 0 0 0 4.5 5.625v12.75a3.375 3.375 0 0 0 3.375 3.375h8.25A3.375 3.375 0 0 0 19.5 18.375V16.5" />
                            </svg>
                        </div>
                        <p class="text-sm font-semibold text-slate-800">Dokumen Tersimpan</p>
                        <p class="mt-1 text-xs text-slate-500">File pendukung tersedia untuk diunduh.</p>
                    </div>
                @endif
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p class="text-sm font-medium text-slate-700">Keterangan Lampiran</p>

                <div class="mt-4 space-y-3 text-sm text-slate-600">
                    <div>
                        <span class="font-medium text-slate-700">Jenis Surat:</span>
                        {{ $surat->jenis_surat_nama ?? $surat->jenisSurat->nama ?? '-' }}
                    </div>

                    <div>
                        <span class="font-medium text-slate-700">Nama Pemohon:</span>
                        {{ $surat->nama_pemohon ?? '-' }}
                    </div>

                    <div>
                        <span class="font-medium text-slate-700">Format File:</span>
                        {{ strtoupper($extension) }}
                    </div>

                    <div>
                        <span class="font-medium text-slate-700">Keterangan:</span>
                        Dokumen pendukung digunakan sebagai syarat verifikasi pengajuan surat oleh operator.
                    </div>
                </div>

                <div class="mt-5">
                    <a
                        href="{{ $filePath }}"
                        target="_blank"
                        class="inline-flex items-center rounded-2xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                    >
                        Lihat / Unduh Dokumen
                    </a>
                </div>
            </div>
        </div>
    @else
        <div class="rounded-2xl bg-slate-50 px-4 py-8 text-center">
            <p class="text-sm text-slate-500">
                Belum ada dokumen pendukung yang diunggah.
            </p>
        </div>
    @endif
</div>