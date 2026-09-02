<x-layouts.admin title="Pengaturan Profil" pageTitle="Pengaturan Profil" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengaturan', 'url' => route('admin.pengaturan.index')],
        ['label' => 'Profil']
    ]" />

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {{-- Card Informasi Visual --}}
        <div class="xl:col-span-1">
            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div class="flex flex-col items-center text-center">
                    <div class="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700 uppercase">
                        {{ substr($user->name, 0, 1) }}
                    </div>
                    <h2 class="text-xl font-bold text-slate-800">{{ $user->name }}</h2>
                    <p class="mt-1 text-sm text-slate-500">{{ $user->email }}</p>
                    <span class="mt-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {{ $user->jabatan ?? 'Pengguna' }}
                    </span>
                </div>
            </div>
        </div>

        {{-- Form Edit Profil --}}
        <div class="xl:col-span-2">
            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <form action="{{ route('admin.pengaturan.profil.update') }}" method="POST" class="space-y-5">
                    @csrf
                    @method('PUT')

                    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <x-form.input 
                            label="Nama Lengkap" 
                            name="name" {{-- Sesuaikan dengan kolom 'name' di DB --}}
                            :value="old('name', $user->name)" 
                            placeholder="Masukkan nama lengkap" 
                        />
                        
                        <x-form.input 
                            label="Email" 
                            name="email" 
                            :value="old('email', $user->email)" 
                            placeholder="Masukkan email" 
                        />
                        
                        <x-form.input 
                            label="Nomor Telepon" 
                            name="telepon" 
                            :value="old('telepon', $user->telepon)" 
                            placeholder="Masukkan nomor telepon" 
                        />
                        
                        <x-form.input 
                            label="Jabatan" 
                            name="jabatan" 
                            :value="old('jabatan', $user->jabatan)" 
                            placeholder="Masukkan jabatan (contoh: Kepala Lingkungan)" 
                        />
                    </div>

                    <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                        <button type="submit" class="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

</x-layouts.admin>