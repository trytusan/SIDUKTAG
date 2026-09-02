<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bantuan_penerima', function (Blueprint $table) {
            $table->id();

            $table->foreignId('bantuan_id')->constrained('bantuan')->cascadeOnDelete();
            $table->foreignId('penduduk_id')->constrained('penduduk')->cascadeOnDelete();

            $table->date('tanggal_menerima')->nullable();
            $table->enum('status_penerima', ['Menunggu', 'Diterima', 'Ditolak', 'Selesai'])->default('Menunggu');
            $table->text('catatan')->nullable();

            $table->timestamps();

            $table->unique(['bantuan_id', 'penduduk_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bantuan_penerima');
    }
};