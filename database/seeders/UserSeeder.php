<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Jane Doe',
            'email' => 'jane.doe@gmail.com',
            'nik' => '3506040301930069',
            'nip' => '199301032024211069',
            'password' => Hash::make('kedirikota'),
            'role_id' => 1,
            'is_verified' => true,
        ]);
        User::create([
            'name' => 'Gal',
            'email' => 'Gal@gmail.com',
            'nik' => '3506040301930070',
            'nip' => '199301032024211070',
            'password' => Hash::make('kedirikota'),
            'role_id' => 2,
            'is_verified' => true,
        ]);
    }
}
