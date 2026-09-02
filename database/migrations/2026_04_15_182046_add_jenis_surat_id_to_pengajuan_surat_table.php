<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pengajuan_surat', function (Blueprint $table) {
            $table->foreignId('jenis_surat_id')
                ->nullable()
                ->after('penduduk_id')
                ->constrained('jenis_surat')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('pengajuan_surat', function (Blueprint $table) {
            $table->dropForeign(['jenis_surat_id']);
            $table->dropColumn('jenis_surat_id');
        });
    }
};