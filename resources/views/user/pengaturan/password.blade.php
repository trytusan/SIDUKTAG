<x-layouts.user
    title="Ubah Password"
    pageTitle="Ubah Password"
    :user="auth()->user()->penduduk->nama_lengkap ?? auth()->user()->name"
>

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard Saya', 'url' => route('user.dashboard')],
        ['label' => 'Pengaturan', 'url' => route('user.pengaturan.index')],
        ['label' => 'Password']
    ]" />

    @if (session('status'))
        <div class="mx-auto mb-6 max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {{ session('status') }}
        </div>
    @endif

    <div class="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-6">
            <h2 class="text-lg font-bold text-slate-800">Perbarui Password</h2>
            <p class="mt-1 text-sm text-slate-500">
                Gunakan password yang kuat untuk menjaga keamanan akun Anda.
            </p>
        </div>

        <form action="{{ route('password.change.update') }}" method="POST" class="space-y-5">
            @csrf

            <div>
                <x-form.input
                    type="password"
                    label="Password Lama"
                    name="current_password"
                    placeholder="Masukkan password lama"
                />
                @error('current_password')
                    <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <x-form.input
                    type="password"
                    label="Password Baru"
                    name="password"
                    placeholder="Masukkan password baru"
                />
                @error('password')
                    <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <x-form.input
                    type="password"
                    label="Konfirmasi Password Baru"
                    name="password_confirmation"
                    placeholder="Masukkan ulang password baru"
                />
            </div>

            <div class="flex justify-end border-t border-slate-100 pt-5">
                <button
                    type="submit"
                    class="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                    Update Password
                </button>
            </div>
        </form>
    </div>

</x-layouts.user>