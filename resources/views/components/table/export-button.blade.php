@props([
    'label' => 'Export',
    'href' => '#',
])

<a
    href="{{ $href }}"
    {{ $attributes->merge([
        'class' => 'inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700'
    ]) }}
>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 16.5V4.5m0 12 4.5-4.5M12 16.5 7.5 12m9 6H7.5A2.25 2.25 0 0 1 5.25 15.75v-1.5" />
    </svg>
    {{ $label }}
</a>