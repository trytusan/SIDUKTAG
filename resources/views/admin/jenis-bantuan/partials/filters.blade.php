<div class="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        {{-- Komponen Search Box --}}
        <form action="{{ route('admin.jenis-bantuan.index') }}" method="GET" class="w-full lg:max-w-md">
            <x-table.search-box 
                name="search" 
                value="{{ request('search') }}" 
                placeholder="Cari nama program, jenis, atau sumber bantuan..." 
            />
        </form>

        <div class="flex flex-wrap items-center gap-3">
            {{-- Tombol Tambah --}}
            <a 
                href="{{ route('admin.jenis-bantuan.create') }}"
                class="inline-flex items-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Jenis Bantuan
            </a>
        </div>

    </div>
</div>