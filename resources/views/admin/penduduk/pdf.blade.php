<!DOCTYPE html>
<html>
<head>
    <title>Laporan Data Penduduk</title>
    <style>
        /* CSS Murni karena DomPDF tidak mendukung Tailwind secara penuh */
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table th, .table td { border: 1px solid #333; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; font-weight: bold; }
        .footer { margin-top: 30px; text-align: right; font-size: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>LAPORAN DATA PENDUDUK</h2>
        <p>Tanggal Cetak: {{ date('d/m/Y H:i') }}</p>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Lengkap</th>
                <th>NIK</th>
                <th>Jenis Kelamin</th>
                <th>Kategori Umur</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($penduduk as $index => $row)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $row->nama_lengkap }}</td>
                <td>{{ $row->nik }}</td>
                <td>{{ $row->jenis_kelamin }}</td>
                <td>{{ $row->kategori_umur }}</td>
                <td>{{ $row->status_kependudukan }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Dicetak secara otomatis oleh Sistem Kependudukan</p>
    </div>
</body>
</html>