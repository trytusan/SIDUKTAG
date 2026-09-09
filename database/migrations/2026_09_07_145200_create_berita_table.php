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
        Schema::create('berita', function (Blueprint $table) {
            $table->id();
            $table->string('judul', 255);
            $table->string('slug', 255)->unique();
            $table->string('kategori', 100)->default('Pengumuman');
            $table->text('ringkasan');
            $table->longText('konten');
            $table->string('gambar', 255)->nullable();
            $table->string('status', 50)->default('Published'); // Published, Draft, Archived
            $table->string('penulis', 100)->default('Admin Administrator');
            $table->date('tanggal_publikasi');
            $table->unsignedInteger('views')->default(0);
            $table->timestamps();

            $table->index('slug');
            $table->index('kategori');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('berita');
    }
};

