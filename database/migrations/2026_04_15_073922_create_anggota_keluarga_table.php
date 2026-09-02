<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anggota_keluarga', function (Blueprint $table) {
            $table->id();

            $table->foreignId('kartu_keluarga_id')->constrained('kartu_keluarga')->cascadeOnDelete();
            $table->foreignId('penduduk_id')->constrained('penduduk')->cascadeOnDelete();

            $table->string('status_dalam_keluarga');
            $table->boolean('is_kepala_keluarga')->default(false);

            $table->timestamps();

            $table->unique(['kartu_keluarga_id', 'penduduk_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anggota_keluarga');
    }
};