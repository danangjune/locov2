<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PanduanFile extends Model
{
    use HasFactory;

    protected $table = 'panduan_file';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'name_file',
        'description',
        'typefile',
        'asset_file',
        'statusenabled',
    ];
    
    protected function casts(): array
    {
        return [
            'statusenabled' => 'boolean',
        ];
    }

    
}
