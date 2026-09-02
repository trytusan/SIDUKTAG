<div class="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
    <div class="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
        {{ $slot }}
    </div>

    @isset($actions)
        <div class="flex items-center gap-3">
            {{ $actions }}
        </div>
    @endisset
</div>