<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            CategorySeeder::class,
            AppFromSeeder::class,
            UrusanSeeder::class,
            AppLinkSeeder::class,
            AppSectionsSeeder::class,
            AppSectionsItemsSeeder::class,
            ContentFooterSeeder::class,
            PanduanFileSeeder::class,
            UserSeeder::class,
            // UserEncriptionSeeder::class,
        ]);
    }
}
