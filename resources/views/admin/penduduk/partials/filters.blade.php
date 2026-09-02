<form method="GET" action="{{ route('admin.penduduk.index') }}" id="filter-form"
    class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <input type="text" name="search" value="{{ request('search') }}" placeholder="Cari nama, NIK, atau KK..."
            class="filter-input w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">

        <select name="jenis_kelamin"
            class="filter-input rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
            <option value="">Semua Jenis Kelamin</option>
            <option value="Laki-laki" {{ request('jenis_kelamin') === 'Laki-laki' ? 'selected' : '' }}>Laki-laki</option>
            <option value="Perempuan" {{ request('jenis_kelamin') === 'Perempuan' ? 'selected' : '' }}>Perempuan</option>
        </select>

        <select name="kategori_umur"
            class="filter-input rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
            <option value="">Semua Kategori Umur</option>
            <option value="Balita" {{ request('kategori_umur') === 'Balita' ? 'selected' : '' }}>Balita</option>
            <option value="Anak-anak" {{ request('kategori_umur') === 'Anak-anak' ? 'selected' : '' }}>Anak-anak</option>
            <option value="Remaja" {{ request('kategori_umur') === 'Remaja' ? 'selected' : '' }}>Remaja</option>
            <option value="Dewasa" {{ request('kategori_umur') === 'Dewasa' ? 'selected' : '' }}>Dewasa</option>
            <option value="Lansia" {{ request('kategori_umur') === 'Lansia' ? 'selected' : '' }}>Lansia</option>
        </select>

        <select name="status_kependudukan"
            class="filter-input rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
            <option value="">Semua Status Kependudukan</option>
            <option value="Tetap" {{ request('status_kependudukan') === 'Tetap' ? 'selected' : '' }}>Tetap</option>
            <option value="Pendatang" {{ request('status_kependudukan') === 'Pendatang' ? 'selected' : '' }}>Pendatang
            </option>
            <option value="Pindah" {{ request('status_kependudukan') === 'Pindah' ? 'selected' : '' }}>Pindah</option>
            <option value="Meninggal" {{ request('status_kependudukan') === 'Meninggal' ? 'selected' : '' }}>Meninggal
            </option>
        </select>
    </div>

    <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <a href="{{ route('admin.penduduk.index') }}"
            class="inline-flex items-center rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-red-600">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Bersihkan Filter
        </a>

        <div class="flex flex-wrap items-center gap-3">
            <div class="flex flex-wrap items-center gap-3">
                {{-- Export Excel --}}
                <x-table.export-button label="Excel" :href="route('admin.penduduk.export.excel', request()->query())"
                    class="!bg-emerald-50 !text-emerald-700 !border-emerald-200 border hover:!bg-emerald-100" />

                {{-- Export PDF --}}
                <x-table.export-button label="PDF" :href="route('admin.penduduk.export.pdf', request()->query())"
                    class="!bg-red-50 !text-red-700 !border-red-200 border hover:!bg-red-100" />
            </div>

            <a href="{{ route('admin.penduduk.create') }}"
                class="inline-flex items-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-md">
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Tambah Penduduk
            </a>
        </div>
    </div>
</form>