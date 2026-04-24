@props([
    'title' => 'Belum ada data',
    'description' => 'Data yang Anda cari atau butuhkan belum tersedia.',
    'buttonText' => null,
    'buttonHref' => '#',
])

<div {{ $attributes->merge(['class' => 'rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center']) }}>
    <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
    </div>

    <h3 class="mt-4 text-lg font-bold text-slate-800">{{ $title }}</h3>
    <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {{ $description }}
    </p>

    @if($buttonText)
        <a
            href="{{ $buttonHref }}"
            class="mt-6 inline-flex items-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
            {{ $buttonText }}
        </a>
    @endif
</div>