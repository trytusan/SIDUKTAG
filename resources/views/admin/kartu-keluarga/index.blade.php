<x-layouts.admin title="Data Keluarga" pageTitle="Data Keluarga" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Kartu Keluarga']
    ]" />

    @if (session('status'))
        <div class="mb-5 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700 border border-emerald-100">
            {{ session('status') }}
        </div>
    @endif

    @include('admin.kartu-keluarga.partials.filters')

    <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        @include('admin.kartu-keluarga.partials.table')
    </div>
    @push('scripts')
        @vite('resources/js/admin/kartu-keluarga.js')
    @endpush

</x-layouts.admin>