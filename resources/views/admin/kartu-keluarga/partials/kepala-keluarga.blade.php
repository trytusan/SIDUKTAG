<div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 class="mb-5 text-lg font-bold text-slate-800">Data Kepala Keluarga</h2>

    <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
            <p class="text-sm text-slate-500">Nama Kepala Keluarga</p>
            <p class="font-semibold text-slate-800">
                {{ $kartuKeluarga->nama_kepala_keluarga }}
            </p>
        </div>

        <div>
            <p class="text-sm text-slate-500">Nomor KK</p>
            <p class="font-semibold text-slate-800">
                {{ $kartuKeluarga->nomor_kk }}
            </p>
        </div>

        <div class="md:col-span-2">
            <p class="text-sm text-slate-500">Alamat Keluarga</p>
            <p class="font-semibold text-slate-800 italic">
                "{{ $kartuKeluarga->alamat_keluarga }}"
            </p>
        </div>

        <div>
            <p class="text-sm text-slate-500">Jumlah Anggota Keluarga</p>
            <p class="font-semibold text-slate-800">
                {{-- Menggunakan count dari relasi anggota agar data selalu akurat --}}
                {{ $kartuKeluarga->jumlah_anggota }} Orang
            </p>
        </div>
    </div>
</div>