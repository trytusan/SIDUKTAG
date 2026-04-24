<x-layouts.auth title="Forgot Password">

    <div class="w-full max-w-xl">
        <div class="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-10">

            <div class="mb-8 text-center">
                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16.5 10.5V7.875a4.5 4.5 0 1 0-9 0V10.5m-.75 0h10.5A2.25 2.25 0 0 1 19.5 12.75v5.25a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18v-5.25A2.25 2.25 0 0 1 6.75 10.5Z" />
                    </svg>
                </div>

                <h1 class="text-3xl font-bold text-white">
                    Lupa Password
                </h1>
                <p class="mt-2 text-sm text-slate-300">
                    Masukkan email akun Anda untuk menerima link reset password
                </p>
            </div>

            @if (session('status'))
                <div class="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    {{ session('status') }}
                </div>
            @endif

            <form method="POST" action="{{ route('password.email') }}" class="space-y-6">
                @csrf

                <div>
                    <label for="email" class="mb-2 block text-sm font-medium text-slate-100">
                        Email
                    </label>
                    <div class="relative">
                        <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5A2.25 2.25 0 0 0 2.25 6.75m19.5 0-8.69 5.52a2.25 2.25 0 0 1-2.12 0L2.25 6.75" />
                            </svg>
                        </span>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value="{{ old('email') }}"
                            placeholder="Masukkan email Anda"
                            class="w-full rounded-2xl border border-white/10 bg-white/10 py-3 pl-12 pr-4 text-white placeholder:text-slate-300/70 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/30 @error('email') border-red-400/60 focus:border-red-400/60 focus:ring-red-400/30 @enderror"
                        />
                    </div>

                    @error('email')
                        <p class="mt-2 text-sm text-red-300">{{ $message }}</p>
                    @enderror
                </div>

                <button
                    type="submit"
                    class="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-900 transition hover:bg-emerald-300"
                >
                    Kirim Link Reset
                </button>
            </form>

            <p class="mt-6 text-center text-sm text-slate-300">
                Kembali ke
                <a href="{{ route('login') }}" class="font-medium text-emerald-300 hover:text-emerald-200">
                    Login
                </a>
            </p>
        </div>
    </div>

</x-layouts.auth>