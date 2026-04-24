<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kartu_keluarga', function (Blueprint $table) {
            $table->id();

            $table->string('nomor_kk')->unique();
            $table->string('nama_kepala_keluarga');
            $table->text('alamat_keluarga');
            $table->unsignedInteger('jumlah_anggota')->default(0);

            $table->timestamps();

            $table->index('nama_kepala_keluarga');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kartu_keluarga');
    }
};