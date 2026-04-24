@props([
    'label' => '',
    'name',
    'options' => [],
])

<div>
    @if($label)
        <label class="block text-sm text-slate-800 font-bold mb-2">
            {{ $label }}
        </label>
    @endif

    <div class="flex gap-4">
        @foreach($options as $key => $value)
            <label class="flex items-center gap-2 text-slate-800">
                <input
                    type="radio"
                    name="{{ $name }}"
                    value="{{ $key }}"
                    class="text-emerald-400 focus:ring-emerald-400"
                >
                {{ $value }}
            </label>
        @endforeach
    </div>
</div>