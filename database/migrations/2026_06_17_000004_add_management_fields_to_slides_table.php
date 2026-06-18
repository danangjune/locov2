<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('slides', function (Blueprint $table) {
            if (! Schema::hasColumn('slides', 'subtitle')) {
                $table->string('subtitle')->nullable()->after('title');
            }

            if (! Schema::hasColumn('slides', 'button_label')) {
                $table->string('button_label')->nullable()->after('url');
            }

            if (! Schema::hasColumn('slides', 'secondary_label')) {
                $table->string('secondary_label')->nullable()->after('button_label');
            }

            if (! Schema::hasColumn('slides', 'secondary_url')) {
                $table->string('secondary_url')->nullable()->after('secondary_label');
            }

            if (! Schema::hasColumn('slides', 'sort_order')) {
                $table->unsignedInteger('sort_order')->default(0)->after('secondary_url');
            }

            if (! Schema::hasColumn('slides', 'statusenabled')) {
                $table->boolean('statusenabled')->default(true)->after('sort_order');
            }
        });
    }

    public function down(): void
    {
        Schema::table('slides', function (Blueprint $table) {
            foreach (['subtitle', 'button_label', 'secondary_label', 'secondary_url', 'sort_order', 'statusenabled'] as $column) {
                if (Schema::hasColumn('slides', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
