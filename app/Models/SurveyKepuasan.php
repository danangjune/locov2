<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyKepuasan extends Model
{
    use HasFactory;

    protected $table = 'survey_kepuasan';
    protected $fillable = [
        'skor',
        'kritik',
        'saran',
        'nama_aplikasi',
        'user_id',
        'status',
        'status_enabled',
        'created_by',
        'updated_by',
    ];
}
