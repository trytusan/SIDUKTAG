<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bantuan', function (Blueprint $table) {
            $table->id();

            $table->string('nama_program');
            $table->string('jenis_bantuan');
            $table->text('deskripsi')->nullable();

            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();

            $table->enum('status_bantuan', ['Aktif', 'Nonaktif', 'Selesai'])->default('Aktif');
            $table->unsignedInteger('kuota_penerima')->nullable();
            $table->string('sumber_bantuan')->nullable();

            $table->timestamps();

            $table->index('nama_program');
            $table->index('status_bantuan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bantuan');
    }
};