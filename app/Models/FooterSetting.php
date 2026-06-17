<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FooterSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'logo_path',
        'description',
        'copyright_text',
        'bottom_text',
        'statusenabled',
    ];

    protected $casts = [
        'statusenabled' => 'boolean',
    ];
}
