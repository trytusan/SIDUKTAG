<x-layouts.user title="Detail Kartu Keluarga" pageTitle="Detail Kartu Keluarga" :user="$penduduk->nama_lengkap ?? auth()->user()->name">

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard Saya', 'url' => route('user.dashboard')],
        ['label' => 'Data Keluarga', 'url' => route('user.kartu-keluarga.index')],
        ['label' => 'Detail Kartu Keluarga']
    ]" />

    <div class="space-y-6">

        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-6 border-b border-slate-100 pb-5">
                <h2 class="text-lg font-bold text-slate-800">Informasi Kartu Keluarga</h2>
                <p class="mt-1 text-sm text-slate-500">
                    Detail lengkap data keluarga Anda
                </p>
            </div>

            <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Nomor KK</p>
                    <p class="mt-1 font-semibold text-slate-800">
                        {{ $kartuKeluarga->nomor_kk }}
                    </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Nama Kepala Keluarga</p>
                    <p class="mt-1 font-semibold text-slate-800">
                        {{ $kartuKeluarga->nama_kepala_keluarga }}
                    </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Jumlah Anggota</p>
                    <p class="mt-1 font-semibold text-slate-800">
                        {{ $kartuKeluarga->anggota->count() }} Orang
                    </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Alamat Lengkap</p>
                    <p class="mt-1 font-semibold leading-7 text-slate-800">
                        {{ $kartuKeluarga->alamat_keluarga }}
                    </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4">
                    <p class="text-sm text-slate-500">Status Keluarga</p>
                    <div class="mt-2">
                        <x-ui.status-badge status="aktif">Aktif</x-ui.status-badge>
                    </div>
                </div>
            </div>
        </div>

        @include('user.kartu-keluarga.partials.anggota-list')

    </div>

</x-layouts.user>