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
        Schema::table('penduduk', function (Blueprint $table) {
            $table->date('tanggal_masuk')->nullable()->after('tujuan_menetap');
            $table->date('masa_berlaku')->nullable()->after('tanggal_masuk');
            $table->string('nomor_surat_tanda_lapor')->nullable()->after('masa_berlaku');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penduduk', function (Blueprint $table) {
            $table->dropColumn([
                'tanggal_masuk',
                'masa_berlaku',
                'nomor_surat_tanda_lapor',
            ]);
        });
    }
};

