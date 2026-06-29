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
    ],

];
