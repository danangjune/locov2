<?php

namespace Database\Seeders;

use App\Models\UserEncription;
use App\Traits\CaasTrait;
use App\Traits\CassTrait;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserEncriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    // Fungsi Untuk Hashing
    use CaasTrait;
    public function run(): void
    {
        $name = 'John Doe';
        $email = 'john.doe@gmail.com';
        $nik = '3506040301930069';
        $nip = '199301032024211069';

        $encrypted = $this->api_encription('encrypt', [
            "name" => $name,
            "email" => $email,
            "nik" => $nik,
            "nip" => $nip
        ]);

        UserEncription::create([
            'name' => $encrypted['Ciphertext'][0]['text'],
            'email' => $encrypted['Ciphertext'][1]['text'],
            'nik' => $encrypted['Ciphertext'][2]['text'],
            'nip' => $encrypted['Ciphertext'][3]['text'],
            'password' => Hash::make('kedirikota'),
            'role_id' => 1,
            'is_verified' => true,
            'hash_name' => $this->hash_proses(strtolower($name)),
            'hash_email' => $this->hash_proses(strtolower($email)),
            'hash_nik' => $this->hash_proses($nik),
            'hash_nip' => $this->hash_proses($nip),
        ]);

        $name = 'Galih Adi Winasis';
        $email = 'gal@gmail.com';
        $nik = '3506040301930068';
        $nip = '199301032024211068';

        $encrypted = $this->api_encription('encrypt', [
            "name" => $name,
            "email" => $email,
            "nik" => $nik,
            "nip" => $nip
        ]);
        
        UserEncription::create([
            'name' => $encrypted['Ciphertext'][0]['text'],
            'email' => $encrypted['Ciphertext'][1]['text'],
            'nik' => $encrypted['Ciphertext'][2]['text'],
            'nip' => $encrypted['Ciphertext'][3]['text'],
            'password' => Hash::make('kedirikota'),
            'role_id' => 1,
            'is_verified' => true,
            'hash_name' => $this->hash_proses(strtolower($name)),
            'hash_email' => $this->hash_proses(strtolower($email)),
            'hash_nik' => $this->hash_proses($nik),
            'hash_nip' => $this->hash_proses($nip),
        ]);

        $name = 'Chasan Ali';
        $email = 'chasan@gmail.com';
        $nik = '3506040301930067';
        $nip = '199301032024211067';

        $encrypted = $this->api_encription('encrypt', [
            "name" => $name,
            "email" => $email,
            "nik" => $nik,
            "nip" => $nip
        ]);
        
        UserEncription::create([
            'name' => $encrypted['Ciphertext'][0]['text'],
            'email' => $encrypted['Ciphertext'][1]['text'],
            'nik' => $encrypted['Ciphertext'][2]['text'],
            'nip' => $encrypted['Ciphertext'][3]['text'],
            'password' => Hash::make('kedirikota'),
            'role_id' => 1,
            'is_verified' => true,
            'hash_name' => $this->hash_proses(strtolower($name)),
            'hash_email' => $this->hash_proses(strtolower($email)),
            'hash_nik' => $this->hash_proses($nik),
            'hash_nip' => $this->hash_proses($nip),
        ]);

        $name = 'Novarita Milianti P';
        $email = 'nova@gmail.com';
        $nik = '3506040301930050';
        $nip = '199301032024211050';

        $encrypted = $this->api_encription('encrypt', [
            "name" => $name,
            "email" => $email,
            "nik" => $nik,
            "nip" => $nip
        ]);
        
        UserEncription::create([
            'name' => $encrypted['Ciphertext'][0]['text'],
            'email' => $encrypted['Ciphertext'][1]['text'],
            'nik' => $encrypted['Ciphertext'][2]['text'],
            'nip' => $encrypted['Ciphertext'][3]['text'],
            'password' => Hash::make('kedirikota'),
            'role_id' => 1,
            'is_verified' => true,
            'hash_name' => $this->hash_proses(strtolower($name)),
            'hash_email' => $this->hash_proses(strtolower($email)),
            'hash_nik' => $this->hash_proses($nik),
            'hash_nip' => $this->hash_proses($nip),
        ]);

        $name = 'Fani Adi Setiawan';
        $email = 'fanboy@gmail.com';
        $nik = '3506040301930051';
        $nip = '199301032024211051';

        $encrypted = $this->api_encription('encrypt', [
            "name" => $name,
            "email" => $email,
            "nik" => $nik,
            "nip" => $nip
        ]);
        
        UserEncription::create([
            'name' => $encrypted['Ciphertext'][0]['text'],
            'email' => $encrypted['Ciphertext'][1]['text'],
            'nik' => $encrypted['Ciphertext'][2]['text'],
            'nip' => $encrypted['Ciphertext'][3]['text'],
            'password' => Hash::make('kedirikota'),
            'role_id' => 1,
            'is_verified' => true,
            'hash_name' => $this->hash_proses(strtolower($name)),
            'hash_email' => $this->hash_proses(strtolower($email)),
            'hash_nik' => $this->hash_proses($nik),
            'hash_nip' => $this->hash_proses($nip),
        ]);

        $name = 'Bayu Setiawan';
        $email = 'bayuk@gmail.com';
        $nik = '3506040301930052';
        $nip = '199301032024211052';

        $encrypted = $this->api_encription('encrypt', [
            "name" => $name,
            "email" => $email,
            "nik" => $nik,
            "nip" => $nip
        ]);
        
        UserEncription::create([
            'name' => $encrypted['Ciphertext'][0]['text'],
            'email' => $encrypted['Ciphertext'][1]['text'],
            'nik' => $encrypted['Ciphertext'][2]['text'],
            'nip' => $encrypted['Ciphertext'][3]['text'],
            'password' => Hash::make('kedirikota'),
            'role_id' => 1,
            'is_verified' => true,
            'hash_name' => $this->hash_proses(strtolower($name)),
            'hash_email' => $this->hash_proses(strtolower($email)),
            'hash_nik' => $this->hash_proses($nik),
            'hash_nip' => $this->hash_proses($nip),
        ]);

        $name = 'Denny Imam';
        $email = 'denden@gmail.com';
        $nik = '3506040301930053';
        $nip = '199301032024211053';

        $encrypted = $this->api_encription('encrypt', [
            "name" => $name,
            "email" => $email,
            "nik" => $nik,
            "nip" => $nip
        ]);
        
        UserEncription::create([
            'name' => $encrypted['Ciphertext'][0]['text'],
            'email' => $encrypted['Ciphertext'][1]['text'],
            'nik' => $encrypted['Ciphertext'][2]['text'],
            'nip' => $encrypted['Ciphertext'][3]['text'],
            'password' => Hash::make('kedirikota'),
            'role_id' => 1,
            'is_verified' => true,
            'hash_name' => $this->hash_proses(strtolower($name)),
            'hash_email' => $this->hash_proses(strtolower($email)),
            'hash_nik' => $this->hash_proses($nik),
            'hash_nip' => $this->hash_proses($nip),
        ]);
    }
}
