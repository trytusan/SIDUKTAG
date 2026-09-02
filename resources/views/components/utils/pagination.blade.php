@props([
    'paginator'
])

@if ($paginator->hasPages())
    <div class="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row">

        <!-- Info -->
        <div class="text-sm text-slate-600">
            Menampilkan
            <span class="font-semibold text-slate-800">{{ $paginator->firstItem() }}</span>
            sampai
            <span class="font-semibold text-slate-800">{{ $paginator->lastItem() }}</span>
            dari
            <span class="font-semibold text-slate-800">{{ $paginator->total() }}</span>
            data
        </div>

        <!-- Links -->
        <div class="flex items-center gap-1">

            {{-- Previous --}}
            @if ($paginator->onFirstPage())
                <span class="px-3 py-2 text-sm text-slate-400">‹</span>
            @else
                <a href="{{ $paginator->previousPageUrl() }}"
                   class="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
                    ‹
                </a>
            @endif

            {{-- Pages --}}
            @foreach ($elements as $element)
                @if (is_string($element))
                    <span class="px-3 py-2 text-sm text-slate-400">{{ $element }}</span>
                @endif

                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if ($page == $paginator->currentPage())
                            <span class="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">
                                {{ $page }}
                            </span>
                        @else
                            <a href="{{ $url }}"
                               class="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
                                {{ $page }}
                            </a>
                        @endif
                    @endforeach
                @endif
            @endforeach

            {{-- Next --}}
            @if ($paginator->hasMorePages())
                <a href="{{ $paginator->nextPageUrl() }}"
                   class="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
                    ›
                </a>
            @else
                <span class="px-3 py-2 text-sm text-slate-400">›</span>
            @endif

        </div>
    </div>
@endif