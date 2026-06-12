<?php

namespace App\Services\Pecut;

use App\Models\PanduanFile;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SupportPageService
{
    public function getGuideData(Request $request): array
    {
        $search = $request->query('search');

        $files = $this->getGuideFiles($search);

        return [
            'steps' => [
                [
                    'title' => 'Cari Aplikasi',
                    'description' => 'Gunakan kolom pencarian, kategori, atau filter layanan untuk menemukan aplikasi yang dibutuhkan.',
                    'icon' => 'Search',
                ],
                [
                    'title' => 'Pilih Ruang Portal',
                    'description' => 'Pilih ASN Digital atau Public Digital sesuai kebutuhan pengguna dan jenis layanan.',
                    'icon' => 'Layers3',
                ],
                [
                    'title' => 'Buka Detail Layanan',
                    'description' => 'Klik kartu aplikasi untuk melihat informasi, kategori, status akses, dan tombol menuju layanan.',
                    'icon' => 'Eye',
                ],
                [
                    'title' => 'Gunakan Bantuan',
                    'description' => 'Gunakan menu bantuan apabila membutuhkan informasi kontak, FAQ, atau panduan lanjutan.',
                    'icon' => 'HelpCircle',
                ],
            ],
            'files' => [
                'items' => $files,
                'meta' => [
                    'total' => count($files),
                ],
            ],
            'errors' => [
                'files' => null,
            ],
        ];
    }

    public function getHelpData(Request $request): array
    {
        return [
            'faqs' => [
                [
                    'question' => 'Apa itu PECUT?',
                    'answer' => 'PECUT adalah portal satu pintu layanan digital Pemerintah Kota Kediri untuk memudahkan akses aplikasi ASN dan masyarakat.',
                ],
                [
                    'question' => 'Apakah semua aplikasi sudah SSO?',
                    'answer' => 'Belum semuanya. Status aplikasi dibedakan menjadi SSO, Non SSO, dan Web Link agar integrasi dapat dilakukan bertahap.',
                ],
                [
                    'question' => 'Bagaimana cara mencari aplikasi?',
                    'answer' => 'Buka halaman Aplikasi, lalu gunakan pencarian, kategori, atau filter layanan sesuai kebutuhan.',
                ],
                [
                    'question' => 'Apa perbedaan ASN Digital dan Public Digital?',
                    'answer' => 'ASN Digital berisi layanan internal aparatur pemerintah, sedangkan Public Digital berisi layanan yang dapat diakses masyarakat umum.',
                ],
            ],
            'contacts' => [
                [
                    'label' => 'Email',
                    'value' => 'bantuan@pecut.kedirikota.go.id',
                    'icon' => 'Mail',
                ],
                [
                    'label' => 'Telepon',
                    'value' => '(0354) 000000',
                    'icon' => 'Phone',
                ],
                [
                    'label' => 'Lokasi',
                    'value' => 'Command Center Kota Kediri',
                    'icon' => 'MapPinned',
                ],
            ],
            'quick_links' => [
                [
                    'label' => 'Lihat Aplikasi',
                    'href' => '/apps',
                ],
                [
                    'label' => 'Panduan Pengguna',
                    'href' => '/guide',
                ],
                [
                    'label' => 'Info Layanan',
                    'href' => '/info',
                ],
            ],
        ];
    }

    public function getInfoData(Request $request): array
    {
        return [
            'items' => [
                [
                    'title' => 'Status Layanan',
                    'description' => 'Informasi status layanan aktif, pemeliharaan, atau gangguan sementara pada aplikasi pemerintah Kota Kediri.',
                    'icon' => 'ShieldCheck',
                    'status' => 'Aktif',
                ],
                [
                    'title' => 'Pengumuman',
                    'description' => 'Informasi resmi terkait update aplikasi, integrasi, perubahan layanan, dan agenda pengembangan portal.',
                    'icon' => 'Bell',
                    'status' => 'Informasi',
                ],
                [
                    'title' => 'Integrasi Aplikasi',
                    'description' => 'Pemetaan aplikasi SSO, Non SSO, dan Web Link untuk pengembangan integrasi layanan digital berikutnya.',
                    'icon' => 'Database',
                    'status' => 'Bertahap',
                ],
            ],
            'timeline' => [
                [
                    'title' => 'Portal public tersedia',
                    'description' => 'Halaman public PECUT mulai dimigrasikan ke React Inertia.',
                    'status' => 'Selesai',
                ],
                [
                    'title' => 'Integrasi data aplikasi',
                    'description' => 'Data aplikasi dibaca melalui Laravel Service dan dikirim ke halaman React.',
                    'status' => 'Berjalan',
                ],
                [
                    'title' => 'Penguatan SSO dan dashboard',
                    'description' => 'Penguatan integrasi login dan akses dashboard dilakukan bertahap.',
                    'status' => 'Rencana',
                ],
            ],
        ];
    }

    public function getKediriData(Request $request): array
    {
        return [
            'stats' => [
                [
                    'label' => 'Kecamatan',
                    'value' => '3',
                ],
                [
                    'label' => 'Kelurahan',
                    'value' => '46',
                ],
                [
                    'label' => 'Luas Wilayah',
                    'value' => '67,2 km²',
                ],
            ],

            'sections' => [
                [
                    'title' => 'Profil Wilayah Kota Kediri',
                    'subtitle' => 'Letak, posisi geografis, dan pembagian wilayah administratif Kota Kediri.',
                    'image' => '/assets/img/kediri/harmoni.jpeg',
                    'description' => [
                        'Profil Wilayah — Kota Kediri “berumah” di arah barat daya Ibu Kota Provinsi Jawa Timur, Surabaya. Jarak dari Kota Pahlawan sekitar 130 km. Untuk catatan jumlah penduduk, Kota Kediri merupakan kota terbesar nomor 3 di Jawa Timur setelah Surabaya dan Malang. Menurut Badan Pusat Statistik (BPS) Jawa Timur, sampai 2018 penduduk Kota Kediri berjumlah 292.768 jiwa. Seluruh wilayah kota ibarat berada dalam kepungan Kabupaten Kediri karena seluruh batas wilayahnya, baik utara, barat, selatan, maupun timur, berbatasan langsung dengan Kabupaten Kediri. Kota Kediri juga terbelah oleh sungai tua dengan histori dan heroisme besar, yaitu Kali Brantas.',

                        'Posisi Geografis — Kota Kediri berada pada posisi antara 111º05´ – 112º03´ Bujur Timur dan 7º45´ – 7º55´ Lintang Selatan. Dari aspek topografi, Kota Kediri terletak pada ketinggian rata-rata 67 meter di atas permukaan laut dengan tingkat kemiringan wilayah sekitar 0–40 persen.',

                        'Luas Kota — Luas wilayah Kota Kediri adalah 67,2 km². Secara administratif, wilayah ini terbagi menjadi tiga kecamatan, yaitu Kecamatan Mojoroto, Kecamatan Kota, dan Kecamatan Pesantren, serta 46 kelurahan. Kecamatan Mojoroto memiliki luas wilayah 26,93 km² dan terdiri dari 14 kelurahan. Kecamatan Kota memiliki luas wilayah 15,95 km² dan terdiri dari 17 kelurahan. Sementara itu, Kecamatan Pesantren memiliki luas wilayah 24,32 km² dan terdiri dari 15 kelurahan.',
                    ],
                ],

                [
                    'title' => 'Sejarah Singkat Kota Kediri',
                    'subtitle' => 'Jejak panjang Kediri dari masa kerajaan, kolonial, hingga perkembangan kota otonom.',
                    'image' => '/assets/img/kediri/gunung-klotok.jpg',
                    'description' => [
                        'Artefak arkeologi yang ditemukan pada tahun 2007 menunjukkan bahwa daerah sekitar Kediri menjadi lokasi Kerajaan Kediri, sebuah kerajaan Hindu pada abad ke-11. Awal mula Kediri sebagai pemukiman perkotaan dimulai ketika Airlangga memindahkan pusat pemerintahan kerajaannya dari Kahuripan ke Dahanapura, menurut Serat Calon Arang. Dahanapura atau Kota Api selanjutnya lebih dikenal sebagai Daha. Sepeninggal Raja Airlangga, wilayah Medang dibagi menjadi dua, yaitu Panjalu di barat dan Janggala di timur. Daha menjadi pusat pemerintahan Kerajaan Panjalu, sedangkan Kahuripan menjadi pusat pemerintahan Kerajaan Jenggala. Panjalu oleh penulis-penulis periode belakangan juga disebut sebagai Kerajaan Kadiri atau Kediri.',

                        'Semenjak Kerajaan Tumapel atau Singasari menguat, ibu kota Daha diserang dan kota ini menjadi kedudukan raja vazal. Kondisi tersebut terus berlanjut hingga masa Majapahit, Demak, dan Mataram. Kediri kemudian jatuh ke tangan VOC sebagai konsekuensi Geger Pecinan. Jawa Timur pada saat itu dikuasai Cakraningrat IV, adipati Madura yang memihak VOC dan menginginkan bebasnya Madura dari Kasunanan Kartasura. Karena keinginannya ditolak oleh VOC, Cakraningrat IV memberontak. Pemberontakan ini dikalahkan VOC dengan bantuan Pakubuwana II, Sunan Kartasura. Sebagai pembayaran, Kediri menjadi bagian wilayah yang dikuasai VOC. Kekuasaan Belanda atas Kediri terus berlangsung sampai masa Perang Kemerdekaan Indonesia.',

                        'Perkembangan Kota Kediri menjadi swapraja dimulai ketika Gemeente Kediri diresmikan pada tanggal 1 April 1906 berdasarkan Staatsblad atau Lembaran Negara No. 148 tertanggal 1 Maret 1906. Gemeente ini menjadi tempat kedudukan Residen Kediri dengan sifat pemerintahan otonom terbatas dan memiliki Gemeente Raad atau Dewan Kota/DPRD sebanyak 13 orang, yang terdiri dari delapan orang golongan Eropa dan yang disamakan, empat orang Pribumi, dan satu orang Bangsa Timur Asing. Berdasarkan Staatsblad No. 173 tertanggal 13 Maret 1906, ditetapkan pula anggaran keuangan sebesar f. 15.240 dalam satu tahun. Baru sejak tanggal 1 November 1928 berdasarkan Staatsblad No. 498 tanggal 1 Januari 1928, Kota Kediri menjadi Zelfstanding Gemeenteschap atau kota swapraja dengan otonomi penuh.',
                    ],
                ],

                [
                    'title' => 'Kediri, NGANGENI',
                    'subtitle' => 'Penguatan pelayanan publik, investasi, dan kemudahan akses layanan masyarakat.',
                    'image' => '/assets/img/kediri/taman-sekartaji.jpg',
                    'description' => [
                        'Untuk meningkatkan peluang investasi di Kota Kediri, pemerintah kota menerapkan berbagai layanan untuk memberikan kemudahan bagi calon investor. Salah satunya adalah pembentukan Badan Penanaman Modal (BPM) Kota Kediri yang mempunyai tugas melaksanakan sebagian urusan pemerintah daerah di bidang penanaman modal, meliputi perencanaan, pelaksanaan, dan pengendalian sesuai dengan kebijakan Wali Kota Kediri.',

                        'Pemerintah Kota Kediri juga terus berbenah dalam peningkatan pelayanan prima kepada masyarakat. Agar pelayanan terhadap masyarakat lebih representatif, pemerintah melakukan perbaikan gedung pelayanan di seluruh kelurahan yang ada di Kota Kediri. Tidak hanya gedung pelayanannya, sarana dan prasarana pendukung pelayanan juga diperbaiki. Dengan gedung pelayanan yang lebih baik, diharapkan suasana baru dapat tumbuh dan mendorong gairah serta semangat kerja yang produktif dalam melayani masyarakat.',

                        'Keberadaan BPM ditujukan untuk membantu para investor menanamkan modalnya di Kota Kediri. BPM memberikan kemudahan layanan perizinan yang disyaratkan. Dari sekitar 153 item perizinan, hanya empat yang berbayar, sedangkan sisanya gratis. Dengan berbagai kemudahan tersebut, Pemerintah Kota Kediri mendapatkan penghargaan “Investment Award” 2015 di bidang pelayanan penanaman modal oleh Gubernur Jawa Timur Soekarwo.',
                    ],
                ],
            ],

            'highlights' => [
                [
                    'title' => 'Kota Pelayanan',
                    'description' => 'Kediri terus memperkuat pelayanan publik yang mudah dijangkau, representatif, dan dekat dengan kebutuhan masyarakat.',
                ],
                [
                    'title' => 'Wilayah Strategis',
                    'description' => 'Berada di kawasan Kediri Raya dan dilalui Kali Brantas, Kota Kediri memiliki peran penting dalam aktivitas pemerintahan, ekonomi, dan sosial.',
                ],
                [
                    'title' => 'Identitas Sejarah',
                    'description' => 'Kediri memiliki jejak sejarah panjang sejak masa kerajaan hingga berkembang menjadi kota dengan otonomi pemerintahan.',
                ],
            ],
        ];
    }

    private function getGuideFiles(?string $search = null): array
    {
        try {
            $query = PanduanFile::query()
                ->where('statusenabled', true);

            if ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('name_file', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('typefile', 'like', "%{$search}%");
                });
            }

            return $query
                ->orderBy('id', 'desc')
                ->get()
                ->map(fn ($item) => [
                    'id' => $item->id,
                    'name' => $item->name_file ?: 'File Panduan',
                    'description' => $item->description ?: 'Dokumen panduan penggunaan PECUT.',
                    'type' => $item->typefile ?: 'file',
                    'url' => $this->makeFileUrl($item->asset_file),
                ])
                ->values()
                ->all();
        } catch (\Throwable $th) {
            return [];
        }
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
