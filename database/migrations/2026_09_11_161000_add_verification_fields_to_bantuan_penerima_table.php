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
            $table->string('status_verifikasi')->default('Menunggu Verifikasi')->after('tanggal_menerima');
            $table->date('tanggal_verifikasi')->nullable()->after('status_verifikasi');
            $table->text('catatan_operator')->nullable()->after('catatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bantuan_penerima', function (Blueprint $table) {
            $table->dropColumn([
                'status_verifikasi',
                'tanggal_verifikasi',
                'catatan_operator',
            ]);
        });
    }
};

