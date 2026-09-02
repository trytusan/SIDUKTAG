<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('penduduk', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();

            $table->string('nama_lengkap');
            $table->string('nik')->unique();
            $table->string('nomor_kk', 16);
            $table->foreign('nomor_kk')
                ->references('nomor_kk')
                ->on('kartu_keluarga')
                ->onDelete('cascade');
            $table->string('nomor_ktp')->nullable();

            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();

            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan'])->nullable();
            $table->string('agama')->nullable();
            $table->string('status_perkawinan')->nullable();

            $table->string('pekerjaan')->nullable();
            $table->string('pendidikan_terakhir')->nullable();
            $table->string('kategori_umur')->nullable();

            $table->string('status_dalam_keluarga')->nullable();
            $table->string('status_kependudukan')->default('Tetap');

            $table->string('nomor_telepon')->nullable();
            $table->text('alamat_lengkap')->nullable();

            $table->string('foto_profil')->nullable();
            $table->string('dokumen_pendukung')->nullable();

            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            $table->boolean('is_profile_completed')->default(false);

            $table->timestamps();

            $table->index('nomor_kk');
            $table->index('nama_lengkap');
            $table->index('status_kependudukan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penduduk');
    }
};