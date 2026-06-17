<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('footer_settings', function (Blueprint $table) {
            $table->id();
            $table->string('logo_path')->nullable();
            $table->text('description')->nullable();
            $table->string('copyright_text')->nullable();
            $table->string('bottom_text')->nullable();
            $table->boolean('statusenabled')->default(true);
            $table->timestamps();
        });

        DB::table('footer_settings')->insert([
            'logo_path' => '/images/logo-pecut-full-transparan.png',
            'description' => 'PECUT adalah portal layanan digital Pemerintah Kota Kediri untuk memudahkan masyarakat, ASN, dan perangkat daerah menemukan layanan digital dalam satu pintu.',
            'copyright_text' => '© ' . date('Y') . ' PECUT Kota Kediri. Portal layanan digital satu pintu Pemerintah Kota Kediri.',
            'bottom_text' => 'PECUT · Portal Efisien Cepat Mudah Terpadu',
            'statusenabled' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('footer_settings');
    }
};
