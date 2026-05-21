<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AppFrom;

class AppFromSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AppFrom::create([
            'name' => 'LOKAL',
        ]);
        AppFrom::create([
            'name' => 'PUSAT',
        ]);
    }
}
