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
        <textarea name="deskripsi" rows="4"
            class="w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="Jelaskan kegunaan surat ini...">{{ old('deskripsi', $jenisSurat->deskripsi ?? '') }}</textarea>
    </div>

    {{-- Status Aktif (Hanya tampil saat Edit) --}}
    @if(isset($jenisSurat))
        <div class="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div>
                <span class="block text-sm font-semibold text-slate-700">Status Aktif</span>
                <span class="text-xs text-slate-500">Nonaktifkan jika jenis surat ini sedang tidak tersedia.</span>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" name="is_active" value="1" {{ $jenisSurat->is_active ? 'checked' : '' }}
                    class="peer sr-only">
                <div
                    class="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white">
                </div>
            </label>
        </div>
    @endif

    {{-- Tombol Aksi --}}
    <div class="flex gap-4 pt-4 border-t border-slate-100">
        <button type="submit"
            class="inline-flex items-center rounded-2xl bg-slate-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isset($jenisSurat) ? 'Perbarui Data' : 'Simpan Jenis Surat' }}
        </button>

        <a href="{{ route('admin.jenis-surat.index') }}"
            class="rounded-2xl border border-slate-200 px-8 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
            Batal
        </a>
    </div>
</div>