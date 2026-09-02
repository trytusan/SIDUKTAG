<div class="grid grid-cols-1 gap-5 md:grid-cols-2">

    <x-form.input
        label="Nomor KK"
        name="nomor_kk"
        :value="old('nomor_kk', $kartuKeluarga->nomor_kk ?? '')"
        placeholder="Masukkan nomor KK"
    />

    <x-form.input
        label="Nama Kepala Keluarga"
        name="nama_kepala_keluarga"
        :value="old('nama_kepala_keluarga', $kartuKeluarga->nama_kepala_keluarga ?? '')"
        placeholder="Masukkan nama kepala keluarga"
    />

    {{-- Jumlah anggota biasanya dihitung otomatis di Controller, buat readonly --}}
    <x-form.input
        label="Jumlah Anggota Keluarga"
        name="jumlah_anggota"
        :value="old('jumlah_anggota', $kartuKeluarga->jumlah_anggota ?? 0)"
        readonly
        class="bg-slate-50"
    />

    <div class="md:col-span-2">
        <x-form.textarea
            label="Alamat Keluarga"
            name="alamat_keluarga"
            placeholder="Masukkan alamat keluarga"
        >{{ old('alamat_keluarga', $kartuKeluarga->alamat_keluarga ?? '') }}</x-form.textarea>
    </div>

    <div class="md:col-span-2">
        <label class="mb-3 block text-sm font-medium text-slate-800">
            Daftar Anggota Keluarga
        </label>

        <div id="anggota-container" class="space-y-3">
            {{-- Menangani data lama (old input) atau data edit --}}
            @php
                $anggotaData = old('anggota', isset($kartuKeluarga) ? $kartuKeluarga->anggota->pluck('nama_lengkap')->toArray() : ['']);
            @endphp

            @foreach($anggotaData as $val)
                <div class="anggota-item flex items-center gap-3">
                    <input
                        type="text"
                        name="anggota[]"
                        value="{{ $val }}"
                        placeholder="Nama anggota keluarga"
                        class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    >
                    <button type="button" onclick="hapusAnggota(this)" class="rounded-xl bg-red-100 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-200">
                        Hapus
                    </button>
                </div>
            @endforeach
        </div>

        <button type="button" onclick="tambahAnggota()" class="mt-4 inline-flex items-center rounded-2xl bg-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200">
            + Tambah Anggota
        </button>
    </div>
</div>

<div class="mt-6 flex items-center justify-end gap-3">
    <a href="{{ route('admin.kartu-keluarga.index') }}" class="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
        Batal
    </a>
    <button type="submit" class="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
        {{ isset($kartuKeluarga) ? 'Simpan Perubahan' : 'Simpan Data' }}
    </button>
</div>