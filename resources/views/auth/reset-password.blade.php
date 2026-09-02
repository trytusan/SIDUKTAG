<x-layouts.auth title="Reset Password">

    <div class="w-full max-w-2xl">
        <div class="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-10">

            <div class="mb-8 text-center">
                <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-300" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                            d="M12 15v2.25m0 0h.008v.008H12v-.008Zm4.5-6.75V8.25a4.5 4.5 0 1 0-9 0v2.25m9 0h.75A2.25 2.25 0 0 1 19.5 12.75v6A2.25 2.25 0 0 1 17.25 21h-10.5A2.25 2.25 0 0 1 4.5 18.75v-6A2.25 2.25 0 0 1 6.75 10.5h9.75Z" />
                    </svg>
                </div>

                <h1 class="text-3xl font-bold text-white">
                    Reset Password
                </h1>
                <p class="mt-2 text-sm text-slate-300">
                    Buat password baru untuk akun Anda
                </p>
            </div>

            <form method="POST" action="{{ route('password.update') }}" class="space-y-6">
                @csrf

                <!-- TOKEN (WAJIB) -->
                <input type="hidden" name="token" value="{{ $token }}">

                <div class="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <!-- EMAIL -->
                    <div class="md:col-span-2">
                        <label class="mb-2 block text-sm font-medium text-slate-100">
                            Email
                        </label>
                        <input type="email" name="email" value="{{ old('email', $email) }}"
                            placeholder="Masukkan email Anda" class="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none
                @error('email') border-red-400 @enderror" />
                        @error('email')
                            <p class="mt-2 text-sm text-red-300">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- PASSWORD -->
                    <div>
                        <label class="mb-2 block text-sm font-medium text-slate-100">
                            Password Baru
                        </label>
                        <input type="password" name="password" placeholder="Masukkan password baru" class="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none
                @error('password') border-red-400 @enderror" />
                        @error('password')
                            <p class="mt-2 text-sm text-red-300">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- KONFIRMASI -->
                    <div>
                        <label class="mb-2 block text-sm font-medium text-slate-100">
                            Konfirmasi Password
                        </label>
                        <input type="password" name="password_confirmation" placeholder="Ulangi password baru"
                            class="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none" />
                    </div>

                </div>

                <button type="submit"
                    class="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-900 hover:bg-emerald-300">
                    Simpan Password Baru
                </button>
            </form>

            <p class="mt-6 text-center text-sm text-slate-300">
                Sudah ingat password?
                <a href="{{ route('login') }}" class="font-medium text-emerald-300 hover:text-emerald-200">
                    Login
                </a>
            </p>
        </div>
    </div>

</x-layouts.auth>