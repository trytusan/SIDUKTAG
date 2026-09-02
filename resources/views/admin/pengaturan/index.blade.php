<x-layouts.admin title="Pengaturan" pageTitle="Pengaturan" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengaturan']
    ]" />

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <a href="{{ route('admin.pengaturan.profil') }}"
           class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75a17.933 17.933 0 0 1-7.5-1.632Z" />
                </svg>
            </div>
            <h2 class="mt-4 text-lg font-bold text-slate-800">Profil</h2>
            <p class="mt-1 text-sm text-slate-500">Kelola informasi profil administrator.</p>
        </a>

        <a href="{{ route('admin.pengaturan.akun') }}"
           class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16.5 10.5V7.875a4.5 4.5 0 1 0-9 0V10.5m-.75 0h10.5A2.25 2.25 0 0 1 19.5 12.75v5.25a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18v-5.25A2.25 2.25 0 0 1 6.75 10.5Z" />
                </svg>
            </div>
            <h2 class="mt-4 text-lg font-bold text-slate-800">Akun</h2>
            <p class="mt-1 text-sm text-slate-500">Atur username, email, dan status akun.</p>
        </a>

        <a href="{{ route('admin.pengaturan.password') }}"
           class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 15v2.25m0 0h.008v.008H12v-.008Zm4.5-6.75V8.25a4.5 4.5 0 1 0-9 0v2.25m9 0h.75A2.25 2.25 0 0 1 19.5 12.75v6A2.25 2.25 0 0 1 17.25 21h-10.5A2.25 2.25 0 0 1 4.5 18.75v-6A2.25 2.25 0 0 1 6.75 10.5h9.75Z" />
                </svg>
            </div>
            <h2 class="mt-4 text-lg font-bold text-slate-800">Password</h2>
            <p class="mt-1 text-sm text-slate-500">Perbarui password untuk keamanan akun.</p>
        </a>


    </div>

</x-layouts.admin>