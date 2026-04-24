@props([
    'items' => [],
])

<nav aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        @foreach($items as $item)
            <li class="flex items-center gap-2">
                @if(!$loop->first)
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="m9 5 7 7-7 7" />
                    </svg>
                @endif

                @if(isset($item['url']) && !$loop->last)
                    <a href="{{ $item['url'] }}" class="transition hover:text-emerald-600">
                        {{ $item['label'] }}
                    </a>
                @else
                    <span class="{{ $loop->last ? 'font-semibold text-slate-800' : '' }}">
                        {{ $item['label'] }}
                    </span>
                @endif
            </li>
        @endforeach
    </ol>
</nav>