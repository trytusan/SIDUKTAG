<div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <form action="{{ route('admin.pengajuan-surat.index') }}" method="GET">
        <div class="grid grid-cols-1 gap-4 xl:grid-cols-4">
            <div class="xl:col-span-1">
                {{-- Gunakan name="search" agar sesuai dengan Controller --}}
                <x-table.search-box name="search" value="{{ request('search') }}" placeholder="Cari nama, NIK, atau keperluan..." />
            </div>

            {{-- Filter Jenis Surat dari Database --}}
            <select name="jenis_surat_id" onchange="this.form.submit()" 
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
                <option value="">Semua Jenis Surat</option>
                @foreach($listJenisSurat as $jenis)
                    <option value="{{ $jenis->id }}" {{ request('jenis_surat_id') == $jenis->id ? 'selected' : '' }}>
                        {{ $jenis->nama }}
                    </option>
                @endforeach
            </select>

            {{-- Filter Status --}}
            <select name="status" onchange="this.form.submit()"
                class="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
                <option value="">Semua Status</option>
                @foreach(['Menunggu', 'Diproses', 'Selesai', 'Ditolak'] as $status)
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
        <div class="flex flex-1 gap-3 sm:flex-initial">
            {{-- Tambahkan Query String agar hasil export sesuai dengan filter yang sedang aktif --}}
            <x-table.export-button label="Export Excel" href="{{ route('admin.pengajuan-surat.index', array_merge(request()->query(), ['export' => 'excel'])) }}" />
            <x-table.export-button label="Cetak PDF" href="{{ route('admin.pengajuan-surat.index', array_merge(request()->query(), ['export' => 'pdf'])) }}" />
        </div>

        <div class="flex items-center gap-3">
            <a
                href="{{ route('admin.jenis-surat.index') }}"
                class="inline-flex items-center rounded-2xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:border-slate-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Kelola Jenis Surat
            </a>

            <a
                href="{{ route('admin.pengajuan-surat.create') }}"
                class="inline-flex items-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ajukan Surat
            </a>
        </div>
    </div>
</div>