<?php

namespace App\Services\Pecut\Admin;

use App\Models\Slide;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class HomeSlideManagementService
{
    public function getIndexData(Request $request): array
    {
        $search = trim((string) $request->query('search', ''));
        $status = $request->query('status', 'all');
        $perPage = (int) $request->query('per_page', 10);
        $perPage = in_array($perPage, [10, 20, 50, 100], true) ? $perPage : 10;

        $query = Slide::query();

        if ($search !== '') {
            $query->where(function ($sub) use ($search) {
                $sub->where('title', 'like', "%{$search}%")
                    ->orWhere('subtitle', 'like', "%{$search}%")
                    ->orWhere('body', 'like', "%{$search}%")
                    ->orWhere('url', 'like', "%{$search}%");
            });
        }

        if ($status === 'active') {
            $query->where('statusenabled', true);
        }

        if ($status === 'inactive') {
            $query->where('statusenabled', false);
        }

        /** @var LengthAwarePaginator $slides */
        $slides = $query
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        return [
            'stats' => $this->getStats(),
            'slides' => [
                'data' => $slides->getCollection()
                    ->map(fn (Slide $slide) => $this->mapSlide($slide))
                    ->values()
                    ->all(),
                'meta' => [
                    'current_page' => $slides->currentPage(),
                    'last_page' => $slides->lastPage(),
                    'per_page' => $slides->perPage(),
                    'total' => $slides->total(),
                    'from' => $slides->firstItem(),
                    'to' => $slides->lastItem(),
                ],
                'links' => $slides->linkCollection()->toArray(),
            ],
        ];
    }

    public function store(Request $request): Slide
    {
        $validated = $this->validatePayload($request, true);

        $payload = $this->buildPayload($request, $validated);
        $payload['image'] = $this->storeImage($request);
        $payload['created_by'] = $this->actorName($request);
        $payload['updated_by'] = $this->actorName($request);

        return Slide::query()->create($payload);
    }

    public function update(Request $request, Slide $slide): Slide
    {
        $validated = $this->validatePayload($request, false);

        $payload = $this->buildPayload($request, $validated);
        $payload['updated_by'] = $this->actorName($request);

        if ($request->hasFile('image')) {
            $this->deleteImage($slide->image);
            $payload['image'] = $this->storeImage($request);
        }

        $slide->update($payload);

        return $slide;
    }

    public function destroy(Slide $slide): void
    {
        $this->deleteImage($slide->image);
        $slide->delete();
    }

    private function validatePayload(Request $request, bool $isCreate): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:2000'],
            'url' => ['nullable', 'string', 'max:1000'],
            'button_label' => ['nullable', 'string', 'max:100'],
            'secondary_label' => ['nullable', 'string', 'max:100'],
            'secondary_url' => ['nullable', 'string', 'max:1000'],
            'image' => [$isCreate ? 'required' : 'nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:3072'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'statusenabled' => ['nullable', Rule::in([true, false, 1, 0, '1', '0', 'true', 'false'])],
        ], [
            'image.required' => 'Gambar slide wajib diupload saat membuat slide baru.',
        ]);
    }

    private function buildPayload(Request $request, array $validated): array
    {
        return [
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'body' => $validated['body'],
            'url' => $validated['url'] ?? null,
            'button_label' => $validated['button_label'] ?? null,
            'secondary_label' => $validated['secondary_label'] ?? null,
            'secondary_url' => $validated['secondary_url'] ?? null,
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
            'statusenabled' => filter_var($request->input('statusenabled', true), FILTER_VALIDATE_BOOLEAN),
        ];
    }

    private function getStats(): array
    {
        return [
            'total' => Slide::query()->count(),
            'active' => Slide::query()->where('statusenabled', true)->count(),
            'inactive' => Slide::query()->where('statusenabled', false)->count(),
        ];
    }

    private function mapSlide(Slide $slide): array
    {
        return [
            'id' => $slide->id,
            'title' => $slide->title,
            'subtitle' => $slide->subtitle,
            'body' => $slide->body,
            'url' => $slide->url,
            'button_label' => $slide->button_label,
            'secondary_label' => $slide->secondary_label,
            'secondary_url' => $slide->secondary_url,
            'image' => $this->normalizeImage($slide->image),
            'sort_order' => $slide->sort_order ?? 0,
            'statusenabled' => (bool) ($slide->statusenabled ?? true),
            'created_by' => $slide->created_by,
            'updated_by' => $slide->updated_by,
            'created_at' => optional($slide->created_at)->format('d-m-Y H:i'),
            'updated_at' => optional($slide->updated_at)->format('d-m-Y H:i'),
        ];
    }

    private function storeImage(Request $request): string
    {
        $path = $request->file('image')->store('slides', 'public');

        return 'storage/' . $path;
    }

    private function deleteImage(?string $image): void
    {
        $image = trim((string) $image);

        if ($image === '' || Str::startsWith($image, ['http://', 'https://'])) {
            return;
        }

        $path = Str::startsWith($image, 'storage/')
            ? Str::after($image, 'storage/')
            : Str::after($image, '/storage/');

        if ($path !== '') {
            Storage::disk('public')->delete($path);
        }
    }

    private function normalizeImage(?string $image): ?string
    {
        $image = trim((string) $image);

        if ($image === '') {
            return null;
        }

        if (Str::startsWith($image, ['http://', 'https://', '/'])) {
            return $image;
        }

        if (Str::startsWith($image, 'storage/')) {
            return '/' . $image;
        }

        return '/storage/slides/' . ltrim($image, '/');
    }

    private function actorName(Request $request): string
    {
        return $request->user()?->name ?: 'admin';
    }
}
