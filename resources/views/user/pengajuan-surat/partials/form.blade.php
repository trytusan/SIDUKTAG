<form 
    action="{{ route('user.pengajuan-surat.store') }}" 
    method="POST" 
    enctype="multipart/form-data"
>
    @csrf

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

        {{-- Nama (AUTO) --}}
        <x-form.input
            label="Nama Pemohon"
            name="nama_pemohon"
            :value="$penduduk->nama_lengkap ?? auth()->user()->name"
            readonly
        />

        {{-- NIK (AUTO) --}}
        <x-form.input
            label="NIK"
            name="nik"
            :value="$penduduk->nik ?? '-'"
            readonly
        />

        {{-- Jenis Surat (DINAMIS) --}}
        <x-form.select
            label="Jenis Surat"
            name="jenis_surat_id"
            :options="$jenisSurat->pluck('nama', 'id')->toArray()"
        />

        {{-- Keperluan --}}
        <div class="xl:col-span-3">
            <x-form.textarea
                label="Keperluan"
                name="keperluan"
                :value="old('keperluan')"
                placeholder="Masukkan keperluan pengajuan surat"
            />
        </div>

        {{-- Dokumen --}}
        <div class="xl:col-span-3">
            <x-form.file
                label="Dokumen Pendukung"
                name="dokumen_pendukung"
            />
        </div>

    </div>

    <div class="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <a
            href="{{ route('user.pengajuan-surat.index') }}"
            class="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
            Kembali
        </a>

        <button
            type="submit"
            class="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
            Ajukan Surat
        </button>
    </div>
</form>