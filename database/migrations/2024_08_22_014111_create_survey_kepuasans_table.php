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
        Schema::create('survey_kepuasan', function (Blueprint $table) {
            $table->id();
            $table->integer('skor');
            $table->string('kritik', 255)->nullable();
            $table->string('saran', 255)->nullable();
            $table->string('nama_aplikasi', 255);
            $table->foreignId('user_id')->nullable()->index()->constrained('users', 'id')->onUpdate('cascade')->onDelete('cascade');
            $table->boolean('status')->default(0);
            $table->boolean('status_enabled')->default(1);
            $table->timestamps();
        });
    
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survey_kepuasan');
    }
};
