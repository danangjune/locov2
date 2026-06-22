<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('portal_logo_settings')) {
            Schema::create('portal_logo_settings', function (Blueprint $table) {
                $table->id();
                $table->string('app_name')->nullable();
                $table->string('alt_text')->nullable();
                $table->string('header_logo')->nullable();
                $table->string('footer_logo')->nullable();
                $table->string('icon_logo')->nullable();
                $table->string('favicon')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        Schema::table('portal_logo_settings', function (Blueprint $table) {
            if (!Schema::hasColumn('portal_logo_settings', 'logo_svg')) {
                $table->string('logo_svg')->nullable()->after('favicon');
            }

            if (!Schema::hasColumn('portal_logo_settings', 'logo_svg_inline')) {
                $table->longText('logo_svg_inline')->nullable()->after('logo_svg');
            }

            if (!Schema::hasColumn('portal_logo_settings', 'logo_primary_color')) {
                $table->string('logo_primary_color', 20)->default('#2da8fe')->after('logo_svg_inline');
            }

            if (!Schema::hasColumn('portal_logo_settings', 'logo_secondary_color')) {
                $table->string('logo_secondary_color', 20)->default('#0158b1')->after('logo_primary_color');
            }

            if (!Schema::hasColumn('portal_logo_settings', 'logo_accent_color')) {
                $table->string('logo_accent_color', 20)->default('#38bdf8')->after('logo_secondary_color');
            }

            if (!Schema::hasColumn('portal_logo_settings', 'logo_text_color')) {
                $table->string('logo_text_color', 20)->default('#0158b1')->after('logo_accent_color');
            }

            if (!Schema::hasColumn('portal_logo_settings', 'use_theme_colors')) {
                $table->boolean('use_theme_colors')->default(true)->after('logo_text_color');
            }
        });

        if (DB::table('portal_logo_settings')->count() === 0) {
            DB::table('portal_logo_settings')->insert([
                'app_name' => 'PECUT',
                'alt_text' => 'PECUT Kota Kediri',
                'header_logo' => null,
                'footer_logo' => null,
                'icon_logo' => null,
                'favicon' => null,
                'logo_svg' => null,
                'logo_svg_inline' => null,
                'logo_primary_color' => '#2da8fe',
                'logo_secondary_color' => '#0158b1',
                'logo_accent_color' => '#38bdf8',
                'logo_text_color' => '#0158b1',
                'use_theme_colors' => true,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('portal_logo_settings')) {
            return;
        }

        Schema::table('portal_logo_settings', function (Blueprint $table) {
            foreach ([
                'logo_svg',
                'logo_svg_inline',
                'logo_primary_color',
                'logo_secondary_color',
                'logo_accent_color',
                'logo_text_color',
                'use_theme_colors',
            ] as $column) {
                if (Schema::hasColumn('portal_logo_settings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
