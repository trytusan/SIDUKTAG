<x-table.table :headers="[
    'Nomor KK',
    'Kepala Keluarga',
    'Alamat',
    'Jumlah Anggota',
    'Aksi'
]">
    @if($kartuKeluarga)
        <tr class="transition hover:bg-slate-50">
            <td class="px-4 py-4 text-center text-sm font-medium text-slate-800">
                {{ $kartuKeluarga->nomor_kk }}
            </td>

            <td class="px-4 py-4 text-center text-sm text-slate-700">
                {{ $kartuKeluarga->nama_kepala_keluarga }}
            </td>

            <td class="px-4 py-4 text-center text-sm text-slate-700">
                {{ $kartuKeluarga->alamat_keluarga }}
            </td>

            <td class="px-4 py-4 text-center text-sm text-slate-700">
                {{ $kartuKeluarga->anggota->count() }} Orang
            </td>

            <td class="px-4 py-4 text-center">
                <a
                    href="{{ route('user.kartu-keluarga.show', $kartuKeluarga->id) }}"
                    class="inline-flex items-center rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100"
                >
                    Detail
                </a>
            </td>
        </tr>
    @else
        <tr>
            <td colspan="5" class="px-4 py-8 text-center text-sm text-slate-500">
                Data kartu keluarga belum tersedia.
            </td>
        </tr>
    @endif
</x-table.table>