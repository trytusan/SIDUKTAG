@props([
    'showDetail' => true,
    'showEdit' => true,
    'showDelete' => true,
    'detailHref' => '#',
    'editHref' => '#',
    'deleteAction' => null,
])

<div class="flex items-center gap-2 justify-center">
    @if($showDetail)
        <a
            href="{{ $detailHref }}"
            class="inline-flex items-center rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-600 transition hover:bg-sky-100"
        >
            Detail
        </a>
    @endif

    @if($showEdit)
        <a
            href="{{ $editHref }}"
            class="inline-flex items-center rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-600 transition hover:bg-amber-100"
        >
            Edit
        </a>
    @endif

    @if($showDelete)
        @if($deleteAction)
            <button
                type="button"
                onclick="{{ $deleteAction }}"
                class="inline-flex items-center rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
            >
                Hapus
            </button>
        @else
            <button
                type="button"
                class="inline-flex items-center rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
            >
                Hapus
            </button>
        @endif
    @endif
</div>