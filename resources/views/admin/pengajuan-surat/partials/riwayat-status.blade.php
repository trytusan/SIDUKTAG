<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-5">
        <h2 class="text-lg font-bold text-slate-800">Riwayat Status</h2>
        <p class="text-sm text-slate-500">Perjalanan proses pengajuan surat</p>
    </div>

    <div class="space-y-4">
        {{-- Pastikan relasi riwayatStatus ada dan memiliki data --}}
        @forelse($surat->riwayatStatus as $riwayat)
            @php
                // Logika warna dot berdasarkan status
                $dotColor = match($riwayat->status) {
                    'Menunggu' => 'bg-sky-500',
                    'Diproses' => 'bg-amber-500',
                    'Selesai'  => 'bg-emerald-500',
                    'Ditolak'  => 'bg-red-500',
                    default    => 'bg-slate-400'
                };
            @endphp

            <div class="flex items-start gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
                <div class="mt-1 h-3 w-3 rounded-full {{ $dotColor }}"></div>
                <div class="flex-1">
                    <p class="text-sm font-semibold text-slate-800">
                        {{ $riwayat->judul_status ?? 'Status: ' . $riwayat->status }}
                    </p>
                    <p class="mt-1 text-sm text-slate-500">
                        {{ $riwayat->catatan_operator ?? 'Tidak ada catatan tambahan.' }}
                    </p>
                    
                    {{-- Opsional: Nama petugas yang memproses --}}
                    @if($riwayat->operator_nama)
                        <p class="mt-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            Diproses Oleh: {{ $riwayat->operator_nama }}
                        </p>
                    @endif
                </div>
                <div class="text-right">
                    <span class="block text-xs font-medium text-slate-500">
                        {{ $riwayat->created_at->translatedFormat('d F Y') }}
                    </span>
                    <span class="text-[10px] text-slate-400">
                        {{ $riwayat->created_at->format('H:i') }} WIB
                    </span>
                </div>
            </div>
        @empty
            {{-- Fallback jika data riwayatStatus kosong di database --}}
            <div class="flex items-start gap-4 rounded-2xl bg-sky-50 p-4 text-sky-700">
                <div class="mt-1 h-3 w-3 rounded-full bg-sky-500"></div>
                <div class="flex-1">
                    <p class="text-sm font-semibold">Pengajuan Diterima</p>
                    <p class="mt-1 text-sm">Menunggu verifikasi awal dari operator.</p>
                </div>
                <span class="text-xs text-sky-400">{{ $surat->created_at->translatedFormat('d F Y') }}</span>
            </div>
        @endforelse
    </div>
</div>