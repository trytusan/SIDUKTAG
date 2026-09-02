<x-layouts.app :title="$title">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <div class="min-h-screen bg-slate-100">
        <div id="sidebar-backdrop" class="fixed inset-0 z-30 hidden bg-slate-900/40 lg:hidden" onclick="closeSidebar()"></div>
        <x-layout.sidebar-admin />

        <div class="lg:ml-72 flex min-h-screen min-w-0 flex-col">
            <x-layout.navbar :title="$pageTitle" :user="$user" />

            <main class="flex-1 overflow-x-hidden p-6">
                <div class="w-full space-y-6">
                    {{ $slot }}
                </div>
            </main>

            <x-layout.footer />
        </div>
    </div>
</x-layouts.app>