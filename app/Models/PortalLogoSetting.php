<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortalLogoSetting extends Model
{
    protected $fillable = [
        'app_name',
        'alt_text',
        'header_logo',
        'footer_logo',
        'icon_logo',
        'favicon',
        'logo_svg',
        'logo_svg_inline',
        'logo_primary_color',
        'logo_secondary_color',
        'logo_accent_color',
        'logo_text_color',
        'use_theme_colors',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'use_theme_colors' => 'boolean',
    ];
}
