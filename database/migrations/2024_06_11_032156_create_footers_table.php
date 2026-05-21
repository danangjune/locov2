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
        Schema::create('content_footer', function (Blueprint $table) {
            $table->id();
            $table->string('content')->nullable();
            $table->bigInteger('parent')->nullable();
            $table->string('url')->nullable();
            $table->string('icon', 100)->nullable();
            $table->string('image')->nullable();
            $table->integer('idx_content')->nullable();
            $table->integer('tab_content')->nullable();
            $table->boolean('statusenabled')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_footer');
    }
};
