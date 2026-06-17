<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portal_pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->longText('description')->nullable();
            $table->string('hero_image')->nullable();
            $table->boolean('statusenabled')->default(true);
            $table->timestamps();
        });

        Schema::create('portal_page_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portal_page_id')->constrained('portal_pages')->cascadeOnDelete();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('image')->nullable();
            $table->longText('content')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('portal_page_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portal_page_id')->constrained('portal_pages')->cascadeOnDelete();
            $table->string('label');
            $table->string('value');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portal_page_stats');
        Schema::dropIfExists('portal_page_sections');
        Schema::dropIfExists('portal_pages');
    }
};
