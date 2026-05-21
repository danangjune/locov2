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
        Schema::table('app_links', function (Blueprint $table) {
            $table->boolean('app_from')->nullable()->default(1)->after('is_sso');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('app_links', function (Blueprint $table) {
            $table->dropColumn('app_from');
        });
    }
};
