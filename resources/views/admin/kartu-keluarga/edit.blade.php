<x-layouts.admin title="Edit Data Kartu Keluarga" pageTitle="Edit Data Kartu Keluarga" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Kartu Keluarga', 'url' => route('admin.kartu-keluarga.index')],
        ['label' => 'Edit Data']
    ]" />

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form action="{{ route('admin.kartu-keluarga.update', $kartuKeluarga->id) }}" method="POST">
            @csrf
            @method('PUT')
            @include('admin.kartu-keluarga.partials.form')
        </form>
    </div>

    @push('scripts')
        @vite('resources/js/admin/kartu-keluarga-form.js')
    @endpush

</x-layouts.admin>