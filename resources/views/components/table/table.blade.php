@props([
    'headers' => [],
    'emptyText' => 'Belum ada data tersedia.',
])

<div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
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
</div>