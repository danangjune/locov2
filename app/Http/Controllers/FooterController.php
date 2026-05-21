<?php

namespace App\Http\Controllers;

use App\Models\SurveyKepuasan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FooterController extends Controller
{
    // Get Live Views
    public function live_views(){
        $data = DB::table('sessions')->count();
        return $data;
    }

    // Survey Kepuasan
    public function survey_kepuasan($id){
        // Create Survey Kepuasan
        // return response()->json(['data' => $this->getIp()]);
        if (Auth::check()) {
            // The user is logged in...
            $data = SurveyKepuasan::where('status_enabled', true)
                ->where('nama_aplikasi', 'pecut')
                ->where('user_id', Auth::id())
                ->first();
            if(!$data){
                SurveyKepuasan::create([
                    'skor' => $id,
                    'nama_aplikasi' => 'pecut',
                    'user_id' => Auth::id(),
                ]);
                // Survey
                $survey_kepuasan = SurveyKepuasan::where('status_enabled', true)
                    ->where('nama_aplikasi', 'pecut')
                    ->get();
                $total_survey = count($survey_kepuasan);
                $nilai_survey = [];
                $sp = 0; $p = 0; $cp = 0; $tp = 0;
                foreach ($survey_kepuasan as $key => $value) {
                    if($value->skor == 1){
                        $tp ++;
                    }elseif($value->skor == 2){
                        $cp ++;
                    }elseif($value->skor == 3){
                        $p ++;
                    }elseif($value->skor == 4){
                        $sp ++;
                    }
                }
                $nilai_survey = [
                    'sp' => round($sp/$total_survey*100),
                    'p' => round($p/$total_survey*100), 
                    'cp' => round($cp/$total_survey*100), 
                    'tp' => round($tp/$total_survey*100)
                ];
                return response()->json([
                    'data' => $nilai_survey,
                    'message' => 'Telah Memberikan Survey Terbaik Anda',
                    'status' => 1,
                    'code' => 200
                ]);
            }else{
                return response()->json([
                    'message' => 'Survey Kepuasan Terdeteksi',
                    'status' => 2,
                    'code' => 400
                ]);
            }
        }else{
            return response()->json([
                'message' => 'Silahkan Login Terlebih Dahulu',
                'status' => 3,
                'code' => 400
            ]);
        }
    }
    // Load Survey Kepuasan
    public function load_survey_kepuasan(){
        // return response()->json(['data' => $this->getIp()]);
        if (Auth::check()) {
            $data = SurveyKepuasan::where('status_enabled', true)
                ->where('nama_aplikasi', 'pecut')
                ->where('user_id', Auth::id())
                ->first();
            
            if(!$data){
                return response()->json([
                    'message' => 'Data Tidak Ditemukan',
                    'code' => 400
                ]);
            }else{
                return response()->json([
                    'data' => $data,
                    'message' => 'Data Ditemukan',
                    'code' => 200
                ]);
            }
        }else{
            return response()->json([
                'message' => 'Data Tidak Ditemukan',
                'code' => 400
            ]);
        }
    }
}
