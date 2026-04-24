@props([
    'title' => 'Total Data',
    'value' => '0',
    'description' => null,
    'iconBg' => 'bg-emerald-100',
    'iconColor' => 'text-emerald-600',
])

<div {{ $attributes->merge(['class' => 'rounded-3xl border border-slate-200 bg-white p-6 shadow-sm']) }}>
    <div class="flex items-start justify-between gap-4">
        <div>
            <p class="text-sm font-medium text-slate-500">{{ $title }}</p>
            <h3 class="mt-2 text-3xl font-bold text-slate-800">{{ $value }}</h3>

            @if($description)
                <p class="mt-2 text-sm text-slate-500">{{ $description }}</p>
            @endif
        </div>

        <div class="flex h-14 w-14 items-center justify-center rounded-2xl {{ $iconBg }} {{ $iconColor }}">
            {{ $icon ?? '' }}
        </div>
    </div>
</div>