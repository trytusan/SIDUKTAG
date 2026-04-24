<!DOCTYPE html>
<html>
<head>
    <title>Laporan Penerima Bantuan</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: center; }
        th { bg-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>LAPORAN DATA PENERIMA BANTUAN</h2>
        <p>Tanggal Dicetak: {{ date('d F Y') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Penerima</th>
                <th>NIK</th>
                <th>Nomor KK</th>
                <th>Program Bantuan</th>
                <th>Jenis Bantuan</th>
                <th>Tanggal Terima</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $index => $item)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $item->penduduk->nama_lengkap ?? ($item->penduduk->nama ?? '-') }}</td>
                    <td>'{{ $item->penduduk->nik ?? '-' }}</td> {{-- Tanda kutip agar tidak jadi angka ilmiah di excel/pdf --}}
                    <td>'{{ $item->penduduk->nomor_kk ?? '-' }}</td>
                    <td>{{ $item->bantuan->nama_program ?? '-' }}</td>
                    <td>{{ $item->bantuan->jenis_bantuan ?? '-' }}</td>
                    <td>{{ $item->tanggal_menerima ? $item->tanggal_menerima->format('d/m/Y') : '-' }}</td>
                    <td>{{ $item->status_penerima }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>