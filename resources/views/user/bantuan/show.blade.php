<x-layouts.user
    title="Detail Bantuan"
    pageTitle="Detail Bantuan"
    :user="$bantuan->penduduk->nama_lengkap ?? auth()->user()->name"
>

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard Saya', 'url' => route('user.dashboard')],
        ['label' => 'Bantuan Saya', 'url' => route('user.bantuan.index')],
        ['label' => 'Detail Bantuan']
    ]" />

    <div class="space-y-6">
        @include('user.bantuan.partials.penerima-detail')
    </div>

</x-layouts.user>