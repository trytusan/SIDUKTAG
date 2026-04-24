<x-layouts.admin title="Edit Jenis Bantuan" pageTitle="Jenis Bantuan" user="Administrator">
    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Jenis Bantuan', 'url' => route('admin.jenis-bantuan.index')],
        ['label' => 'Edit Data']
    ]" />

    <div class="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 class="mb-6 text-xl font-bold text-slate-800">Edit Kategori Bantuan</h2>
        <form action="{{ route('admin.jenis-bantuan.update', $jenisBantuan->id) }}" method="POST">
            @csrf 
            @method('PUT')
            @include('admin.jenis-bantuan.partials.form', ['jenisBantuan' => $jenisBantuan])
        </form>
    </div>
</x-layouts.admin>