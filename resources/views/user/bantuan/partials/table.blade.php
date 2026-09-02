<x-table.table :headers="[
    'No',
    'Program Bantuan',
    'Jenis Bantuan',
    'Tanggal Menerima',
    'Status',
    'Aksi'
]">
    @forelse($bantuan as $index => $item)
        @php
            $badgeStatus = match(strtolower($item->status_penerima ?? '')) {
                'diterima' => 'aktif',
                'selesai' => 'success',
                'menunggu' => 'pending',
                'ditolak' => 'danger',
                default => 'pending',
            };
        @endphp

        <tr class="transition hover:bg-slate-50">
            <td class="px-4 py-4 text-center text-sm text-slate-700">
                {{ $bantuan->firstItem() + $index }}
            </td>

            <td class="px-4 py-4 text-center text-sm font-medium text-slate-800">
                {{ $item->bantuan->nama_program ?? '-' }}
            </td>

            <td class="px-4 py-4 text-center text-sm text-slate-700">
                {{ $item->bantuan->jenis_bantuan ?? '-' }}
            </td>

            <td class="px-4 py-4 text-center text-sm text-slate-700">
                {{ $item->tanggal_menerima ? $item->tanggal_menerima->format('d F Y') : '-' }}
            </td>

            <td class="px-4 py-4 text-center">
                <x-ui.status-badge :status="$badgeStatus">
                    {{ $item->status_penerima ?? '-' }}
                </x-ui.status-badge>
            </td>

            <td class="px-4 py-4 text-center">
                <a
                    href="{{ route('user.bantuan.show', $item->id) }}"
                    class="inline-flex items-center rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100"
                >
                    Detail
                </a>
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="6" class="px-4 py-8 text-center text-sm text-slate-500">
                Belum ada data bantuan.
            </td>
        </tr>
    @endforelse
</x-table.table>