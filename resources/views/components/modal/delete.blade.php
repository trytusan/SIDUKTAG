@props([
    'id' => 'deleteModal',
    'title' => 'Hapus Data',
    'message' => 'Data yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?',
    'deleteText' => 'Ya, Hapus',
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
            class="w-full max-w-md overflow-hidden rounded-3xl border border-red-100 bg-white shadow-2xl"
        >
            <div class="border-b border-red-100 px-6 py-5">
                <div class="flex items-center gap-4">
                    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 7.5h12m-1.5 0-.53 10.606A2.25 2.25 0 0 1 13.723 20.25h-3.446a2.25 2.25 0 0 1-2.247-2.144L7.5 7.5m3-3h3a1.5 1.5 0 0 1 1.5 1.5V7.5h-6V6a1.5 1.5 0 0 1 1.5-1.5Z" />
                        </svg>
                    </div>

                    <div>
                        <h3 class="text-lg font-bold text-slate-800">
                            {{ $title }}
                        </h3>
                        <p class="text-sm text-red-500">
                            Tindakan ini bersifat permanen
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
                    class="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                    {{ $deleteText }}
                </button>
            </div>
        </div>
    </div>
</div>