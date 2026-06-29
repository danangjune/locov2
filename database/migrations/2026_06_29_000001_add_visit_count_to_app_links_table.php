<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('app_links', function (Blueprint $table) {
            $table->unsignedBigInteger('visit_count')->default(0)->after('is_popular');
            $table->timestamp('last_visited_at')->nullable()->after('visit_count');
        });
    }

    public function down(): void
    {
        Schema::table('app_links', function (Blueprint $table) {
            $table->dropColumn(['visit_count', 'last_visited_at']);
        });
    }
};
