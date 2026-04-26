@props([
    'label' => '',
    'type' => 'text',
    'name',
    'placeholder' => '',
    'value' => '', // Nilai default jika tidak ada data
])

<div>
    @if($label)
        <label for="{{ $attributes->get('id') ?? $name }}" class="block text-sm text-slate-800 font-bold mb-2">
            {{ $label }}
        </label>
    @endif

    <input
        {{-- 1. Biarkan type, name, dan id tetap fleksibel --}}
        type="{{ $type }}"
        name="{{ $name }}"
        id="{{ $attributes->get('id') ?? $name }}" 
        
        {{-- 2. PERBAIKAN: Gunakan value dari old() atau variabel $value --}}
        value="{{ old($name, $value) }}"
        
        placeholder="{{ $placeholder }}"

        {{-- 3. Merge class dan atribut lainnya --}}
        {{ $attributes->merge([
            'class' => 'w-full rounded-2xl bg-white border border-slate-300 px-4 py-3 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition-all'
        ]) }}
    >
    
    @error($name)
        <p class="mt-1 text-xs text-red-500">{{ $message }}</p>
    @enderror
</div>