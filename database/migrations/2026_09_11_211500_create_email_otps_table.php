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
        if (!Schema::hasTable('email_otps')) {
            Schema::create('email_otps', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
                $table->string('email')->nullable()->index();
                $table->string('otp', 6)->index();
                $table->timestamp('expires_at')->index();
                $table->timestamp('verified_at')->nullable();
                $table->unsignedInteger('attempts')->default(0);
                $table->timestamps();
            });
        } else {
            Schema::table('email_otps', function (Blueprint $table) {
                if (!Schema::hasColumn('email_otps', 'email')) {
                    $table->string('email')->nullable()->after('user_id')->index();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('email_otps')) {
            Schema::table('email_otps', function (Blueprint $table) {
                if (Schema::hasColumn('email_otps', 'email')) {
                    $table->dropColumn('email');
                }
            });
        }
    }
};

