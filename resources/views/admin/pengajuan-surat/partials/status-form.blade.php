<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-5">
        <h2 class="text-lg font-bold text-slate-800">Form Verifikasi Status</h2>
        <p class="text-sm text-slate-500">Ubah status pengajuan dan tambahkan catatan operator</p>
    </div>

    {{-- Hubungkan ke route updateVerifikasi dengan ID surat --}}
    <form action="{{ route('admin.pengajuan-surat.verifikasi.update', $surat->id) }}" method="POST" enctype="multipart/form-data" class="space-y-5">
        @csrf
        @method('PUT') {{-- Karena di route biasanya menggunakan PUT/PATCH untuk update --}}

        <div>
            <label class="mb-2 block text-sm font-medium text-slate-800">Status Pengajuan</label>
            <select name="status" required class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
                <option value="Menunggu" {{ $surat->status == 'Menunggu' ? 'selected' : '' }}>Menunggu</option>
                <option value="Diproses" {{ $surat->status == 'Diproses' ? 'selected' : '' }}>Diproses</option>
                <option value="Selesai" {{ $surat->status == 'Selesai' ? 'selected' : '' }}>Selesai</option>
                <option value="Ditolak" {{ $surat->status == 'Ditolak' ? 'selected' : '' }}>Ditolak</option>
            </select>
            @error('status') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
        </div>

        {{-- Field Tanggal Pengesahan (Opsional sesuai logic controller Anda) --}}
        <div>
            <label class="mb-2 block text-sm font-medium text-slate-800">Tanggal Pengesahan</label>
            <input
                type="date"
                name="tanggal_pengesahan"
                value="{{ old('tanggal_pengesahan', $surat->tanggal_pengesahan ?? now()->toDateString()) }}"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            >
        </div>

        <div>
            <label class="mb-2 block text-sm font-medium text-slate-800">Catatan Operator</label>
            <textarea
                name="catatan_operator"
                rows="4"
                placeholder="Masukkan alasan diterima/ditolak atau instruksi pengambilan surat..."
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            >{{ old('catatan_operator', $surat->catatan_operator) }}</textarea>
            @error('catatan_operator') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
        </div>

        {{-- Input File jika admin mengunggah hasil scan surat yang sudah jadi --}}
        <div>
            <label class="mb-2 block text-sm font-medium text-slate-800">File Hasil Surat (Jika Ada)</label>
            <input
                type="file"
                name="file_hasil"
                class="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-200"
            >
            <p class="mt-1 text-[10px] text-slate-400">*Format PDF/JPG maksimal 2MB</p>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4">
            <a
                href="{{ route('admin.pengajuan-surat.show', $surat->id) }}"
                class="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
                Batal
            </a>

            <button
                type="submit"
                class="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700"
            >
                Simpan Verifikasi
            </button>
        </div>
    </form>
</div>