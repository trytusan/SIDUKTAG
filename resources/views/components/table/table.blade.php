@props([
    'headers' => [],
    'emptyText' => 'Belum ada data tersedia.',
])

<style>
    .responsive-table table {
        width: 100%;
    }

    @media (max-width: 768px) {
        .responsive-table td {
            white-space: normal !important;
            word-break: break-word !important;
        }

        .responsive-table table {
            min-width: max-content;
        }
    }
</style>

@php
    $tableScrollId = 'table-scroll-' . uniqid();
@endphp

<div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm responsive-table">
    <div class="flex items-center justify-between gap-3 px-4 py-3 lg:hidden">
        <div class="inline-flex items-center gap-2 rounded-full bg-slate-950/5 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            Geser tabel untuk melihat kolom kanan
            <span class="text-slate-400">›</span>
        </div>
    </div>

    <div class="overflow-x-auto px-4 pb-3" id="{{ $tableScrollId }}">
        <table class="divide-y divide-slate-200 table-auto">
            <thead class="bg-slate-50">
                <tr>
                    @foreach($headers as $header)
                        <th class="whitespace-nowrap px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                            {{ $header }}
                        </th>
                    @endforeach
                </tr>
            </thead>

            <tbody class="divide-y divide-slate-100 bg-white text-center">
                {{ $slot }}

                @if(trim($slot) === '')
                    <tr>
                        <td colspan="{{ count($headers) }}" class="px-6 py-10 text-center text-sm text-slate-500">
                            {{ $emptyText }}
                        </td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>

    <div class="flex items-center justify-end gap-2 px-4 pb-4 lg:hidden">
        <button
            type="button"
            aria-label="Geser kiri"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            onclick="document.getElementById('{{ $tableScrollId }}').scrollBy({ left: -240, behavior: 'smooth' })"
        >
            ‹
        </button>
        <button
            type="button"
            aria-label="Geser kanan"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            onclick="document.getElementById('{{ $tableScrollId }}').scrollBy({ left: 240, behavior: 'smooth' })"
        >
            ›
        </button>
    </div>
</div>