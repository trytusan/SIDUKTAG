<div class="mb-8 flex flex-col items-center">
    <div class="mb-4 relative">
        <img
            id="preview_foto"
            src="{{ isset($penduduk) && $penduduk->foto_profil ? asset('storage/' . $penduduk->foto_profil) : 'https://ui-avatars.com/api/?name=' . urlencode(old('nama_lengkap', $penduduk->nama_lengkap ?? 'User')) . '&background=10b981&color=fff' }}"
            class="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
        />
    </div>

    <label class="cursor-pointer rounded-xl bg-emerald-100 px-5 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-200">
        {{ isset($penduduk->foto_profil) ? 'Ganti Foto' : 'Upload Foto Profil' }}
        <input type="file" name="foto_profil" accept="image/*" class="hidden" onchange="previewFotoProfil(event)" />
    </label>
    <p class="mt-2 text-[10px] text-slate-400">JPG/PNG/WEBP, Maks 2MB</p>
    @error('foto_profil')
        <p class="mt-2 text-sm text-red-500">{{ $message }}</p>
    @enderror
</div>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div>
        <x-form.input
            label="Nama Lengkap"
            name="nama_lengkap"
            :value="old('nama_lengkap', $penduduk->nama_lengkap ?? '')"
            placeholder="Masukkan nama lengkap"
        />
        @error('nama_lengkap') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
    </div>

    <div>
        <x-form.input
            label="NIK"
            name="nik"
            :value="old('nik', $penduduk->nik ?? '')"
            placeholder="Masukkan 16 digit NIK"
        />
        @error('nik') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
    </div>

    <div>
        <x-form.input
            label="Nomor KK"
            name="nomor_kk"
            :value="old('nomor_kk', $penduduk->nomor_kk ?? '')"
            placeholder="Masukkan 16 digit Nomor KK"
        />
        @error('nomor_kk') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
    </div>

    <div>
        <x-form.input
            label="Nomor Telepon"
            name="nomor_telepon"
            :value="old('nomor_telepon', $penduduk->nomor_telepon ?? '')"
            placeholder="Contoh: 08123456789"
        />
        @error('nomor_telepon') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
    </div>

    <div>
        <x-form.input
            label="Tempat Lahir"
            name="tempat_lahir"
            :value="old('tempat_lahir', $penduduk->tempat_lahir ?? '')"
            placeholder="Masukkan kota lahir"
        />
        @error('tempat_lahir') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
    </div>

    <div>
        <x-form.input
            type="date"
            label="Tanggal Lahir"
            name="tanggal_lahir"
            :value="old('tanggal_lahir', (isset($penduduk->tanggal_lahir) && $penduduk->tanggal_lahir instanceof \Carbon\Carbon) ? $penduduk->tanggal_lahir->format('Y-m-d') : (is_string($penduduk->tanggal_lahir ?? null) ? \Carbon\Carbon::parse($penduduk->tanggal_lahir)->format('Y-m-d') : ''))"
        />
        @error('tanggal_lahir') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
    </div>

    <div>
        <x-form.select
            label="Jenis Kelamin"
            name="jenis_kelamin"
            :options="['' => 'Pilih jenis kelamin', 'Laki-laki' => 'Laki-laki', 'Perempuan' => 'Perempuan']"
            :selected="old('jenis_kelamin', $penduduk->jenis_kelamin ?? '')"
        />
    </div>

    <div>
        <x-form.select
            label="Agama"
            name="agama"
            :options="['' => 'Pilih agama', 'Islam' => 'Islam', 'Kristen' => 'Kristen', 'Katolik' => 'Katolik', 'Hindu' => 'Hindu', 'Buddha' => 'Buddha', 'Konghucu' => 'Konghucu']"
            :selected="old('agama', $penduduk->agama ?? '')"
        />
    </div>

    <div>
        <x-form.select
            label="Status Perkawinan"
            name="status_perkawinan"
            :options="['' => 'Pilih status', 'Belum Kawin' => 'Belum Kawin', 'Kawin' => 'Kawin', 'Cerai Hidup' => 'Cerai Hidup', 'Cerai Mati' => 'Cerai Mati']"
            :selected="old('status_perkawinan', $penduduk->status_perkawinan ?? '')"
        />
    </div>

    <div>
        <x-form.input
            label="Pekerjaan"
            name="pekerjaan"
            :value="old('pekerjaan', $penduduk->pekerjaan ?? '')"
            placeholder="Contoh: Karyawan Swasta"
        />
    </div>

    <div>
        <x-form.select
            label="Pendidikan Terakhir"
            name="pendidikan_terakhir"
            :options="['' => 'Pilih pendidikan', 'Tidak Sekolah' => 'Tidak Sekolah', 'SD' => 'SD', 'SMP' => 'SMP', 'SMA/SMK' => 'SMA/SMK', 'D3' => 'D3', 'S1' => 'S1', 'S2' => 'S2', 'S3' => 'S3']"
            :selected="old('pendidikan_terakhir', $penduduk->pendidikan_terakhir ?? '')"
        />
    </div>

    <div>
        <x-form.select
            label="Status dalam Keluarga"
            name="status_dalam_keluarga"
            :options="['' => 'Pilih status', 'Kepala Keluarga' => 'Kepala Keluarga', 'Istri' => 'Istri', 'Anak' => 'Anak', 'Lainnya' => 'Lainnya']"
            :selected="old('status_dalam_keluarga', $penduduk->status_dalam_keluarga ?? '')"
        />
    </div>

    <div>
        <x-form.select
            label="Status Kependudukan"
            name="status_kependudukan"
            :options="['' => 'Pilih status', 'Tetap' => 'Tetap', 'Pendatang' => 'Pendatang', 'Pindah' => 'Pindah', 'Meninggal' => 'Meninggal']"
            :selected="old('status_kependudukan', $penduduk->status_kependudukan ?? '')"
        />
    </div>

    <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 flex flex-col justify-center">
        <label class="mb-2 block text-sm font-bold text-slate-800">
            Dokumen KTP/Pendukung
            @if(isset($penduduk->dokumen_pendukung))
                <span class="text-[10px] text-emerald-600 ml-2">(Sudah ada file)</span>
            @endif
        </label>
        
        <input 
            type="file" 
            name="dokumen" 
            accept=".pdf,image/*" 
            class="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-bold hover:file:bg-emerald-100"
        />

        <div class="mt-3 flex items-center justify-between">
            <span class="text-[10px] text-slate-400 italic">PDF/JPG/PNG, Max 4MB</span>
            @if(isset($penduduk->dokumen_pendukung))
                <a href="{{ asset('storage/' . $penduduk->dokumen_pendukung) }}" target="_blank" class="text-[10px] font-bold text-emerald-600 hover:underline">Lihat File &rarr;</a>
            @endif
        </div>
        @error('dokumen') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
    </div>

    <div class="md:col-span-2">
        <x-form.textarea
            label="Alamat Lengkap"
            name="alamat_lengkap"
            placeholder="Masukkan alamat lengkap sesuai domisili"
        >{{ old('alamat_lengkap', $penduduk->alamat_lengkap ?? '') }}
        </x-form.textarea>
    </div>
</div>

<div class="mt-10 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
    <a href="{{ route('admin.penduduk.index') }}" class="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50">
        Batal
    </a>
    <button type="submit" class="rounded-2xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 active:scale-95">
        Simpan Perubahan
    </button>
</div>
