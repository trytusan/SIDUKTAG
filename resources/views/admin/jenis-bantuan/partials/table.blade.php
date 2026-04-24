<x-table.table :headers="['No', 'Nama Program', 'Jenis', 'Kuota', 'Status', 'Aksi']">
    @forelse($jenisBantuan as $index => $item)
        <tr class="transition hover:bg-slate-50">
            <td class="px-4 py-4 text-center text-sm text-slate-700">
                {{ $jenisBantuan->firstItem() + $index }}
            </td>
            
            <td class="px-4 py-4 text-sm font-medium text-slate-800">
                <div class="flex flex-col">
                    <span>{{ $item->nama_program }}</span>
                    <span class="text-xs font-normal text-slate-400">{{ $item->sumber_bantuan ?? 'Sumber tidak diketahui' }}</span>
                </div>
            </td>

            <td class="px-4 py-4 text-sm text-slate-600">
                {{ $item->jenis_bantuan }}
            </td>

            <td class="px-4 py-4 text-sm text-slate-600">
                {{ number_format($item->kuota_penerima) }} Orang
            </td>

            <td class="px-4 py-4 text-center">
                @php
                    $statusClasses = match($item->status_bantuan) {
                        'Aktif' => 'bg-emerald-50 text-emerald-700 border-emerald-100',
                        'Selesai' => 'bg-blue-50 text-blue-700 border-blue-100',
                        'Nonaktif' => 'bg-slate-50 text-slate-600 border-slate-200',
                        default => 'bg-slate-50 text-slate-600'
                    };
                    
                    $dotClasses = match($item->status_bantuan) {
                        'Aktif' => 'bg-emerald-500',
                        'Selesai' => 'bg-blue-500',
                        'Nonaktif' => 'bg-slate-400',
                        default => 'bg-slate-400'
                    };
                @endphp

                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border {{ $statusClasses }}">
                    <span class="mr-1.5 h-1.5 w-1.5 rounded-full {{ $dotClasses }}"></span>
                    {{ $item->status_bantuan }}
                </span>
            </td>

            <td class="px-4 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    {{-- Tombol Edit --}}
                    <a href="{{ route('admin.jenis-bantuan.edit', $item->id) }}" 
                       class="rounded-lg bg-amber-50 p-2 text-amber-600 transition hover:bg-amber-100">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </a>

                    {{-- Tombol Hapus --}}
                    <form action="{{ route('admin.jenis-bantuan.destroy', $item->id) }}" method="POST" onsubmit="return confirm('Hapus program bantuan ini?')">
                        @csrf 
                        @method('DELETE')
                        <button type="submit" class="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100">
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </form>
                </div>
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="6" class="py-12 text-center text-slate-400 italic">
                Belum ada data program bantuan yang tersedia.
            </td>
        </tr>
    @endforelse
</x-table.table>

<div class="mt-4">
    {{ $jenisBantuan->links() }}
</div>