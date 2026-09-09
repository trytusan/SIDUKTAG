<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wilayah', function (Blueprint $table) {
            $table->id();
            $table->string('kode_wilayah', 50)->unique();
            $table->string('nama_wilayah', 255);
            $table->string('jenis_wilayah', 50)->default('Dusun'); // Dusun, RW, RT, Lingkungan
            $table->string('kepala_wilayah', 255);
            $table->string('nomor_telepon', 50)->nullable();
            $table->unsignedInteger('jumlah_kk')->default(0);
            $table->unsignedInteger('jumlah_penduduk')->default(0);
            $table->decimal('luas_wilayah', 8, 2)->nullable();
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->text('deskripsi')->nullable();
            $table->string('warna_marker', 20)->default('#10b981');
            $table->timestamps();

            $table->index('nama_wilayah');
            $table->index('jenis_wilayah');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wilayah');
    }
};

