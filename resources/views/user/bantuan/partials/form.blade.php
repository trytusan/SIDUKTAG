<div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

    <div class="xl:col-span-2">
        <x-form.select
            label="Program Bantuan"
            name="bantuan_id"
            :options="['' => 'Pilih program bantuan'] + $programBantuan->pluck('nama_program', 'id')->toArray()"
        />
        @error('bantuan_id')
            <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
        @enderror
    </div>

    <div>
        <x-form.input
            label="Nama Pemohon"
            name="nama_pemohon"
            :value="$penduduk->nama_lengkap ?? auth()->user()->name"
            readonly
        />
    </div>

    <div>
        <x-form.input
            label="NIK"
            name="nik"
            :value="$penduduk->nik ?? '-'"
            readonly
        />
    </div>

    <div>
        <x-form.input
            label="Nomor KK"
            name="nomor_kk"
            :value="$penduduk->nomor_kk ?? '-'"
            readonly
        />
    </div>

    <div>
        <x-form.input
            label="Jenis Bantuan"
            name="jenis_bantuan"
            :value="old('jenis_bantuan')"
            placeholder="Otomatis mengikuti program bantuan"
            readonly
        />
    </div>

    <div class="xl:col-span-3">
        <x-form.textarea
            label="Alasan / Keterangan"
            name="catatan"
            placeholder="Jelaskan alasan pengajuan bantuan"
        >{{ old('catatan') }}</x-form.textarea>
        @error('catatan')
            <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
        @enderror
    </div>

</div>

<div class="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
    <a
        href="{{ route('user.bantuan.index') }}"
        class="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
        Kembali
    </a>

    <button
        type="submit"
        class="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
    >
        Ajukan Bantuan
    </button>
</div>