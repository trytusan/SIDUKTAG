<!DOCTYPE html>
<html>
<head>
    <title>Biodata Penduduk - {{ $penduduk->nama_lengkap }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.5; }
        .kop { text-align: center; border-bottom: 3px double #000; pb: 10px; mb: 20px; }
        .foto { width: 120px; height: 150px; border: 1px solid #ccc; position: absolute; right: 0; top: 120px; }
        .title { text-align: center; text-decoration: underline; font-size: 16px; font-weight: bold; margin-bottom: 30px; }
        table { width: 80%; border: none; }
        table td { padding: 5px; vertical-align: top; }
        .label { width: 180px; font-weight: bold; }
        .titik { width: 10px; }
    </style>
</head>
<body>
    <div class="kop">
        <h2 style="margin:0">PEMERINTAH KABUPATEN BULELENG</h2>
        <h3 style="margin:0">KECAMATAN DESA DIGITAL</h3>
        <p style="margin:5px 0">Jl. Raya Utama No. 1, Kode Pos 81111</p>
    </div>

    <div class="title">BIODATA PENDUDUK</div>

    @if($penduduk->foto_profil)
        <img src="{{ public_path('storage/' . $penduduk->foto_profil) }}" class="foto">
    @endif

    <table>
        <tr>
            <td class="label">Nama Lengkap</td>
            <td class="titik">:</td>
            <td>{{ strtoupper($penduduk->nama_lengkap) }}</td>
        </tr>
        <tr>
            <td class="label">NIK</td>
            <td class="titik">:</td>
            <td>{{ $penduduk->nik }}</td>
        </tr>
        <tr>
            <td class="label">Nomor KK</td>
            <td class="titik">:</td>
            <td>{{ $penduduk->nomor_kk }}</td>
        </tr>
        <tr>
            <td class="label">Tempat, Tgl Lahir</td>
            <td class="titik">:</td>
            <td>{{ $penduduk->tempat_lahir }}, {{ $penduduk->tanggal_lahir->format('d-m-Y') }}</td>
        </tr>
        <tr>
            <td class="label">Jenis Kelamin</td>
            <td class="titik">:</td>
            <td>{{ $penduduk->jenis_kelamin }}</td>
        </tr>
        <tr>
            <td class="label">Agama</td>
            <td class="titik">:</td>
            <td>{{ $penduduk->agama }}</td>
        </tr>
        <tr>
            <td class="label">Pekerjaan</td>
            <td class="titik">:</td>
            <td>{{ $penduduk->pekerjaan }}</td>
        </tr>
        <tr>
            <td class="label">Status Kawin</td>
            <td class="titik">:</td>
            <td>{{ $penduduk->status_perkawinan }}</td>
        </tr>
        <tr>
            <td class="label">Pendidikan</td>
            <td class="titik">:</td>
            <td>{{ $penduduk->pendidikan_terakhir }}</td>
        </tr>
        <tr>
            <td class="label">Alamat</td>
            <td class="titik">:</td>
            <td>{{ $penduduk->alamat_lengkap }}</td>
        </tr>
    </table>

    <div style="margin-top: 50px; float: right; width: 200px; text-align: center;">
        <p>Buleleng, {{ date('d F Y') }}</p>
        <p>Petugas Registrasi,</p>
        <br><br><br>
        <p><strong>( ________________ )</strong></p>
    </div>
</body>
</html>