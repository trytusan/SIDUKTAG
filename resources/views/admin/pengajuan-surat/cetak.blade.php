<x-layouts.app title="Cetak - {{ $surat->nomor_pengajuan }}">

    <div class="mx-auto max-w-4xl bg-white p-10 shadow-sm print:shadow-none">
        {{-- Kop Surat (Opsional) --}}
        <div class="mb-8 border-b-4 border-double border-slate-900 pb-4 text-center">
            <h2 class="text-xl font-bold uppercase tracking-widest text-slate-900">Pemerintah Kabupaten Garut</h2>
            <h3 class="text-lg font-bold uppercase text-slate-800">Kecamatan Tarogong Kidul</h3>
            <p class="text-sm italic text-slate-600">Alamat: Jl. Merdeka No. 10, Garut, Jawa Barat</p>
        </div>

        {{-- Judul & Nomor Surat --}}
        <div class="text-center">
            <h1 class="text-2xl font-bold uppercase text-slate-800 underline decoration-2">{{ $surat->jenis_surat_nama }}</h1>
            <p class="mt-2 text-sm font-medium text-slate-700">Nomor: {{ $surat->nomor_pengajuan }}</p>
        </div>

        {{-- Isi Surat --}}
        <div class="mt-10 text-base leading-relaxed text-slate-800">
            <p>Yang bertanda tangan di bawah ini, menerangkan bahwa:</p>

            <div class="my-8 ml-10 space-y-3">
                <div class="flex">
                    <span class="inline-block w-48 font-medium">Nama Lengkap</span>
                    <span>: <span class="font-bold uppercase">{{ $surat->nama_pemohon }}</span></span>
                </div>
                <div class="flex">
                    <span class="inline-block w-48 font-medium">NIK</span>
                    <span>: {{ $surat->nik }}</span>
                </div>
                <div class="flex">
                    <span class="inline-block w-48 font-medium">Alamat</span>
                    <span>: {{ $surat->penduduk->alamat ?? 'Garut, Jawa Barat' }}</span>
                </div>
                <div class="flex">
                    <span class="inline-block w-48 font-medium">Jenis Surat</span>
                    <span>: {{ $surat->jenis_surat_nama }}</span>
                </div>
            </div>

            <p class="mb-6">
                Adalah benar yang bersangkutan merupakan warga kami yang berdomisili di lingkungan tersebut di atas. Surat ini dibuat secara sah berdasarkan data kependudukan untuk dipergunakan sebagai: 
                <span class="font-bold italic text-slate-900">"{{ $surat->keperluan }}"</span>.
            </p>

            <p>
                Demikian surat keterangan ini kami buat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya. Atas perhatiannya kami ucapkan terima kasih.
            </p>
        </div>

        {{-- Tanda Tangan --}}
        <div class="mt-20 flex justify-end">
            <div class="text-center">
                <p class="text-sm text-slate-700">Garut, {{ $surat->tanggal_pengesahan ? \Carbon\Carbon::parse($surat->tanggal_pengesahan)->translatedFormat('d F Y') : now()->translatedFormat('d F Y') }}</p>
                <p class="mt-1 text-sm font-bold text-slate-800">An. Kepala Desa / Ketua Lingkungan</p>
                
                {{-- Area Tanda Tangan --}}
                <div class="my-4 flex justify-center">
                    {{-- Opsional: QRCode untuk validasi digital --}}
                    {{-- {!! QrCode::size(80)->generate(url()->current()) !!} --}}
                    <div class="h-24 w-40 border-b border-dashed border-slate-200"></div>
                </div>

                <p class="font-bold text-slate-900 underline">Administrator Sistem</p>
                <p class="text-xs text-slate-500 italic">NIP: 19880212 201212 1 002</p>
            </div>
        </div>

        {{-- Action Buttons --}}
        <div class="mt-16 flex justify-center gap-4 print:hidden">
            <a href="{{ route('admin.pengajuan-surat.show', $surat->id) }}"
                class="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
                Kembali
            </a>

            <button
                onclick="window.print()"
                class="inline-flex items-center rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Cetak Surat Sekarang
            </button>
        </div>
    </div>

    {{-- CSS Khusus untuk Print --}}
    @push('styles')
    <style>
        @media print {
            body {
                background-color: white !important;
            }
            .print\:hidden {
                display: none !important;
            }
            @page {
                margin: 2cm;
            }
        }
    </style>
    @endpush

</x-layouts.app>