<x-layouts.admin title="Tambah Data Kartu Keluarga" pageTitle="Tambah Data Kartu Keluarga" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Kartu Keluarga', 'url' => route('admin.kartu-keluarga.index')],
        ['label' => 'Tambah Data']
    ]" />

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form action="{{ route('admin.kartu-keluarga.store') }}" method="POST">
            @csrf

            @include('admin.kartu-keluarga.partials.form')
        </form>
    </div>

    @push('scripts')
        @vite('resources/js/admin/kartu-keluarga-form.js')
    @endpush

</x-layouts.admin>