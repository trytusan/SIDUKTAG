<div class="space-y-6">
    {{-- Nama Surat --}}
    <div>
        <label class="mb-2 block text-sm font-semibold text-slate-700">Nama Jenis Surat</label>
        <input type="text" name="nama" value="{{ old('nama', $jenisSurat->nama ?? '') }}" required
            class="w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500 @error('nama') border-red-500 @enderror"
            placeholder="Contoh: Surat Keterangan Domisili">
        @error('nama')
            <p class="mt-1 text-xs text-red-500">{{ $message }}</p>
        @enderror
    </div>

    {{-- Deskripsi --}}
    <div>
        <label class="mb-2 block text-sm font-semibold text-slate-700">Deskripsi (Opsional)</label>
        <textarea name="deskripsi" rows="3"
            class="w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Jelaskan kegunaan surat ini...">{{ old('deskripsi', $jenisSurat->deskripsi ?? '') }}</textarea>
    </div>

    {{-- Template Surat (Baru) --}}
    <div>
        <label class="mb-2 block text-sm font-semibold text-slate-700">File Template Surat</label>
        <div class="relative flex items-center justify-center w-full">
            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer group">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="text-xs text-slate-500"><span class="font-semibold text-emerald-600">Klik untuk unggah</span> atau seret file</p>
                    <p class="text-[10px] text-slate-400 mt-1 uppercase">PDF, JPG, PNG, atau DOCX (Max. 2MB)</p>
                </div>
                <input type="file" name="template_file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx" />
            </label>
        </div>

        {{-- Indikator Jika File Sudah Ada (Saat Edit) --}}
        @if(isset($jenisSurat) && $jenisSurat->template_file)
            <div class="mt-3 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2">
                <div class="flex items-center gap-2">
                    <div class="rounded-lg bg-emerald-500 p-1.5 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span class="text-xs font-medium text-emerald-700">File template tersedia</span>
                </div>
                <a href="{{ asset('storage/' . $jenisSurat->template_file) }}" target="_blank" class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 hover:underline">
                    Lihat File
                </a>
            </div>
        @endif
        @error('template_file')
            <p class="mt-1 text-xs text-red-500">{{ $message }}</p>
        @enderror
    </div>

    {{-- Status Aktif --}}
    @if(isset($jenisSurat))
        <div class="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div>
                <span class="block text-sm font-semibold text-slate-700">Status Aktif</span>
                <span class="text-xs text-slate-500">Nonaktifkan jika jenis surat ini sedang tidak tersedia.</span>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" name="is_active" value="1" {{ $jenisSurat->is_active ? 'checked' : '' }}
                    class="peer sr-only">
                <div class="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white">
                </div>
            </label>
        </div>
    @endif

    {{-- Tombol Aksi --}}
    <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
        <button type="submit"
            class="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800 shadow-sm active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isset($jenisSurat) ? 'Perbarui Data' : 'Simpan Jenis Surat' }}
        </button>

        <a href="{{ route('admin.jenis-surat.index') }}"
            class="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 active:scale-95">
            Batal
        </a>
    </div>
</div>