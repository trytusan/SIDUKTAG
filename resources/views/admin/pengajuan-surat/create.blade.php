<x-layouts.admin title="Ajukan Surat" pageTitle="Ajukan Surat" user="Administrator">
    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengajuan Surat', 'url' => route('admin.pengajuan-surat.index')],
        ['label' => 'Ajukan Surat']
    ]" />

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form method="POST" action="{{ route('admin.pengajuan-surat.store') }}" enctype="multipart/form-data" class="space-y-5">
            @csrf
            @include('admin.pengajuan-surat.partials.form')
        </form>
    </div>
</x-layouts.admin>