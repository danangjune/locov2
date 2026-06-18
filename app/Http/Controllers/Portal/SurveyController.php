<?php

namespace App\Http\Controllers\Portal;

use App\Http\Controllers\Controller;
use App\Services\Pecut\SatisfactionSurveyService;
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
}
