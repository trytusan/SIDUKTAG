<x-layouts.admin title="Verifikasi Pengajuan Surat" pageTitle="Verifikasi Pengajuan Surat" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengajuan Surat', 'url' => route('admin.pengajuan-surat.index')],
        ['label' => 'Verifikasi']
    ]" />

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {{-- Sisi Kiri: Informasi & Lampiran --}}
        <div class="xl:col-span-2 space-y-6">

            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div class="mb-5 flex items-center justify-between">
                    <h2 class="text-lg font-bold text-slate-800">Informasi Pemohon</h2>
                    <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                        ID: #{{ $surat->nomor_pengajuan }}
                    </span>
                </div>

                <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
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

                    <div class="md:col-span-2">
                        <p class="text-sm text-slate-500">Keperluan</p>
                        <p class="font-semibold text-slate-800">{{ $surat->keperluan }}</p>
                    </div>
                </div>
            </div>

            {{-- Menampilkan Lampiran Dokumen untuk diperiksa Admin --}}
            @include('admin.pengajuan-surat.partials.lampiran')
        </div>

        {{-- Sisi Kanan: Form Aksi Verifikasi --}}
        <div>
            {{-- Pastikan nama file partials ini sesuai dengan file form verifikasi yang kita buat tadi --}}
            @include('admin.pengajuan-surat.partials.status-form')
        </div>
    </div>

</x-layouts.admin>