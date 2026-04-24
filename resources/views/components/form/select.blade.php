@props([
    'label' => '',
    'name',
    'options' => [],
    'value' => '' // Gunakan 'value' agar konsisten dengan komponen input lainnya
])

<div>
    @if($label)
        <label for="{{ $name }}" class="block text-sm text-slate-800 font-bold mb-2">
            {{ $label }}
        </label>
    @endif

    <select
        id="{{ $name }}"
        name="{{ $name }}"
        {{ $attributes->merge([
            'class' => 'w-full rounded-2xl bg-white border border-slate-300 px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition-all'
        ]) }}
    >
        @foreach($options as $key => $optionValue)
            <option 
                value="{{ $key }}" 
                {{-- Casting ke string sangat penting karena ID seringkali integer sedangkan input seringkali string --}}
                {{ (string) $key === (string) $value ? 'selected' : '' }}
            >
                {{ $optionValue }}
            </option>
        @endforeach
    </select>
</div>