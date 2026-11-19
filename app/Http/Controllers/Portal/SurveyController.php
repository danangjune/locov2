<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Services\Pecut\SatisfactionSurveyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Inertia\Inertia;
use Inertia\Response;

class SurveyController extends Controller
{
    public function index(SatisfactionSurveyService $surveyService): Response
    {
        $embedUrl = Config::get('services.survey_digital.embed_url');

        return Inertia::render('Survey/Index', [
            'meta' => [
                'title' => 'Survey Kepuasan PECUT',
                'description' => 'Isi survey kepuasan pengguna layanan PECUT dan lihat ringkasan rating pengguna.',
            ],
            'data' => [
                'embed_url' => $embedUrl,
                'satisfaction' => $surveyService->getPecutSatisfaction(),
            ],
        ]);
    }

    public function apps(Request $request, SatisfactionSurveyService $surveyService)
    {
        try {
            $appId = $request->query('app_id');

            if ($appId) {
                return response()->json([
                    'satisfaction' => $surveyService->getPecutSatisfaction($appId),
                ], 200);
            }
            
            return response()->json([
                'error' => 'Missing app_id parameter',
                'message' => 'Please provide the app_id query parameter to retrieve satisfaction data for a specific app.',
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retrieve survei apps',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
