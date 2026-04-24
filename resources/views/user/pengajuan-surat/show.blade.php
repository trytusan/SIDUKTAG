<x-layouts.user
    title="Detail Pengajuan Surat"
    pageTitle="Detail Pengajuan Surat"
    :user="auth()->user()->penduduk->nama_lengkap ?? auth()->user()->name"
>

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard Saya', 'url' => route('user.dashboard')],
        ['label' => 'Pengajuan Surat', 'url' => route('user.pengajuan-surat.index')],
        ['label' => 'Detail Pengajuan']
    ]" />

    @php
        $badgeStatus = match($surat->status) {
            'Selesai' => 'success',
            'Diproses' => 'process',
            'Menunggu' => 'pending',
            'Ditolak' => 'danger',
            default => 'pending',
        };
    @endphp

    <div class="space-y-6">

        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 class="text-lg font-bold text-slate-800">Informasi Pengajuan</h2>
                    <p class="mt-1 text-sm text-slate-500">
                        Detail data pengajuan surat Anda.
                    </p>
                </div>

                <div>
                    <x-ui.status-badge :status="$badgeStatus">{{ $surat->status }}</x-ui.status-badge>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Nama Pemohon</p>
                    <p class="mt-1 font-semibold text-slate-800">
                        {{ $surat->nama_pemohon ?? '-' }}
                    </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">NIK</p>
                    <p class="mt-1 font-semibold text-slate-800">
                        {{ $surat->nik ?? '-' }}
                    </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Jenis Surat</p>
                    <p class="mt-1 font-semibold text-slate-800">
                        {{ $surat->jenis_surat_nama ?? $surat->jenisSurat->nama ?? '-' }}
                    </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Nomor Pengajuan</p>
                    <p class="mt-1 font-semibold text-slate-800">
                        {{ $surat->nomor_pengajuan ?? '-' }}
                    </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Tanggal Pengajuan</p>
                    <p class="mt-1 font-semibold text-slate-800">
                        {{ $surat->tanggal_pengajuan ? $surat->tanggal_pengajuan->format('d F Y') : '-' }}
                    </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Tanggal Pengesahan</p>
                    <p class="mt-1 font-semibold text-slate-800">
                        {{ $surat->tanggal_pengesahan ? $surat->tanggal_pengesahan->format('d F Y') : '-' }}
                    </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Status Pengajuan</p>
                    <div class="mt-2">
                        <x-ui.status-badge :status="$badgeStatus">{{ $surat->status }}</x-ui.status-badge>
                    </div>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 xl:col-span-2">
                    <p class="text-sm text-slate-500">Keperluan</p>
                    <p class="mt-1 font-semibold leading-7 text-slate-800">
                        {{ $surat->keperluan ?? '-' }}
                    </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 xl:col-span-3">
                    <p class="text-sm text-slate-500">Catatan Operator</p>
                    <p class="mt-1 font-semibold leading-7 text-slate-800">
                        {{ $surat->catatan_operator ?: 'Belum ada catatan dari operator.' }}
                    </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 xl:col-span-3">
                    <p class="text-sm text-slate-500">File Hasil Surat</p>
                    <div class="mt-3">
                        @if($surat->status === 'Selesai' && $surat->file_hasil_surat)
                            <a
                                href="{{ route('user.pengajuan-surat.download', $surat->id) }}"
                                class="inline-flex items-center rounded-2xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            >
                                Unduh Surat
                            </a>
                        @else
                            <button
                                type="button"
                                disabled
                                class="inline-flex cursor-not-allowed items-center rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400"
                            >
                                Belum Tersedia
                            </button>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        @include('user.pengajuan-surat.partials.lampiran')

    </div>

</x-layouts.user>