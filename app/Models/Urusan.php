<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Urusan extends Model
{
    use HasFactory;

    protected $table = 'urusan';

    protected $fillable = [
        'title',
        'description',
        'icon_name',
    ];

    public function children(): HasMany
    {
        return $this->hasMany(AppLink::class, 'urusan_id')->where('is_active', true);
    }
}
