<form action="{{ route('user.pengajuan-surat.store') }}" method="POST" enctype="multipart/form-data">
    @csrf

    <div class="space-y-8">
        {{-- Section 1: Informasi Pemohon --}}
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center gap-3 border-b border-slate-50 pb-4">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <h3 class="font-bold text-slate-800">Informasi Pemohon</h3>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <x-form.input label="Nama Lengkap" name="nama_pemohon" :value="$penduduk->nama_lengkap ?? auth()->user()->name" readonly />
                <x-form.input label="Nomor Induk Kependudukan (NIK)" name="nik" :value="$penduduk->nik ?? '-'"
                    readonly />
            </div>
        </div>

        {{-- Section 2: Detail Pengajuan --}}
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center gap-3 border-b border-slate-50 pb-4">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 class="font-bold text-slate-800">Detail Surat</h3>
            </div>

            <div class="grid grid-cols-1 gap-6">
                {{-- Pemilihan Jenis Surat --}}
                <div class="max-w-md">
                    <x-form.select label="Jenis Surat yang Diajukan" name="jenis_surat_id" id="jenis_surat_select"
                        :options="$jenisSurat->pluck('nama', 'id')->toArray()" placeholder="-- Pilih Jenis Surat --" />
                </div>

                {{-- Container Dinamis Template (Akan diisi JS) --}}
                <div id="template-container" class="hidden transition-all duration-500">
                    <div class="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
                        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div class="flex items-start gap-4">
                                <div
                                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="text-sm font-bold text-emerald-900">Template Tersedia</h4>
                                    <p id="template-description"
                                        class="max-w-xl text-xs leading-relaxed text-emerald-700"></p>
                                </div>
                            </div>
                            <a id="template-link" href="#" target="_blank"
                                class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-emerald-600 shadow-sm transition hover:bg-emerald-100 active:scale-95">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Unduh Template Surat
                            </a>
                        </div>
                    </div>
                </div>

                <x-form.textarea label="Keperluan / Alasan Pengajuan" name="keperluan" rows="4"
                    placeholder="Contoh: Digunakan sebagai syarat pendaftaran sekolah atau melamar pekerjaan..." />

                <div class="max-w-xl">
                    <x-form.file label="Dokumen Pendukung (Opsional)" name="dokumen_pendukung"
                        helper="Format: JPG, PNG, PDF (Maks. 4MB). Sertakan bukti pendukung jika diperlukan." />
                </div>
            </div>
        </div>

        {{-- Footer Form --}}
        <div class="flex items-center justify-between border-t border-slate-100 pt-6">
            <a href="{{ route('user.pengajuan-surat.index') }}"
                class="flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Batalkan dan Kembali
            </a>
            <button type="submit"
                class="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-10 py-4 text-sm font-bold text-white transition hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 active:scale-95">
                Kirim Pengajuan Surat
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </div>
    </div>
</form>
@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Targetkan select berdasarkan name attribute karena id sering dibungkus component
            const selectSurat = document.querySelector('select[name="jenis_surat_id"]');
            const templateContainer = document.getElementById('template-container');
            const descText = document.getElementById('template-description');
            const linkFile = document.getElementById('template-link');

            // Data Jenis Surat (Pastikan di Controller sudah menggunakan keyBy('id'))
            const daftarSurat = @json($jenisSurat->keyBy('id'));

            if (selectSurat) {
                selectSurat.addEventListener('change', function () {
                    const selectedId = this.value;
                    const data = daftarSurat[selectedId];

                    if (data && data.template_file) {
                        // Reset animiasi & tampilkan
                        templateContainer.classList.remove('hidden');
                        templateContainer.style.opacity = '0';
                        templateContainer.style.transform = 'translateY(-10px)';

                        setTimeout(() => {
                            templateContainer.style.transition = 'all 0.4s ease';
                            templateContainer.style.opacity = '1';
                            templateContainer.style.transform = 'translateY(0)';
                            descText.textContent = data.deskripsi || 'Silakan unduh template surat ini dan isi data sesuai dengan format yang telah disediakan sebelum diunggah kembali.';
                            linkFile.href = `{{ asset('storage') }}/${data.template_file}`;
                        }, 50);
                    } else {
                        templateContainer.classList.add('hidden');
                    }
                });

                // Inisialisasi jika ada old value (setelah validasi gagal)
                if (selectSurat.value) {
                    selectSurat.dispatchEvent(new Event('change'));
                }
            }
        });
    </script>
@endpush