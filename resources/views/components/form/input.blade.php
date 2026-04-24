@props([
    'label' => '',
    'type' => 'text',
    'name',
    'placeholder' => '',
    'value' => '',
])

<div>
    @if($label)
        <label class="block text-sm text-slate-800 font-bold mb-2">
            {{ $label }}
        </label>
    @endif

    <input
        type="{{ $type }}"
        name="{{ $name }}"
        value="{{ old($name, $value) }}"
        placeholder="{{ $placeholder }}"
        {{ $attributes->merge([
            'class' => 'w-full rounded-2xl bg-white/10 border border-black/10 px-4 py-3 text-black placeholder:text-slate-800 outline-none focus:ring-2 focus:ring-emerald-400'
        ]) }}
    >
</div>  