<x-layouts.admin title="Tambah Jenis Bantuan" pageTitle="Jenis Bantuan" user="Administrator">
    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Jenis Bantuan', 'url' => route('admin.jenis-bantuan.index')],
        ['label' => 'Tambah Data']
    ]" />

    <div class="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 class="mb-6 text-xl font-bold text-slate-800">Buat Kategori Bantuan Baru</h2>
        <form action="{{ route('admin.jenis-bantuan.store') }}" method="POST">
            @csrf
            @include('admin.jenis-bantuan.partials.form')
        </form>
    </div>
</x-layouts.admin>