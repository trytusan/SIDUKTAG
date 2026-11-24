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
        Schema::table('bantuan_penerima', function (Blueprint $table) {
            $table->string('nomor_undangan', 100)->nullable()->after('tanggal_verifikasi');
            $table->string('barcode_pengambilan', 255)->nullable()->after('nomor_undangan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bantuan_penerima', function (Blueprint $table) {
            $table->dropColumn([
                'nomor_undangan',
                'barcode_pengambilan',
            ]);
        });
    }
};
