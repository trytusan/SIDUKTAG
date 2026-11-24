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
        if (!Schema::hasTable('dasawisma')) {
            Schema::create('dasawisma', function (Blueprint $table) {
                $table->id();
                $table->string('nama_dasawisma', 100)->unique();
                $table->string('ketua_dasawisma', 150)->nullable();
                $table->string('nomor_telepon_ketua', 20)->nullable();
                $table->text('keterangan')->nullable();
                $table->timestamps();
            });
        }

        if (Schema::hasTable('penduduk') && !Schema::hasColumn('penduduk', 'dasawisma_id')) {
            Schema::table('penduduk', function (Blueprint $table) {
                $table->foreignId('dasawisma_id')
                    ->nullable()
                    ->after('nomor_kk')
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
        if (Schema::hasTable('penduduk') && Schema::hasColumn('penduduk', 'dasawisma_id')) {
            Schema::table('penduduk', function (Blueprint $table) {
                $table->dropForeign(['dasawisma_id']);
                $table->dropColumn('dasawisma_id');
            });
        }

        Schema::dropIfExists('dasawisma');
    }
};
