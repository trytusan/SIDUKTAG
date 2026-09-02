<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
    {{-- 1. Pilih Pemohon (Warga) --}}
    <div class="md:col-span-2">
        <x-form.select label="Cari & Pilih Pemohon (Warga)" name="penduduk_id" :value="old('penduduk_id', $pengajuan->penduduk_id ?? '')" :options="$listPenduduk" required />
        <p class="mt-1 text-xs text-slate-400 font-medium italic">*Data Nama dan NIK akan diambil otomatis dari profil
            warga.</p>
    </div>

    {{-- 2. Pilih Jenis Surat --}}
    <x-form.select label="Jenis Surat" name="jenis_surat_id" required
        :options="['' => 'Pilih jenis surat'] + $jenisSurat->pluck('nama', 'id')->toArray()"
        :value="old('jenis_surat_id', $pengajuan->jenis_surat_id ?? '')" />

    {{-- 3. Tanggal Pengajuan --}}
    <x-form.input type="date" label="Tanggal Pengajuan" name="tanggal_pengajuan"
        value="{{ old('tanggal_pengajuan', isset($pengajuan) ? $pengajuan->tanggal_pengajuan->format('Y-m-d') : now()->toDateString()) }}" />

    {{-- 4. Keperluan --}}
    <div class="md:col-span-2">
        <x-form.textarea label="Keperluan" name="keperluan" placeholder="Masukkan keperluan pengajuan surat" required>
            {{ old('keperluan', $pengajuan->keperluan ?? '') }}
        </x-form.textarea>
    </div>

    {{-- 5. Dokumen Pendukung --}}
    <div class="md:col-span-2">
        <x-form.file label="Dokumen Pendukung" name="dokumen_pendukung" />
        @if(isset($pengajuan) && $pengajuan->dokumen_pendukung)
            <div class="mt-2 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Dokumen sudah diunggah: <a href="{{ asset('storage/' . $pengajuan->dokumen_pendukung) }}" target="_blank"
                    class="underline">Lihat File</a>
            </div>
        @endif
        <p class="mt-1 text-xs text-slate-400 font-medium italic">*Format: JPG, PNG, PDF (Maks. 4MB)</p>
    </div>
</div>

<div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
    <a href="{{ route('admin.pengajuan-surat.index') }}"
        class="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
        Batal
    </a>

    <button type="submit"
        class="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700">
        {{ isset($pengajuan) ? 'Perbarui Pengajuan' : 'Simpan Pengajuan' }}
    </button>
</div>