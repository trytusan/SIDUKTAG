<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode OTP Verifikasi - SIDUKTAG</title>
    <style>
        body {
            font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            color: #334155;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 560px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .header {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            padding: 32px 24px;
            text-align: center;
            color: #ffffff;
        }
        .logo-badge {
            display: inline-block;
            width: 48px;
            height: 48px;
            line-height: 48px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 14px;
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 8px;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 4px 0 0;
            font-size: 12px;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
        }
        .content {
            padding: 32px 28px;
        }
        .greeting {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .desc {
            font-size: 14px;
            line-height: 1.6;
            color: #475569;
            margin-bottom: 24px;
        }
        .otp-box {
            background: #ecfdf5;
            border: 2px dashed #10b981;
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            margin: 24px 0;
        }
        .otp-code {
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 38px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #047857;
            display: inline-block;
            margin: 0;
        }
        .otp-exp {
            font-size: 12px;
            color: #059669;
            font-weight: 600;
            margin-top: 8px;
        }
        .warning-card {
            background-color: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 12px;
            padding: 14px 16px;
            margin-top: 24px;
            font-size: 12px;
            color: #92400e;
            line-height: 1.5;
        }
        .warning-card strong {
            color: #b45309;
        }
        .footer {
            background-color: #f1f5f9;
            padding: 20px 24px;
            text-align: center;
            font-size: 11px;
            color: #64748b;
            line-height: 1.6;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo-badge">S</div>
            <h1>SIDUKTAG</h1>
            <p>Sistem Terintegrasi Kependudukan Desa</p>
        </div>

        <!-- Body Content -->
        <div class="content">
            <div class="greeting">Halo, {{ $userName ?? 'Warga' }}!</div>
            <div class="desc">
                Kami menerima permintaan verifikasi untuk akun SIDUKTAG Anda. Gunakan kode OTP (One-Time Password) di bawah ini untuk melanjutkan:
            </div>

            <!-- OTP Code Card -->
            <div class="otp-box">
                <div class="otp-code">{{ $otp }}</div>
                <div class="otp-exp">⏱️ Berlaku selama 10 menit</div>
            </div>

            <!-- Warning Box -->
            <div class="warning-card">
                <strong>Penting:</strong> Jangan berikan kode OTP ini kepada siapapun, termasuk pihak yang mengaku sebagai petugas desa atau admin sistem. Demi keamanan akun Anda, pastikan Anda hanya memasukkan kode ini pada halaman resmi portal SIDUKTAG.
            </div>

            <div style="margin-top: 24px; font-size: 13px; color: #64748b; line-height: 1.5;">
                Jika Anda tidak merasa melakukan permintaan ini, mohon abaikan email ini. Password akun Anda tetap aman.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            Email ini dikirim secara otomatis oleh <strong>SIDUKTAG</strong><br>
            Banjar Dinas Dauh Munduk, Desa Bungkulan, Kec. Sawan, Kab. Buleleng, Bali.<br>
            &copy; {{ date('Y') }} SIDUKTAG. Seluruh Hak Cipta Dilindungi.
        </div>
    </div>
</body>
</html>

