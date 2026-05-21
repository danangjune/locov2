<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class AppLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = public_path('seeds/app_links.sql');
        
        DB::unprepared(file_get_contents($path));

        File::copyDirectory(public_path('assets/icon'), storage_path('app/public/apps'));
    }
}
