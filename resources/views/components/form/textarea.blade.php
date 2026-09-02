@props([
    'label' => '',
    'name',
    'placeholder' => '',
])

<div>
    @if($label)
        <label class="block text-sm text-slate-800 font-bold mb-2">
            {{ $label }}
        </label>
    @endif

    <textarea
        name="{{ $name }}"
        placeholder="{{ $placeholder }}"
        rows="4"
        {{ $attributes->merge([
            'class' => 'w-full rounded-2xl bg-white border border-slate-300 px-4 py-3 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500'
        ]) }}
    >{{ $slot }}</textarea>
</div>