<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortalThemeSetting extends Model
{
    protected $fillable = [
        'key',
        'name',
        'primary_color',
        'secondary_color',
        'accent_color',
        'background_color',
        'surface_color',
        'text_color',
        'muted_text_color',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
