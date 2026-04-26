{{-- form.blade.php --}}
<div class="mb-8 flex flex-col items-center">
    <div class="mb-4 relative">
        <img
            id="preview_foto"
            src="{{ (isset($penduduk) && $penduduk->foto_profil) ? asset('storage/' . $penduduk->foto_profil) : 'https://ui-avatars.com/api/?name=' . urlencode(old('nama_lengkap', $penduduk->nama_lengkap ?? 'User')) . '&background=10b981&color=fff' }}"
            class="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
        />
    </div>

    <label class="cursor-pointer rounded-xl bg-emerald-100 px-5 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-200">
        {{ (isset($penduduk) && $penduduk->foto_profil) ? 'Ganti Foto' : 'Upload Foto Profil' }}
        <input type="file" name="foto_profil" accept="image/*" class="hidden" onchange="previewFotoProfil(event)" />
    </label>
    <p class="mt-2 text-[10px] text-slate-400">JPG/PNG/WEBP, Maks 2MB</p>
    @error('foto_profil') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
</div>

<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    {{-- Baris 1: Nama & NIK --}}
    <x-form.input label="Nama Lengkap" name="nama_lengkap" :value="old('nama_lengkap', $penduduk->nama_lengkap ?? '')" placeholder="Masukkan nama lengkap" />
    <x-form.input label="NIK" name="nik" :value="old('nik', $penduduk->nik ?? '')" placeholder="16 Digit NIK" />

    {{-- Baris 2: KK & Telepon --}}
    <x-form.input label="Nomor KK" name="nomor_kk" :value="old('nomor_kk', $penduduk->nomor_kk ?? '')" placeholder="16 Digit Nomor KK" />
    <x-form.input label="Nomor Telepon" name="nomor_telepon" :value="old('nomor_telepon', $penduduk->nomor_telepon ?? '')" placeholder="Contoh: 0812..." />

    {{-- Baris 3: Tempat & Tanggal Lahir --}}
    <x-form.input label="Tempat Lahir" name="tempat_lahir" :value="old('tempat_lahir', $penduduk->tempat_lahir ?? '')" placeholder="Kota Lahir" />
    <x-form.input type="date" label="Tanggal Lahir" name="tanggal_lahir" :value="old('tanggal_lahir', isset($penduduk->tanggal_lahir) ? \Carbon\Carbon::parse($penduduk->tanggal_lahir)->format('Y-m-d') : '')" />

    {{-- Baris 4: Jenis Kelamin & Agama --}}
    <x-form.select label="Jenis Kelamin" name="jenis_kelamin" :value="old('jenis_kelamin', $penduduk->jenis_kelamin ?? '')" 
        :options="['' => 'Pilih', 'Laki-laki' => 'Laki-laki', 'Perempuan' => 'Perempuan']" />
    
    <x-form.select label="Agama" name="agama" :value="old('agama', $penduduk->agama ?? '')" 
        :options="['' => 'Pilih', 'Islam'=>'Islam', 'Kristen'=>'Kristen', 'Katolik'=>'Katolik', 'Hindu'=>'Hindu', 'Buddha'=>'Buddha', 'Konghucu'=>'Konghucu']" />

    {{-- Baris 5: Pekerjaan & Status Perkawinan --}}
    <x-form.input label="Pekerjaan" name="pekerjaan" :value="old('pekerjaan', $penduduk->pekerjaan ?? '')" placeholder="Pekerjaan" />

    <x-form.select label="Status Perkawinan" name="status_perkawinan" :value="old('status_perkawinan', $penduduk->status_perkawinan ?? '')" 
        :options="['' => 'Pilih', 'Belum Kawin'=>'Belum Kawin', 'Kawin'=>'Kawin', 'Cerai Hidup'=>'Cerai Hidup', 'Cerai Mati'=>'Cerai Mati']" />

    {{-- Baris 6: Pendidikan & Status Keluarga --}}
    <x-form.select label="Pendidikan" name="pendidikan_terakhir" :value="old('pendidikan_terakhir', $penduduk->pendidikan_terakhir ?? '')" 
        :options="['' => 'Pilih', 'SD'=>'SD', 'SMP'=>'SMP', 'SMA/SMK'=>'SMA/SMK', 'D3'=>'D3', 'S1'=>'S1', 'S2'=>'S2', 'S3'=>'S3']" />

    <x-form.select label="Status Keluarga" name="status_dalam_keluarga" :value="old('status_dalam_keluarga', $penduduk->status_dalam_keluarga ?? '')" 
        :options="['' => 'Pilih', 'Kepala Keluarga'=>'Kepala Keluarga', 'Istri'=>'Istri', 'Anak'=>'Anak', 'Lainnya'=>'Lainnya']" />

    {{-- Baris 7: Status Kependudukan & Dokumen --}}
    <x-form.select label="Status Kependudukan" name="status_kependudukan" :value="old('status_kependudukan', $penduduk->status_kependudukan ?? '')" 
        :options="['' => 'Pilih', 'Tetap'=>'Tetap', 'Pendatang'=>'Pendatang', 'Pindah'=>'Pindah', 'Meninggal'=>'Meninggal']" />

    {{-- Bagian Dokumen KTP/Pendukung di dalam form.blade.php --}}
    <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 flex flex-col justify-center">
        <label class="mb-2 block text-sm font-bold text-slate-800">Dokumen KTP/Pendukung</label>
        
        <input 
            type="file" 
            name="dokumen" 
            id="dokumen"
            accept=".pdf,image/*" 
            class="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-bold hover:file:bg-emerald-100 transition" 
        />

        {{-- Logika untuk menampilkan data lama --}}
        @if(isset($penduduk) && $penduduk->dokumen_pendukung)
            <div class="mt-3 flex items-center gap-2 rounded-lg bg-white p-2 border border-slate-200">
                <div class="flex h-8 w-8 items-center justify-center rounded bg-emerald-50 text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div class="flex flex-col overflow-hidden">
                    <span class="text-[10px] text-slate-400 leading-none">File saat ini:</span>
                    <a href="{{ asset('storage/' . $penduduk->dokumen_pendukung) }}" target="_blank" class="text-xs font-medium text-emerald-600 hover:underline truncate">
                        {{ basename($penduduk->dokumen_pendukung) }}
                    </a>
                </div>
            </div>
        @else
            <p class="mt-2 text-[10px] text-slate-400 italic">Belum ada dokumen yang diunggah.</p>
        @endif

        @error('dokumen') 
            <p class="mt-1 text-xs text-red-500">{{ $message }}</p> 
        @enderror
    </div>

    {{-- Baris 8: Alamat Lengkap --}}
    <div class="md:col-span-2">
        <x-form.textarea label="Alamat Lengkap" name="alamat_lengkap" placeholder="Alamat Domisili">
            {{ old('alamat_lengkap', $penduduk->alamat_lengkap ?? '') }}
        </x-form.textarea>
    </div>

    {{-- Baris 9: Geotagging --}}
    <div class="md:col-span-2">
        <label class="mb-2 block text-sm font-bold text-slate-800">Titik Lokasi Geotagging (Rumah)</label>
        <div id="map" class="h-80 w-full rounded-2xl border border-slate-200 z-0"></div>
        <div class="grid grid-cols-2 gap-4 mt-3">
            <x-form.input label="Latitude" name="latitude" id="lat" :value="old('latitude', $penduduk->latitude ?? '')" readonly />
            <x-form.input label="Longitude" name="longitude" id="lng" :value="old('longitude', $penduduk->longitude ?? '')" readonly />
        </div>
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

<script>
    document.addEventListener('DOMContentLoaded', function() {
        let latVal = "{{ $penduduk->latitude ?? '' }}";
        let lngVal = "{{ $penduduk->longitude ?? '' }}";
        
        let initialLat = latVal ? parseFloat(latVal) : -8.1176;
        let initialLng = lngVal ? parseFloat(lngVal) : 115.0903;

        const zoomLevel = latVal ? 18 : 13;
        const map = L.map('map').setView([initialLat, initialLng], zoomLevel);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        const marker = L.marker([initialLat, initialLng], {
            draggable: true
        }).addTo(map);

        function setCoords(lat, lng) {
            document.getElementById('lat').value = lat.toFixed(8);
            document.getElementById('lng').value = lng.toFixed(8);
        }

        marker.on('dragend', function(e) {
            setCoords(marker.getLatLng().lat, marker.getLatLng().lng);
        });

        map.on('click', function(e) {
            marker.setLatLng(e.latlng);
            setCoords(e.latlng.lat, e.latlng.lng);
        });

        setTimeout(() => { map.invalidateSize(); }, 500);
    });

    function previewFotoProfil(event) {
        const reader = new FileReader();
        reader.onload = function() {
            document.getElementById('preview_foto').src = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
</script>