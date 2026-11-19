<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('penduduk', function (Blueprint $table) {
            $table->string('created_by_name')->nullable()->after('is_profile_completed');
            $table->string('created_by_role')->nullable()->after('created_by_name');
            $table->string('updated_by_name')->nullable()->after('created_by_role');
            $table->string('updated_by_role')->nullable()->after('updated_by_name');
            $table->string('last_modified_source')->nullable()->after('updated_by_role');
            $table->timestamp('last_modified_at')->nullable()->after('last_modified_source');
        });
    }

    public function down(): void
    {
        Schema::table('penduduk', function (Blueprint $table) {
            $table->dropColumn([
                'created_by_name',
                'created_by_role',
                'updated_by_name',
                'updated_by_role',
                'last_modified_source',
                'last_modified_at',
            ]);
        });
    }
};
