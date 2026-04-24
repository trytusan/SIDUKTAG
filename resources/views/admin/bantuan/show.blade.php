<x-layouts.admin title="Detail Bantuan" pageTitle="Detail Bantuan" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Bantuan', 'url' => route('admin.bantuan.index')],
        ['label' => 'Detail Bantuan']
    ]" />

    <div class="space-y-6">
        @include('admin.bantuan.partials.penerima-detail')
    </div>

</x-layouts.admin>