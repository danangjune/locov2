<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create([
            'title' => 'Layanan Publik',
            'sub_title' => 'Layanan Public merupakan layanan terpadu Pemerintah Kota Kediri untuk seluruh masyarakat Kota Kediri',
        ]);

        Category::create([
            'title' => 'Layanan Pemerintahan',
            'sub_title' => 'Layanan Pemerintahan merupakan layanan terpadu Pemerintah Kota Kediri untuk seluruh ASN Kota Kediri',
        ]);

        File::copyDirectory(public_path('assets/imag/layanan'), storage_path('app/public/layanan'));
    }
}
