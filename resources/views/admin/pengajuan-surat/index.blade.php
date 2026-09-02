<x-layouts.admin title="Pengajuan Surat" pageTitle="Pengajuan Surat" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengajuan Surat']
    ]" />

    @include('admin.pengajuan-surat.partials.filters')

    <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        @include('admin.pengajuan-surat.partials.table')
    </div>

</x-layouts.admin>