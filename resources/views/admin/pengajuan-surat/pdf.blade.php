<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Rekap Pengajuan Surat</title>
    <style>
        /* Simulasi Desain Tailwind CSS */
        @page {
            margin: 1.5cm;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #1e293b;
            /* slate-800 */
            line-height: 1.5;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #e2e8f0;
            /* slate-200 */
            padding-bottom: 20px;
        }

        h2 {
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #0f172a;
            /* slate-900 */
            margin-bottom: 5px;
        }

        .meta {
            font-size: 11px;
            color: #64748b;
            /* slate-500 */
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
        }

        th {
            background-color: #f8fafc;
            /* slate-50 */
            color: #475569;
            /* slate-600 */
            font-weight: bold;
            text-align: left;
            text-transform: uppercase;
            border-bottom: 2px solid #e2e8f0;
            padding: 12px 8px;
        }

        td {
            padding: 10px 8px;
            border-bottom: 1px solid #f1f5f9;
            /* slate-100 */
        }

        .badge {
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }

        /* Status Colors */
        .status-selesai {
            background-color: #ecfdf5;
            color: #059669;
        }

        .status-menunggu {
            background-color: #f0f9ff;
            color: #0284c7;
        }

        .status-diproses {
            background-color: #fffbeb;
            color: #d97706;
        }

        .status-ditolak {
            background-color: #fef2f2;
            color: #dc2626;
        }

        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 10px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h2>Rekap Pengajuan Surat</h2>
        <p class="meta">Laporan Sistem Informasi Kependudukan Digital</p>
        <p class="meta">Dicetak pada: {{ now()->translatedFormat('d F Y H:i') }} WIB</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%">No</th>
                <th style="width: 25%">Nama Pemohon</th>
                <th style="width: 20%">NIK</th>
                <th style="width: 25%">Jenis Surat</th>
                <th style="width: 15%">Tanggal</th>
                <th style="width: 10%">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $key => $item)
                <tr>
                    <td style="text-align: center">{{ $key + 1 }}</td>
                    <td><strong>{{ $item->nama_pemohon }}</strong></td>
                    <td>{{ $item->nik }}</td>
                    <td>{{ $item->jenis_surat_nama }}</td>
                    <td>{{ \Carbon\Carbon::parse($item->tanggal_pengajuan)->translatedFormat('d/m/Y') }}</td>
                    <td>
                        {{-- Logika Badge Warna --}}
                        @php
                            $class = match ($item->status) {
                                'Selesai' => 'status-selesai',
                                'Menunggu' => 'status-menunggu',
                                'Diproses' => 'status-diproses',
                                'Ditolak' => 'status-ditolak',
                                default => ''
                            };
                        @endphp
                        <span class="badge {{ $class }}">{{ $item->status }}</span>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Dokumen ini dihasilkan secara otomatis oleh Sistem Desa Digital - &copy; {{ date('Y') }}
    </div>
</body>

</html>