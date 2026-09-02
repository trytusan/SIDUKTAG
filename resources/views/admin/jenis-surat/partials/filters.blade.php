<div class="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        {{-- Sisi Kiri: Filter Pencarian --}}
        <div class="w-full lg:max-w-md">
            {{-- Action mengarah ke route index --}}
            <form action="{{ route('admin.jenis-surat.index') }}" method="GET">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    {{-- Input name="search" harus sama dengan yang ada di Controller --}}
                    <input type="text" name="search" value="{{ request('search') }}"
                        class="w-full rounded-2xl border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm focus:border-sky-500 focus:ring-sky-500"
                        placeholder="Cari nama atau deskripsi surat...">
                </div>
            </form>
        </div>

        {{-- Sisi Kanan: Tombol Tambah --}}
        <div class="flex items-center gap-3">
            <a href="{{ route('admin.jenis-surat.create') }}"
                class="inline-flex items-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Jenis Surat
            </a>
        </div>
        
    </div>
</div>