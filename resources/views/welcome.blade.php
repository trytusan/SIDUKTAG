<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Change Password - Sistem Informasi Penduduk</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center px-4">

    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-10 left-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl"></div>
        <div class="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-2xl">
        <div class="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-10">

            <div class="mb-8 text-center">
                <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16.5 10.5V7.875a4.5 4.5 0 1 0-9 0V10.5m-.75 0h10.5A2.25 2.25 0 0 1 19.5 12.75v5.25a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 18v-5.25A2.25 2.25 0 0 1 6.75 10.5Z" />
                    </svg>
                </div>

                <h1 class="text-3xl font-bold text-white">Ganti Password</h1>
                <p class="mt-2 text-sm text-slate-300">
                    Perbarui password akun Anda untuk keamanan yang lebih baik
                </p>
            </div>

            <form class="space-y-6">
                <div class="grid grid-cols-1 gap-5">
                    <div>
                        <label class="mb-2 block text-sm font-medium text-slate-100">Password Lama</label>
                        <input
                            type="password"
                            placeholder="Masukkan password lama"
                            class="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300/70 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/30"
                        />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium text-slate-100">Password Baru</label>
                        <input
                            type="password"
                            placeholder="Masukkan password baru"
                            class="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300/70 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/30"
                        />
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium text-slate-100">Konfirmasi Password Baru</label>
                        <input
                            type="password"
                            placeholder="Ulangi password baru"
                            class="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300/70 outline-none transition focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-400/30"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    class="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-900 transition hover:bg-emerald-300"
                >
                    Update Password
                </button>
            </form>

            <p class="mt-6 text-center text-sm text-slate-300">
                Kembali ke
                <a href="#" class="font-medium text-emerald-300 hover:text-emerald-200">Dashboard</a>
            </p>
        </div>
    </div>

</body>
</html>