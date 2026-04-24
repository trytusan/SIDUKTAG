<x-layouts.user
    title="Bantuan"
    pageTitle="Bantuan Saya"
    :user="auth()->user()->penduduk->nama_lengkap ?? auth()->user()->name"
>

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard Saya', 'url' => route('user.dashboard')],
        ['label' => 'Bantuan Saya']
    ]" />

    @if (session('status'))
        <div class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {{ session('status') }}
        </div>
    @endif

    @if (session('error'))
        <div class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ session('error') }}
        </div>
    @endif

    <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div class="w-full lg:w-72">
                    <x-table.search-box placeholder="Cari program bantuan..." />
                </div>

                <select class="w-full lg:w-48 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
                    <option value="">Semua Status</option>
                    <option>Aktif</option>
                    <option>Menunggu</option>
                    <option>Selesai</option>
                    <option>Ditolak</option>
                </select>
            </div>

            <div class="flex items-center justify-end">
                <a
                    href="{{ route('user.bantuan.create') }}"
                    class="inline-flex items-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                    Ajukan Bantuan
                </a>
            </div>
        </div>
    </div>

    <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        @include('user.bantuan.partials.table')
    </div>

    @if($bantuan->hasPages())
        <div class="mt-4">
            {{ $bantuan->links() }}
        </div>
    @endif

</x-layouts.user>