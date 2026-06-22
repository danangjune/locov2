<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portal_theme_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->default('default')->unique();
            $table->string('name')->default('Tema PECUT');
            $table->string('primary_color', 20)->default('#1E6FA5');
            $table->string('secondary_color', 20)->default('#15547D');
            $table->string('accent_color', 20)->default('#38BDF8');
            $table->string('background_color', 20)->default('#F8FAFC');
            $table->string('surface_color', 20)->default('#FFFFFF');
            $table->string('text_color', 20)->default('#0F172A');
            $table->string('muted_text_color', 20)->default('#64748B');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        DB::table('portal_theme_settings')->insert([
            'key' => 'default',
            'name' => 'Tema PECUT',
            'primary_color' => '#1E6FA5',
            'secondary_color' => '#15547D',
            'accent_color' => '#38BDF8',
            'background_color' => '#F8FAFC',
            'surface_color' => '#FFFFFF',
            'text_color' => '#0F172A',
            'muted_text_color' => '#64748B',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('portal_theme_settings');
    }
};
