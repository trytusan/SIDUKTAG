@php
    $statusProgram = strtolower($bantuan->bantuan->status_bantuan ?? '');
    $badgeProgram = match($statusProgram) {
        'aktif' => 'aktif',
        'nonaktif' => 'danger',
        'selesai' => 'success',
        default => 'pending',
    };

    $statusPenerima = strtolower($bantuan->status_penerima ?? '');
    $badgePenerima = match($statusPenerima) {
        'diterima' => 'success',
        'menunggu' => 'pending',
        'ditolak' => 'danger',
        'selesai' => 'success',
        default => 'pending',
    };
@endphp

<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-5">
        <h2 class="text-lg font-bold text-slate-800">Detail Bantuan</h2>
        <p class="text-sm text-slate-500">Informasi lengkap bantuan yang Anda terima / ajukan</p>
    </div>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Nama Program</p>
            <p class="mt-1 font-semibold text-slate-800">
                {{ $bantuan->bantuan->nama_program ?? '-' }}
            </p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Jenis Bantuan</p>
            <p class="mt-1 font-semibold text-slate-800">
                {{ $bantuan->bantuan->jenis_bantuan ?? '-' }}
            </p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Status Program</p>
            <div class="mt-2">
                <x-ui.status-badge :status="$badgeProgram">
                    {{ $bantuan->bantuan->status_bantuan ?? '-' }}
                </x-ui.status-badge>
            </div>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Status Penerima</p>
            <div class="mt-2">
                <x-ui.status-badge :status="$badgePenerima">
                    {{ $bantuan->status_penerima ?? '-' }}
                </x-ui.status-badge>
            </div>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Nama Penerima</p>
            <p class="mt-1 font-semibold text-slate-800">
                {{ $bantuan->penduduk->nama_lengkap ?? '-' }}
            </p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">NIK</p>
            <p class="mt-1 font-semibold text-slate-800">
                {{ $bantuan->penduduk->nik ?? '-' }}
            </p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Nomor KK</p>
            <p class="mt-1 font-semibold text-slate-800">
                {{ $bantuan->penduduk->nomor_kk ?? '-' }}
            </p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Tanggal Menerima</p>
            <p class="mt-1 font-semibold text-slate-800">
                {{ $bantuan->tanggal_menerima ? $bantuan->tanggal_menerima->format('d F Y') : '-' }}
            </p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Sumber Bantuan</p>
            <p class="mt-1 font-semibold text-slate-800">
                {{ $bantuan->bantuan->sumber_bantuan ?? '-' }}
            </p>
        </div>

        <!-- <div class="rounded-2xl bg-slate-50 p-4">
            <p class="text-sm text-slate-500">Kuota Program</p>
            <p class="mt-1 font-semibold text-slate-800">
                {{ $bantuan->bantuan->kuota_penerima ? $bantuan->bantuan->kuota_penerima . ' Penerima' : '-' }}
            </p>
        </div> -->

        <div class="rounded-2xl bg-slate-50 p-4 xl:col-span-3">
            <p class="text-sm text-slate-500">Deskripsi Bantuan</p>
            <p class="mt-1 font-semibold leading-7 text-slate-800">
                {{ $bantuan->bantuan->deskripsi ?? '-' }}
            </p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4 xl:col-span-3">
            <p class="text-sm text-slate-500">Catatan</p>
            <p class="mt-1 font-semibold leading-7 text-slate-800">
                {{ $bantuan->catatan ?: 'Belum ada catatan.' }}
            </p>
        </div>
    </div>
</div>