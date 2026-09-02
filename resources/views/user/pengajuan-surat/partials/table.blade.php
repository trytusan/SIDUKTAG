<x-table.table :headers="[
    'No',
    'Nama Pemohon',
    'Jenis Surat',
    'Keperluan',
    'Tanggal Pengajuan',
    'Status',
    'Aksi'
]">
    @forelse($surat as $index => $item)
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
                {{ $surat->firstItem() + $index }}
            </td>

            <td class="px-4 py-4 text-center text-sm font-medium text-slate-800">
                {{ $item->nama_pemohon }}
            </td>

            <td class="px-4 py-4 text-center text-sm font-medium text-slate-800">
                {{ $item->jenis_surat_nama ?? $item->jenisSurat->nama ?? '-' }}
            </td>

            <td class="px-4 py-4 text-center text-sm text-slate-700">
                {{ $item->keperluan }}
            </td>

            <td class="px-4 py-4 text-center text-sm text-slate-700">
                {{ $item->tanggal_pengajuan ? $item->tanggal_pengajuan->format('d F Y') : '-' }}
            </td>

            <td class="px-4 py-4 text-center">
                <x-ui.status-badge :status="$badgeStatus">
                    {{ $item->status }}
                </x-ui.status-badge>
            </td>

            <td class="px-4 py-4 text-center">
                @if($item->status === 'Selesai' && $item->file_hasil_surat)
                    <div class="flex items-center justify-center gap-2">
                        <a
                            href="{{ route('user.pengajuan-surat.show', $item->id) }}"
                            class="inline-flex items-center rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100"
                        >
                            Detail
                        </a>

                        <a
                            href="{{ route('user.pengajuan-surat.download', $item->id) }}"
                            class="inline-flex items-center rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100"
                        >
                            Unduh
                        </a>
                    </div>
                @else
                    <a
                        href="{{ route('user.pengajuan-surat.show', $item->id) }}"
                        class="inline-flex items-center rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100"
                    >
                        Detail
                    </a>
                @endif
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="7" class="px-4 py-8 text-center text-sm text-slate-500">
                Belum ada pengajuan surat.
            </td>
        </tr>
    @endforelse
</x-table.table>