<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PortalPage extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'subtitle',
        'description',
        'hero_image',
        'statusenabled',
    ];

    protected $casts = [
        'statusenabled' => 'boolean',
    ];

    public function sections(): HasMany
    {
        return $this->hasMany(PortalPageSection::class);
    }

    public function stats(): HasMany
    {
        return $this->hasMany(PortalPageStat::class);
    }
}
