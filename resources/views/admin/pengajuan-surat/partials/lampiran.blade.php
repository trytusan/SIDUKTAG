<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-5">
        <h2 class="text-lg font-bold text-slate-800">Lampiran Dokumen</h2>
        <p class="text-sm text-slate-500">Dokumen pendukung pengajuan surat</p>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        {{-- Jika di database Anda hanya ada satu kolom 'dokumen_pendukung' --}}
        <div>
            <p class="mb-3 text-sm font-medium text-slate-700">Dokumen Utama (KTP/Lainnya)</p>
            <div class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                @if($surat->dokumen_pendukung)
                    @php
                        $extension = pathinfo($surat->dokumen_pendukung, PATHINFO_EXTENSION);
                    @endphp

                    @if(in_array(strtolower($extension), ['jpg', 'jpeg', 'png']))
                        {{-- Tampilan jika File adalah Gambar --}}
                        <img 
                            src="{{ asset('storage/' . $surat->dokumen_pendukung) }}" 
                            alt="Lampiran Dokumen" 
                            class="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                        >
                        <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                            <a href="{{ asset('storage/' . $surat->dokumen_pendukung) }}" target="_blank" class="rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-xl">
                                Lihat Fullscreen
                            </a>
                        </div>
                    @else
                        {{-- Tampilan jika File adalah PDF --}}
                        <div class="flex h-64 flex-col items-center justify-center p-6 text-center">
                            <svg class="mb-3 h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <p class="text-sm font-semibold text-slate-700">Dokumen PDF</p>
                            <a href="{{ asset('storage/' . $surat->dokumen_pendukung) }}" target="_blank" class="mt-4 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-600">
                                Buka Dokumen
                            </a>
                        </div>
                    @endif
                @else
                    {{-- Jika tidak ada file --}}
                    <div class="flex h-64 flex-col items-center justify-center bg-slate-50 text-slate-400">
                        <p class="text-sm italic">Tidak ada lampiran dokumen</p>
                    </div>
                @endif
            </div>
        </div>

        {{-- Jika Anda memiliki sistem multi-lampiran (relasi 'lampiran') --}}
        <div>
            <p class="mb-3 text-sm font-medium text-slate-700">Informasi Tambahan</p>
            <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6">
                <ul class="space-y-3">
                    <li class="flex items-center text-sm text-slate-600">
                        <span class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600">1</span>
                        NIK: <span class="ml-1 font-semibold text-slate-800">{{ $surat->nik }}</span>
                    </li>
                    <li class="flex items-center text-sm text-slate-600">
                        <span class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-600">2</span>
                        Jenis: <span class="ml-1 font-semibold text-slate-800">{{ $surat->jenis_surat_nama }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>