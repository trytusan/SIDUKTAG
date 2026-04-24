<x-layouts.admin title="Edit Jenis Surat" pageTitle="Jenis Surat" user="Administrator">
    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengajuan Surat', 'url' => route('admin.pengajuan-surat.index')],
        ['label' => 'Jenis Surat', 'url' => route('admin.jenis-surat.index')],
        ['label' => 'Edit Data']
    ]" />
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 class="mb-6 text-xl font-bold text-slate-800">Edit Jenis Surat</h2>
            <form action="{{ route('admin.jenis-surat.update', $jenisSurat->id) }}" method="POST">
                @csrf
                @method('PUT')
                @include('admin.jenis-surat.partials.form')
            </form>
        </div>
    </div>
</x-layouts.admin>