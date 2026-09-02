<x-layouts.user
    title="Pengaturan Akun"
    pageTitle="Pengaturan Akun"
    :user="auth()->user()->penduduk->nama_lengkap ?? auth()->user()->name"
>

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard Saya', 'url' => route('user.dashboard')],
        ['label' => 'Pengaturan', 'url' => route('user.pengaturan.index')],
        ['label' => 'Akun']
    ]" />

    @if (session('status'))
        <div class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {{ session('status') }}
        </div>
    @endif

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-6">
            <h2 class="text-lg font-bold text-slate-800">Informasi Akun</h2>
            <p class="mt-1 text-sm text-slate-500">
                Kelola data akun login Anda.
            </p>
        </div>

        <form
            action="{{ route('user.pengaturan.akun.update') }}"
            method="POST"
            class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
            @csrf
            @method('PUT')

            <div>
                <x-form.input
                    label="Username"
                    name="name"
                    :value="old('name', auth()->user()->name)"
                    placeholder="Masukkan username"
                />
                @error('name')
                    <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <x-form.input
                    label="Email"
                    name="email"
                    :value="old('email', auth()->user()->email)"
                    placeholder="Masukkan email"
                />
                @error('email')
                    <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <x-form.input
                    label="Status Akun"
                    name="status_akun_tampil"
                    :value="auth()->user()->is_active ? 'Aktif' : 'Tidak Aktif'"
                    readonly
                />
            </div>

            <div class="xl:col-span-3 flex justify-end border-t border-slate-100 pt-5">
                <button
                    type="submit"
                    class="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                    Simpan Perubahan
                </button>
            </div>
        </form>
    </div>

</x-layouts.user>