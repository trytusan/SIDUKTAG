<x-layouts.auth title="Register - Sistem Informasi Penduduk">

    <div class="w-full max-w-2xl">
        <div class="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-10">

            <div class="mb-8 text-center">
                <h1 class="text-3xl font-bold text-white">
                    Buat Akun Baru
                </h1>
                <p class="mt-1 text-sm text-slate-300">
                    Daftar untuk menggunakan sistem
                </p>
            </div>

            @if (session('error'))
                <div class="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {{ session('error') }}
                </div>
            @endif

            <form method="POST" action="{{ route('register.store') }}" class="space-y-6">
                @csrf

                <div class="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div class="md:col-span-2">
                        <label for="name" class="mb-2 block text-sm font-medium text-slate-100">
                            Nama Lengkap
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value="{{ old('name') }}"
                            placeholder="Masukkan nama lengkap"
                            class="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300/70 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/30 @error('name') border-red-400/60 focus:border-red-400/60 focus:ring-red-400/30 @enderror"
                        >
                        @error('name')
                            <p class="mt-2 text-sm text-red-300">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="md:col-span-2">
                        <label for="email" class="mb-2 block text-sm font-medium text-slate-100">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value="{{ old('email') }}"
                            placeholder="Masukkan email"
                            class="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300/70 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/30 @error('email') border-red-400/60 focus:border-red-400/60 focus:ring-red-400/30 @enderror"
                        >
                        @error('email')
                            <p class="mt-2 text-sm text-red-300">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <label for="password" class="mb-2 block text-sm font-medium text-slate-100">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Masukkan password"
                            class="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300/70 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/30 @error('password') border-red-400/60 focus:border-red-400/60 focus:ring-red-400/30 @enderror"
                        >
                        @error('password')
                            <p class="mt-2 text-sm text-red-300">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <label for="password_confirmation" class="mb-2 block text-sm font-medium text-slate-100">
                            Konfirmasi Password
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            placeholder="Ulangi password"
                            class="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300/70 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/30"
                        >
                    </div>

                </div>

                <button
                    type="submit"
                    class="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-900 transition hover:bg-emerald-300"
                >
                    Daftar
                </button>
            </form>

            <p class="mt-6 text-center text-sm text-slate-300">
                Sudah punya akun?
                <a href="{{ route('login') }}" class="font-medium text-emerald-300 hover:text-emerald-200">
                    Login di sini
                </a>
            </p>

        </div>
    </div>

</x-layouts.auth>