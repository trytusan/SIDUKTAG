<x-layouts.admin title="Pengaturan Profil" pageTitle="Pengaturan Profil" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengaturan', 'url' => route('admin.pengaturan.index')],
        ['label' => 'Profil']
    ]" />

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="xl:col-span-1">
            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div class="flex flex-col items-center text-center">
                    <div class="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700">
                        A
                    </div>
                    <h2 class="text-xl font-bold text-slate-800">Administrator</h2>
                    <p class="mt-1 text-sm text-slate-500">admin@siduktag.test</p>
                </div>
            </div>
        </div>

        <div class="xl:col-span-2">
            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <form class="space-y-5">
                    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <x-form.input label="Nama Lengkap" name="nama" placeholder="Masukkan nama lengkap" />
                        <x-form.input label="Email" name="email" placeholder="Masukkan email" />
                        <x-form.input label="Nomor Telepon" name="telepon" placeholder="Masukkan nomor telepon" />
                        <x-form.input label="Jabatan" name="jabatan" placeholder="Masukkan jabatan" />
                    </div>

                    <div class="flex items-center justify-end gap-3">
                        <button type="submit" class="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

</x-layouts.admin>