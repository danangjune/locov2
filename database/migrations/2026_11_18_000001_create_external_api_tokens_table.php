<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('external_api_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('service_name')->unique();
            $table->longText('access_token')->nullable();
            $table->longText('refresh_token')->nullable();
            // Unix seconds, independent of database/application timezone.
            $table->unsignedBigInteger('access_token_expires_at')->nullable();
            $table->unsignedBigInteger('refresh_token_expires_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->timestamp('last_refresh_at')->nullable();
            $table->timestamp('last_attempt_at')->nullable();
            $table->string('last_error')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('external_api_tokens');
    }
};
