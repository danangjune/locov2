<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;

trait CaasTrait
{
    // Fungsi Untuk Hashing
    public function hash_proses($data){
        $arraydata = str_split($data);
        $result = '';
        foreach ($arraydata as $key => $value) {
            $result = $result . crc32($value);
        }
        return $result;
    }

    // Fungsi untuk Encryption dan Decryption
    protected function api_encription($method, $data){
        // Lokasi file sertifikat dan kunci
        $certFile = env('CERTIFICATE_CRT');
        $keyFile = env('CERTIFICATE_KEY');
        
        // URL endpoint API
        $url = env('APP_URL_CAAS') . ($method=='encrypt' ? '/seal' : ($method=='decrypt' ? '/unseal' : '/'));

        // Set Ciphertext and Plaintext
        $chiper_plain = [
            $method=='encrypt' ? 'Plaintext' : ($method=='decrypt' ? 'Ciphertext' : '') => []
        ];

        // Set Data in Ciphertext and Plaintext
        if(is_array($data)){
            foreach ($data as $key => $value) {
                array_push($chiper_plain[$method=='encrypt' ? 'Plaintext' : ($method=='decrypt' ? 'Ciphertext' : '')], array("text" => $value));
            }
        }else{
            return response()->json(['message' => 'Format Data Incorrect']);
        }

        // Set Connection
        $response = Http::withoutVerifying()->withOptions([
            'CURLOPT_RETURNTRANSFER'=>true,
            'cert' => $certFile,
            'ssl_key' => $keyFile,
            'CURLOPT_SSL_VERIFYPEER'=>false,
            'CURLOPT_SSL_VERIFYHOST'=>false,
        ])->withHeaders([
            'Content-Type' => 'application/json'
        ])->post($url, $chiper_plain);
        
        // Return Response
        return $response->json();
    }
}
