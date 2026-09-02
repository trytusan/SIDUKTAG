<x-layouts.auth title="Login">
    <div class="w-full max-w-md">
        <div
            class="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-10">

            <div class="mb-8 text-center">
                <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/20 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-300" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3 21h18M5 21V8.2a1 1 0 0 1 .4-.8l6-4.5a1 1 0 0 1 1.2 0l6 4.5a1 1 0 0 1 .4.8V21M9 21v-6h6v6" />
                    </svg>
                </div>

                <h1 class="text-2xl font-bold tracking-tight text-white md:text-3xl">
                    Sistem Informasi Penduduk
                </h1>
                <p class="mt-2 text-sm text-slate-200/80">
                    Login untuk masuk ke dashboard lingkungan
                </p>
            </div>

            @if (session('error'))
                <div class="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {{ session('error') }}
                </div>
            @endif

            @if (session('status'))
                <div class="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    {{ session('status') }}
                </div>
            @endif

            <form method="POST" action="{{ route('login.store') }}" class="space-y-5">
                @csrf

                <div>
                    <label for="email" class="mb-2 block text-sm font-medium text-slate-100">
                        Email
                    </label>
                    <div class="relative">
                        <span
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75a17.933 17.933 0 0 1-7.5-1.632Z" />
                            </svg>
                        </span>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value="{{ old('email') }}"
                            placeholder="Masukkan email"
                            class="w-full rounded-2xl border border-white/10 bg-white/10 py-3 pl-12 pr-4 text-white placeholder:text-slate-300/70 outline-none transition duration-200 focus:border-emerald-300/60 focus:bg-white/15 focus:ring-2 focus:ring-emerald-400/30 @error('email') border-red-400/60 focus:border-red-400/60 focus:ring-red-400/30 @enderror" />
                    </div>
                    @error('email')
                        <p class="mt-2 text-sm text-red-300">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label for="password" class="mb-2 block text-sm font-medium text-slate-100">
                        Password
                    </label>
                    <div class="relative">
                        <span
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" stroke-width="1.8">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M16.5 10.5V7.875a4.5 4.5 0 1 0-9 0V10.5m-.75 0h10.5A2.25 2.25 0 0 1 19.5 12.75v5.25a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18v-5.25A2.25 2.25 0 0 1 6.75 10.5Z" />
                            </svg>
                        </span>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Masukkan password"
                            class="w-full rounded-2xl border border-white/10 bg-white/10 py-3 pl-12 pr-4 text-white placeholder:text-slate-300/70 outline-none transition duration-200 focus:border-emerald-300/60 focus:bg-white/15 focus:ring-2 focus:ring-emerald-400/30 @error('password') border-red-400/60 focus:border-red-400/60 focus:ring-red-400/30 @enderror" />
                    </div>
                    @error('password')
                        <p class="mt-2 text-sm text-red-300">{{ $message }}</p>
                    @enderror
                </div>

                <div class="flex items-center justify-between text-sm">
                    <label class="flex items-center gap-2 text-slate-200/90">
                        <input
                            type="checkbox"
                            name="remember"
                            value="1"
                            class="h-4 w-4 rounded border-white/20 bg-white/10 text-emerald-400 focus:ring-emerald-400/40">
                        Ingat saya
                    </label>

                    <a href="{{ route('password.request') }}" class="text-emerald-300 transition hover:text-emerald-200">
                        Lupa password?
                    </a>
                </div>

                <button type="submit"
                    class="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-900 shadow-lg shadow-emerald-900/30 transition duration-200 hover:scale-[1.02] hover:bg-emerald-300 active:scale-[0.98]">
                    Login
                </button>
            </form>

            <p class="mt-6 text-center text-sm text-slate-200/80">
                Belum punya akun?
                <a href="{{ route('register') }}" class="font-medium text-emerald-300 hover:text-emerald-200">
                    Daftar sekarang
                </a>
            </p>
        </div>
    </div>
</x-layouts.auth>