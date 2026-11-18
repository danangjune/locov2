<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'aduan' => [
        'api_url' => env('ADUAN_API_URL') . '/api',
        'appkey' => env('ADUAN_API_KEY'),
        'base_url' => env('ADUAN_API_URL'),
    ],

    'survey_digital' => [
        'url' => env('SURVEY_DIGITAL_URL'),
        'embed_url' => env('SURVEY_DIGITAL_EMBED_URL'),

        'app_id' => env('SURVEY_DIGITAL_APP_ID', 395),
        'token' => env('SURVEY_DIGITAL_TOKEN'),
        'refresh_token' => env('SURVEY_DIGITAL_REFRESH_TOKEN'),
        'timeout' => env('SURVEY_DIGITAL_TIMEOUT', 8),
        'refresh_before_seconds' => env('SURVEY_DIGITAL_REFRESH_BEFORE_SECONDS', 1800),
        'auto_login' => env('SURVEY_DIGITAL_AUTO_LOGIN', false),
        'login_path' => env('SURVEY_DIGITAL_LOGIN_PATH'),
        'login_username_field' => env('SURVEY_DIGITAL_LOGIN_USERNAME_FIELD', 'username'),
        'username' => env('SURVEY_DIGITAL_USERNAME'),
        'password' => env('SURVEY_DIGITAL_PASSWORD'),
        'access_token_json_path' => env('SURVEY_DIGITAL_ACCESS_TOKEN_JSON_PATH', 'data.token'),
        'refresh_token_json_path' => env('SURVEY_DIGITAL_REFRESH_TOKEN_JSON_PATH', 'data.refresh_token'),
    ],

    'kediri_kota' => [
        'base_url' => env('APP_URL_KEDIRIKOTA'),
        'url' => env('APP_URL_KEDIRIKOTA'), // compatibility alias
        'timeout' => env('KEDIRI_KOTA_API_TIMEOUT', 10),
    ],

];
