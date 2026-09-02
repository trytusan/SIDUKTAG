<div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <form action="{{ route('admin.bantuan.index') }}" method="GET">
        <div class="grid grid-cols-1 gap-4 xl:grid-cols-4">
            {{-- Filter Pencarian --}}
            <div>
                <x-table.search-box 
                    name="search" 
                    value="{{ request('search') }}" 
                    placeholder="Cari nama, NIK, atau program..." 
                />
            </div>

            {{-- Filter Jenis Bantuan (Dinamis) --}}
            <select name="jenis" onchange="this.form.submit()" 
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
                <option value="">Semua Jenis Bantuan</option>
                @foreach($listProgram as $prog)
                    <option value="{{ $prog->jenis_bantuan }}" {{ request('jenis') == $prog->jenis_bantuan ? 'selected' : '' }}>
                        {{ $prog->jenis_bantuan }}
                    </option>
                @endforeach
            </select>

            {{-- Filter Status Bantuan --}}
            <select name="status" onchange="this.form.submit()"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
                <option value="">Semua Status Bantuan</option>
                @foreach(['Aktif', 'Nonaktif', 'Selesai'] as $status)
                    <option value="{{ $status }}" {{ request('status') == $status ? 'selected' : '' }}>
                        {{ $status }}
                    </option>
                @endforeach
            </select>

            {{-- Filter Tanggal --}}
            <input
                type="date"
                name="tanggal"
                value="{{ request('tanggal') }}"
                onchange="this.form.submit()"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            >
        </div>
    </form>

    <div class="mt-4 flex flex-wrap items-center justify-end gap-3">
        {{-- Tombol Export --}}
        <div class="flex flex-1 gap-3 sm:flex-initial">
            <x-table.export-button label="Excel" href="{{ route('admin.bantuan.index', array_merge(request()->query(), ['export' => 'excel'])) }}" />
            <x-table.export-button label="PDF" href="{{ route('admin.bantuan.index', array_merge(request()->query(), ['export' => 'pdf'])) }}" />
        </div>

        <div class="flex items-center gap-3">
            {{-- Tombol Kelola Jenis Bantuan (BARU) --}}
            <a
                href="{{ route('admin.jenis-bantuan.index') }}"
                class="inline-flex items-center rounded-2xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:border-slate-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Kelola Jenis Bantuan
            </a>

            {{-- Tombol Tambah Bantuan --}}
            <a
                href="{{ route('admin.bantuan.create') }}"
                class="inline-flex items-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajukan Bantuan
            </a>
        </div>
    </div>
</div>