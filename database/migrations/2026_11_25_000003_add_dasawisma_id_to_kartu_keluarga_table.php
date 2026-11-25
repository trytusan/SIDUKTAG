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
        if (Schema::hasTable('kartu_keluarga') && !Schema::hasColumn('kartu_keluarga', 'dasawisma_id')) {
            Schema::table('kartu_keluarga', function (Blueprint $table) {
                $table->foreignId('dasawisma_id')
                    ->nullable()
                    ->after('jumlah_anggota')
                    ->constrained('dasawisma')
                    ->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('kartu_keluarga') && Schema::hasColumn('kartu_keluarga', 'dasawisma_id')) {
            Schema::table('kartu_keluarga', function (Blueprint $table) {
                $table->dropForeign(['dasawisma_id']);
                $table->dropColumn('dasawisma_id');
            });
        }
    }
};
