<x-layouts.admin title="Tambah Data Bantuan" pageTitle="Tambah Data Bantuan" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Bantuan', 'url' => route('admin.bantuan.index')],
        ['label' => 'Tambah Data']
    ]" />

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {{-- Menghubungkan form ke method 'store' di BantuanController --}}
        <form action="{{ route('admin.bantuan.store') }}" method="POST">
            @csrf {{-- Wajib ada untuk keamanan setiap request POST di Laravel --}}

            @include('admin.bantuan.partials.form')
        </form>
    </div>

</x-layouts.admin>