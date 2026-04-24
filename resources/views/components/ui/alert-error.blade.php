@props([
    'title' => 'Terjadi kesalahan',
])

<div {{ $attributes->merge(['class' => 'rounded-2xl border border-red-200 bg-red-50 p-4']) }}>
    <div class="flex items-start gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM10.34 3.94 1.82 18a1.875 1.875 0 0 0 1.604 2.813h17.152A1.875 1.875 0 0 0 22.18 18L13.66 3.94a1.875 1.875 0 0 0-3.32 0Z" />
            </svg>
        </div>

        <div class="flex-1">
            <h4 class="text-sm font-bold text-red-700">{{ $title }}</h4>
            <div class="mt-1 text-sm text-red-600">
                {{ $slot }}
            </div>
        </div>
    </div>
</div>