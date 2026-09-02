<!DOCTYPE html>
<html>
<head>
    <title>Laporan Data Kartu Keluarga</title>
    <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
        th { background-color: #f2f2f2; }
        h2 { text-align: center; font-family: sans-serif; }
    </style>
</head>
<body>
    <h2>Laporan Data Kartu Keluarga</h2>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nomor KK</th>
                <th>Kepala Keluarga</th>
                <th>Alamat</th>
                <th>Jumlah Anggota</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $item->nomor_kk }}</td>
                <td>{{ $item->nama_kepala_keluarga }}</td>
                <td>{{ $item->alamat_keluarga }}</td>
                <td>{{ $item->anggota_count }} Orang</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>