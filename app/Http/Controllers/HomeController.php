<?php

namespace App\Http\Controllers;

use App\Models\AppSection;
use App\Models\Category;
use App\Models\PanduanFile;
use App\Models\Slide;
use Carbon\Carbon;
use Illuminate\Contracts\Session\Session;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    private function _sections()
    {
        $query = AppSection::query();
        $query->with(['children.apps']);
        return $query->get();
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $slides = Slide::get();
        $categories = Category::get();
        $sections = $this->_sections();
        $berita = [];

        try {
            $data = Http::withoutVerifying()->timeout(60)->get('https://kedirikota.go.id/api/berita', [
                // 'page' => 1,
            ]);
            $data = json_decode($data->body());
            if (isset($data->berita)) {
                $berita = json_decode($data->berita);
                // dd($berita);
            }
        } catch (\Throwable $th) {
            // $isberita=false;
        }

        return view('pages.homepage', compact('slides', 'categories', 'sections', 'berita'));
    }

    public function beritaTop(Request $request)
    {
        $limit = (int) $request->query('limit', 10);
        $limit = max(1, min($limit, 30));

        $berita = [];

        try {
            $response = Http::withoutVerifying()
                ->timeout(30)
                ->get('https://kedirikota.go.id/api/berita');

            if (! $response->successful()) {
                return response()->json([
                    'message' => 'Gagal mengambil berita dari website resmi Kota Kediri.',
                    'data' => [],
                    'meta' => [
                        'source' => 'https://kedirikota.go.id/api/berita',
                        'status' => $response->status(),
                    ],
                ], 502);
            }

            $data = json_decode($response->body());

            if (isset($data->berita)) {
                $berita = json_decode($data->berita);
            }

            $items = collect($berita)
                ->take($limit)
                ->values()
                ->map(function ($item, $index) {
                    $id = $item->idpost ?? $item->id ?? ($index + 1);

                    $title = $this->cleanBeritaText(
                        $item->judul ?? $item->title ?? 'Berita Kota Kediri'
                    );

                    $slug = $item->judulurl ?? Str::slug($title);

                    $description = $this->cleanBeritaText(
                        $item->deskripsi ?? $item->isi ?? ''
                    );

                    $image = $this->normalizeBeritaImage(
                        $item->linkgambar ?? $item->gambar ?? null
                    );

                    $dateRaw = $item->tanggal
                        ?? $item->tgl
                        ?? $item->tglpost
                        ?? $item->created_at
                        ?? null;

                    return [
                        'id' => $id,
                        'slug' => (string) $slug,
                        'title' => $title,
                        'date' => $this->formatBeritaDate($dateRaw),
                        'tag' => $this->cleanBeritaText($item->kategori ?? 'Kota Kediri'),
                        'excerpt' => $description
                            ? Str::limit($description, 170)
                            : Str::limit($title, 170),
                        'image' => $image,
                        'url' => "https://www.kedirikota.go.id/p/berita/{$id}/{$slug}",
                        'content' => array_values(array_filter([
                            $description ?: 'Informasi berita resmi Pemerintah Kota Kediri.',
                            'Baca berita lengkap melalui tautan website resmi Pemerintah Kota Kediri.',
                        ])),
                    ];
                });

            return response()->json([
                'data' => $items,
                'meta' => [
                    'source' => 'https://kedirikota.go.id/api/berita',
                    'total' => $items->count(),
                    'limit' => $limit,
                ],
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat mengambil berita resmi Kota Kediri.',
                'error' => config('app.debug') ? $th->getMessage() : null,
                'data' => [],
            ], 500);
        }
    }

    private function cleanBeritaText($value): string
    {
        $text = html_entity_decode((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = strip_tags($text);
        $text = preg_replace('/\s+/', ' ', $text);

        return trim($text);
    }

    private function normalizeBeritaImage(?string $url): string
    {
        $url = trim((string) $url);

        if ($url === '') {
            return 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80';
        }

        if (Str::startsWith($url, ['http://', 'https://'])) {
            return $url;
        }

        return 'https://www.kedirikota.go.id/' . ltrim($url, '/');
    }

    private function formatBeritaDate($value): string
    {
        if (! $value) {
            return '';
        }

        try {
            Carbon::setLocale('id');

            return Carbon::parse($value)->translatedFormat('d F Y');
        } catch (\Throwable $th) {
            return (string) $value;
        }
    }

    public function kediri()
    {
        return view('pages.kediri');
    }

    public function panduan()
    {
        // Get Data File Panduan
        $data = PanduanFile::where('statusenabled', true)->get();
        return view('pages.panduan', compact('data'));
    }
}
