@props([
    'title' => 'Halaman',
    'description' => null,
])

<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
        <h1 class="text-2xl font-bold text-slate-800 md:text-3xl">
            {{ $title }}
        </h1>

        @if($description)
            <p class="mt-2 text-sm text-slate-500">
                {{ $description }}
            </p>
        @endif
    </div>

    @if(isset($actions))
        <div class="flex items-center gap-3">
            {{ $actions }}
        </div>
    @endif
</div>