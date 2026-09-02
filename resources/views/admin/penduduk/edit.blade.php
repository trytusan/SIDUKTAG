<x-layouts.admin title="Edit Data Penduduk" pageTitle="Edit Data Penduduk" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Data Penduduk', 'url' => route('admin.penduduk.index')],
        ['label' => 'Edit Data']
    ]" />

    @if (session('status'))
        <div class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {{ session('status') }}
        </div>
    @endif

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form action="{{ route('admin.penduduk.update', $penduduk->id) }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method('PUT')

            @include('admin.penduduk.partials.form', ['penduduk' => $penduduk])
        </form>
    </div>
    @push('scripts')
        @vite('resources/js/admin/penduduk.js')
    @endpush
</x-layouts.admin>