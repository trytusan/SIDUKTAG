<x-layouts.user title="Dashboard User" pageTitle="Dashboard Saya" :user="$penduduk->nama_lengkap ?? $user->name">

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <x-ui.card-stat title="Pengajuan Surat" :value="$totalPengajuan" description="Total pengajuan surat Anda">
            <x-slot:icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H5.625A2.625 2.625 0 0 0 3 4.875v14.25a2.625 2.625 0 0 0 2.625 2.625h12.75A2.625 2.625 0 0 0 21 19.125v-1.5a3.375 3.375 0 0 0-1.5-2.812Z" />
                </svg>
            </x-slot:icon>
        </x-ui.card-stat>

        <x-ui.card-stat title="Surat Selesai" :value="$totalSuratSelesai" description="Siap dicetak atau diunduh"
            iconBg="bg-emerald-100" iconColor="text-emerald-600">
            <x-slot:icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </x-slot:icon>
        </x-ui.card-stat>

        <x-ui.card-stat title="Bantuan Aktif" :value="$totalBantuanAktif" description="Program bantuan yang diterima"
            iconBg="bg-amber-100" iconColor="text-amber-600">
            <x-slot:icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </x-slot:icon>
        </x-ui.card-stat>

        <x-ui.card-stat title="Anggota Keluarga" :value="$totalAnggotaKeluarga"
            description="Tercatat dalam kartu keluarga" iconBg="bg-sky-100" iconColor="text-sky-600">
            <x-slot:icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                        d="M18 18.72a9.094 9.094 0 0 0 3.742-.479 3 3 0 0 0-4.682-2.72m.94 3.198-.001.031c0 .225-.012.447-.035.666A11.944 11.944 0 0 1 12 21c-2.331 0-4.504-.667-6.345-1.584A6.728 6.728 0 0 1 5.62 18.75m12.32 0a24.61 24.61 0 0 0-5.94-.75c-2.183 0-4.226.286-5.94.75m11.88 0a3 3 0 0 0-2.63-2.973M6.06 18.75a3 3 0 0 1 2.63-2.973m0 0A3.75 3.75 0 1 1 12 8.25a3.75 3.75 0 0 1-3.31 7.527m0 0a5.971 5.971 0 0 1 6.62 0" />
                </svg>
            </x-slot:icon>
        </x-ui.card-stat>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="space-y-6 xl:col-span-2">

            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div class="mb-5 flex items-center justify-between">
                    <div>
                        <h2 class="text-lg font-bold text-slate-800">Aktivitas Terbaru</h2>
                        <p class="text-sm text-slate-500">Riwayat aktivitas akun Anda</p>
                    </div>

                    <a href="{{ route('user.pengajuan-surat.index') }}"
                        class="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                        Lihat Semua
                    </a>
                </div>

                <div class="space-y-4">
                    @forelse($aktivitasTerbaru as $aktivitas)
                        <div class="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                            <div class="mt-1 h-3 w-3 rounded-full
                                    @if($aktivitas->status === 'Selesai') bg-emerald-500
                                    @elseif($aktivitas->status === 'Diproses') bg-amber-500
                                    @elseif($aktivitas->status === 'Menunggu') bg-sky-500
                                    @else bg-red-500
                                    @endif"></div>

                            <div class="flex-1">
                                <p class="text-sm font-semibold text-slate-800">
                                    {{ $aktivitas->jenis_surat_nama ?? 'Pengajuan Surat' }}
                                </p>
                                <p class="mt-1 text-sm text-slate-500">
                                    Status pengajuan Anda: {{ $aktivitas->status }}.
                                </p>
                            </div>

                            <span class="text-xs text-slate-400">
                                {{ $aktivitas->created_at->diffForHumans() }}
                            </span>
                        </div>
                    @empty
                        <div class="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                            Belum ada aktivitas terbaru.
                        </div>
                    @endforelse
                </div>
            </div>

            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div class="mb-5">
                    <h2 class="text-lg font-bold text-slate-800">Pengajuan Surat Terbaru</h2>
                    <p class="text-sm text-slate-500">Ringkasan status pengajuan Anda</p>
                </div>

                <x-table.table :headers="['No', 'Jenis Surat', 'Tanggal', 'Status', 'Aksi']">
                    @forelse($pengajuanTerbaru as $index => $item)
                        <tr class="transition hover:bg-slate-50">
                            <td class="px-4 py-4 text-center text-sm text-slate-700">
                                {{ $index + 1 }}
                            </td>
                            <td class="px-4 py-4 text-center text-sm text-slate-700">
                                {{ $item->jenis_surat_nama ?? '-' }}
                            </td>
                            <td class="px-4 py-4 text-center text-sm text-slate-700">
                                {{ $item->tanggal_pengajuan?->format('d M Y') }}
                            </td>
                            <td class="px-4 py-4 text-center">
                                @php
                                    $badgeStatus = match ($item->status) {
                                        'Selesai' => 'success',
                                        'Diproses' => 'process',
                                        'Menunggu' => 'pending',
                                        'Ditolak' => 'danger',
                                        default => 'pending',
                                    };
                                @endphp

                                <x-ui.status-badge :status="$badgeStatus">
                                    {{ $item->status }}
                                </x-ui.status-badge>
                            </td>
                            <td class="px-4 py-4 text-center">
                                @if($item->status === 'Selesai' && $item->file_hasil_surat)
                                    <a href="{{ route('user.pengajuan-surat.download', $item->id) }}"
                                        class="inline-flex items-center rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100">
                                        Unduh
                                    </a>
                                @else
                                    <a href="{{ route('user.pengajuan-surat.show', $item->id) }}"
                                        class="inline-flex items-center rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100">
                                        Detail
                                    </a>
                                @endif
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

        </div>

        <div class="space-y-6">

            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 class="text-lg font-bold text-slate-800">Profil Singkat</h2>
                <p class="mt-1 text-sm text-slate-500">Informasi akun Anda</p>

                <div class="mt-5 space-y-4">
                    <div class="flex items-center gap-4">
                        <div
                            class="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
                            {{ strtoupper(substr($penduduk->nama_lengkap ?? $user->name, 0, 1)) }}
                        </div>
                        <div>
                            <p class="font-semibold text-slate-800">
                                {{ $penduduk->nama_lengkap ?? $user->name }}
                            </p>
                            <p class="text-sm text-slate-500">
                                NIK: {{ $penduduk->nik ?? '-' }}
                            </p>
                        </div>
                    </div>

                    <div class="rounded-2xl bg-slate-50 px-4 py-3">
                        <p class="text-sm text-slate-500">Nomor KK</p>
                        <p class="font-semibold text-slate-800">{{ $penduduk->nomor_kk ?? '-' }}</p>
                    </div>

                    <div class="rounded-2xl bg-slate-50 px-4 py-3">
                        <p class="text-sm text-slate-500">Alamat</p>
                        <p class="font-semibold text-slate-800">{{ $penduduk->alamat_lengkap ?? '-' }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</x-layouts.user>