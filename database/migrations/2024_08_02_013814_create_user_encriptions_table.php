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
        Schema::create('user_encriptions', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Encripted
            $table->string('email')->unique(); // Encripted
            $table->timestamp('email_verified_at')->nullable();
            $table->char('nik')->unique(); // Encripted
            $table->char('nip')->unique(); // Encripted
            $table->string('password'); // Hash
            $table->boolean('is_verified')->default(false);
            $table->foreignId('role_id')->constrained('roles', 'id')->onUpdate('cascade')->onDelete('cascade');
            $table->rememberToken();
            $table->timestamps();
            $table->string('hash_email')->unique(); // Hash with theory
            $table->char('hash_nik')->unique(); // Hash with theory
            $table->char('hash_nip')->unique(); // Hash with theory
            $table->string('hash_name'); // Hash with theory
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_encriptions');
    }
};
