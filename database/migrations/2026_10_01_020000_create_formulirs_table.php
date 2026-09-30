<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('formulirs')) {
            Schema::create('formulirs', function (Blueprint $table) {
                $table->id();
                $table->string('nama_formulir');
                $table->string('kode_formulir')->nullable();
                $table->string('kategori')->default('Kependudukan');
                $table->text('deskripsi')->nullable();
                $table->text('persyaratan')->nullable();
                $table->string('file_template');
                $table->string('file_format', 10)->default('docx');
                $table->unsignedBigInteger('file_size')->nullable();
                $table->unsignedInteger('download_count')->default(0);
                $table->boolean('is_active')->default(true);
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('formulirs');
    }
};
