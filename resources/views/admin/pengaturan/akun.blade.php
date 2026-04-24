<x-layouts.admin title="Pengaturan Akun" pageTitle="Pengaturan Akun" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengaturan', 'url' => route('admin.pengaturan.index')],
        ['label' => 'Akun']
    ]" />

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form class="space-y-5">
            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <x-form.input label="Username" name="username" placeholder="Masukkan username" />
                <x-form.input label="Email Login" name="email_login" placeholder="Masukkan email login" />

                <x-form.select
                    label="Status Akun"
                    name="status_akun"
                    :options="[
                        '' => 'Pilih status akun',
                        'Aktif' => 'Aktif',
                        'Nonaktif' => 'Nonaktif'
                    ]"
                />

                <x-form.select
                    label="Role"
                    name="role"
                    :options="[
                        '' => 'Pilih role',
                        'Administrator' => 'Administrator',
                        'Operator' => 'Operator'
                    ]"
                />
            </div>

            <div class="flex items-center justify-end gap-3">
                <button type="submit" class="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                    Simpan Akun
                </button>
            </div>
        </form>
    </div>

</x-layouts.admin>