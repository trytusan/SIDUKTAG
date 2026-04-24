<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengajuan_surat', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('penduduk_id')->nullable()->constrained('penduduk')->nullOnDelete();

            $table->string('nomor_pengajuan')->unique();

            $table->string('nama_pemohon');
            $table->string('nik');
            $table->string('jenis_surat_nama')->nullable();

            $table->text('keperluan');
            $table->date('tanggal_pengajuan');
            $table->date('tanggal_pengesahan')->nullable();

            $table->enum('status', ['Menunggu', 'Diproses', 'Selesai', 'Ditolak'])->default('Menunggu');
            $table->text('catatan_operator')->nullable();

            $table->string('dokumen_pendukung')->nullable();
            $table->string('file_hasil_surat')->nullable();

            $table->timestamps();

            $table->index('status');
            $table->index('tanggal_pengajuan');
            $table->index('nik');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan_surat');
    }
};