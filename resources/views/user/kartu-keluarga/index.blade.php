<x-layouts.user
    title="Data Keluarga"
    pageTitle="Data Keluarga"
    :user="$penduduk->nama_lengkap ?? auth()->user()->name"
>

    <div class="space-y-6">

        <!-- RINGKASAN (ATAS) -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-5">
                <h2 class="text-lg font-bold text-slate-800">Ringkasan Kartu Keluarga</h2>
                <p class="text-sm text-slate-500">Informasi dasar keluarga Anda</p>
            </div>

            @include('user.kartu-keluarga.partials.table')
        </div>

        <!-- DAFTAR ANGGOTA (TENGAH) -->
        @include('user.kartu-keluarga.partials.anggota-list')

        <!-- INFORMASI KELUARGA (BAWAH) -->
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-5">
                <h2 class="text-lg font-bold text-slate-800">Informasi Keluarga</h2>
                <p class="mt-1 text-sm text-slate-500">Data singkat kartu keluarga Anda</p>
            </div>

            @if($kartuKeluarga)
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

                    <div class="rounded-2xl bg-slate-50 px-4 py-3">
                        <p class="text-sm text-slate-500">Nomor KK</p>
                        <p class="font-semibold text-slate-800">
                            {{ $kartuKeluarga->nomor_kk }}
                        </p>
                    </div>

                    <div class="rounded-2xl bg-slate-50 px-4 py-3">
                        <p class="text-sm text-slate-500">Kepala Keluarga</p>
                        <p class="font-semibold text-slate-800">
                            {{ $kartuKeluarga->nama_kepala_keluarga }}
                        </p>
                    </div>

                    <div class="rounded-2xl bg-slate-50 px-4 py-3">
                        <p class="text-sm text-slate-500">Jumlah Anggota</p>
                        <p class="font-semibold text-slate-800">
                            {{ $kartuKeluarga->anggota->count() }} Orang
                        </p>
                    </div>

                    <div class="md:col-span-2 xl:col-span-3 rounded-2xl bg-slate-50 px-4 py-3">
                        <p class="text-sm text-slate-500">Alamat</p>
                        <p class="mt-1 text-sm font-semibold leading-6 text-slate-800">
                            {{ $kartuKeluarga->alamat_keluarga }}
                        </p>
                    </div>

                </div>
            @else
                <div class="rounded-2xl bg-slate-50 px-4 py-8 text-center">
                    <p class="text-sm text-slate-500">
                        Data kartu keluarga belum tersedia.
                    </p>
                </div>
            @endif
        </div>

    </div>

</x-layouts.user>