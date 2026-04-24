@props([
    'title' => 'Berhasil',
])

<div {{ $attributes->merge(['class' => 'rounded-2xl border border-emerald-200 bg-emerald-50 p-4']) }}>
    <div class="flex items-start gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12.75 11.25 15 15 9.75m6 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </div>

        <div class="flex-1">
            <h4 class="text-sm font-bold text-emerald-700">{{ $title }}</h4>
            <div class="mt-1 text-sm text-emerald-600">
                {{ $slot }}
            </div>
        </div>
    </div>
</div>