@props([
    'id' => 'confirmModal',
    'title' => 'Konfirmasi',
    'message' => 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
    'confirmText' => 'Ya, Lanjutkan',
    'cancelText' => 'Batal',
])

<div x-data="{ open: false }" x-on:open-modal.window="if ($event.detail === '{{ $id }}') open = true">
    {{ $trigger ?? '' }}

    <div
        x-show="open"
        x-transition.opacity
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
        style="display: none;"
    >
        <div
            x-show="open"
            x-transition.scale
            @click.away="open = false"
            class="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl"
        >
            <div class="border-b border-slate-200 px-6 py-5">
                <div class="flex items-center gap-4">
                    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM10.34 3.94 1.82 18a1.875 1.875 0 0 0 1.604 2.813h17.152A1.875 1.875 0 0 0 22.18 18L13.66 3.94a1.875 1.875 0 0 0-3.32 0Z" />
                        </svg>
                    </div>

                    <div>
                        <h3 class="text-lg font-bold text-slate-800">
                            {{ $title }}
                        </h3>
                        <p class="text-sm text-slate-500">
                            Mohon periksa kembali sebelum melanjutkan
                        </p>
                    </div>
                </div>
            </div>

            <div class="px-6 py-5">
                <p class="text-sm leading-6 text-slate-600">
                    {{ $message }}
                </p>

                {{ $slot }}
            </div>

            <div class="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    @click="open = false"
                    class="rounded-2xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    {{ $cancelText }}
                </button>

                <button
                    type="button"
                    class="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                    {{ $confirmText }}
                </button>
            </div>
        </div>
    </div>
</div>