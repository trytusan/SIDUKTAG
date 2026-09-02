<x-layouts.admin title="Pengaturan Akun" pageTitle="Pengaturan Akun" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengajuan Surat', 'url' => route('admin.pengaturan.index')],
        ['label' => 'Akun']
    ]" />

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {{-- TAMBAHKAN ACTION DAN METHOD --}}
        <form action="{{ route('admin.pengaturan.akun.update') }}" method="POST" class="space-y-5">
            @csrf
            @method('PUT')

            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                {{-- ISI :value DENGAN DATA DARI DATABASE --}}
                <x-form.input 
                    label="Nama Lengkap / Username" 
                    name="name" 
                    :value="old('name', $user->name)" 
                    placeholder="Masukkan username" 
                />
                
                <x-form.input 
                    label="Email Login" 
                    name="email" 
                    :value="old('email', $user->email)" 
                    placeholder="Masukkan email login" 
                />

                <x-form.select
                    label="Status Akun"
                    name="status_akun"
                    :value="old('status_akun', $user->status_akun ?? 'Aktif')"
                    :options="[
                        '' => 'Pilih status akun',
                        'Aktif' => 'Aktif',
                        'Nonaktif' => 'Nonaktif'
                    ]"
                />
                
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                <button type="submit" class="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700">
                    Simpan Perubahan Akun
                </button>
            </div>
        </form>
    </div>

</x-layouts.admin>