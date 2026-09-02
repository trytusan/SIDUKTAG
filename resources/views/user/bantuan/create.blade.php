<x-layouts.user
    title="Ajukan Bantuan"
    pageTitle="Ajukan Bantuan"
    :user="$penduduk->nama_lengkap ?? auth()->user()->name"
>

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard Saya', 'url' => route('user.dashboard')],
        ['label' => 'Bantuan Saya', 'url' => route('user.bantuan.index')],
        ['label' => 'Ajukan Bantuan']
    ]" />

    @if (session('error'))
        <div class="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ session('error') }}
        </div>
    @endif

    @if (session('status'))
        <div class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {{ session('status') }}
        </div>
    @endif

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form
            action="{{ route('user.bantuan.store') }}"
            method="POST"
        >
            @csrf

            @include('user.bantuan.partials.form')
        </form>
    </div>

</x-layouts.user>