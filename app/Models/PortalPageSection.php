<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortalPageSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'portal_page_id',
        'title',
        'subtitle',
        'image',
        'content',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(PortalPage::class, 'portal_page_id');
    }
}
