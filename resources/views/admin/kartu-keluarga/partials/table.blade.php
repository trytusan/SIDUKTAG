<x-table.table :headers="[
    'No',
    'Nomor KK',
    'Kepala Keluarga',
    'Alamat Keluarga',
    'Jumlah Anggota',
    'Aksi'
]">
    @forelse($kartuKeluarga as $index => $item)
        <tr class="transition hover:bg-slate-50">
            {{-- Penomoran dinamis berdasarkan pagination --}}
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-700">
                {{ $kartuKeluarga->firstItem() + $index }}
            </td>
            
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm font-medium text-slate-800">
                {{ $item->nomor_kk }}
            </td>
            
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-700">
                {{ $item->nama_kepala_keluarga }}
            </td>
            
            <td class="px-4 py-4 text-center text-sm text-slate-700">
                {{ Str::limit($item->alamat_keluarga, 40) }}
            </td>
            
            <td class="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-700">
                {{ $item->jumlah_anggota }} Orang
            </td>
            
            <td class="whitespace-nowrap px-4 py-4 text-center">
                <x-table.table-actions
                    detailHref="{{ route('admin.kartu-keluarga.show', $item->id) }}"
                    editHref="{{ route('admin.kartu-keluarga.edit', $item->id) }}"
                    {{-- Menggunakan fungsi confirmDelete dari file JS terpisah --}}
                    deleteAction="confirmDelete('{{ route('admin.kartu-keluarga.destroy', $item->id) }}')"
                />
            </td>
        </tr>
    @empty
        <tr>
            <td colspan="8" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center">
                    <div class="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                        <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 class="text-sm font-bold text-slate-800">Data Tidak Ditemukan</h3>
                    <p class="mt-1 text-xs text-slate-500 italic">
                        Tidak ada data keluarga yang cocok dengan filter "{{ request('search') ?: 'pilihan Anda' }}"
                    </p>
                    @if(request()->anyFilled(['search']))
                        <a href="{{ route('admin.kartu-keluarga.index') }}" class="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline">
                            Reset Filter & Lihat Semua Data
                        </a>
                    @endif
                </div>
            </td>
        </tr>
    @endforelse
</x-table.table>

{{-- Menampilkan navigasi halaman (Pagination) --}}
@if($kartuKeluarga->hasPages())
    <div class="mt-6">
        {{ $kartuKeluarga->links() }}
    </div>
@endif