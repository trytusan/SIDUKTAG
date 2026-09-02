@props([
    'placeholder' => 'Cari data...',
    'name' => 'search',
    'value' => '',
])

<div class="relative w-full md:max-w-sm">
    <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m21 21-4.35-4.35m0 0A7.65 7.65 0 1 0 5.85 5.85a7.65 7.65 0 0 0 10.8 10.8Z" />
        </svg>
    </span>

    <input
        type="text"
        name="{{ $name }}"
        value="{{ $value }}"
        placeholder="{{ $placeholder }}"
        {{ $attributes->merge([
            'class' => 'w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
        ]) }}
    >
</div>