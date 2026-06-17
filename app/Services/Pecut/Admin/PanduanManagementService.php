<?php

namespace App\Services\Pecut\Admin;

use App\Models\PanduanFile;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PanduanManagementService
{
    public function getIndexData(Request $request): array
    {
        $search = trim((string) $request->query('search', ''));
        $type = trim((string) $request->query('type', ''));
        $perPage = max(5, min((int) $request->query('per_page', 10), 50));

        $query = PanduanFile::query()
            ->where('statusenabled', true)
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('name_file', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('typefile', 'like', "%{$search}%")
                        ->orWhere('asset_file', 'like', "%{$search}%");
                });
            })
            ->when($type !== '', function ($query) use ($type) {
                $query->where('typefile', strtolower($type));
            })
            ->orderByDesc('id');

        $paginator = $query->paginate($perPage)->withQueryString();

        $paginator->getCollection()->transform(fn (PanduanFile $item) => $this->mapFile($item));

        return [
            'stats' => $this->getStats(),
            'files' => [
                'items' => $paginator->items(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'from' => $paginator->firstItem(),
                    'to' => $paginator->lastItem(),
                    'links' => $paginator->linkCollection()->toArray(),
                ],
            ],
            'file_types' => $this->fileTypes(),
        ];
    }

    public function fileTypes(): array
    {
        return [
            ['id' => 'pdf', 'text' => 'PDF'],
            ['id' => 'doc', 'text' => 'DOC'],
            ['id' => 'docx', 'text' => 'DOCX'],
            ['id' => 'ppt', 'text' => 'PPT'],
            ['id' => 'pptx', 'text' => 'PPTX'],
            ['id' => 'xls', 'text' => 'XLS'],
            ['id' => 'xlsx', 'text' => 'XLSX'],
            ['id' => 'csv', 'text' => 'CSV'],
            ['id' => 'txt', 'text' => 'TXT'],
            ['id' => 'jpg', 'text' => 'JPG'],
            ['id' => 'jpeg', 'text' => 'JPEG'],
            ['id' => 'png', 'text' => 'PNG'],
            ['id' => 'webp', 'text' => 'WEBP'],
        ];
    }

    public function store(Request $request): PanduanFile
    {
        $validated = $this->validateRequest($request, true);

        $filePath = $this->storeFile($request->file('berkas'));

        return PanduanFile::query()->create([
            'name_file' => $validated['name_file'],
            'description' => $validated['description'],
            'typefile' => strtolower($validated['typefile']),
            'asset_file' => $filePath,
            'statusenabled' => true,
        ]);
    }

    public function update(Request $request, PanduanFile $panduan): PanduanFile
    {
        $validated = $this->validateRequest($request, false);

        $payload = [
            'name_file' => $validated['name_file'],
            'description' => $validated['description'],
            'typefile' => strtolower($validated['typefile']),
        ];

        if ($request->hasFile('berkas')) {
            $this->deleteFile($panduan->asset_file);
            $payload['asset_file'] = $this->storeFile($request->file('berkas'));
        }

        $panduan->update($payload);

        return $panduan->refresh();
    }

    public function destroy(PanduanFile $panduan): void
    {
        $panduan->update([
            'statusenabled' => false,
        ]);
    }

    private function validateRequest(Request $request, bool $fileRequired): array
    {
        $fileRule = $fileRequired
            ? ['required', 'file', 'mimes:pdf,doc,docx,dot,ppt,pptx,xls,xlsx,csv,txt,jpg,jpeg,png,webp', 'max:10240']
            : ['nullable', 'file', 'mimes:pdf,doc,docx,dot,ppt,pptx,xls,xlsx,csv,txt,jpg,jpeg,png,webp', 'max:10240'];

        return $request->validate([
            'name_file' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'typefile' => ['required', 'string', 'max:20'],
            'berkas' => $fileRule,
        ], [
            'name_file.required' => 'Nama file wajib diisi.',
            'description.required' => 'Deskripsi wajib diisi.',
            'typefile.required' => 'Tipe file wajib dipilih.',
            'berkas.required' => 'Berkas panduan wajib diupload.',
            'berkas.mimes' => 'Format berkas tidak didukung.',
            'berkas.max' => 'Ukuran berkas maksimal 10 MB.',
        ]);
    }

    private function storeFile(?UploadedFile $file): ?string
    {
        if (! $file) {
            return null;
        }

        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension());
        $filename = now()->format('YmdHis') . '-' . Str::random(20) . '.' . $extension;

        $file->storeAs('public/panduan', $filename);

        return 'storage/panduan/' . $filename;
    }

    private function deleteFile(?string $path): void
    {
        $path = trim((string) $path);

        if ($path === '' || Str::startsWith($path, ['http://', 'https://'])) {
            return;
        }

        $relativePath = Str::after($path, 'storage/');

        if ($relativePath !== $path && Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }

    private function getStats(): array
    {
        $active = PanduanFile::query()->where('statusenabled', true);

        return [
            'total' => (clone $active)->count(),
            'pdf_total' => (clone $active)->where('typefile', 'pdf')->count(),
            'document_total' => (clone $active)->whereIn('typefile', ['doc', 'docx', 'dot'])->count(),
            'spreadsheet_total' => (clone $active)->whereIn('typefile', ['xls', 'xlsx', 'csv'])->count(),
            'presentation_total' => (clone $active)->whereIn('typefile', ['ppt', 'pptx'])->count(),
            'image_total' => (clone $active)->whereIn('typefile', ['jpg', 'jpeg', 'png', 'webp'])->count(),
        ];
    }

    private function mapFile(PanduanFile $item): array
    {
        return [
            'id' => $item->id,
            'name_file' => $item->name_file,
            'description' => $item->description,
            'typefile' => strtolower((string) $item->typefile),
            'asset_file' => $item->asset_file,
            'file_url' => $this->makeFileUrl($item->asset_file),
            'statusenabled' => (bool) $item->statusenabled,
            'created_at' => optional($item->created_at)->format('d-m-Y H:i'),
            'updated_at' => optional($item->updated_at)->format('d-m-Y H:i'),
        ];
    }

    private function makeFileUrl(?string $path): string
    {
        $path = trim((string) $path);

        if ($path === '') {
            return '#';
        }

        if (Str::startsWith($path, ['http://', 'https://', '/'])) {
            return $path;
        }

        return '/' . ltrim($path, '/');
    }
}
