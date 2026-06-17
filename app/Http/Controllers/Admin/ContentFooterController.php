<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Footer;
use App\Services\Pecut\Admin\ContentFooterManagementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ContentFooterController extends Controller
{
    public function index(Request $request, ContentFooterManagementService $service)
    {
        $search = $request->query('search');
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);

        return Inertia::render('Admin/ContentFooter/Index', [
            'meta' => [
                'title' => 'Content Footer',
                'subtitle' => 'Kelola group dan item konten footer yang tampil pada portal PECUT.',
            ],
            'filter' => (object) [
                'search' => $search,
                'page' => $page,
                'per_page' => $perPage,
            ],
            'data' => $service->getIndexData($request),
        ]);
    }

    public function store(Request $request, ContentFooterManagementService $service)
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:1000'],
            'url' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:2048'],
            'parent' => ['nullable', 'integer'],
            'idx_content' => ['nullable', 'integer', 'min:0'],
        ]);

        $parent = (int) ($validated['parent'] ?? 0);
        $image = $this->storeImage($request);

        Footer::create([
            'content' => $validated['content'],
            'url' => $validated['url'] ?? null,
            'icon' => $validated['icon'] ?? null,
            'image' => $image,
            'parent' => $parent,
            'idx_content' => $validated['idx_content'] ?? $service->getNextSortOrder($parent),
            'tab_content' => null,
            'statusenabled' => true,
        ]);

        return back()->with('success', 'Content footer berhasil ditambahkan.');
    }

    public function update(Request $request, Footer $footer)
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:1000'],
            'url' => ['nullable', 'string', 'max:1000'],
            'icon' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:2048'],
            'parent' => ['nullable', 'integer'],
            'idx_content' => ['nullable', 'integer', 'min:0'],
        ]);

        $payload = [
            'content' => $validated['content'],
            'url' => $validated['url'] ?? null,
            'icon' => $validated['icon'] ?? null,
            'parent' => (int) ($validated['parent'] ?? 0),
            'idx_content' => $validated['idx_content'] ?? $footer->idx_content,
            'statusenabled' => true,
        ];

        if ($request->hasFile('image')) {
            $this->deleteImage($footer->image);
            $payload['image'] = $this->storeImage($request);
        }

        $footer->update($payload);

        return back()->with('success', 'Content footer berhasil diperbarui.');
    }

    public function destroy(Footer $footer)
    {
        $activeChildren = Footer::query()
            ->where('statusenabled', true)
            ->where('parent', $footer->id)
            ->count();

        if ($activeChildren > 0) {
            return back()->withErrors([
                'delete' => 'Content footer ini masih memiliki child. Hapus child terlebih dahulu sebelum menghapus parent.',
            ]);
        }

        $footer->update([
            'statusenabled' => false,
        ]);

        return back()->with('success', 'Content footer berhasil dihapus.');
    }

    public function find(string $id)
    {
        return response()->json(Footer::findOrFail($id));
    }

    private function storeImage(Request $request): ?string
    {
        if (! $request->hasFile('image')) {
            return null;
        }

        $fileName = $request->file('image')->hashName();
        $request->file('image')->storeAs('public/footer', $fileName);

        return 'storage/footer/' . $fileName;
    }

    private function deleteImage(?string $image): void
    {
        $image = trim((string) $image);

        if ($image === '' || str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
            return;
        }

        $path = str_replace('storage/', 'public/', ltrim($image, '/'));

        if (Storage::exists($path)) {
            Storage::delete($path);
        }
    }
}
