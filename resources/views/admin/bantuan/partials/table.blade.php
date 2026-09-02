<x-table.table :headers="['No', 'Nama Penerima', 'NIK', 'Nomor KK', 'Program Bantuan', 'Jenis Bantuan', 'Tanggal Menerima', 'Status', 'Aksi']">
    @forelse($bantuan as $index => $item)
        <tr class="transition hover:bg-slate-50">
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-700">
                {{ $bantuan->firstItem() + $index }}
            </td>

            {{-- Mengambil Nama, NIK, dan KK dari relasi Penduduk --}}
            {{-- Gunakan kolom 'nama_lengkap' sesuai struktur tabel Anda --}}
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm font-medium text-slate-800">
                {{ $item->penduduk->nama_lengkap ?? ($item->penduduk->nama ?? '-') }}
            </td>
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-700">
                {{ $item->penduduk->nik ?? '-' }}
            </td>
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-700">
                {{ $item->penduduk->nomor_kk ?? '-' }}
            </td>

            {{-- Mengambil Nama Program dan Jenis dari relasi Bantuan (Master) --}}
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-700">
                {{ $item->bantuan->nama_program ?? 'Program Terhapus' }}
            </td>
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-700">
                {{ $item->bantuan->jenis_bantuan ?? '-' }}
            </td>

            <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-700">
                {{ $item->tanggal_menerima ? $item->tanggal_menerima->translatedFormat('d F Y') : '-' }}
            </td>

            <td class="whitespace-nowrap px-4 py-4 text-center">
                @php
                    $statusColor = match ($item->status_penerima) {
                        'Diterima' => 'success',
                        'Selesai' => 'aktif',
                        'Ditolak' => 'danger',
                        'Menunggu' => 'pending',
                        default => 'pending'
                    };
                @endphp
                <x-ui.status-badge :status="$statusColor">
                    {{ $item->status_penerima ?? 'Menunggu' }}
                </x-ui.status-badge>
            </td>

            <td class="whitespace-nowrap px-4 py-4 text-center">
                <x-table.table-actions detailHref="{{ route('admin.bantuan.show', $item->id) }}"
                    editHref="{{ route('admin.bantuan.edit', $item->id) }}"
                    deleteAction="confirm('Hapus data pengajuan {{ $item->penduduk->nama_lengkap ?? ($item->penduduk->nama ?? '') }}?') ? document.getElementById('delete-form-{{ $item->id }}').submit() : null" />

                <form id="delete-form-{{ $item->id }}" action="{{ route('admin.bantuan.destroy', $item->id) }}"
                    method="POST" class="hidden">
                    @csrf
                    @method('DELETE')
                </form>
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="9" class="px-4 py-10 text-center text-sm italic text-slate-400">
                Belum ada warga yang mengajukan bantuan.
            </td>
        </tr>
    @endforelse
</x-table.table>