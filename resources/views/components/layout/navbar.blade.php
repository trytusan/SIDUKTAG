@props([
    'title' => 'Dashboard',
    'user' => 'Admin',
])

<nav class="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
    <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-4">
            <button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden"
                onclick="toggleSidebar()" aria-label="Buka menu">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
            </button>
            <div>
                <h1 class="text-xl font-bold text-slate-800">
                    {{ $title }}
                </h1>
                <p class="text-sm text-slate-500">
                    Selamat datang kembali
                </p>
            </div>
        </div>

        <div class="flex items-center gap-4">

            <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                    {{ strtoupper(substr($user, 0, 1)) }}
                </div>
                <div class="hidden sm:block">
                    <p class="text-sm font-semibold text-slate-800">{{ $user }}</p>
                    <p class="text-xs text-slate-500">Pengguna aktif</p>
                </div>
            </div>
        </div>
    </div>
</nav>