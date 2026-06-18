<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slide extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subtitle',
        'body',
        'url',
        'button_label',
        'secondary_label',
        'secondary_url',
        'image',
        'sort_order',
        'statusenabled',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'statusenabled' => 'boolean',
        'sort_order' => 'integer',
    ];
}
