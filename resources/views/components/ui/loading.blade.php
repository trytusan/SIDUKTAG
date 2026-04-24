@props([
    'text' => 'Memuat data...',
])

<div {{ $attributes->merge(['class' => 'flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-5 text-slate-600 shadow-sm']) }}>
    <svg class="h-5 w-5 animate-spin text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"></path>
    </svg>

    <span class="text-sm font-medium">{{ $text }}</span>
</div>