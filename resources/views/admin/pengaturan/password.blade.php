<x-layouts.admin title="Pengaturan Password" pageTitle="Pengaturan Password" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengaturan', 'url' => route('admin.pengaturan.index')],
        ['label' => 'Password']
    ]" />

    <div class="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form action="{{ route('admin.pengaturan.password.update') }}" method="POST" class="space-y-5">
            @csrf
            @method('PUT')

            {{-- Menggunakan name 'current_password' agar bisa divalidasi otomatis --}}
            <x-form.input type="password" label="Password Saat Ini" name="current_password" placeholder="Masukkan password lama" required />
            
            {{-- Menggunakan name 'password' untuk password baru --}}
            <x-form.input type="password" label="Password Baru" name="password" placeholder="Masukkan password baru" required />
            
            {{-- Menggunakan name 'password_confirmation' agar otomatis divalidasi oleh rule 'confirmed' --}}
            <x-form.input type="password" label="Konfirmasi Password Baru" name="password_confirmation" placeholder="Masukkan ulang password baru" required />

            <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                <button type="submit" class="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700">
                    Update Password
                </button>
            </div>
        </form>
    </div>

</x-layouts.admin>