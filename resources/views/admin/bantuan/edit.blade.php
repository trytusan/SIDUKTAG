<x-layouts.admin title="Edit Data Bantuan" pageTitle="Edit Data Bantuan" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Bantuan', 'url' => route('admin.bantuan.index')],
        ['label' => 'Edit Data']
    ]" />

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form action="{{ route('admin.bantuan.update', $bantuan->id) }}" method="POST">
            @csrf
            @method('PUT') {{-- WAJIB ADA UNTUK EDIT --}}

            @include('admin.bantuan.partials.form')
        </form>
    </div>

</x-layouts.admin>