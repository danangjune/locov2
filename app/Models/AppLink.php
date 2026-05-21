<?php

namespace App\Models;

use Google\Service\AdMob\App;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AppLink extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'urusan_id',
        'category_id',
        'parent',
        'code',
        'name',
        'alias',
        'description',
        'url',
        'icon',
        'image',
        'is_active',
        'is_sso',
        'app_from_id',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_sso' => 'boolean',
        ];
    }

    // Anake Sopo ae
    public function children() : HasMany
    {
        return $this->hasMany(self::class, 'parent')->with(['parentRoot', 'urusan', 'app_from']);
    }

    public function childrenRecursive() : HasMany 
    {
        return $this->children()->with('childrenRecursive');
    }

    // Iki anake sopo
    public function parentRoot() 
    {
        return $this->belongsTo(self::class, 'parent');
    }

    public function urusan() : BelongsTo 
    {
        return $this->belongsTo(Urusan::class, 'urusan_id');
    }

    public function category() : BelongsTo 
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function app_from() : BelongsTo 
    {
        return $this->belongsTo(AppFrom::class, 'app_from_id');
    }
}
