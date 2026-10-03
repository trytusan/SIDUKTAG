<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('formulirs') && !Schema::hasColumn('formulirs', 'nama_file_asli')) {
            Schema::table('formulirs', function (Blueprint $table) {
                $table->string('nama_file_asli')->nullable()->after('file_template');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('formulirs') && Schema::hasColumn('formulirs', 'nama_file_asli')) {
            Schema::table('formulirs', function (Blueprint $table) {
                $table->dropColumn('nama_file_asli');
            });
        }
    }
};

