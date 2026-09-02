@props([
    'status' => 'default',
])

@php
    $classes = match($status) {
        'aktif', 'success', 'selesai', 'approved' => 'bg-emerald-100 text-emerald-700',
        'pending', 'process', 'diproses' => 'bg-amber-100 text-amber-700',
        'nonaktif', 'failed', 'rejected', 'ditolak' => 'bg-red-100 text-red-700',
        'draft' => 'bg-slate-100 text-slate-700',
        default => 'bg-sky-100 text-sky-700',
    };
@endphp

<span {{ $attributes->merge(['class' => "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold {$classes}"]) }}>
    {{ $slot->isNotEmpty() ? $slot : ucfirst($status) }}
</span>