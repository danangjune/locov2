<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AppSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
    ];

    public function children() : HasMany 
    {
        return $this->hasMany(AppSectionItem::class, 'section_id');
    }
}
