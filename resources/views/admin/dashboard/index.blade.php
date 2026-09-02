<x-layouts.admin
    title="Dashboard Admin"
    pageTitle="Dashboard"
    :user="auth()->user()->name"
>

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard']
    ]" />

    @if (session('status'))
        <div class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {{ session('status') }}
        </div>
    @endif

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <x-ui.card-stat
            title="Total Penduduk"
            :value="$totalPenduduk"
            description="Data warga yang terdaftar"
        >
            <x-slot:icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75a17.933 17.933 0 0 1-7.5-1.632Z" />
                </svg>
            </x-slot:icon>
        </x-ui.card-stat>

        <x-ui.card-stat
            title="Kartu Keluarga"
            :value="$totalKartuKeluarga"
            description="Total data kartu keluarga"
            iconBg="bg-sky-100"
            iconColor="text-sky-600"
        >
            <x-slot:icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M3.75 6.75h16.5m-16.5 0A2.25 2.25 0 0 0 1.5 9v8.25a2.25 2.25 0 0 0 2.25 2.25h16.5A2.25 2.25 0 0 0 22.5 17.25V9a2.25 2.25 0 0 0-2.25-2.25m-16.5 0V5.625A2.625 2.625 0 0 1 6.375 3h11.25a2.625 2.625 0 0 1 2.625 2.625V6.75" />
                </svg>
            </x-slot:icon>
        </x-ui.card-stat>

        <x-ui.card-stat
            title="Pengajuan Surat"
            :value="$totalPengajuanSurat"
            description="Total pengajuan surat masuk"
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
        >
            <x-slot:icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H5.625A2.625 2.625 0 0 0 3 4.875v14.25a2.625 2.625 0 0 0 2.625 2.625h12.75A2.625 2.625 0 0 0 21 19.125v-1.5a3.375 3.375 0 0 0-1.5-2.812Z" />
                </svg>
            </x-slot:icon>
        </x-ui.card-stat>

        <x-ui.card-stat
            title="Bantuan Aktif"
            :value="$totalBantuanAktif"
            description="Program bantuan yang sedang berjalan"
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
        >
            <x-slot:icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </x-slot:icon>
        </x-ui.card-stat>
    </div>

    <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-bold text-slate-800">Pengajuan Surat Terbaru</h2>
                    <p class="text-sm text-slate-500">Ringkasan pengajuan surat masuk</p>
                </div>

                <a
                    href="{{ route('admin.pengajuan-surat.index') }}"
                    class="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                    Lihat Semua
                </a>
            </div>

            <x-table.table :headers="['No', 'Nama', 'Jenis Surat', 'Tanggal', 'Status']">
                @forelse($pengajuanTerbaru as $index => $item)
                    @php
                        $badgeStatus = match($item->status) {
                            'Selesai' => 'success',
                            'Diproses' => 'process',
                            'Menunggu' => 'pending',
                            'Ditolak' => 'danger',
                            default => 'pending',
                        };
                    @endphp

                    <tr class="transition hover:bg-slate-50">
                        <td class="px-4 py-4 text-center text-sm text-slate-700">
                            {{ $index + 1 }}
                        </td>

                        <td class="px-4 py-4 text-center text-sm font-medium text-slate-800">
                            {{ $item->nama_pemohon ?? '-' }}
                        </td>

                        <td class="px-4 py-4 text-center text-sm text-slate-700">
                            {{ $item->jenis_surat_nama ?? $item->jenisSurat->nama ?? '-' }}
                        </td>

                        <td class="px-4 py-4 text-center text-sm text-slate-700">
                            {{ $item->tanggal_pengajuan ? $item->tanggal_pengajuan->format('d M Y') : '-' }}
                        </td>

                        <td class="px-4 py-4 text-center">
                            <x-ui.status-badge :status="$badgeStatus">
                                {{ $item->status }}
                            </x-ui.status-badge>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-4 py-8 text-center text-sm text-slate-500">
                            Belum ada pengajuan surat.
                        </td>
                    </tr>
                @endforelse
            </x-table.table>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-5 flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-bold text-slate-800">Penduduk Terbaru</h2>
                    <p class="text-sm text-slate-500">Data penduduk yang baru ditambahkan</p>
                </div>

                <a
                    href="{{ route('admin.penduduk.index') }}"
                    class="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                    Lihat Semua
                </a>
            </div>

            <x-table.table :headers="['No', 'Nama', 'NIK', 'Nomor KK', 'Jenis Kelamin']">
                @forelse($pendudukTerbaru as $index => $item)
                    <tr class="transition hover:bg-slate-50">
                        <td class="px-4 py-4 text-center text-sm text-slate-700">
                            {{ $index + 1 }}
                        </td>

                        <td class="px-4 py-4 text-center text-sm font-medium text-slate-800">
                            {{ $item->nama_lengkap }}
                        </td>

                        <td class="px-4 py-4 text-center text-sm text-slate-700">
                            {{ $item->nik }}
                        </td>

                        <td class="px-4 py-4 text-center text-sm text-slate-700">
                            {{ $item->nomor_kk }}
                        </td>

                        <td class="px-4 py-4 text-center text-sm text-slate-700">
                            {{ $item->jenis_kelamin ?? '-' }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-4 py-8 text-center text-sm text-slate-500">
                            Belum ada data penduduk.
                        </td>
                    </tr>
                @endforelse
            </x-table.table>
        </div>

    </div>

</x-layouts.admin>