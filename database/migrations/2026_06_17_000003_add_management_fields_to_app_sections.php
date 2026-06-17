<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('app_sections')) {
            Schema::table('app_sections', function (Blueprint $table) {
                if (! Schema::hasColumn('app_sections', 'sort_order')) {
                    $table->unsignedInteger('sort_order')->default(0)->after('description');
                }

                if (! Schema::hasColumn('app_sections', 'statusenabled')) {
                    $table->boolean('statusenabled')->default(true)->after('sort_order');
                }
            });
        }

        if (Schema::hasTable('app_section_items')) {
            Schema::table('app_section_items', function (Blueprint $table) {
                if (! Schema::hasColumn('app_section_items', 'sort_order')) {
                    $table->unsignedInteger('sort_order')->default(0)->after('app_id');
                }

                if (! Schema::hasColumn('app_section_items', 'statusenabled')) {
                    $table->boolean('statusenabled')->default(true)->after('sort_order');
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('app_section_items')) {
            Schema::table('app_section_items', function (Blueprint $table) {
                if (Schema::hasColumn('app_section_items', 'statusenabled')) {
                    $table->dropColumn('statusenabled');
                }

                if (Schema::hasColumn('app_section_items', 'sort_order')) {
                    $table->dropColumn('sort_order');
                }
            });
        }

        if (Schema::hasTable('app_sections')) {
            Schema::table('app_sections', function (Blueprint $table) {
                if (Schema::hasColumn('app_sections', 'statusenabled')) {
                    $table->dropColumn('statusenabled');
                }

                if (Schema::hasColumn('app_sections', 'sort_order')) {
                    $table->dropColumn('sort_order');
                }
            });
        }
    }
};
