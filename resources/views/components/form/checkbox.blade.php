@props([
    'label' => '',
    'name',
])

<div class="flex items-center gap-2">
    <input
        type="checkbox"
        name="{{ $name }}"
        {{ $attributes->merge([
            'class' => 'w-4 h-4 text-emerald-400 bg-white/10 border-white/20 rounded focus:ring-emerald-400'
        ]) }}
    >

    <label class="text-sm text-slate-200">
        {{ $label }}
    </label>
</div>