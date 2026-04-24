<x-layouts.admin title="Kelola Jenis Bantuan" pageTitle="Jenis Bantuan" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Bantuan Masyarakat', 'url' => route('admin.bantuan.index')],
        ['label' => 'Jenis Bantuan']
    ]" />

    {{-- Filter & Tombol Tambah --}}
    @include('admin.jenis-bantuan.partials.filters')

    {{-- Tabel Data --}}
    <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        @include('admin.jenis-bantuan.partials.table')
    </div>

</x-layouts.admin>