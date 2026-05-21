<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Illuminate\Support\Facades\Http;

class AgendaController extends Controller
{
    public function index(Request $request) : JsonResponse
    {
        // id 1 = today, id 2 = week, id 3 = month
        $periode = $request->query('id', 2);

        $endpoint = env('APP_URL_SIMALIK').'/api/get_agenda';
        $response = Http::get($endpoint, [
            'id' => $periode,
        ]);

        return response()->json($response->json());
    }
}
