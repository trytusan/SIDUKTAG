<x-table.table :headers="[
    'No',
    'Nama Pemohon',
    'NIK',
    'Jenis Surat',
    'Keperluan',
    'Tanggal Pengajuan',
    'Status',
    'Aksi'
]">
    @forelse($pengajuanSurat as $index => $item)
        <tr class="transition hover:bg-slate-50">
            {{-- Menghitung nomor urut agar tetap benar meski pindah halaman (pagination) --}}
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-700">
                {{ $pengajuanSurat->firstItem() + $index }}
            </td>
            
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm font-medium text-slate-800">
                {{ $item->nama_pemohon }}
            </td>
            
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-700">
                {{ $item->nik }}
            </td>
            
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-700">
                {{ $item->jenis_surat_nama }}
            </td>
            
            <td class="px-4 py-4 text-center text-sm text-slate-700">
                {{ Str::limit($item->keperluan, 30) }}
            </td>
            
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-700">
                {{ \Carbon\Carbon::parse($item->tanggal_pengajuan)->translatedFormat('d F Y') }}
            </td>
            
            <td class="whitespace-nowrap px-4 py-4 text-center">
                @php
                    $statusType = match($item->status) {
                        'Menunggu' => 'pending',
                        'Diproses' => 'process',
                        'Selesai'  => 'success',
                        'Ditolak'  => 'rejected',
                        default    => 'pending'
                    };
                @endphp
                <x-ui.status-badge :status="$statusType">
                    {{ $item->status }}
                </x-ui.status-badge>
            </td>
            
            <td class="whitespace-nowrap px-4 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    <a href="{{ route('admin.pengajuan-surat.show', $item->id) }}" 
                       class="inline-flex items-center rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100">
                        Detail
                    </a>
                    
                    <a href="{{ route('admin.pengajuan-surat.verifikasi', $item->id) }}" 
                       class="inline-flex items-center rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-600 transition hover:bg-amber-100">
                        Verifikasi
                    </a>
                    
                    <form action="{{ route('admin.pengajuan-surat.destroy', $item->id) }}" method="POST" class="inline" onsubmit="return confirm('Apakah Anda yakin ingin menghapus data ini?')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="inline-flex items-center rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100">
                            Hapus
                        </button>
                    </form>
                </div>
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="8" class="px-4 py-12 text-center">
                <div class="flex flex-col items-center">
                    <svg class="h-12 w-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p class="mt-2 text-sm text-slate-500">Belum ada pengajuan surat yang ditemukan.</p>
                </div>
            </td>
        </tr>
    @endforelse
</x-table.table>

{{-- Link Pagination --}}
<div class="mt-4">
    {{ $pengajuanSurat->links() }}
</div>