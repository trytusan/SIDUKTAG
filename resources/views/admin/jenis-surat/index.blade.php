<x-layouts.admin title="Manajemen Jenis Surat" pageTitle="Jenis Surat" user="Administrator">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard', 'url' => route('admin.dashboard')],
        ['label' => 'Pengajuan Surat', 'url' => route('admin.pengajuan-surat.index')],
        ['label' => 'Jenis Surat', 'url' => route('admin.jenis-surat.index')],
    ]" />

    {{-- Tambahkan padding kontainer agar rapi --}}
    <div class="container mx-auto px-4 py-8">

        {{-- Menampilkan Pesan Sukses (Status) --}}
        @if (session('status'))
            <div class="mb-6 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700 border border-emerald-100">
                {{ session('status') }}
            </div>
        @endif

        {{-- Row 1: Filter & Actions --}}
        @include('admin.jenis-surat.partials.filters')

        {{-- Row 2: Table Section --}}
        <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            @include('admin.jenis-surat.partials.table')
        </div>

        {{-- Info Row & Pagination Info --}}
        <div class="mt-4 flex items-center justify-between">
            <div class="text-sm text-slate-500">
                Menampilkan <span class="font-semibold text-slate-800">{{ $jenisSurat->firstItem() ?? 0 }}</span>
                sampai <span class="font-semibold text-slate-800">{{ $jenisSurat->lastItem() ?? 0 }}</span>
                dari <span class="font-semibold text-slate-800">{{ $jenisSurat->total() }}</span> data jenis surat
            </div>
        </div>
    </div>

</x-layouts.admin>