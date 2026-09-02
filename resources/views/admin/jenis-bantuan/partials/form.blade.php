<div class="grid grid-cols-1 gap-5 md:grid-cols-2">

    {{-- Nama Program --}}
    <x-form.input
        label="Nama Program Bantuan"
        name="nama_program"
        value="{{ old('nama_program', $jenisBantuan->nama_program ?? '') }}"
        placeholder="Contoh: BLT Dana Desa 2026"
    />

    {{-- Kategori / Jenis Bantuan --}}
    <x-form.select
        label="Jenis Bantuan"
        name="jenis_bantuan"
        :value="old('jenis_bantuan', $jenisBantuan->jenis_bantuan ?? '')"
        :options="[
            '' => 'Pilih jenis bantuan',
            'Bantuan Tunai' => 'Bantuan Tunai',
            'Sembako' => 'Sembako',
            'Pendidikan' => 'Pendidikan',
            'Kesehatan' => 'Kesehatan',
            'Sosial' => 'Sosial'
        ]"
    />

    {{-- Tanggal Mulai --}}
    <x-form.input
        type="date"
        label="Tanggal Mulai"
        name="tanggal_mulai"
        value="{{ old('tanggal_mulai', isset($jenisBantuan->tanggal_mulai) ? $jenisBantuan->tanggal_mulai->format('Y-m-d') : '') }}"
    />

    {{-- Tanggal Selesai --}}
    <x-form.input
        type="date"
        label="Tanggal Selesai"
        name="tanggal_selesai"
        value="{{ old('tanggal_selesai', isset($jenisBantuan->tanggal_selesai) ? $jenisBantuan->tanggal_selesai->format('Y-m-d') : '') }}"
    />

    {{-- Status Aktifitas Program --}}
    <x-form.select
        label="Status Bantuan"
        name="status_bantuan"
        :value="old('status_bantuan', $jenisBantuan->status_bantuan ?? 'Aktif')"
        :options="[
            '' => 'Pilih status bantuan',
            'Aktif' => 'Aktif',
            'Nonaktif' => 'Nonaktif',
            'Selesai' => 'Selesai'
        ]"
    />

    {{-- Kapasitas / Kuota --}}
    <x-form.input
        type="number"
        label="Kuota Penerima"
        name="kuota_penerima"
        value="{{ old('kuota_penerima', $jenisBantuan->kuota_penerima ?? '') }}"
        placeholder="Masukkan jumlah kuota maksimal"
    />

    {{-- Asal Dana --}}
    <x-form.input
        label="Sumber Bantuan"
        name="sumber_bantuan"
        value="{{ old('sumber_bantuan', $jenisBantuan->sumber_bantuan ?? '') }}"
        placeholder="Contoh: APBDes / Pemerintah Pusat"
    />

    {{-- Penjelasan Lengkap Program --}}
    <div class="md:col-span-2">
        <x-form.textarea
            label="Deskripsi Program Bantuan"
            name="deskripsi"
            placeholder="Masukkan detail kriteria dan penjelasan program bantuan"
        >{{ old('deskripsi', $jenisBantuan->deskripsi ?? '') }}</x-form.textarea>
    </div>

</div>

<div class="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
    <a
        href="{{ route('admin.jenis-bantuan.index') }}"
        class="rounded-2xl border border-slate-300 px-8 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
    >
        Batal
    </a>

    <button
        type="submit"
        class="rounded-2xl bg-slate-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800 shadow-sm"
    >
        {{ isset($jenisBantuan) ? 'Perbarui Data' : 'Simpan Program' }}
    </button>
</div>