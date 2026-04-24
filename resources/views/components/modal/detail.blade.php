@props([
    'id' => 'detailModal',
    'title' => 'Detail Data',
    'closeText' => 'Tutup',
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
            class="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        >
            <div class="border-b border-slate-200 px-6 py-5">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">
                            {{ $title }}
                        </h3>
                        <p class="text-sm text-slate-500">
                            Informasi detail data
                        </p>
                    </div>

                    <button
                        type="button"
                        @click="open = false"
                        class="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="max-h-[70vh] overflow-y-auto px-6 py-5">
                {{ $slot }}
            </div>

            <div class="border-t border-slate-200 px-6 py-4 text-right">
                <button
                    type="button"
                    @click="open = false"
                    class="rounded-2xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900"
                >
                    {{ $closeText }}
                </button>
            </div>
        </div>
    </div>
</div>