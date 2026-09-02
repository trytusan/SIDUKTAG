<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-5 flex items-center justify-between">
        <div>
            <h2 class="text-lg font-bold text-slate-800">Detail Penerima Bantuan</h2>
            <p class="text-sm text-slate-500">Informasi lengkap program dan penerima bantuan</p>
        </div>
        {{-- Tombol Aksi Cepat --}}
        <div class="flex gap-2">
            <a href="{{ route('admin.bantuan.edit', $bantuan->id) }}"
                class="rounded-xl bg-amber-50 px-4 py-2 text-xs font-bold text-amber-600 transition hover:bg-amber-100">
                Edit Data
            </a>
            <a href="{{ route('admin.bantuan.index') }}"
                class="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200">
                Kembali
            </a>
        </div>
    </div>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {{-- Nama Program - Diambil dari relasi bantuan --}}
        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Nama Program</p>
            <p class="mt-1 font-semibold text-slate-800">{{ $bantuan->bantuan->nama_program ?? 'Program Terhapus' }}</p>
        </div>

        {{-- Jenis Bantuan - Diambil dari relasi bantuan --}}
        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Jenis Bantuan</p>
            <p class="mt-1 font-semibold text-slate-800">{{ $bantuan->bantuan->jenis_bantuan ?? '-' }}</p>
        </div>

        {{-- Status Bantuan Program --}}
        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Status Program</p>
            <div class="mt-2">
                @php
                    $statusColor = match ($bantuan->bantuan->status_bantuan ?? '') {
                        'Aktif' => 'success',
                        'Selesai' => 'info',
                        'Nonaktif' => 'danger',
                        default => 'neutral'
                    };
                @endphp
                <x-ui.status-badge
                    :status="$statusColor">{{ $bantuan->bantuan->status_bantuan ?? 'Unknown' }}</x-ui.status-badge>
            </div>
        </div>

        {{-- Nama Penerima - Diambil dari relasi penduduk --}}
        <div class="rounded-2xl bg-slate-50 p-4 border-l-4 border-emerald-500">
            <p class="text-sm text-slate-500">Nama Penerima</p>
            <p class="mt-1 font-semibold text-slate-800">
                {{ $bantuan->penduduk->nama_lengkap ?? ($bantuan->penduduk->nama ?? '-') }}</p>
        </div>

        {{-- NIK --}}
        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">NIK</p>
            <p class="mt-1 font-semibold text-slate-800">{{ $bantuan->penduduk->nik ?? '-' }}</p>
        </div>

        {{-- Nomor KK --}}
        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Nomor KK</p>
            <p class="mt-1 font-semibold text-slate-800">{{ $bantuan->penduduk->nomor_kk ?? '-' }}</p>
        </div>

        {{-- Tanggal Mulai Program --}}
        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Tanggal Mulai Program</p>
            <p class="mt-1 font-semibold text-slate-800">
                {{ $bantuan->bantuan?->tanggal_mulai ? $bantuan->bantuan->tanggal_mulai->translatedFormat('d F Y') : '-' }}
            </p>
        </div>

        {{-- Tanggal Selesai Program --}}
        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Tanggal Selesai Program</p>
            <p class="mt-1 font-semibold text-slate-800">
                {{ $bantuan->bantuan?->tanggal_selesai ? $bantuan->bantuan->tanggal_selesai->translatedFormat('d F Y') : '-' }}
            </p>
        </div>

        {{-- Tanggal Menerima/Verifikasi --}}
        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Tanggal Verifikasi/Terima</p>
            <p class="mt-1 font-semibold text-slate-800">
                {{ $bantuan->tanggal_menerima ? $bantuan->tanggal_menerima->translatedFormat('d F Y') : '-' }}
            </p>
        </div>

        {{-- Status Pengajuan/Penerima --}}
        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Status Pengajuan</p>
            <div class="mt-2">
                @php
                    $penerimaColor = match ($bantuan->status_penerima) {
                        'Diterima' => 'success',
                        'Menunggu' => 'warning',
                        'Ditolak' => 'danger',
                        'Selesai' => 'info',
                        default => 'neutral'
                    };
                @endphp
                <x-ui.status-badge
                    :status="$penerimaColor">{{ $bantuan->status_penerima ?? 'Menunggu' }}</x-ui.status-badge>
            </div>
        </div>

        {{-- Kuota Program --}}
        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Kuota Program</p>
            <p class="mt-1 font-semibold text-slate-800">{{ $bantuan->bantuan->kuota_penerima ?? 0 }} Orang</p>
        </div>

        {{-- Sumber Bantuan --}}
        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Sumber Dana</p>
            <p class="mt-1 font-semibold text-slate-800">{{ $bantuan->bantuan->sumber_bantuan ?? '-' }}</p>
        </div>

        {{-- Deskripsi Program --}}
        <div class="rounded-2xl bg-slate-50 p-4 md:col-span-2 xl:col-span-3">
            <p class="text-sm text-slate-500">Deskripsi Program</p>
            <p class="mt-1 font-semibold leading-7 text-slate-800 italic">
                {{ $bantuan->bantuan->deskripsi ?? 'Tidak ada deskripsi.' }}
            </p>
        </div>
        
        {{-- Catatan Pengajuan --}}
        <div class="rounded-2xl bg-slate-50 p-4 md:col-span-2 xl:col-span-3">
            <p class="text-sm text-slate-500">Catatan Verifikasi</p>
            <p class="mt-1 font-semibold leading-7 text-slate-800">
                {{ $bantuan->catatan ?? 'Tidak ada catatan tambahan.' }}
            </p>
        </div>
    </div>
</div>