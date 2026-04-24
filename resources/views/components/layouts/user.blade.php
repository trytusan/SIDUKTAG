@props([
    'title' => 'User Panel',
    'pageTitle' => 'Dashboard Saya',
    'user' => 'Masyarakat',
])

<x-layouts.app :title="$title">
    <div class="min-h-screen bg-slate-100">
        <x-layout.sidebar-user />

        <div class="ml-72 flex min-h-screen min-w-0 flex-col">
            <header class="border-b border-slate-200 bg-white px-6 py-5">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 class="text-2xl font-bold text-slate-800">
                            {{ $pageTitle }}
                        </h1>
                        <p class="mt-1 text-sm text-slate-500">
                            Selamat datang kembali
                        </p>

                           
                    </div>

                               
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                            @if(auth()->user()->penduduk && auth()->user()->penduduk->foto_profil)
                                <img src="{{ asset('storage/' . auth()->user()->penduduk->foto_profil) }}" 
                                    alt="Profile" 
                                    class="h-12 w-12 rounded-full object-cover shadow-sm">
                            @else
                                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                                    {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}
                                </div>
                            @endif
                            <div>
                                <p class="text-base font-semibold text-slate-800">
                                    {{ $user }}
                                </p>
                                <p class="text-sm text-slate-500">
                                    Pengguna aktif
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main class="flex-1 overflow-x-hidden p-6">
                <div class="w-full space-y-6">
                    {{ $slot }}
                </div>
            </main>

            <x-layout.footer />
        </div>
    </div>
</x-layouts.app>