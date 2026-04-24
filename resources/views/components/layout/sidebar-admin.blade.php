<aside
    class="fixed top-0 left-0 z-40 flex h-screen w-72 min-w-[18rem] flex-col border-r border-white/10 bg-slate-950 text-slate-200">

    <!-- Header -->
    <div class="border-b border-white/10 px-6 py-6">
        <h2 class="text-2xl font-bold text-white">SIDUKTAG</h2>
        <p class="mt-1 text-sm text-slate-400">Panel Administrator</p>
    </div>

    @php
        $active = 'bg-emerald-500/15 text-emerald-300';
        $inactive = 'text-slate-300 hover:bg-white/5 hover:text-white';
    @endphp

    <!-- Menu -->
    <nav class="flex-1 space-y-2 overflow-y-auto px-4 py-6">

        <!-- Dashboard -->
        <a href="{{ route('admin.dashboard') }}"
            class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition {{ request()->routeIs('admin.dashboard') ? $active : $inactive }}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
            </svg>
            Dashboard
        </a>

        <!-- Penduduk -->
        <a href="{{ route('admin.penduduk.index') }}"
            class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition {{ request()->routeIs('admin.penduduk.*') ? $active : $inactive }}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                    d="M5.121 17.804A7.5 7.5 0 1118.879 17.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Data Penduduk
        </a>

        <!-- Kartu Keluarga -->
        <a href="{{ route('admin.kartu-keluarga.index') }}"
            class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition {{ request()->routeIs('admin.kartu-keluarga.*') ? $active : $inactive }}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                    d="M3 7.5 12 3l9 4.5M4.5 10.5V15A7.5 7.5 0 0 0 12 22.5 7.5 7.5 0 0 0 19.5 15v-4.5" />
            </svg>
            Data Keluarga
        </a>

        <!-- Pengajuan Surat -->
        <a href="{{ route('admin.pengajuan-surat.index') }}"
            class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition {{ request()->routeIs('admin.pengajuan-surat.*') || request()->routeIs('admin.jenis-surat.*') ? $active : $inactive }}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H5.625A2.625 2.625 0 0 0 3 4.875v14.25a2.625 2.625 0 0 0 2.625 2.625h12.75A2.625 2.625 0 0 0 21 19.125v-1.5a3.375 3.375 0 0 0-1.5-2.812Z" />
            </svg>
            Pengajuan Surat
        </a>

        <!-- Bantuan -->
        <a href="{{ route('admin.bantuan.index') }}"
            class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition {{ request()->routeIs('admin.bantuan.*') ? $active : $inactive }}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                    d="M4.5 12a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Z" />
            </svg>
            Bantuan
        </a>

        <!-- Pengaturan -->
        <a href="{{ route('admin.pengaturan.index') }}"
            class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition {{ request()->routeIs('admin.pengaturan.*') ? $active : $inactive }}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor"
                stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 15.75A3.75 3.75 0 1 0 12 8.25a3.75 3.75 0 0 0 0 7.5Z" />
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M19.5 12a7.5 7.5 0 0 0-.15-1.5l2.1-1.65-2-3.46-2.55 1a7.5 7.5 0 0 0-2.6-1.5l-.4-2.7h-4l-.4 2.7a7.5 7.5 0 0 0-2.6 1.5l-2.55-1-2 3.46 2.1 1.65A7.5 7.5 0 0 0 4.5 12c0 .5.05 1 .15 1.5l-2.1 1.65 2 3.46 2.55-1a7.5 7.5 0 0 0 2.6 1.5l.4 2.7h4l.4-2.7a7.5 7.5 0 0 0 2.6-1.5l2.55 1 2-3.46-2.1-1.65c.1-.5.15-1 .15-1.5Z" />
            </svg>
            Pengaturan
        </a>

    </nav>

    <!-- Logout -->
    <div class="border-t border-white/10 px-4 py-4">
        <a href="{{ route('login') }}"
            class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" stroke="currentColor"
                stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H9m0 0 3-3m-3 3 3 3" />
            </svg>
            Logout
        </a>
    </div>

</aside>