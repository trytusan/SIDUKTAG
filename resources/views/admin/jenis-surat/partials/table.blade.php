<x-table.table :headers="['No', 'Nama Surat', 'Deskripsi', 'Status', 'Aksi']">
    @forelse($jenisSurat as $index => $item)
        <tr class="transition hover:bg-slate-50">
            {{-- Nomor --}}
            <td class="px-4 py-4 text-center text-sm text-slate-700">
                {{ $jenisSurat->firstItem() + $index }}
            </td>

            {{-- Nama & Slug --}}
            <td class="px-4 py-4 text-sm font-medium text-slate-800">
                <div class="flex flex-col">
                    <span>{{ $item->nama }}</span>
                    <span class="text-xs font-normal text-slate-400">{{ $item->slug }}</span>
                </div>
            </td>

            {{-- Deskripsi --}}
            <td class="px-4 py-4 text-sm text-slate-600 max-w-xs truncate">
                {{ $item->deskripsi ?? '-' }}
            </td>

            {{-- Status Aktif --}}
            <td class="px-4 py-4 text-center">
                @if($item->is_active)
                    <span class="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-100">
                        <span class="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Aktif
                    </span>
                @else
                    <span class="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
                        <span class="mr-1.5 h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                        Non-Aktif
                    </span>
                @endif
            </td>

            {{-- Aksi --}}
            <td class="px-4 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    {{-- Tombol Edit --}}
                    <a href="{{ route('admin.jenis-surat.edit', $item->id) }}" 
                       class="inline-flex items-center rounded-lg bg-amber-50 p-2 text-amber-600 transition hover:bg-amber-100"
                       title="Edit Jenis Surat">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </a>

                    {{-- Tombol Hapus --}}
                    <form action="{{ route('admin.jenis-surat.destroy', $item->id) }}" 
                          method="POST" 
                          onsubmit="return confirm('Apakah Anda yakin ingin menghapus jenis surat ini? Ini mungkin berdampak pada data pengajuan surat terkait.')"
                          class="inline">
                        @csrf
                        @method('DELETE')
                        <button type="submit" 
                                class="inline-flex items-center rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                                title="Hapus Jenis Surat">
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
            <td colspan="5" class="px-4 py-12 text-center">
                <div class="flex flex-col items-center justify-center">
                    <div class="rounded-full bg-slate-50 p-4">
                        <svg class="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p class="mt-2 text-sm text-slate-500 italic">Belum ada data jenis surat.</p>
                </div>
            </td>
        </tr>
    @endforelse
</x-table.table>

{{-- Pagination --}}
<div class="mt-4">
    {{ $jenisSurat->links() }}
</div>