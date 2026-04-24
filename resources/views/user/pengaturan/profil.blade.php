<x-layouts.user
    title="Profil Saya"
    pageTitle="Profil Saya"
    :user="$penduduk->nama_lengkap ?? auth()->user()->name"
>

    <x-ui.breadcrumb :items="[
        ['label' => 'Dashboard Saya', 'url' => route('user.dashboard')],
        ['label' => 'Pengaturan', 'url' => route('user.pengaturan.index')],
        ['label' => 'Profil Saya']
    ]" />

    @if (session('status'))
        <div class="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {{ session('status') }}
        </div>
    @endif

    <div class="space-y-6">
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
                <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700">
                    @if(!empty($penduduk?->foto_profil))
                        <img
                            src="{{ asset('storage/' . $penduduk->foto_profil) }}"
                            alt="Foto Profil"
                            class="h-full w-full object-cover"
                        >
                    @else
                        {{ strtoupper(substr($penduduk->nama_lengkap ?? auth()->user()->name, 0, 1)) }}
                    @endif
                </div>

                <div>
                    <h2 class="text-xl font-bold text-slate-800">
                        {{ $penduduk->nama_lengkap ?? auth()->user()->name }}
                    </h2>
                    <p class="mt-1 text-sm text-slate-500">
                        NIK: {{ $penduduk->nik ?? '-' }}
                    </p>
                    <p class="text-sm text-slate-500">Pengguna aktif</p>
                </div>
            </div>

            <form
                action="{{ route('user.pengaturan.profil.update') }}"
                method="POST"
                enctype="multipart/form-data"
                class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
                @csrf
                @method('PUT')

                <div>
                    <x-form.input
                        label="Nama Lengkap"
                        name="nama_lengkap"
                        :value="old('nama_lengkap', $penduduk->nama_lengkap ?? '')"
                        placeholder="Masukkan nama lengkap"
                    />
                    @error('nama_lengkap')
                        <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <x-form.input
                        label="NIK"
                        name="nik_tampil"
                        :value="$penduduk->nik ?? ''"
                        readonly
                    />
                </div>

                <div>
                    <x-form.input
                        label="Nomor KK"
                        name="nomor_kk_tampil"
                        :value="$penduduk->nomor_kk ?? ''"
                        readonly
                    />
                </div>

                <div>
                    <x-form.input
                        label="Tempat Lahir"
                        name="tempat_lahir"
                        :value="old('tempat_lahir', $penduduk->tempat_lahir ?? '')"
                        placeholder="Masukkan tempat lahir"
                    />
                    @error('tempat_lahir')
                        <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <x-form.input
                        type="date"
                        label="Tanggal Lahir"
                        name="tanggal_lahir"
                        :value="old('tanggal_lahir', optional($penduduk->tanggal_lahir)->format('Y-m-d'))"
                    />
                    @error('tanggal_lahir')
                        <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <x-form.select
                        label="Jenis Kelamin"
                        name="jenis_kelamin"
                        :options="[
                            'Laki-laki' => 'Laki-laki',
                            'Perempuan' => 'Perempuan'
                        ]"
                        :selected="old('jenis_kelamin', $penduduk->jenis_kelamin ?? '')"
                    />
                    @error('jenis_kelamin')
                        <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <x-form.select
                        label="Agama"
                        name="agama"
                        :options="[
                            'Islam' => 'Islam',
                            'Kristen' => 'Kristen',
                            'Katolik' => 'Katolik',
                            'Hindu' => 'Hindu',
                            'Buddha' => 'Buddha',
                            'Konghucu' => 'Konghucu'
                        ]"
                        :selected="old('agama', $penduduk->agama ?? '')"
                    />
                    @error('agama')
                        <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <x-form.select
                        label="Status Perkawinan"
                        name="status_perkawinan"
                        :options="[
                            'Belum Kawin' => 'Belum Kawin',
                            'Kawin' => 'Kawin',
                            'Cerai Hidup' => 'Cerai Hidup',
                            'Cerai Mati' => 'Cerai Mati'
                        ]"
                        :selected="old('status_perkawinan', $penduduk->status_perkawinan ?? '')"
                    />
                    @error('status_perkawinan')
                        <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <x-form.input
                        label="Pekerjaan"
                        name="pekerjaan"
                        :value="old('pekerjaan', $penduduk->pekerjaan ?? '')"
                        placeholder="Masukkan pekerjaan"
                    />
                    @error('pekerjaan')
                        <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <div class="xl:col-span-2">
                    <x-form.select
                        label="Pendidikan Terakhir"
                        name="pendidikan_terakhir"
                        :options="[
                            'SD' => 'SD',
                            'SMP' => 'SMP',
                            'SMA/SMK' => 'SMA/SMK',
                            'D1' => 'D1',
                            'D2' => 'D2',
                            'D3' => 'D3',
                            'S1' => 'S1',
                            'S2' => 'S2',
                            'S3' => 'S3'
                        ]"
                        :selected="old('pendidikan_terakhir', $penduduk->pendidikan_terakhir ?? '')"
                    />
                    @error('pendidikan_terakhir')
                        <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <x-form.input
                        label="Nomor Telepon"
                        name="nomor_telepon"
                        :value="old('nomor_telepon', $penduduk->nomor_telepon ?? '')"
                        placeholder="Masukkan nomor telepon"
                    />
                    @error('nomor_telepon')
                        <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <div class="xl:col-span-3">
                    <x-form.textarea
                        label="Alamat Lengkap"
                        name="alamat_lengkap"
                        placeholder="Masukkan alamat lengkap"
                    >{{ old('alamat_lengkap', $penduduk->alamat_lengkap ?? '') }}</x-form.textarea>
                    @error('alamat_lengkap')
                        <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <div class="xl:col-span-3">
                    <x-form.file
                        label="Foto Profil"
                        name="foto_profil"
                    />
                    @error('foto_profil')
                        <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                    @enderror
                </div>

                <div class="xl:col-span-3 flex justify-end border-t border-slate-100 pt-5">
                    <button
                        type="submit"
                        class="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </form>
        </div>
    </div>

</x-layouts.user>