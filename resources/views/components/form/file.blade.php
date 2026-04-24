@props([
    'label' => '',
    'name',
])

<div>
    @if($label)
        <label class="block text-sm text-slate-800 font-bold mb-2">
            {{ $label }}
        </label>
    @endif

    <input
        type="file"
        name="{{ $name }}"
        {{ $attributes->merge([
            'class' => 'w-full text-sm text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-emerald-400 file:text-slate-900 hover:file:bg-emerald-300'
        ]) }}
    >
</div>