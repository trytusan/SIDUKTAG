<x-layouts.app title="Data Pribadi">

    <div class="min-h-screen bg-slate-100 px-4 py-8">
        <div class="mx-auto max-w-7xl">

            <div class="mb-6 text-center">
                <h1 class="text-2xl font-bold text-slate-800">Lengkapi Data Diri</h1>
                <p class="mt-1 text-sm text-slate-500">
                    Lengkapi data Anda sebelum masuk dashboard
                </p>
            </div>

            <div class="mb-6">
                <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span class="font-semibold text-emerald-600">Data Pribadi</span>
                    <span>Alamat</span>
                    <span>Dokumen</span>
                </div>
                <div class="h-2 w-full rounded-full bg-slate-200">
                    <div class="h-2 w-1/3 rounded-full bg-emerald-500"></div>
                </div>
            </div>

            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <form action="{{ route('user.onboarding.step-1.store') }}" method="POST"
                    class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    @csrf

                    <div>
                        <x-form.input
                            label="Nama Lengkap"
                            name="nama_lengkap"
                            :value="old('nama_lengkap', $data['nama_lengkap'] ?? '')"
                            placeholder="Masukkan nama lengkap"
                        />
                        @error('nama_lengkap')
                            <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <x-form.input
                            label="NIK"
                            name="nik"
                            :value="old('nik', $data['nik'] ?? '')"
                            placeholder="Masukkan NIK"
                        />
                        @error('nik')
                            <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <x-form.input
                            label="Nomor KK"
                            name="nomor_kk"
                            :value="old('nomor_kk', $data['nomor_kk'] ?? '')"
                            placeholder="Masukkan nomor KK"
                        />
                        @error('nomor_kk')
                            <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <x-form.input
                            label="Tempat Lahir"
                            name="tempat_lahir"
                            :value="old('tempat_lahir', $data['tempat_lahir'] ?? '')"
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
                            :value="old('tanggal_lahir', $data['tanggal_lahir'] ?? '')"
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
                            :selected="old('jenis_kelamin', $data['jenis_kelamin'] ?? '')"
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
                            :selected="old('agama', $data['agama'] ?? '')"
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
                            :selected="old('status_perkawinan', $data['status_perkawinan'] ?? '')"
                        />
                        @error('status_perkawinan')
                            <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <x-form.input
                            label="Pekerjaan"
                            name="pekerjaan"
                            :value="old('pekerjaan', $data['pekerjaan'] ?? '')"
                            placeholder="Masukkan pekerjaan"
                        />
                        @error('pekerjaan')
                            <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="xl:col-span-3">
                        <x-form.select
                            label="Pendidikan"
                            name="pendidikan_terakhir"
                            :options="[
                                'SD' => 'SD',
                                'SMP' => 'SMP',
                                'SMA' => 'SMA',
                                'S1' => 'S1',
                                'S2' => 'S2',
                                'S3' => 'S3'
                            ]"
                            :selected="old('pendidikan_terakhir', $data['pendidikan_terakhir'] ?? '')"
                        />
                        @error('pendidikan_terakhir')
                            <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="xl:col-span-3 flex justify-end pt-4">
                        <button type="submit"
                            class="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                            Lanjut →
                        </button>
                    </div>

                </form>
            </div>
        </div>
    </div>

</x-layouts.app>