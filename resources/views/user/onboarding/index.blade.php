<x-layouts.user title="Lengkapi Data" pageTitle="Lengkapi Data Diri">

    <div class="max-w-4xl mx-auto">

        <!-- Progress -->
        <div class="mb-8">
            <div class="flex items-center justify-between text-sm text-slate-500">
                <span>Data Pribadi</span>
                <span>Alamat</span>
                <span>Dokumen</span>
            </div>

            <div class="mt-2 h-2 w-full rounded-full bg-slate-200">
                <div class="h-2 w-1/3 rounded-full bg-emerald-500"></div>
            </div>
        </div>

        @include('user.onboarding.step-1')

    </div>

</x-layouts.user>