<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Pecut\Admin\ThemeSettingManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ThemeSettingController extends Controller
{
    public function __construct(private readonly ThemeSettingManagementService $service)
    {
    }

    public function index(): Response
    {
        return Inertia::render('Admin/ThemeSetting/Index', [
            'meta' => [
                'title' => 'Tampilan Portal',
            ],
            'data' => $this->service->getPageData(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate($this->rules());

        $this->service->update($validated);

        return back()->with('success', 'Tema portal berhasil diperbarui.');
    }

    public function reset()
    {
        $this->service->reset();

        return back()->with('success', 'Tema portal berhasil dikembalikan ke default.');
    }

    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'primary_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'secondary_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'accent_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'background_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'surface_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'text_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'muted_text_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ];
    }
}
