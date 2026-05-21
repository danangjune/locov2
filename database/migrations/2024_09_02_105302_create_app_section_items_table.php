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
        Schema::create('app_section_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained('app_sections', 'id')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('app_id')->constrained('app_links', 'id')->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_section_items');
    }
};
