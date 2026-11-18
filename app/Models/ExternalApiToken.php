<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExternalApiToken extends Model
{
    protected $fillable = [
        'service_name', 'access_token', 'refresh_token',
        'access_token_expires_at', 'refresh_token_expires_at',
        'last_login_at', 'last_refresh_at', 'last_attempt_at', 'last_error',
    ];

    protected $hidden = ['access_token', 'refresh_token'];

    protected $casts = [
        'access_token' => 'encrypted',
        'refresh_token' => 'encrypted',
        'access_token_expires_at' => 'integer',
        'refresh_token_expires_at' => 'integer',
        'last_login_at' => 'datetime',
        'last_refresh_at' => 'datetime',
        'last_attempt_at' => 'datetime',
    ];
}
