<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('lapor_diris')) {
            // Ubah kolom nik, agama, pekerjaan, alamat_asal agar nullable untuk WNA
            DB::statement("ALTER TABLE `lapor_diris` MODIFY COLUMN `nik` VARCHAR(16) NULL;");
            DB::statement("ALTER TABLE `lapor_diris` MODIFY COLUMN `agama` VARCHAR(50) NULL;");
            DB::statement("ALTER TABLE `lapor_diris` MODIFY COLUMN `pekerjaan` VARCHAR(100) NULL;");
            DB::statement("ALTER TABLE `lapor_diris` MODIFY COLUMN `alamat_asal` TEXT NULL;");

            Schema::table('lapor_diris', function (Blueprint $table) {
                if (!Schema::hasColumn('lapor_diris', 'kewarganegaraan')) {
                    $table->enum('kewarganegaraan', ['WNI', 'WNA'])->default('WNI')->after('nama_lengkap');
                }
                if (!Schema::hasColumn('lapor_diris', 'negara_asal')) {
                    $table->string('negara_asal')->nullable()->after('kewarganegaraan');
                }
                if (!Schema::hasColumn('lapor_diris', 'nomor_paspor')) {
                    $table->string('nomor_paspor')->nullable()->after('negara_asal');
                }
                if (!Schema::hasColumn('lapor_diris', 'masa_berlaku_paspor')) {
                    $table->date('masa_berlaku_paspor')->nullable()->after('nomor_paspor');
                }
                if (!Schema::hasColumn('lapor_diris', 'jenis_izin_tinggal')) {
                    $table->string('jenis_izin_tinggal')->nullable()->after('masa_berlaku_paspor');
                }
                if (!Schema::hasColumn('lapor_diris', 'nomor_izin_tinggal')) {
                    $table->string('nomor_izin_tinggal')->nullable()->after('jenis_izin_tinggal');
                }
                if (!Schema::hasColumn('lapor_diris', 'masa_berlaku_izin')) {
                    $table->date('masa_berlaku_izin')->nullable()->after('nomor_izin_tinggal');
                }
                if (!Schema::hasColumn('lapor_diris', 'status_bekerja')) {
                    $table->string('status_bekerja', 50)->nullable()->after('pekerjaan');
                }
                if (!Schema::hasColumn('lapor_diris', 'nama_perusahaan')) {
                    $table->string('nama_perusahaan')->nullable()->after('status_bekerja');
                }
                if (!Schema::hasColumn('lapor_diris', 'jabatan_pekerjaan')) {
                    $table->string('jabatan_pekerjaan')->nullable()->after('nama_perusahaan');
                }
                if (!Schema::hasColumn('lapor_diris', 'nomor_dokumen_kerja')) {
                    $table->string('nomor_dokumen_kerja')->nullable()->after('jabatan_pekerjaan');
                }
                if (!Schema::hasColumn('lapor_diris', 'nama_penjamin')) {
                    $table->string('nama_penjamin')->nullable()->after('nomor_kontak_pemilik');
                }
                if (!Schema::hasColumn('lapor_diris', 'kategori_penjamin')) {
                    $table->string('kategori_penjamin')->nullable()->after('nama_penjamin');
                }
                if (!Schema::hasColumn('lapor_diris', 'nik_penjamin')) {
                    $table->string('nik_penjamin')->nullable()->after('kategori_penjamin');
                }
                if (!Schema::hasColumn('lapor_diris', 'telepon_penjamin')) {
                    $table->string('telepon_penjamin')->nullable()->after('nik_penjamin');
                }
                if (!Schema::hasColumn('lapor_diris', 'alamat_penjamin')) {
                    $table->text('alamat_penjamin')->nullable()->after('telepon_penjamin');
                }

                // Berkas & Lampiran WNA
                if (!Schema::hasColumn('lapor_diris', 'lampiran_paspor')) {
                    $table->boolean('lampiran_paspor')->default(false)->after('lampiran_surat_pindah');
                }
                if (!Schema::hasColumn('lapor_diris', 'lampiran_kitas_kitap')) {
                    $table->boolean('lampiran_kitas_kitap')->default(false)->after('lampiran_paspor');
                }
                if (!Schema::hasColumn('lapor_diris', 'lampiran_surat_permohonan')) {
                    $table->boolean('lampiran_surat_permohonan')->default(false)->after('lampiran_kitas_kitap');
                }
                if (!Schema::hasColumn('lapor_diris', 'lampiran_ktp_penjamin')) {
                    $table->boolean('lampiran_ktp_penjamin')->default(false)->after('lampiran_surat_permohonan');
                }
                if (!Schema::hasColumn('lapor_diris', 'lampiran_dokumen_kerja')) {
                    $table->boolean('lampiran_dokumen_kerja')->default(false)->after('lampiran_ktp_penjamin');
                }
                if (!Schema::hasColumn('lapor_diris', 'lampiran_dokumen_lainnya')) {
                    $table->boolean('lampiran_dokumen_lainnya')->default(false)->after('lampiran_dokumen_kerja');
                }

                if (!Schema::hasColumn('lapor_diris', 'file_paspor')) {
                    $table->string('file_paspor')->nullable()->after('file_surat_pindah');
                }
                if (!Schema::hasColumn('lapor_diris', 'file_kitas_kitap')) {
                    $table->string('file_kitas_kitap')->nullable()->after('file_paspor');
                }
                if (!Schema::hasColumn('lapor_diris', 'file_surat_permohonan')) {
                    $table->string('file_surat_permohonan')->nullable()->after('file_kitas_kitap');
                }
                if (!Schema::hasColumn('lapor_diris', 'file_ktp_penjamin')) {
                    $table->string('file_ktp_penjamin')->nullable()->after('file_surat_permohonan');
                }
                if (!Schema::hasColumn('lapor_diris', 'file_dokumen_kerja')) {
                    $table->string('file_dokumen_kerja')->nullable()->after('file_ktp_penjamin');
                }
                if (!Schema::hasColumn('lapor_diris', 'file_dokumen_lainnya')) {
                    $table->string('file_dokumen_lainnya')->nullable()->after('file_dokumen_kerja');
                }
            });
        }

        if (Schema::hasTable('lapor_diri_anggotas')) {
            Schema::table('lapor_diri_anggotas', function (Blueprint $table) {
                if (!Schema::hasColumn('lapor_diri_anggotas', 'nomor_paspor')) {
                    $table->string('nomor_paspor')->nullable()->after('nik');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('lapor_diris')) {
            Schema::table('lapor_diris', function (Blueprint $table) {
                $columns = [
                    'kewarganegaraan', 'negara_asal', 'nomor_paspor', 'masa_berlaku_paspor',
                    'jenis_izin_tinggal', 'nomor_izin_tinggal', 'masa_berlaku_izin',
                    'status_bekerja', 'nama_perusahaan', 'jabatan_pekerjaan', 'nomor_dokumen_kerja',
                    'nama_penjamin', 'kategori_penjamin', 'nik_penjamin', 'telepon_penjamin', 'alamat_penjamin',
                    'lampiran_paspor', 'lampiran_kitas_kitap', 'lampiran_surat_permohonan', 'lampiran_ktp_penjamin', 'lampiran_dokumen_kerja', 'lampiran_dokumen_lainnya',
                    'file_paspor', 'file_kitas_kitap', 'file_surat_permohonan', 'file_ktp_penjamin', 'file_dokumen_kerja', 'file_dokumen_lainnya'
                ];
                foreach ($columns as $col) {
                    if (Schema::hasColumn('lapor_diris', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }

        if (Schema::hasTable('lapor_diri_anggotas')) {
            Schema::table('lapor_diri_anggotas', function (Blueprint $table) {
                if (Schema::hasColumn('lapor_diri_anggotas', 'nomor_paspor')) {
                    $table->dropColumn('nomor_paspor');
                }
            });
        }
    }
};

