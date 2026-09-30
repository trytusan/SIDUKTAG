<?php

use IlluminateDatabaseMigrationsMigration;
use IlluminateDatabaseSchemaBlueprint;
use IlluminateSupportFacadesSchema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('lapor_diris')) {
            Schema::create('lapor_diris', function (Blueprint $table) {
                $table->id();

                // A. Data Pribadi
                $table->string('nama_lengkap');
                $table->enum('jenis_kelamin', ['Laki-Laki', 'Perempuan']);
                $table->string('tempat_lahir');
                $table->date('tanggal_lahir');
                $table->string('agama');
                $table->string('status_perkawinan');
                $table->string('pekerjaan');
                $table->string('nik', 16);
                $table->string('nomor_kk', 16)->nullable();
                $table->string('nomor_telepon')->nullable();

                // B. Data Tempat Tinggal Baru
                $table->text('alamat_baru');
                $table->date('tanggal_mulai_tinggal')->nullable();
                $table->enum('status_tempat_tinggal', ['Kost', 'Kontrak/Sewa', 'Milik Sendiri', 'Numpang'])->default('Kost');
                $table->string('nama_pemilik_rumah')->nullable();
                $table->string('nomor_kontak_pemilik')->nullable();
                $table->decimal('latitude', 10, 8)->nullable();
                $table->decimal('longitude', 11, 8)->nullable();

                // C. Data Asal
                $table->text('alamat_asal');
                $table->string('rt_rw_asal')->nullable();
                $table->string('kelurahan_asal')->nullable();
                $table->string('kecamatan_asal')->nullable();
                $table->string('kota_kabupaten_asal')->nullable();

                // E. Dokumen Fisik & Tanda Tangan
                $table->boolean('lampiran_ktp')->default(false);
                $table->boolean('lampiran_kk')->default(false);
                $table->boolean('lampiran_surat_pindah')->default(false);
                $table->boolean('lampiran_ttd')->default(false);
                $table->string('file_ktp')->nullable();
                $table->string('file_kk')->nullable();
                $table->string('file_surat_pindah')->nullable();
                $table->string('tanda_tangan')->nullable();

                // Meta
                $table->date('tanggal_lapor')->nullable();
                $table->enum('status_lapor', ['Terdaftar', 'Diverifikasi', 'Ditolak'])->default('Terdaftar');
                $table->text('catatan')->nullable();
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

                $table->timestamps();
            });
        }

        if (!Schema::hasTable('lapor_diri_anggotas')) {
            Schema::create('lapor_diri_anggotas', function (Blueprint $table) {
                $table->id();
                $table->foreignId('lapor_diri_id')->constrained('lapor_diris')->cascadeOnDelete();
                $table->string('nama');
                $table->string('nik', 16)->nullable();
                $table->string('tempat_lahir')->nullable();
                $table->date('tanggal_lahir')->nullable();
                $table->string('hubungan_keluarga')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('lapor_diri_anggotas');
        Schema::dropIfExists('lapor_diris');
    }
};
