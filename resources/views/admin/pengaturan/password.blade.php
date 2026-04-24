<x-layouts.admin title="Pengaturan Password" pageTitle="Pengaturan Password" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengaturan', 'url' => route('admin.pengaturan.index')],
        ['label' => 'Password']
    ]" />

    <div class="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form class="space-y-5">
            <x-form.input type="password" label="Password Lama" name="password_lama" placeholder="Masukkan password lama" />
            <x-form.input type="password" label="Password Baru" name="password_baru" placeholder="Masukkan password baru" />
            <x-form.input type="password" label="Konfirmasi Password Baru" name="konfirmasi_password" placeholder="Masukkan ulang password baru" />

            <div class="flex items-center justify-end gap-3">
                <button type="submit" class="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                    Update Password
                </button>
            </div>
        </form>
    </div>

</x-layouts.admin>