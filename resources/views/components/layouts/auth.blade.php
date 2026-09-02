@props([
    'title' => 'Autentikasi',
])

<x-layouts.app :title="$title">

    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">

        <!-- Background -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute top-10 left-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl"></div>
            <div class="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"></div>
            <div class="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl"></div>
        </div>

        <!-- Content -->
        <div class="relative flex min-h-screen items-center justify-center px-4">
            {{ $slot }}
        </div>

    </div>

</x-layouts.app>