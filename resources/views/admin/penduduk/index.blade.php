<x-layouts.admin title="Data Penduduk" pageTitle="Data Penduduk" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Data Penduduk']
    ]" />

    @if (session('status'))
        <div class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {{ session('status') }}
        </div>
    @endif

    @include('admin.penduduk.partials.filters')

    <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        @include('admin.penduduk.partials.table')
    </div>


    @if($penduduk->hasPages())
        <div class="mt-4">
            {{ $penduduk->links() }}
        </div>
    @endif

    @push('scripts')
        @vite('resources/js/admin/penduduk.js')
    @endpush

</x-layouts.admin>