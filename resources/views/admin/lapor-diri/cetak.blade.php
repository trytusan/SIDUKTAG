<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulir Lapor Diri - {{ $laporDiri->nama_lengkap }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 15mm 20mm;
        }
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.3;
            color: #000;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 8px;
            margin-bottom: 12px;
        }
        .header h3 {
            margin: 0;
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .header h2 {
            margin: 2px 0;
            font-size: 16pt;
            font-weight: bold;
            text-transform: uppercase;
        }
        .header p {
            margin: 0;
            font-size: 10pt;
            font-style: italic;
        }
        .doc-title {
            text-align: center;
            margin: 12px 0;
        }
        .doc-title h4 {
            margin: 0;
            font-size: 13pt;
            text-decoration: underline;
            text-transform: uppercase;
            font-weight: bold;
        }
        .section-title {
            font-weight: bold;
            font-size: 11pt;
            margin-top: 10px;
            margin-bottom: 4px;
            text-transform: uppercase;
        }
        table.form-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 6px;
        }
        table.form-table td {
            vertical-align: top;
            padding: 2px 0;
            font-size: 11pt;
        }
        td.col-num {
            width: 25px;
        }
        td.col-label {
            width: 200px;
        }
        td.col-colon {
            width: 15px;
        }
        span.box {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 1px solid #000;
            margin-right: 4px;
            text-align: center;
            line-height: 12px;
            font-size: 9pt;
            font-weight: bold;
        }
        span.box.checked {
            background-color: #000;
            color: #fff;
        }
        span.option-item {
            display: inline-block;
            margin-right: 15px;
        }
        table.data-grid {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
            margin-bottom: 8px;
        }
        table.data-grid th, table.data-grid td {
            border: 1px solid #000;
            padding: 4px 6px;
            font-size: 10pt;
        }
        table.data-grid th {
            background-color: #f2f2f2;
            text-align: center;
        }
        .statement {
            margin-top: 10px;
            margin-bottom: 14px;
            font-size: 10pt;
            font-style: italic;
            text-align: justify;
        }
        table.signature-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 14px;
            text-align: center;
        }
        table.signature-table td {
            vertical-align: top;
            font-size: 11pt;
        }
        .no-print {
            position: fixed;
            top: 15px;
            right: 20px;
            background: #059669;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-family: sans-serif;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: none;
        }
        @media print {
            .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body>

    <button onclick="window.print()" class="no-print">🖨️ Cetak Formulir (Print A4)</button>

    <div class="header">
        <h3>PEMERINTAH KOTA DENPASAR</h3>
        <h3>KECAMATAN DENPASAR TIMUR - KELURAHAN PENATIH</h3>
        <h2>BANJAR SABA PENATIH</h2>
        <p>Sekretariat: Jl. Trenggana, Lingkungan Saba, Kelurahan Penatih, Denpasar Timur, Bali 80238</p>
    </div>

    <div class="doc-title">
        <h4>FORMULIR LAPOR DIRI WARGA BARU / PENDATANG</h4>
    </div>

    <!-- A. DATA PRIBADI -->
    <div class="section-title">A. DATA PRIBADI</div>
    <table class="form-table">
        <tr>
            <td class="col-num">1.</td>
            <td class="col-label">Nama Lengkap</td>
            <td class="col-colon">:</td>
            <td class="col-value"><strong>{{ strtoupper($laporDiri->nama_lengkap) }}</strong></td>
        </tr>
        <tr>
            <td class="col-num">2.</td>
            <td class="col-label">Jenis Kelamin</td>
            <td class="col-colon">:</td>
            <td class="col-value">
                <span class="option-item"><span class="box {{ $laporDiri->jenis_kelamin === 'Laki-Laki' ? 'checked' : '' }}">{!! $laporDiri->jenis_kelamin === 'Laki-Laki' ? '&#10003;' : '' !!}</span> Laki-Laki</span>
                <span class="option-item"><span class="box {{ $laporDiri->jenis_kelamin === 'Perempuan' ? 'checked' : '' }}">{!! $laporDiri->jenis_kelamin === 'Perempuan' ? '&#10003;' : '' !!}</span> Perempuan</span>
            </td>
        </tr>
        <tr>
            <td class="col-num">3.</td>
            <td class="col-label">Tempat/ Tanggal Lahir</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->tempat_lahir }}, {{ $laporDiri->tanggal_lahir ? $laporDiri->tanggal_lahir->format('d-m-Y') : '-' }}</td>
        </tr>
        <tr>
            <td class="col-num">4.</td>
            <td class="col-label">Agama</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->agama }}</td>
        </tr>
        <tr>
            <td class="col-num">5.</td>
            <td class="col-label">Status Perkawinan</td>
            <td class="col-colon">:</td>
            <td class="col-value">
                <span class="option-item"><span class="box {{ $laporDiri->status_perkawinan === 'Belum Kawin' ? 'checked' : '' }}">{!! $laporDiri->status_perkawinan === 'Belum Kawin' ? '&#10003;' : '' !!}</span> Belum Kawin</span>
                <span class="option-item"><span class="box {{ $laporDiri->status_perkawinan === 'Kawin' ? 'checked' : '' }}">{!! $laporDiri->status_perkawinan === 'Kawin' ? '&#10003;' : '' !!}</span> Kawin</span>
                <span class="option-item"><span class="box {{ $laporDiri->status_perkawinan === 'Cerai Hidup' ? 'checked' : '' }}">{!! $laporDiri->status_perkawinan === 'Cerai Hidup' ? '&#10003;' : '' !!}</span> Cerai Hidup</span>
                <span class="option-item"><span class="box {{ $laporDiri->status_perkawinan === 'Cerai Mati' ? 'checked' : '' }}">{!! $laporDiri->status_perkawinan === 'Cerai Mati' ? '&#10003;' : '' !!}</span> Cerai Mati</span>
            </td>
        </tr>
        <tr>
            <td class="col-num">6.</td>
            <td class="col-label">Pekerjaan</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->pekerjaan }}</td>
        </tr>
        <tr>
            <td class="col-num">7.</td>
            <td class="col-label">Nomor Induk Kependudukan (NIK)</td>
            <td class="col-colon">:</td>
            <td class="col-value"><strong>{{ $laporDiri->nik }}</strong></td>
        </tr>
        <tr>
            <td class="col-num">8.</td>
            <td class="col-label">Nomor Kartu Keluarga (KK)</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->nomor_kk ?? '-' }}</td>
        </tr>
        <tr>
            <td class="col-num">9.</td>
            <td class="col-label">Nomor Telp/ Hp</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->nomor_telepon ?? '-' }}</td>
        </tr>
    </table>

    <!-- B. DATA TEMPAT TINGGAL BARU -->
    <div class="section-title">B. DATA TEMPAT TINGGAL BARU (DI BANJAR SABA PENATIH)</div>
    <table class="form-table">
        <tr>
            <td class="col-num">1.</td>
            <td class="col-label">Alamat Lengkap</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->alamat_baru }}</td>
        </tr>
        <tr>
            <td class="col-num">2.</td>
            <td class="col-label">Tanggal Tinggal di Alamat Baru</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->tanggal_mulai_tinggal ? $laporDiri->tanggal_mulai_tinggal->format('d-m-Y') : '-' }}</td>
        </tr>
        <tr>
            <td class="col-num">3.</td>
            <td class="col-label">Status Tempat Tinggal</td>
            <td class="col-colon">:</td>
            <td class="col-value">
                <span class="option-item"><span class="box {{ $laporDiri->status_tempat_tinggal === 'Milik Sendiri' ? 'checked' : '' }}">{!! $laporDiri->status_tempat_tinggal === 'Milik Sendiri' ? '&#10003;' : '' !!}</span> Milik Sendiri</span>
                <span class="option-item"><span class="box {{ $laporDiri->status_tempat_tinggal === 'Kontrak/Sewa' ? 'checked' : '' }}">{!! $laporDiri->status_tempat_tinggal === 'Kontrak/Sewa' ? '&#10003;' : '' !!}</span> Kontrak/Sewa</span>
                <span class="option-item"><span class="box {{ $laporDiri->status_tempat_tinggal === 'Numpang' ? 'checked' : '' }}">{!! $laporDiri->status_tempat_tinggal === 'Numpang' ? '&#10003;' : '' !!}</span> Numpang</span>
                <span class="option-item"><span class="box {{ $laporDiri->status_tempat_tinggal === 'Kost' ? 'checked' : '' }}">{!! $laporDiri->status_tempat_tinggal === 'Kost' ? '&#10003;' : '' !!}</span> Kost</span>
            </td>
        </tr>
        <tr>
            <td class="col-num">4.</td>
            <td class="col-label">Nama Pemilik Rumah / Kos</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->nama_pemilik_rumah ?? '-' }}</td>
        </tr>
        <tr>
            <td class="col-num">5.</td>
            <td class="col-label">Nomor Kontak Pemilik Rumah</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->nomor_kontak_pemilik ?? '-' }}</td>
        </tr>
    </table>

    <!-- C. DATA ASAL -->
    <div class="section-title">C. DATA ASAL</div>
    <table class="form-table">
        <tr>
            <td class="col-num">1.</td>
            <td class="col-label">Alamat Asal</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->alamat_asal }}</td>
        </tr>
        <tr>
            <td class="col-num">2.</td>
            <td class="col-label">RT/RW / Dusun Asal</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->rt_rw_asal ?? '-' }}</td>
        </tr>
        <tr>
            <td class="col-num">3.</td>
            <td class="col-label">Kelurahan / Desa Asal</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->kelurahan_asal ?? '-' }}</td>
        </tr>
        <tr>
            <td class="col-num">4.</td>
            <td class="col-label">Kecamatan Asal</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->kecamatan_asal ?? '-' }}</td>
        </tr>
        <tr>
            <td class="col-num">5.</td>
            <td class="col-label">Kota / Kabupaten Asal</td>
            <td class="col-colon">:</td>
            <td class="col-value">{{ $laporDiri->kota_kabupaten_asal ?? '-' }}</td>
        </tr>
    </table>

    <!-- D. ANGGOTA KELUARGA YANG IKUT PINDAH -->
    <div class="section-title">D. ANGGOTA KELUARGA YANG IKUT PINDAH</div>
    <table class="data-grid">
        <thead>
            <tr>
                <th style="width: 30px;">No</th>
                <th>Nama</th>
                <th style="width: 140px;">NIK</th>
                <th>Tempat, Tanggal Lahir</th>
                <th style="width: 120px;">Hubungan Keluarga</th>
            </tr>
        </thead>
        <tbody>
            @forelse($laporDiri->anggota as $idx => $ang)
                <tr>
                    <td style="text-align: center;">{{ $idx + 1 }}</td>
                    <td>{{ $ang->nama }}</td>
                    <td style="text-align: center;">{{ $ang->nik ?? '-' }}</td>
                    <td>{{ $ang->tempat_lahir ? $ang->tempat_lahir . ', ' : '' }}{{ $ang->tanggal_lahir ? $ang->tanggal_lahir->format('d-m-Y') : '-' }}</td>
                    <td>{{ $ang->hubungan_keluarga ?? '-' }}</td>
                </tr>
            @empty
                @for($i = 1; $i <= 3; $i++)
                    <tr>
                        <td style="text-align: center; color: #aaa;">{{ $i }}</td>
                        <td>-</td>
                        <td style="text-align: center;">-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                @endfor
            @endforelse
        </tbody>
    </table>

    <!-- E. DOKUMEN YANG DILAMPIRKAN -->
    <div class="section-title">E. DOKUMEN YANG DILAMPIRKAN</div>
    <table class="form-table" style="margin-left: 10px;">
        <tr>
            <td style="width: 25px;"><span class="box {{ $laporDiri->lampiran_ktp ? 'checked' : '' }}">{!! $laporDiri->lampiran_ktp ? '&#10003;' : '' !!}</span></td>
            <td>1. Fotokopi Kartu Tanda Penduduk (KTP)</td>
        </tr>
        <tr>
            <td><span class="box {{ $laporDiri->lampiran_kk ? 'checked' : '' }}">{!! $laporDiri->lampiran_kk ? '&#10003;' : '' !!}</span></td>
            <td>2. Fotokopi Kartu Keluarga (KK)</td>
        </tr>
        <tr>
            <td><span class="box {{ $laporDiri->lampiran_surat_pindah ? 'checked' : '' }}">{!! $laporDiri->lampiran_surat_pindah ? '&#10003;' : '' !!}</span></td>
            <td>3. Surat Keterangan Pindah dari daerah asal (Jika Ada)</td>
        </tr>
        <tr>
            <td><span class="box {{ $laporDiri->lampiran_ttd || $laporDiri->tanda_tangan ? 'checked' : '' }}">{!! ($laporDiri->lampiran_ttd || $laporDiri->tanda_tangan) ? '&#10003;' : '' !!}</span></td>
            <td>4. Tanda Tangan Digital / Berkas Tanda Tangan Pelapor</td>
        </tr>
    </table>

    <!-- F. PERNYATAAN -->
    <div class="section-title">F. PERNYATAAN</div>
    <div class="statement">
        Dengan Ini saya menyatakan bahwa data yang saya isi adalah benar adanya. Jika dikemudian hari ditemukan ketidaksesuaian, saya bersedia bertanggung jawab sesuai dengan aturan yang berlaku.
    </div>

    <!-- Tanda Tangan -->
    <table class="signature-table">
        <tr>
            <td style="width: 50%;">
                Mengetahui,<br>
                <strong>Kelian Banjar Saba Penatih</strong>
                <br><br><br><br>
                ( ___________________________ )
            </td>
            <td style="width: 50%;">
                Denpasar, {{ $laporDiri->tanggal_lapor ? $laporDiri->tanggal_lapor->format('d F Y') : date('d F Y') }}<br>
                Pelapor,
                <br>
                @if($laporDiri->tanda_tangan)
                    <div style="height: 60px; line-height: 60px; margin: 2px 0;">
                        <img src="{{ asset('storage/' . $laporDiri->tanda_tangan) }}" alt="Tanda Tangan Pelapor" style="max-height: 55px; max-width: 140px; vertical-align: middle;">
                    </div>
                @else
                    <br><br><br><br>
                @endif
                <strong><u>{{ strtoupper($laporDiri->nama_lengkap) }}</u></strong>
            </td>
        </tr>
    </table>

</body>
</html>
