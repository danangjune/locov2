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
        'sort_order',
        'statusenabled',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'statusenabled' => 'boolean',
        ];
    }

    public function children(): HasMany
    {
        return $this->hasMany(AppSectionItem::class, 'section_id')
            ->orderBy('sort_order')
            ->orderBy('id');
    }
}
