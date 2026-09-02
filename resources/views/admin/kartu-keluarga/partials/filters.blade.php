<div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        
        <div class="w-full lg:max-w-md">
            {{-- Pastikan search-box berada di dalam form agar bisa submit ke controller --}}
            <form action="{{ route('admin.kartu-keluarga.index') }}" method="GET">
                <x-table.search-box 
                    name="search" 
                    value="{{ request('search') }}" 
                    onchange="this.form.submit()"
                    placeholder="Cari nomor KK atau nama kepala keluarga..." 
                />
            </form>
        </div>

        <div class="flex flex-wrap items-center gap-3">
            {{-- Export Excel dengan membawa query pencarian saat ini --}}
            <x-table.export-button 
                label="Export Excel" 
                :href="route('admin.kartu-keluarga.index', array_merge(request()->query(), ['export' => 'excel']))" 
                class="!bg-emerald-50 !text-emerald-700 !border-emerald-200 border hover:!bg-emerald-100"
            />
            
            {{-- Cetak PDF dengan membawa query pencarian saat ini --}}
            <x-table.export-button 
                label="Cetak PDF" 
                :href="route('admin.kartu-keluarga.index', array_merge(request()->query(), ['export' => 'pdf']))" 
                class="!bg-red-50 !text-red-700 !border-red-200 border hover:!bg-red-100"
            />

            <a
                href="{{ route('admin.kartu-keluarga.create') }}"
                class="inline-flex items-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Data KK
            </a>
        </div>

    </div>

</div>