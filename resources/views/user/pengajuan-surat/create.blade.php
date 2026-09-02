<x-layouts.user
    title="Ajukan Surat"
    pageTitle="Ajukan Surat"
    :user="$penduduk->nama_lengkap ?? auth()->user()->name"
>

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard Saya', 'url' => route('user.dashboard')],
        ['label' => 'Pengajuan Surat', 'url' => route('user.pengajuan-surat.index')],
        ['label' => 'Ajukan Surat']
    ]" />

    @if (session('error'))
        <div class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {{ session('error') }}
        </div>
    @endif

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form
            action="{{ route('user.pengajuan-surat.store') }}"
            method="POST"
            enctype="multipart/form-data"
        >
            @csrf

            @include('user.pengajuan-surat.partials.form')
        </form>
    </div>

</x-layouts.user>