<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Footer extends Model
{
    use HasFactory;

    protected $table = 'content_footer';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'content',
        'parent',
        'url',
        'icon',
        'image',
        'idx_content',
        'tab_content',
        'statusenabled',
    ];

    protected function casts(): array
    {
        return [
            'statusenabled' => 'boolean',
        ];
    }

    // Anake Sopo ae
    public function children() 
    {
        return $this->hasMany(self::class, 'parent')->where('statusenabled', true)->orderBy('idx_content', 'ASC');
    }

    // Iki anake sopo
    public function parent() 
    {
        return $this->belongsTo(self::class, 'parent')->where('statusenabled', true);
    }
}
