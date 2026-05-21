<?php

namespace Database\Seeders;

use App\Models\Urusan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class UrusanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    // public function run(): void
    // {
    //     Urusan::create(['title' => 'Bantuan Sosial']);
    //     Urusan::create(['title' => 'Kesehatan']);
    //     Urusan::create(['title' => 'Pendidikan']);
    //     Urusan::create(['title' => 'Kependudukan']);
    //     Urusan::create(['title' => 'Satu Data']);
    //     Urusan::create(['title' => 'Perizinan']);
    //     Urusan::create(['title' => 'Pengaduan Publik']);
    //     Urusan::create(['title' => 'Keuangan']);
    //     Urusan::create(['title' => 'Pemerintahan (Web Profil)']);
    //     Urusan::create(['title' => 'Hukum']);
    //     Urusan::create(['title' => 'Kearsipan']);
    //     Urusan::create(['title' => 'Kepegawaian']);
    //     Urusan::create(['title' => 'Pelaporan']);
    //     Urusan::create(['title' => 'Pembangunan']);
    //     Urusan::create(['title' => 'Perencanaan']);
    //     Urusan::create(['title' => 'Perhubungan']);
    //     Urusan::create(['title' => 'Persuratan']);
    // }
    public function run(): void
    {
        $path = public_path('seeds/urusan.sql');
        
        DB::unprepared(file_get_contents($path));
    }
}
