<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppSectionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_id',
        'app_id',
        'sort_order',
        'statusenabled',
    ];

    protected function casts(): array
    {
        return [
            'section_id' => 'integer',
            'app_id' => 'integer',
            'sort_order' => 'integer',
            'statusenabled' => 'boolean',
        ];
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(AppSection::class, 'section_id');
    }

    public function apps(): BelongsTo
    {
        return $this->belongsTo(AppLink::class, 'app_id');
    }
}
