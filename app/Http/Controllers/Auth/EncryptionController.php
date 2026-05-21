<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\UserEncription;
use App\Traits\CaasTrait;
use App\Traits\CassTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class EncryptionController extends Controller
{
    use CaasTrait;

    // Fungsi Get Info
    public function get(){
        // Lokasi file sertifikat dan kunci
        $certFile = public_path('certificate/client.crt');
        $keyFile = public_path('certificate/client.key');
        
        // URL endpoint API
        $url = env('APP_URL_CAAS');

        $response = Http::withoutVerifying()->withOptions([
            'CURLOPT_RETURNTRANSFER'=>true,
            'cert' => $certFile,
            'ssl_key' => $keyFile,
            'CURLOPT_SSL_VERIFYPEER'=>false,
            'CURLOPT_SSL_VERIFYHOST'=>false,
        ])->withHeaders([
            'Content-Type' => 'application/json'
        ])->get($url);

        return $response->json();
    }

    // Fungsi Search
    public function search(Request $request){
        // Lokasi file sertifikat dan kunci
        $hash_search = $this->hash_proses($request->search);

        $data = UserEncription::where('hash_name', 'like', '%' . $hash_search . '%')
            ->orWhere('hash_email', 'like', '%' . $hash_search . '%')
            ->orWhere('hash_nik', 'like', '%' . $hash_search . '%')
            ->orWhere('hash_nip', 'like', '%' . $hash_search . '%')
            ->get();
        
        if(!$data){
            return response()->json(['message' => 'Data not found'], 404);
        }

        $result = [
            "data" => [],
            "message" => "success"
        ];
        
        foreach ($data as $key => $value) {
            $arrdata = [
                "name" => $value->name,
                "email" => $value->email,
                "nik" => $value->nik,
                "nip" => $value->nip
            ];
            
            array_push($result['data'], $this->api_encription('decrypt', $arrdata));
        }
        
        return response()->json($result);
    }
}
