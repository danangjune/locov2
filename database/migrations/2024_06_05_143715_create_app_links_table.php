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
        Schema::create('app_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('urusan_id')->constrained('urusan', 'id')->onUpdate('cascade');
            $table->foreignId('category_id')->constrained('categories', 'id')->onUpdate('cascade');
            $table->bigInteger('parent')->default(0);
            $table->string('code', 50);
            $table->string('name');
            $table->string('alias')->nullable();
            $table->text('description')->nullable();
            $table->string('url')->nullable();
            $table->string('icon')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->nullable()->default(1);
            $table->boolean('is_sso')->nullable()->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_links');
    }
};
