<x-layouts.admin title="Detail Pengajuan Surat" pageTitle="Detail Pengajuan Surat" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengajuan Surat', 'url' => route('admin.pengajuan-surat.index')],
        ['label' => 'Detail Pengajuan']
    ]" />

    <div class="space-y-6">

        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-bold text-slate-800">Informasi Pengajuan</h2>
                    <p class="text-sm text-slate-500">Nomor: {{ $surat->nomor_pengajuan }}</p>
                </div>
                
                {{-- Tombol Aksi Cepat --}}
                <div class="flex gap-2">
                    @if($surat->status === 'Selesai')
                        <a href="{{ route('admin.pengajuan-surat.cetak', $surat->id) }}" target="_blank" class="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Cetak Surat
                        </a>
                    @endif
                    
                    <a href="{{ route('admin.pengajuan-surat.verifikasi', $surat->id) }}" class="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                        Update Status
                    </a>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div>
                    <p class="text-sm text-slate-500">Nama Pemohon</p>
                    <p class="font-semibold text-slate-800">{{ $surat->nama_pemohon }}</p>
                </div>

                <div>
                    <p class="text-sm text-slate-500">NIK</p>
                    <p class="font-semibold text-slate-800">{{ $surat->nik }}</p>
                </div>

                <div>
                    <p class="text-sm text-slate-500">Jenis Surat</p>
                    <p class="font-semibold text-slate-800">{{ $surat->jenis_surat_nama }}</p>
                </div>

                <div>
                    <p class="text-sm text-slate-500">Tanggal Pengajuan</p>
                    <p class="font-semibold text-slate-800">
                        {{ \Carbon\Carbon::parse($surat->tanggal_pengajuan)->translatedFormat('d F Y') }}
                    </p>
                </div>

                <div>
                    <p class="text-sm text-slate-500">Tanggal Pengesahan</p>
                    <p class="font-semibold text-slate-800">
                        {{ $surat->tanggal_pengesahan ? \Carbon\Carbon::parse($surat->tanggal_pengesahan)->translatedFormat('d F Y') : '-' }}
                    </p>
                </div>

                <div>
                    <p class="text-sm text-slate-500">Status Pengajuan</p>
                    <div class="mt-1">
                        @php
                            $statusType = match($surat->status) {
                                'Menunggu' => 'pending',
                                'Diproses' => 'process',
                                'Selesai'  => 'success',
                                'Ditolak'  => 'rejected',
                                default    => 'pending'
                            };
                        @endphp
                        <x-ui.status-badge :status="$statusType">{{ $surat->status }}</x-ui.status-badge>
                    </div>
                </div>

                <div class="xl:col-span-3 border-t border-slate-50 pt-4">
                    <p class="text-sm text-slate-500">Keperluan</p>
                    <p class="font-semibold text-slate-800">
                        {{ $surat->keperluan }}
                    </p>
                </div>

                <div class="xl:col-span-3 border-t border-slate-50 pt-4">
                    <p class="text-sm text-slate-500">Catatan Operator</p>
                    <p class="font-semibold text-slate-800 italic text-slate-600">
                        {{ $surat->catatan_operator ?? 'Belum ada catatan dari operator.' }}
                    </p>
                </div>

                @if($surat->status === 'Selesai' && $surat->file_hasil)
                <div class="xl:col-span-3 border-t border-slate-50 pt-4">
                    <p class="text-sm text-slate-500 mb-2">File Hasil Surat</p>
                    <a href="{{ asset('storage/' . $surat->file_hasil) }}" target="_blank" class="inline-flex items-center rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Unduh Surat
                    </a>
                </div>
                @endif
            </div>
        </div>

        @include('admin.pengajuan-surat.partials.lampiran')

        @include('admin.pengajuan-surat.partials.riwayat-status')

    </div>

</x-layouts.admin>