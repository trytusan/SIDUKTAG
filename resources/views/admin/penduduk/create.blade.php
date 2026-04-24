<x-layouts.admin title="Tambah Data Penduduk" pageTitle="Tambah Data Penduduk" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Data Penduduk', 'url' => route('admin.penduduk.index')],
        ['label' => 'Tambah Data']
    ]" />

    @if (session('status'))
        <div class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {{ session('status') }}
        </div>
    @endif

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form
            action="{{ route('admin.penduduk.store') }}"
            method="POST"
            enctype="multipart/form-data"
        >
            @csrf
            
            @include('admin.penduduk.partials.form')
        </form>
    </div>

    @push('scripts')
        @vite('resources/js/admin/penduduk.js')
    @endpush

</x-layouts.admin>