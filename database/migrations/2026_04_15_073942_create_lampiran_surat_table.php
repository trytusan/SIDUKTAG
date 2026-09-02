<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lampiran_surat', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pengajuan_surat_id')->constrained('pengajuan_surat')->cascadeOnDelete();

            $table->string('nama_file');
            $table->string('path_file');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lampiran_surat');
    }
};