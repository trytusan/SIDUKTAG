<x-layouts.admin title="Detail Kartu Keluarga" pageTitle="Detail Kartu Keluarga" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Kartu Keluarga', 'url' => route('admin.kartu-keluarga.index')],
        ['label' => 'Detail Kartu Keluarga']
    ]" />

    <div class="space-y-6">
        @include('admin.kartu-keluarga.partials.kepala-keluarga')
        @include('admin.kartu-keluarga.partials.anggota-list')
    </div>

</x-layouts.admin>