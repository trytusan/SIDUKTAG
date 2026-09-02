<x-layouts.admin title="Data Bantuan" pageTitle="Data Bantuan" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Bantuan']
    ]" />

    @include('admin.bantuan.partials.filters')

    <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        @include('admin.bantuan.partials.table')
    </div>

</x-layouts.admin>