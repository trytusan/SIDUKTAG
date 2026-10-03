<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rekapitulasi Lapor Diri Warga Baru - Banjar Saba Penatih</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 12mm 15mm;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 9pt;
            color: #1e293b;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 8px;
            margin-bottom: 15px;
        }
        .header h2 {
            margin: 0;
            font-size: 14pt;
        }
        .header p {
            margin: 2px 0 0 0;
            font-size: 8pt;
            color: #64748b;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #cbd5e1;
            padding: 5px 6px;
            text-align: left;
        }
        th {
            background-color: #f1f5f9;
            font-size: 8.5pt;
            text-transform: uppercase;
        }
        .text-center { text-align: center; }
        .footer {
            margin-top: 25px;
            width: 100%;
        }
        .footer td {
            border: none;
            text-align: center;
            font-size: 9.5pt;
        }
    </style>
</head>
<body>

    <div class="header">
        <h2>REKAPITULASI LAPOR DIRI WARGA BARU / PENDATANG</h2>
        <p>BANJAR SABA PENATIH - KELURAHAN PENATIH, KECAMATAN DENPASAR TIMUR</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 25px;" class="text-center">No</th>
                <th>Nama Pelapor</th>
                <th style="width: 60px;" class="text-center">Warga</th>
                <th style="width: 110px;">NIK / No. Paspor</th>
                <th>Alamat Baru di Banjar</th>
                <th style="width: 80px;">Status Hunian</th>
                <th>Daerah / Negara Asal</th>
                <th style="width: 90px;">Pekerjaan / Kegiatan</th>
                <th style="width: 55px;" class="text-center">Keluarga</th>
                <th style="width: 75px;" class="text-center">Tgl Lapor</th>
                <th style="width: 65px;" class="text-center">Status TTD</th>
            </tr>
        </thead>
        <tbody>
            @forelse($data as $idx => $item)
                <tr>
                    <td class="text-center">{{ $idx + 1 }}</td>
                    <td><strong>{{ $item->nama_lengkap }}</strong></td>
                    <td class="text-center">
                        <strong style="color: {{ $item->kewarganegaraan === 'WNA' ? '#7e22ce' : '#1d4ed8' }};">
                            {{ $item->kewarganegaraan ?? 'WNI' }}
                        </strong>
                    </td>
                    <td style="font-family: monospace;">
                        {{ $item->kewarganegaraan === 'WNA' ? ($item->nomor_paspor ?? '-') : ($item->nik ?? '-') }}
                    </td>
                    <td>{{ $item->alamat_baru }}</td>
                    <td>{{ $item->status_tempat_tinggal }}</td>
                    <td>{{ $item->kewarganegaraan === 'WNA' ? ($item->negara_asal ?? 'Asing') : ($item->kota_kabupaten_asal ?? '-') }}</td>
                    <td>
                        {{ $item->kewarganegaraan === 'WNA' ? ($item->status_bekerja ?? '-') : ($item->pekerjaan ?? '-') }}
                        @if($item->kewarganegaraan === 'WNA' && $item->status_bekerja === 'Bekerja' && $item->nama_perusahaan)
                            <div style="font-size: 7.5pt; color: #64748b;">{{ $item->nama_perusahaan }}</div>
                        @endif
                    </td>
                    <td class="text-center">{{ $item->anggota->count() }} Jiwa</td>
                    <td class="text-center">{{ $item->tanggal_lapor ? $item->tanggal_lapor->format('d/m/Y') : '-' }}</td>
                    <td class="text-center">{{ $item->tanda_tangan || $item->lampiran_ttd ? 'Lengkap' : 'Belum' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="11" class="text-center" style="padding: 20px; color: #94a3b8;">
                        Tidak ada data lapor diri warga baru yang ditemukan.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <table class="footer">
        <tr>
            <td style="width: 60%;"></td>
            <td style="width: 40%;">
                Denpasar, {{ date('d F Y') }}<br>
                <strong>Kelian Banjar Saba Penatih</strong>
                <br><br><br><br>
                ( ___________________________ )
            </td>
        </tr>
    </table>

</body>
</html>
