<div class="grid grid-cols-1 gap-5 md:grid-cols-2">

    {{-- 1. Pilih Penduduk (Nama Warga) --}}
    <div class="md:col-span-2">
        <x-form.select 
            label="Cari & Pilih Warga (Pemohon)" 
            name="penduduk_id" 
            :value="old('penduduk_id', $bantuan->penduduk_id ?? '')" 
            :options="$listPenduduk"
        />
    </div>

    {{-- 2. Pilih Jenis Bantuan --}}
    <x-form.select 
        label="Jenis Bantuan" 
        name="jenis_bantuan_filter" 
        id="jenis_bantuan_filter"
        :value="old('jenis_bantuan_filter', $bantuan->bantuan->jenis_bantuan ?? '')" 
        :options="$listJenis" 
    />

    {{-- 3. Pilih Nama Program --}}
    <x-form.select 
        label="Nama Program Bantuan" 
        name="bantuan_id" 
        id="bantuan_id" 
        :value="old('bantuan_id', $bantuan->bantuan_id ?? '')" 
        :options="isset($listProgramTerpilih) ? $listProgramTerpilih : ['' => 'Pilih Jenis Bantuan Terlebih Dahulu']" 
    />

    {{-- Status Pengajuan --}}
    <x-form.select label="Status Pengajuan" name="status_penerima" :value="old('status_penerima', $bantuan->status_penerima ?? 'Menunggu')" :options="[
        'Menunggu' => 'Menunggu Verifikasi',
        'Diterima' => 'Diterima',
        'Ditolak' => 'Ditolak',
        'Selesai' => 'Selesai'
    ]" />

    {{-- Tanggal Menerima --}}
    <x-form.input type="date" label="Tanggal Verifikasi/Terima" name="tanggal_menerima"
        value="{{ old('tanggal_menerima', isset($bantuan->tanggal_menerima) ? $bantuan->tanggal_menerima->format('Y-m-d') : '') }}" />

    {{-- Catatan --}}
    <div class="md:col-span-2">
        <x-form.textarea label="Catatan Verifikasi" name="catatan"
            placeholder="Masukkan alasan atau catatan tambahan">{{ old('catatan', $bantuan->catatan ?? '') }}</x-form.textarea>
    </div>

</div>

<div class="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
    <a href="{{ route('admin.bantuan.index') }}"
        class="rounded-2xl border border-slate-300 px-8 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
        Batal
    </a>
    <button type="submit"
        class="rounded-2xl bg-slate-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800 shadow-sm">
        {{ isset($bantuan) ? 'Perbarui Pengajuan' : 'Simpan Pengajuan' }}
    </button>
</div>

{{-- Script tetap sama --}}
<script>
    const jenisSelect = document.getElementById('jenis_bantuan_filter');
    const programSelect = document.getElementById('bantuan_id');
    const currentBantuanId = "{{ old('bantuan_id', $bantuan->bantuan_id ?? '') }}";

    function fetchPrograms(jenis, selectedId = null) {
        if (!jenis) return;

        const url = `{{ route('admin.bantuan.get-programs') }}?type=${encodeURIComponent(jenis)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Simpan nilai lama sebelum dikosongkan jika ini muatan pertama
                const targetId = selectedId || programSelect.value;
                
                programSelect.innerHTML = '<option value="">Pilih Program</option>';
                
                data.forEach(program => {
                    const option = document.createElement('option');
                    option.value = program.id;
                    option.text = program.nama_program;

                    if (targetId && program.id == targetId) {
                        option.selected = true;
                    }

                    programSelect.add(option);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                programSelect.innerHTML = '<option value="">Gagal memuat data</option>';
            });
    }

    jenisSelect.addEventListener('change', function () {
        programSelect.innerHTML = '<option value="">Sedang memuat...</option>';
        fetchPrograms(this.value);
    });

    // Jalankan hanya saat pertama kali halaman dimuat (EDIT MODE)
    document.addEventListener('DOMContentLoaded', function () {
        if (jenisSelect.value) {
            // Kita tidak perlu mengosongkan dropdown di sini karena 
            // Controller sudah mengirim $listProgramTerpilih
            fetchPrograms(jenisSelect.value, currentBantuanId);
        }
    });
</script>