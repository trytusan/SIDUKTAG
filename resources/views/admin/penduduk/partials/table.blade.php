<x-table.table :headers="['No', 'Nama Lengkap', 'NIK', 'Nomor KK', 'Jenis Kelamin', 'Kategori Umur', 'Status', 'Aksi']">
    @if($penduduk->count() > 0)
        @php
            $items = $penduduk; 
        @endphp

        @foreach($items as $index => $row)
            @php
                $statusKependudukan = data_get($row, 'status_kependudukan');
                $badgeStatus = match($statusKependudukan) {
                    'Tetap' => 'aktif',
                    'Pendatang' => 'pending',
                    'Pindah' => 'process',
                    'Meninggal' => 'danger',
                    default => 'pending',
                };
            @endphp

            <tr class="transition hover:bg-slate-50">
                <td class="whitespace-nowrap px-6 py-4 text-center text-sm text-slate-700">
                    @if (method_exists($penduduk, 'firstItem'))
                        {{ $penduduk->firstItem() + $index }}
                    @else
                        {{ $loop->iteration }}
                    @endif
                </td>

                <td class="whitespace-nowrap px-6 py-4 text-center text-sm font-medium text-slate-800 italic">
                    {{ data_get($row, 'nama_lengkap', '-') }}
                </td>

                <td class="whitespace-nowrap px-6 py-4 text-center text-sm text-slate-700">
                    {{ data_get($row, 'nik', '-') }}
                </td>

                <td class="whitespace-nowrap px-6 py-4 text-center text-sm text-slate-700">
                    {{ data_get($row, 'nomor_kk', '-') }}
                </td>

                <td class="whitespace-nowrap px-6 py-4 text-center text-sm text-slate-700">
                    {{ data_get($row, 'jenis_kelamin', '-') }}
                </td>

                <td class="whitespace-nowrap px-6 py-4 text-center text-sm text-slate-700">
                    {{ data_get($row, 'kategori_umur', '-') }}
                </td>

                <td class="whitespace-nowrap px-6 py-4 text-center">
                    <x-ui.status-badge :status="$badgeStatus">
                        {{ $statusKependudukan ?: '-' }}
                    </x-ui.status-badge>
                </td>

                <td class="whitespace-nowrap px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <a href="{{ route('admin.penduduk.show', data_get($row, 'id')) }}"
                           class="inline-flex items-center rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100">
                            Detail
                        </a>
                        <a href="{{ route('admin.penduduk.edit', data_get($row, 'id')) }}"
                           class="inline-flex items-center rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-600 transition hover:bg-amber-100">
                            Edit
                        </a>
                        <button type="button" 
                                onclick="if(confirm('Hapus data ini?')) { document.getElementById('delete-form-{{ data_get($row, 'id') }}').submit(); }"
                                class="inline-flex items-center rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100">
                            Hapus
                        </button>
                        <form id="delete-form-{{ data_get($row, 'id') }}" 
                              action="{{ route('admin.penduduk.destroy', data_get($row, 'id')) }}" 
                              method="POST" class="hidden">
                            @csrf
                            @method('DELETE')
                        </form>
                    </div>
                </td>
            </tr>
        @endforeach
    @else
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
                        Tidak ada penduduk yang cocok dengan filter "{{ request('search') ?: 'pilihan Anda' }}"
                    </p>
                    @if(request()->anyFilled(['search', 'jenis_kelamin', 'kategori_umur', 'status_kependudukan']))
                        <a href="{{ route('admin.penduduk.index') }}" class="mt-4 text-xs font-bold text-emerald-600 hover:text-emerald-700 underline">
                            Reset Filter & Lihat Semua Data
                        </a>
                    @endif
                </div>
            </td>
        </tr>
    @endif
</x-table.table>