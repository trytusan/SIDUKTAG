<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="mb-5 flex items-center justify-between">
        <div>
            <h2 class="text-lg font-bold text-slate-800">Daftar Anggota Keluarga</h2>
            <p class="text-sm text-slate-500">Seluruh anggota yang terdaftar dalam KK ini</p>
        </div>
    </div>

    <x-table.table :headers="['No', 'Nama', 'NIK', 'Status dalam Keluarga', 'Jenis Kelamin', 'Aksi']">
        {{-- Looping data anggota dari relasi di model KartuKeluarga --}}
        @forelse($kartuKeluarga->anggota as $index => $anggota)
            <tr class="transition hover:bg-slate-50">
                <td class="px-4 py-4 text-center text-sm text-slate-700">
                    {{ $index + 1 }}
                </td>
                <td class="px-4 py-4 text-center text-sm font-medium text-slate-800">
                    {{ $anggota->nama_lengkap }}
                </td>
                <td class="px-4 py-4 text-center text-sm text-slate-700">
                    {{ $anggota->nik }}
                </td>
                <td class="px-4 py-4 text-center text-sm text-slate-700">
                    {{ $anggota->status_dalam_keluarga }}
                </td>
                <td class="px-4 py-4 text-center text-sm text-slate-700">
                    {{ $anggota->jenis_kelamin }}
                </td>
                <td class="px-4 py-4 text-center">
                    <a
                        href="{{ route('admin.penduduk.show', $anggota->id) }}"
                        class="inline-flex items-center rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100"
                    >
                        <svg class="mr-1.5 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Lihat Detail
                    </a>
                </td>
            </tr>
        @empty
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-sm text-slate-400 italic">
                    Belum ada anggota keluarga yang terdaftar.
                </td>
            </tr>
        @endforelse
    </x-table.table>
</div>