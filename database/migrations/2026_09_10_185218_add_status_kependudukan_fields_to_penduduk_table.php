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
            // Meninggal
            $table->date('tanggal_meninggal')->nullable()->after('status_kependudukan');
            $table->string('tempat_meninggal')->nullable()->after('tanggal_meninggal');
            $table->string('akta_kematian')->nullable()->after('tempat_meninggal');

            // Pindah
            $table->date('tanggal_pindah')->nullable()->after('akta_kematian');
            $table->text('alamat_tujuan')->nullable()->after('tanggal_pindah');

            // Pendatang
            $table->string('daerah_asal')->nullable()->after('alamat_tujuan');
            $table->string('tujuan_menetap')->nullable()->after('daerah_asal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penduduk', function (Blueprint $table) {
            $table->dropColumn([
                'tanggal_meninggal',
                'tempat_meninggal',
                'akta_kematian',
                'tanggal_pindah',
                'alamat_tujuan',
                'daerah_asal',
                'tujuan_menetap',
            ]);
        });
    }
};
