<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'sub_title',
        'icon',
    ];

    protected $appends = ['title_html'];

    public function getTitleHtmlAttribute() : string 
    {
        if ($this->id === 1) {
            return 'Layanan<br>Public Digital';
        }

        return 'Layanan<br>ASN Digital';
    }
}
