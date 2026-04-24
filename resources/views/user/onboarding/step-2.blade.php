<x-layouts.app title="Alamat & Keluarga">

    <div class="min-h-screen bg-slate-100 px-4 py-8">
        <div class="mx-auto max-w-7xl">

            <div class="mb-6 text-center">
                <h1 class="text-2xl font-bold text-slate-800">Lengkapi Data Diri</h1>
                <p class="mt-1 text-sm text-slate-500">
                    Lengkapi alamat dan data keluarga Anda sebelum masuk dashboard
                </p>
            </div>

            <div class="mb-6">
                <div class="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Data Pribadi</span>
                    <span class="font-semibold text-emerald-600">Alamat & Keluarga</span>
                    <span>Dokumen</span>
                </div>
                <div class="h-2 w-full rounded-full bg-slate-200">
                    <div class="h-2 w-2/3 rounded-full bg-emerald-500"></div>
                </div>
            </div>

            <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <form
                    action="{{ route('user.onboarding.step-2.store') }}"
                    method="POST"
                    class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
                >
                    @csrf

                    <div class="xl:col-span-3">
                        <x-form.textarea
                            label="Alamat Lengkap"
                            name="alamat"
                            placeholder="Masukkan alamat lengkap"
                        >{{ old('alamat', $data['alamat'] ?? '') }}</x-form.textarea>
                        @error('alamat')
                            <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <x-form.input
                            label="Nomor Telepon"
                            name="nomor_telepon"
                            :value="old('nomor_telepon', $data['nomor_telepon'] ?? '')"
                            placeholder="Masukkan nomor telepon"
                        />
                        @error('nomor_telepon')
                            <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <x-form.select
                            label="Status Dalam Keluarga"
                            name="status_dalam_keluarga"
                            :options="[
                                'Kepala Keluarga' => 'Kepala Keluarga',
                                'Istri' => 'Istri',
                                'Anak' => 'Anak',
                                'Orang Tua' => 'Orang Tua',
                                'Saudara' => 'Saudara',
                                'Lainnya' => 'Lainnya'
                            ]"
                            :selected="old('status_dalam_keluarga', $data['status_dalam_keluarga'] ?? '')"
                        />
                        @error('status_dalam_keluarga')
                            <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <x-form.select
                            label="Status Kependudukan"
                            name="status_kependudukan"
                            :options="[
                                'Tetap' => 'Tetap',
                                'Pendatang' => 'Pendatang',
                                'Pindah' => 'Pindah',
                                'Meninggal' => 'Meninggal'
                            ]"
                            :selected="old('status_kependudukan', $data['status_kependudukan'] ?? '')"
                        />
                        @error('status_kependudukan')
                            <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="xl:col-span-3 flex items-center justify-between pt-4">
                        <a
                            href="{{ route('user.onboarding.step-1') }}"
                            class="text-sm font-medium text-slate-600 transition hover:text-slate-800"
                        >
                            ← Kembali
                        </a>

                        <button
                            type="submit"
                            class="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Lanjut →
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

</x-layouts.app>