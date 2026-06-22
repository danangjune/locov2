<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Pecut\Admin\LogoSettingManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LogoSettingController extends Controller
{
    public function __construct(
        private readonly LogoSettingManagementService $service
    ) {
    }

    public function index(): Response
    {
        return Inertia::render('Admin/LogoSetting/Index', [
            'meta' => [
                'title' => 'Logo Portal',
            ],
            'data' => $this->service->getPageData(),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'app_name' => ['nullable', 'string', 'max:120'],
            'alt_text' => ['nullable', 'string', 'max:160'],
            'logo_svg' => ['nullable', 'file', 'mimes:svg', 'max:2048'],
            'favicon' => ['nullable', 'file', 'mimes:ico,png,svg', 'max:1024'],
            'logo_primary_color' => ['nullable', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'logo_secondary_color' => ['nullable', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'logo_accent_color' => ['nullable', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'logo_text_color' => ['nullable', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'use_theme_colors' => ['nullable', 'boolean'],
            'remove_logo_svg' => ['nullable', 'boolean'],
            'remove_favicon' => ['nullable', 'boolean'],
        ], [
            'logo_svg.mimes' => 'Logo wajib berupa file SVG.',
            'logo_svg.max' => 'Ukuran logo SVG maksimal 2MB.',
            'logo_primary_color.regex' => 'Format warna utama harus HEX, contoh #1e6fa5.',
            'logo_secondary_color.regex' => 'Format warna sekunder harus HEX, contoh #0158b1.',
            'logo_accent_color.regex' => 'Format warna aksen harus HEX, contoh #38bdf8.',
            'logo_text_color.regex' => 'Format warna teks harus HEX, contoh #0158b1.',
        ]);

        $this->service->update($request);

        return back()->with('success', 'Logo SVG portal berhasil diperbarui.');
    }

    public function reset()
    {
        $this->service->reset();

        return back()->with('success', 'Logo SVG portal berhasil dikembalikan ke default.');
    }
}
