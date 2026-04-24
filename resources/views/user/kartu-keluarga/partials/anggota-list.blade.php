@if($kartuKeluarga)
    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-5">
            <h2 class="text-lg font-bold text-slate-800">Daftar Anggota Keluarga</h2>
            <p class="text-sm text-slate-500">Seluruh anggota yang terdaftar dalam kartu keluarga</p>
        </div>

        <x-table.table :headers="[
            'No',
            'Nama',
            'NIK',
            'Status dalam Keluarga',
            'Jenis Kelamin',
            'Tanggal Lahir'
        ]">
            @forelse($kartuKeluarga->anggota as $index => $anggota)
                <tr class="transition hover:bg-slate-50">
                    <td class="px-4 py-4 text-center text-sm text-slate-700">{{ $index + 1 }}</td>
                    <td class="px-4 py-4 text-center text-sm font-medium text-slate-800">{{ $anggota->nama_lengkap }}</td>
                    <td class="px-4 py-4 text-center text-sm text-slate-700">{{ $anggota->nik }}</td>
                    <td class="px-4 py-4 text-center text-sm text-slate-700">{{ $anggota->status_dalam_keluarga ?? '-' }}</td>
                    <td class="px-4 py-4 text-center text-sm text-slate-700">{{ $anggota->jenis_kelamin ?? '-' }}</td>
                    <td class="px-4 py-4 text-center text-sm text-slate-700">
                        {{ $anggota->tanggal_lahir ? \Carbon\Carbon::parse($anggota->tanggal_lahir)->translatedFormat('d F Y') : '-' }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-sm text-slate-500">
                        Belum ada anggota keluarga yang terdaftar.
                    </td>
                </tr>
            @endforelse
        </x-table.table>
    </div>
@else
    <div class="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p class="text-sm text-slate-500">Data kartu keluarga belum tersedia.</p>
    </div>
@endif