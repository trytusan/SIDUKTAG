<x-layouts.admin title="Pengaturan Aplikasi" pageTitle="Pengaturan Aplikasi" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengaturan', 'url' => route('admin.pengaturan.index')],
        ['label' => 'Aplikasi']
    ]" />

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form class="space-y-5">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <x-form.input label="Nama Aplikasi" name="nama_aplikasi" placeholder="Masukkan nama aplikasi" />
                <x-form.input label="Nama Lingkungan" name="nama_lingkungan" placeholder="Masukkan nama lingkungan" />
                <x-form.input label="Alamat Kantor / Posko" name="alamat_kantor" placeholder="Masukkan alamat kantor" />
                <x-form.input label="Email Sistem" name="email_sistem" placeholder="Masukkan email sistem" />
                <x-form.input label="Nomor Telepon Sistem" name="telepon_sistem" placeholder="Masukkan nomor telepon sistem" />
                <x-form.input label="Tahun Aplikasi" name="tahun_aplikasi" placeholder="Masukkan tahun aplikasi" />
            </div>

            <div>
                <x-form.textarea
                    label="Deskripsi Aplikasi"
                    name="deskripsi_aplikasi"
                    placeholder="Masukkan deskripsi singkat aplikasi"
                />
            </div>

            <div class="flex items-center justify-end gap-3">
                <button type="submit" class="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                    Simpan Pengaturan
                </button>
            </div>
        </form>
    </div>

</x-layouts.admin>