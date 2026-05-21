import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    Grid3X3,
    Building2,
    Users,
    ShieldCheck,
    Link as LinkIcon,
    LockKeyhole,
    ExternalLink,
    CalendarDays,
    ChevronRight,
    Bell,
    MapPin,
    Star,
    Sparkles,
    ArrowRight,
    Smartphone,
    BriefcaseBusiness,
    GraduationCap,
    HeartPulse,
    Landmark,
    FileCheck2,
    Megaphone,
    Globe2,
    UserRoundCheck,
    CloudSun,
    ScrollText,
    Menu,
    X,
    BarChart3,
    Wifi,
    Leaf,
    ShoppingBag,
    Archive,
    BookOpen,
    ShieldAlert,
    Bus,
    Home,
    Scale,
    Coins,
    Handshake,
    Newspaper,
    HelpCircle,
    Mail,
    Phone,
    MapPinned,
    Clock3,
    CheckCircle2,
    ArrowLeft,
    Filter,
    Eye,
    Settings,
    Database,
    User,
    KeyRound,
    Info,
    Layers3,
    CalendarCheck2,
    MessageCircle,
    FileQuestion,
    ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
    "Semua Aplikasi",
    "Pendidikan",
    "Kesehatan",
    "Pekerjaan Umum dan Penataan Ruang",
    "Perumahan Rakyat dan Kawasan Pemukiman",
    "Ketentraman, Ketertiban Umum, dan Perlindungan Masyarakat",
    "Sosial",
    "Tenaga Kerja",
    "Lingkungan Hidup",
    "Administrasi dan Pencatatan Sipil",
    "Pemberdayaan Masyarakat dan Desa",
    "Perhubungan",
    "Komunikasi dan Informatika",
    "Koperasi, Usaha Kecil dan Menengah",
    "Penanaman Modal",
    "Statistik",
    "Persandian",
    "Perpustakaan",
    "Kearsipan",
    "Pertanian",
    "Perdagangan",
    "Keuangan",
    "Pengadaan Barang & Jasa",
    "Pengaduan",
    "Hukum",
    "Web Profil OPD",
    "Pelayanan",
];

const appData = [
    {
        slug: "asn-digital",
        name: "ASN Digital",
        desc: "Pintu masuk layanan internal ASN, administrasi, presensi, dan informasi kepegawaian.",
        detail: "ASN Digital dirancang sebagai ruang kerja terpadu bagi aparatur Pemerintah Kota Kediri. Di halaman implementasi asli, layanan ini dapat dihubungkan dengan SSO, data kepegawaian, presensi, dan aplikasi internal OPD.",
        type: "ASN Digital",
        category: "Komunikasi dan Informatika",
        mode: "SSO",
        popular: true,
        icon: UserRoundCheck,
    },
    {
        slug: "e-suket-kota-kediri",
        name: "E-Suket Kota Kediri",
        desc: "Pengajuan surat keterangan warga secara digital dari kelurahan hingga kecamatan.",
        detail: "E-Suket menjadi layanan pengajuan surat keterangan secara digital. Integrasi ke PECUT dapat diarahkan ke halaman layanan, tracking pengajuan, dan autentikasi warga atau petugas sesuai sistem backend yang sudah disiapkan.",
        type: "Public Digital",
        category: "Pelayanan",
        mode: "SSO",
        popular: true,
        icon: FileCheck2,
    },
    {
        slug: "lapor-mbak-wali",
        name: "Lapor Mbak Wali",
        desc: "Kanal pengaduan dan aspirasi masyarakat Kota Kediri secara cepat dan terdokumentasi.",
        detail: "Lapor Mbak Wali dapat menjadi kanal pengaduan warga yang terhubung dengan status tindak lanjut. Pada backend asli, tombol akses dapat diarahkan ke modul pengaduan atau sistem existing.",
        type: "Public Digital",
        category: "Pengaduan",
        mode: "SSO",
        popular: true,
        icon: Megaphone,
    },
    {
        slug: "ppid-kota-kediri",
        name: "PPID Kota Kediri",
        desc: "Permohonan informasi publik, daftar informasi, dan transparansi layanan pemerintah.",
        detail: "PPID Kota Kediri dapat ditampilkan sebagai layanan informasi publik yang memuat permohonan informasi, daftar informasi publik, serta kanal transparansi pemerintah.",
        type: "Public Digital",
        category: "Komunikasi dan Informatika",
        mode: "Link",
        popular: true,
        icon: Globe2,
    },
    {
        slug: "pajak-daerah-online",
        name: "Pajak Daerah Online",
        desc: "Cek tagihan, pembayaran, dan informasi pajak daerah Kota Kediri.",
        detail: "Layanan pajak daerah dapat menampilkan akses cek tagihan, riwayat pembayaran, dan informasi pajak daerah. Integrasi transaksi tetap disiapkan melalui backend resmi.",
        type: "Public Digital",
        category: "Keuangan",
        mode: "Non SSO",
        popular: true,
        icon: Landmark,
    },
    {
        slug: "kediri-sehat",
        name: "Kediri Sehat",
        desc: "Informasi layanan kesehatan, fasilitas kesehatan, dan layanan publik bidang kesehatan.",
        detail: "Kediri Sehat disiapkan sebagai etalase layanan kesehatan, informasi fasilitas kesehatan, jadwal layanan, dan integrasi aplikasi bidang kesehatan.",
        type: "Public Digital",
        category: "Kesehatan",
        mode: "Link",
        popular: true,
        icon: HeartPulse,
    },
    {
        slug: "sipd-internal",
        name: "SIPD Internal",
        desc: "Dashboard kerja perangkat daerah untuk pemantauan program dan pelaporan internal.",
        detail: "SIPD Internal merupakan ruang akses untuk pemantauan program dan pelaporan perangkat daerah. Pada implementasi asli, akses dapat dibatasi untuk ASN dan OPD terkait.",
        type: "ASN Digital",
        category: "Statistik",
        mode: "SSO",
        popular: false,
        icon: BarChart3,
    },
    {
        slug: "e-office",
        name: "E-Office",
        desc: "Naskah dinas, disposisi, agenda surat, dan arsip kerja perangkat daerah.",
        detail: "E-Office menjadi pintu masuk layanan administrasi perkantoran digital seperti naskah dinas, disposisi, agenda surat, dan arsip kerja internal.",
        type: "ASN Digital",
        category: "Kearsipan",
        mode: "SSO",
        popular: true,
        icon: ScrollText,
    },
    {
        slug: "kediri-smart-mobility",
        name: "Kediri Smart Mobility",
        desc: "Informasi lalu lintas, transportasi, dan layanan mobilitas perkotaan.",
        detail: "Kediri Smart Mobility dapat menampilkan informasi transportasi, lalu lintas, jalur angkutan, dan layanan mobilitas perkotaan.",
        type: "Public Digital",
        category: "Perhubungan",
        mode: "Link",
        popular: false,
        icon: Bus,
    },
    {
        slug: "satu-data-kediri",
        name: "Satu Data Kediri",
        desc: "Portal statistik sektoral dan data prioritas Pemerintah Kota Kediri.",
        detail: "Satu Data Kediri menjadi ruang publikasi statistik sektoral, data prioritas, dan dashboard data yang mendukung pengambilan keputusan.",
        type: "Public Digital",
        category: "Statistik",
        mode: "Link",
        popular: false,
        icon: Grid3X3,
    },
    {
        slug: "katalog-umkm",
        name: "Katalog UMKM",
        desc: "Direktori produk UMKM dan informasi promosi ekonomi lokal Kota Kediri.",
        detail: "Katalog UMKM disiapkan sebagai etalase produk lokal, direktori pelaku usaha, dan promosi ekonomi masyarakat Kota Kediri.",
        type: "Public Digital",
        category: "Koperasi, Usaha Kecil dan Menengah",
        mode: "Link",
        popular: false,
        icon: BriefcaseBusiness,
    },
    {
        slug: "kediri-belajar",
        name: "Kediri Belajar",
        desc: "Akses informasi pendidikan, sekolah, dan program belajar masyarakat.",
        detail: "Kediri Belajar dapat menjadi pusat informasi pendidikan, sekolah, program belajar, dan layanan pembelajaran digital.",
        type: "Public Digital",
        category: "Pendidikan",
        mode: "Non SSO",
        popular: false,
        icon: GraduationCap,
    },
    {
        slug: "kediri-wifi-publik",
        name: "Kediri WiFi Publik",
        desc: "Informasi titik internet publik dan fasilitas digital masyarakat.",
        detail: "Kediri WiFi Publik dapat memuat daftar titik akses internet publik, peta lokasi, serta informasi fasilitas digital masyarakat.",
        type: "Public Digital",
        category: "Komunikasi dan Informatika",
        mode: "Link",
        popular: false,
        icon: Wifi,
    },
    {
        slug: "lingkungan-kediri",
        name: "Lingkungan Kediri",
        desc: "Layanan pelaporan lingkungan, kebersihan, dan informasi ruang hijau kota.",
        detail: "Lingkungan Kediri dapat menampilkan informasi kebersihan kota, ruang hijau, pelaporan lingkungan, dan layanan bidang lingkungan hidup.",
        type: "Public Digital",
        category: "Lingkungan Hidup",
        mode: "Non SSO",
        popular: false,
        icon: Leaf,
    },
    {
        slug: "pengadaan-online",
        name: "Pengadaan Online",
        desc: "Informasi pengadaan barang dan jasa Pemerintah Kota Kediri.",
        detail: "Pengadaan Online menjadi akses ringkas menuju informasi pengadaan barang dan jasa. Backend dapat diarahkan ke sistem pengadaan yang berlaku.",
        type: "ASN Digital",
        category: "Pengadaan Barang & Jasa",
        mode: "Link",
        popular: false,
        icon: ShoppingBag,
    },
    {
        slug: "jdih-kota-kediri",
        name: "JDIH Kota Kediri",
        desc: "Dokumentasi hukum, regulasi, produk hukum daerah, dan informasi peraturan.",
        detail: "JDIH Kota Kediri disiapkan sebagai etalase produk hukum daerah, peraturan, regulasi, dan dokumentasi hukum resmi.",
        type: "Public Digital",
        category: "Hukum",
        mode: "Link",
        popular: false,
        icon: Scale,
    },
    {
        slug: "arsip-digital-opd",
        name: "Arsip Digital OPD",
        desc: "Pengelolaan arsip digital perangkat daerah secara tertib dan terintegrasi.",
        detail: "Arsip Digital OPD menjadi ruang kerja untuk pengelolaan arsip perangkat daerah. Akses dapat dibatasi sesuai role dan unit kerja.",
        type: "ASN Digital",
        category: "Kearsipan",
        mode: "SSO",
        popular: false,
        icon: Archive,
    },
    {
        slug: "perpustakaan-digital",
        name: "Perpustakaan Digital",
        desc: "Akses koleksi bacaan, katalog, dan layanan literasi digital untuk masyarakat.",
        detail: "Perpustakaan Digital dapat memuat katalog buku, layanan literasi, koleksi digital, dan informasi kegiatan perpustakaan.",
        type: "Public Digital",
        category: "Perpustakaan",
        mode: "Non SSO",
        popular: false,
        icon: BookOpen,
    },
    {
        slug: "kediri-siaga",
        name: "Kediri Siaga",
        desc: "Informasi kedaruratan, ketertiban umum, dan perlindungan masyarakat.",
        detail: "Kediri Siaga menampilkan informasi kedaruratan, ketertiban umum, kanal laporan cepat, serta kontak layanan perlindungan masyarakat.",
        type: "Public Digital",
        category: "Ketentraman, Ketertiban Umum, dan Perlindungan Masyarakat",
        mode: "Link",
        popular: false,
        icon: ShieldAlert,
    },
    {
        slug: "profil-opd-kota-kediri",
        name: "Profil OPD Kota Kediri",
        desc: "Direktori web profil perangkat daerah, kecamatan, dan kelurahan.",
        detail: "Profil OPD Kota Kediri menjadi direktori perangkat daerah, kecamatan, kelurahan, serta informasi kanal resmi masing-masing unit.",
        type: "Public Digital",
        category: "Web Profil OPD",
        mode: "Link",
        popular: false,
        icon: Home,
    },
    {
        slug: "investasi-kediri",
        name: "Investasi Kediri",
        desc: "Informasi peluang investasi, perizinan, dan layanan penanaman modal.",
        detail: "Investasi Kediri dapat memuat peluang investasi, profil ekonomi kota, informasi perizinan, dan kanal konsultasi penanaman modal.",
        type: "Public Digital",
        category: "Penanaman Modal",
        mode: "Link",
        popular: false,
        icon: Handshake,
    },
    {
        slug: "retribusi-digital",
        name: "Retribusi Digital",
        desc: "Informasi retribusi daerah dan layanan pembayaran non tunai.",
        detail: "Retribusi Digital dapat disiapkan untuk informasi retribusi, riwayat tagihan, serta integrasi pembayaran non tunai melalui backend resmi.",
        type: "Public Digital",
        category: "Keuangan",
        mode: "Non SSO",
        popular: false,
        icon: Coins,
    },
];

const newsData = [
    {
        slug: "pemkot-kediri-perkuat-integrasi-layanan-digital-melalui-pecut",
        title: "Pemkot Kediri Perkuat Integrasi Layanan Digital Melalui PECUT",
        date: "20 Mei 2026",
        tag: "Transformasi Digital",
        excerpt:
            "Portal satu pintu disiapkan untuk memudahkan masyarakat dan ASN menemukan layanan pemerintah dalam satu halaman.",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
        content: [
            "Pemerintah Kota Kediri menyiapkan PECUT sebagai portal efisien, cepat, mudah, dan terpadu untuk menyatukan akses aplikasi pemerintah dalam satu halaman utama.",
            "Melalui konsep ini, masyarakat dapat menemukan layanan publik, berita, agenda, dan kanal informasi kota tanpa harus mencari alamat aplikasi satu per satu.",
            "Untuk lingkungan internal, PECUT juga disiapkan sebagai pintu masuk aplikasi ASN Digital sehingga pemetaan aplikasi, SSO, dan pengelolaan akses dapat dilakukan lebih tertata.",
        ],
    },
    {
        slug: "layanan-pengaduan-warga-lebih-mudah-dipantau-secara-realtime",
        title: "Layanan Pengaduan Warga Kini Lebih Mudah Dipantau Secara Realtime",
        date: "19 Mei 2026",
        tag: "Pengaduan",
        excerpt:
            "Masyarakat dapat melihat status tindak lanjut pengaduan mulai dari masuk, diproses, hingga selesai.",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
        content: [
            "Kanal pengaduan warga menjadi salah satu layanan yang akan ditonjolkan di PECUT karena termasuk layanan yang sering diakses masyarakat.",
            "Rancangan halaman disiapkan agar status layanan dapat ditampilkan lebih jelas, mulai dari pengajuan, proses, tindak lanjut, hingga selesai.",
            "Integrasi backend nantinya dapat menyesuaikan sistem pengaduan yang sudah berjalan di Pemerintah Kota Kediri.",
        ],
    },
    {
        slug: "diskominfo-dorong-standarisasi-sso-aplikasi-perangkat-daerah",
        title: "Diskominfo Dorong Standarisasi SSO untuk Aplikasi Perangkat Daerah",
        date: "18 Mei 2026",
        tag: "SPBE",
        excerpt:
            "Pemetaan aplikasi dilakukan agar layanan internal dan publik dapat lebih aman, efisien, dan mudah digunakan.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
        content: [
            "Standarisasi SSO menjadi bagian penting dalam pengembangan portal layanan digital karena membantu pengguna mengakses banyak aplikasi dengan autentikasi yang lebih rapi.",
            "Aplikasi yang belum mendukung SSO tetap dapat ditampilkan sebagai tautan atau layanan non-SSO sampai proses integrasi berikutnya dilakukan.",
            "Dengan pendekatan bertahap, PECUT dapat menjadi peta besar transformasi digital Pemerintah Kota Kediri.",
        ],
    },
    {
        slug: "agenda-digitalisasi-layanan-publik-terus-diperkuat",
        title: "Agenda Digitalisasi Layanan Publik Terus Diperkuat",
        date: "17 Mei 2026",
        tag: "Pelayanan Publik",
        excerpt:
            "Layanan prioritas akan dipetakan agar masyarakat lebih mudah menemukan aplikasi sesuai kebutuhan.",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
        content: [
            "Pemetaan layanan publik dilakukan untuk memastikan setiap kanal digital memiliki informasi yang jelas dan mudah ditemukan.",
            "Kategori layanan seperti kesehatan, pendidikan, pengaduan, administrasi kependudukan, dan keuangan menjadi bagian dari struktur awal portal.",
            "Tampilan portal dibuat responsif agar dapat digunakan dari perangkat desktop maupun mobile.",
        ],
    },
    {
        slug: "portal-pecut-disiapkan-untuk-kolaborasi-antar-opd",
        title: "Portal PECUT Disiapkan untuk Kolaborasi Antar OPD",
        date: "16 Mei 2026",
        tag: "Kolaborasi OPD",
        excerpt:
            "Perangkat daerah dapat mengelola informasi aplikasi, berita, dan agenda sesuai kewenangan masing-masing.",
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
        content: [
            "PECUT dirancang tidak hanya sebagai halaman daftar aplikasi, tetapi juga sebagai ruang kolaborasi lintas perangkat daerah.",
            "Pengelolaan informasi aplikasi, berita, dan agenda dapat dikembangkan melalui dashboard admin pada tahap backend.",
            "Dengan pola ini, data portal dapat tetap hidup dan relevan sesuai perkembangan layanan digital kota.",
        ],
    },
    {
        slug: "masyarakat-dapat-akses-layanan-kota-lebih-cepat",
        title: "Masyarakat Dapat Akses Layanan Kota Lebih Cepat",
        date: "15 Mei 2026",
        tag: "Masyarakat Digital",
        excerpt:
            "Portal satu pintu membantu masyarakat menemukan layanan tanpa perlu mengingat banyak alamat website.",
        image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
        content: [
            "Masyarakat sering membutuhkan akses cepat ke layanan tertentu, seperti pengaduan, surat keterangan, pajak, kesehatan, atau informasi publik.",
            "PECUT membantu menyederhanakan akses tersebut melalui pencarian, kategori layanan, dan halaman detail aplikasi.",
            "Ke depan, portal ini dapat dikembangkan dengan personalisasi layanan sesuai akun pengguna.",
        ],
    },
];

const agendaGovernmentData = [
    {
        slug: "rapat-koordinasi-integrasi-aplikasi-opd",
        title: "Rapat Koordinasi Integrasi Aplikasi OPD",
        date: 22,
        fullDate: "22 Mei 2026",
        time: "09.00 WIB",
        type: "Agenda Pemerintah",
        location: "Ruang Joyoboyo",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
        description:
            "Rapat koordinasi untuk memetakan aplikasi perangkat daerah, status integrasi SSO, dan kebutuhan pengelolaan data portal.",
    },
    {
        slug: "pelatihan-admin-portal-pecut",
        title: "Pelatihan Admin Portal PECUT",
        date: 27,
        fullDate: "27 Mei 2026",
        time: "13.00 WIB",
        type: "Agenda Pemerintah",
        location: "Command Center",
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
        description:
            "Pelatihan pengelolaan data aplikasi, berita, agenda, dan kategori layanan untuk admin perangkat daerah.",
    },
    {
        slug: "forum-evaluasi-spbe-kota-kediri",
        title: "Forum Evaluasi SPBE Kota Kediri",
        date: 30,
        fullDate: "30 Mei 2026",
        time: "08.30 WIB",
        type: "Agenda Pemerintah",
        location: "Balai Kota Kediri",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
        description:
            "Forum evaluasi tata kelola layanan digital dan rencana peningkatan kematangan SPBE di lingkungan Pemerintah Kota Kediri.",
    },
];

const agendaPublicData = [
    {
        slug: "sosialisasi-layanan-digital-untuk-masyarakat",
        title: "Sosialisasi Layanan Digital untuk Masyarakat",
        date: 24,
        fullDate: "24 Mei 2026",
        time: "08.30 WIB",
        type: "Agenda Publik",
        location: "Balai Kota Kediri",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
        description:
            "Sosialisasi penggunaan layanan digital Pemerintah Kota Kediri untuk masyarakat umum.",
    },
    {
        slug: "festival-umkm-kota-kediri",
        title: "Festival UMKM Kota Kediri",
        date: 25,
        fullDate: "25 Mei 2026",
        time: "15.00 WIB",
        type: "Agenda Publik",
        location: "Taman Sekartaji",
        image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
        description:
            "Kegiatan promosi produk UMKM lokal sekaligus pengenalan katalog digital UMKM Kota Kediri.",
    },
    {
        slug: "pelayanan-publik-keliling",
        title: "Pelayanan Publik Keliling",
        date: 28,
        fullDate: "28 Mei 2026",
        time: "09.00 WIB",
        type: "Agenda Publik",
        location: "Alun-Alun Kediri",
        image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80",
        description:
            "Layanan administrasi, informasi publik, dan konsultasi layanan digital yang hadir lebih dekat ke masyarakat.",
    },
];

const allAgendaData = [...agendaGovernmentData, ...agendaPublicData];

const appPalettes = [
    {
        bg: "from-sky-500 to-cyan-400",
        soft: "from-sky-50 to-cyan-50",
        text: "text-sky-700",
        shadow: "shadow-sky-100",
    },
    {
        bg: "from-violet-500 to-fuchsia-400",
        soft: "from-violet-50 to-fuchsia-50",
        text: "text-violet-700",
        shadow: "shadow-violet-100",
    },
    {
        bg: "from-emerald-500 to-teal-400",
        soft: "from-emerald-50 to-teal-50",
        text: "text-emerald-700",
        shadow: "shadow-emerald-100",
    },
    {
        bg: "from-amber-400 to-orange-400",
        soft: "from-amber-50 to-orange-50",
        text: "text-orange-700",
        shadow: "shadow-amber-100",
    },
    {
        bg: "from-rose-500 to-pink-400",
        soft: "from-rose-50 to-pink-50",
        text: "text-rose-700",
        shadow: "shadow-rose-100",
    },
    {
        bg: "from-indigo-500 to-blue-500",
        soft: "from-indigo-50 to-blue-50",
        text: "text-indigo-700",
        shadow: "shadow-indigo-100",
    },
    {
        bg: "from-lime-500 to-green-400",
        soft: "from-lime-50 to-green-50",
        text: "text-green-700",
        shadow: "shadow-green-100",
    },
    {
        bg: "from-red-500 to-orange-500",
        soft: "from-red-50 to-orange-50",
        text: "text-red-700",
        shadow: "shadow-red-100",
    },
];

function createSlug(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getAppIcon(app) {
    const text = [
        app?.name,
        app?.alias,
        app?.description,
        app?.urusan?.title,
        app?.category?.title,
    ]
        .join(" ")
        .toLowerCase();

    if (text.includes("hukum") || text.includes("jdih")) return Scale;
    if (
        text.includes("pengadaan") ||
        text.includes("lpse") ||
        text.includes("pbj")
    )
        return ShoppingBag;
    if (
        text.includes("keuangan") ||
        text.includes("pajak") ||
        text.includes("retribusi")
    )
        return Coins;
    if (text.includes("kesehatan") || text.includes("sehat")) return HeartPulse;
    if (
        text.includes("pendidikan") ||
        text.includes("sekolah") ||
        text.includes("belajar")
    )
        return GraduationCap;
    if (text.includes("statistik") || text.includes("data")) return BarChart3;
    if (text.includes("kearsipan") || text.includes("arsip")) return Archive;
    if (text.includes("perpustakaan") || text.includes("buku")) return BookOpen;
    if (text.includes("perhubungan") || text.includes("transportasi"))
        return Bus;
    if (text.includes("lingkungan")) return Leaf;
    if (text.includes("pengaduan") || text.includes("lapor")) return Megaphone;
    if (
        text.includes("web profil") ||
        text.includes("website") ||
        text.includes("profil")
    )
        return Globe2;
    if (
        text.includes("sso") ||
        text.includes("asn") ||
        text.includes("pegawai")
    )
        return UserRoundCheck;

    return Grid3X3;
}

function mapApiApp(item, index = 0) {
    const urusanTitle = item?.urusan?.title || "Pelayanan";
    const categoryTitle = item?.category?.title || "Layanan Digital";

    const categoryId = Number(item?.category_id ?? item?.category?.id);

    const portalType = categoryId === 2 ? "ASN Digital" : "Public Digital";

    return {
        id: item.id,
        slug: `${item.id}-${createSlug(item.name || item.alias || "aplikasi")}`,
        name: item.name || item.alias || "Aplikasi",
        alias: item.alias || "",
        desc:
            item.description ||
            item.alias ||
            item?.category?.sub_title ||
            "Layanan digital Pemerintah Kota Kediri.",
        detail:
            item.description ||
            item.alias ||
            item?.category?.sub_title ||
            "Layanan digital Pemerintah Kota Kediri yang terhubung melalui portal PECUT.",
        type: portalType,
        category: urusanTitle,
        categoryOriginal: categoryTitle,
        categoryId: categoryId,
        mode: item.is_sso ? "SSO" : "Link",
        popular: index < 12,
        icon: getAppIcon(item),
        image: item.image,
        url: item.url,
        redirectUrl: `/redirect/${item.id}`,
        raw: item,
    };
}

async function fetchAppsByCategory(categoryId) {
    const firstResponse = await fetch(`/api/apps?category_id=${categoryId}`, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!firstResponse.ok) {
        throw new Error(
            `Gagal ambil /api/apps?category_id=${categoryId}: ${firstResponse.status}`,
        );
    }

    const firstResult = await firstResponse.json();
    const firstData = Array.isArray(firstResult?.data) ? firstResult.data : [];
    const lastPage = Number(firstResult?.meta?.last_page || 1);

    if (lastPage <= 1) {
        return {
            data: firstData,
            meta: firstResult?.meta || null,
        };
    }

    const pageRequests = [];

    for (let page = 2; page <= lastPage; page += 1) {
        pageRequests.push(
            fetch(`/api/apps?category_id=${categoryId}&page=${page}`, {
                headers: {
                    Accept: "application/json",
                },
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `Gagal ambil /api/apps?category_id=${categoryId}&page=${page}: ${response.status}`,
                    );
                }

                return response.json();
            }),
        );
    }

    const otherResults = await Promise.all(pageRequests);
    const otherData = otherResults.flatMap((result) =>
        Array.isArray(result?.data) ? result.data : [],
    );

    return {
        data: [...firstData, ...otherData],
        meta: firstResult?.meta || null,
    };
}

async function fetchAllAppsFromApi() {
    const [publicApps, asnApps] = await Promise.all([
        fetchAppsByCategory(1),
        fetchAppsByCategory(2),
    ]);

    return {
        data: [...publicApps.data, ...asnApps.data],
        meta: {
            total:
                Number(publicApps?.meta?.total || publicApps.data.length) +
                Number(asnApps?.meta?.total || asnApps.data.length),
            public_total: Number(
                publicApps?.meta?.total || publicApps.data.length,
            ),
            asn_total: Number(asnApps?.meta?.total || asnApps.data.length),
        },
    };
}

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function parseHash() {
    const raw = window.location.hash.replace(/^#\/?/, "");
    return raw || "home";
}

function useHashRoute() {
    const [route, setRoute] = useState(parseHash);

    useEffect(() => {
        const onHashChange = () => {
            setRoute(parseHash());
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
        window.addEventListener("hashchange", onHashChange);
        if (!window.location.hash) window.location.hash = "/home";
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    const navigate = (path) => {
        window.location.hash = `/${path}`;
    };

    return [route, navigate];
}

function PageShell({ children }) {
    return <div className="min-h-[60vh]">{children}</div>;
}

function PageHero({
    eyebrow,
    title,
    subtitle,
    icon: Icon = Sparkles,
    gradient = "from-sky-600 to-cyan-500",
}) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50">
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 rounded-[2rem] border border-white bg-white/70 p-8 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">
                            {eyebrow}
                        </p>
                        <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                            {title}
                        </h1>
                        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                            {subtitle}
                        </p>
                    </div>
                    <div
                        className={classNames(
                            "flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.7rem] bg-gradient-to-br text-white shadow-xl",
                            gradient,
                        )}
                    >
                        <Icon className="h-10 w-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function SectionHeader({ eyebrow, title, subtitle, action, onAction }) {
    return (
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
                {eyebrow && (
                    <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
                        {eyebrow}
                    </p>
                )}
                <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-2 max-w-2xl text-base text-slate-500">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && (
                <button
                    onClick={onAction}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-sm hover:bg-sky-50"
                >
                    {action}
                    <ArrowRight className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

function ModeBadge({ mode }) {
    const config = {
        SSO: {
            label: "SSO",
            icon: LockKeyhole,
            className: "bg-sky-50 text-sky-700 ring-sky-100",
        },
        "Non SSO": {
            label: "Non SSO",
            icon: ShieldCheck,
            className: "bg-amber-50 text-amber-700 ring-amber-100",
        },
        Link: {
            label: "Link Web",
            icon: LinkIcon,
            className: "bg-slate-50 text-slate-700 ring-slate-100",
        },
    };

    const item = config[mode] || config.Link;
    const Icon = item.icon;

    return (
        <span
            className={classNames(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                item.className,
            )}
        >
            <Icon className="h-3 w-3" />
            {item.label}
        </span>
    );
}

function AppCard({ app, compact = false, index = 0, onOpen }) {
    const Icon = app.icon;
    const palette = appPalettes[index % appPalettes.length];

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-slate-200 hover:shadow-xl"
        >
            <div
                className={classNames(
                    "absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br",
                    palette.soft,
                )}
            />

            <div className="relative flex items-start justify-between gap-4">
                <button
                    onClick={onOpen}
                    className={classNames(
                        "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition group-hover:scale-105",
                        palette.bg,
                        palette.shadow,
                    )}
                    aria-label={`Buka detail ${app.name}`}
                >
                    <Icon className="h-7 w-7" />
                </button>
                <ModeBadge mode={app.mode} />
            </div>

            <div className="relative mt-5">
                <p
                    className={classNames(
                        "text-xs font-bold uppercase tracking-wide",
                        palette.text,
                    )}
                >
                    {app.type}
                </p>
                <button
                    onClick={onOpen}
                    className="mt-1 block text-left text-lg font-extrabold text-slate-900 hover:text-sky-700"
                >
                    {app.name}
                </button>
                <p
                    className={classNames(
                        "mt-2 text-sm leading-6 text-slate-500",
                        compact ? "line-clamp-2" : "",
                    )}
                >
                    {app.desc}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-slate-100 pt-4">
                    <span className="line-clamp-1 text-xs font-medium text-slate-400">
                        {app.category}
                    </span>
                    <button
                        onClick={onOpen}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-sky-600"
                    >
                        Buka
                        <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function NewsCard({ news, onOpen, large = false }) {
    return (
        <motion.article
            whileHover={{ y: -4 }}
            className={classNames(
                "overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm shadow-slate-100",
                large ? "lg:grid lg:grid-cols-[1.1fr_0.9fr]" : "flex flex-col",
            )}
        >
            <button
                onClick={onOpen}
                className={classNames(
                    "relative block w-full overflow-hidden text-left",
                    large ? "h-64 lg:h-full" : "h-56",
                )}
            >
                <img
                    src={news.image}
                    alt={news.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-sky-700 shadow">
                    {news.tag}
                </div>
            </button>

            <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-bold text-slate-400">{news.date}</p>

                <button
                    onClick={onOpen}
                    className="mt-2 block text-left text-lg font-black leading-snug text-slate-900 hover:text-sky-700"
                >
                    {news.title}
                </button>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {news.excerpt}
                </p>

                <button
                    onClick={onOpen}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-black text-sky-700"
                >
                    Baca selengkapnya <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </motion.article>
    );
}

function MiniCalendar({
    title,
    month,
    year,
    eventDates = [],
    color = "sky",
    selectedDate = null,
    onDateClick,
}) {
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const totalDays = 31;

    const colorMap = {
        sky: {
            active: "bg-sky-600 text-white shadow-lg shadow-sky-100",
            selected: "ring-4 ring-sky-200",
            soft: "bg-sky-50 text-sky-700",
            header: "text-sky-700",
            dot: "bg-white",
        },
        amber: {
            active: "bg-amber-400 text-slate-950 shadow-lg shadow-amber-100",
            selected: "ring-4 ring-amber-200",
            soft: "bg-amber-50 text-amber-700",
            header: "text-amber-700",
            dot: "bg-slate-950",
        },
    };

    const currentColor = colorMap[color] || colorMap.sky;

    return (
        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        Kalender
                    </p>
                    <h3
                        className={classNames(
                            "text-lg font-black",
                            currentColor.header,
                        )}
                    >
                        {title}
                    </h3>
                    <p className="text-sm text-slate-500">
                        {month} {year}
                    </p>
                </div>

                <div
                    className={classNames(
                        "rounded-2xl px-3 py-2 text-xs font-bold",
                        currentColor.soft,
                    )}
                >
                    {eventDates.length} Event
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
                {days.map((day) => (
                    <div key={day} className="py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
                {Array.from({ length: totalDays }, (_, i) => i + 1).map(
                    (day) => {
                        const hasEvent = eventDates.includes(day);
                        const isSelected = selectedDate === day;

                        return (
                            <button
                                key={day}
                                type="button"
                                disabled={!hasEvent}
                                onClick={() => {
                                    if (hasEvent && onDateClick)
                                        onDateClick(day);
                                }}
                                className={classNames(
                                    "relative flex h-10 w-full items-center justify-center rounded-xl text-sm font-bold transition",
                                    hasEvent
                                        ? currentColor.active
                                        : "bg-slate-50 text-slate-400",
                                    isSelected ? currentColor.selected : "",
                                    hasEvent
                                        ? "cursor-pointer hover:scale-105"
                                        : "cursor-default",
                                )}
                            >
                                {day}
                                {hasEvent && (
                                    <span
                                        className={classNames(
                                            "absolute bottom-1 h-1 w-1 rounded-full",
                                            currentColor.dot,
                                        )}
                                    />
                                )}
                            </button>
                        );
                    },
                )}
            </div>

            <p className="mt-4 text-xs text-slate-500">
                Klik tanggal berwarna untuk memfilter agenda pada tanggal
                tersebut.
            </p>
        </div>
    );
}

function AgendaCard({ agenda, variant = "government", onOpen }) {
    const isGovernment = variant === "government";

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm shadow-slate-100"
        >
            <button
                onClick={onOpen}
                className="relative block h-44 w-full overflow-hidden text-left"
            >
                <img
                    src={agenda.image}
                    alt={agenda.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
                <span
                    className={classNames(
                        "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black shadow-sm",
                        isGovernment
                            ? "bg-sky-100 text-sky-700"
                            : "bg-amber-100 text-amber-700",
                    )}
                >
                    {isGovernment ? "Pemerintah" : "Publik"}
                </span>
            </button>

            <div className="p-5">
                <div className="flex items-center gap-3">
                    <div
                        className={classNames(
                            "flex h-12 w-12 items-center justify-center rounded-2xl",
                            isGovernment
                                ? "bg-sky-50 text-sky-700"
                                : "bg-amber-50 text-amber-700",
                        )}
                    >
                        <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                        <p
                            className={classNames(
                                "text-sm font-black",
                                isGovernment
                                    ? "text-sky-700"
                                    : "text-amber-700",
                            )}
                        >
                            {agenda.fullDate}
                        </p>
                        <p className="text-xs font-semibold text-slate-400">
                            {agenda.time}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onOpen}
                    className="mt-4 block text-left text-lg font-black leading-snug text-slate-900 hover:text-sky-700"
                >
                    {agenda.title}
                </button>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin
                        className={classNames(
                            "h-4 w-4",
                            isGovernment ? "text-sky-600" : "text-amber-600",
                        )}
                    />
                    {agenda.location}
                </p>
            </div>
        </motion.div>
    );
}

function Header({ navigate, route }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        ["home", "Beranda"],
        ["apps", "Aplikasi"],
        ["news", "Berita"],
        ["agenda", "Agenda"],
        ["help", "Bantuan"],
    ];

    const isActive = (path) => route.split("/")[0] === path;

    return (
        <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-white/85 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate("home")}
                    className="flex items-center gap-3 text-left"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-400 to-blue-600 text-white shadow-lg shadow-sky-200">
                        <Sparkles className="h-7 w-7" />
                    </div>
                    <div>
                        <p className="text-xl font-black leading-none tracking-tight text-slate-900">
                            PECUT
                        </p>
                        <p className="text-xs font-semibold text-sky-700">
                            Portal Efisien Cepat Mudah Terpadu
                        </p>
                    </div>
                </button>

                <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex">
                    {navItems.map(([path, label]) => (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            className={classNames(
                                "hover:text-sky-600",
                                isActive(path) ? "text-sky-700" : "",
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">
                    <button
                        onClick={() => navigate("info")}
                        className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 hover:bg-sky-100"
                    >
                        <Bell className="h-4 w-4" /> Info Layanan
                    </button>
                    <button
                        onClick={() => navigate("login")}
                        className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 px-5 py-2.5 text-sm font-black text-slate-900 shadow-lg shadow-amber-100 transition hover:scale-[1.02]"
                    >
                        Masuk SSO
                    </button>
                </div>

                <button
                    className="rounded-2xl border border-sky-100 p-2 lg:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="border-t border-sky-100 bg-white px-4 py-4 lg:hidden">
                    <div className="grid gap-3 text-sm font-bold text-slate-600">
                        {navItems.map(([path, label]) => (
                            <button
                                key={path}
                                onClick={() => {
                                    navigate(path);
                                    setMobileMenuOpen(false);
                                }}
                                className="text-left"
                            >
                                {label}
                            </button>
                        ))}
                        <button
                            onClick={() => {
                                navigate("info");
                                setMobileMenuOpen(false);
                            }}
                            className="text-left"
                        >
                            Info Layanan
                        </button>
                        <button
                            onClick={() => {
                                navigate("login");
                                setMobileMenuOpen(false);
                            }}
                            className="mt-2 rounded-full bg-amber-300 px-4 py-2 font-black text-slate-900"
                        >
                            Masuk SSO
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

function HomePage({
    navigate,
    setActiveType,
    setActiveCategory,
    apps = appData,
    appsLoading = false,
}) {
    const activeApps = apps.length ? apps : appData;
    const popularApps = activeApps.filter((app) => app.popular).slice(0, 12);

    const asnCount = activeApps.filter(
        (app) => app.type === "ASN Digital",
    ).length;
    const publicCount = activeApps.filter(
        (app) => app.type === "Public Digital",
    ).length;
    const ssoCount = activeApps.filter((app) => app.mode === "SSO").length;
    const linkCount = activeApps.filter((app) => app.mode === "Link").length;

    const [selectedAgendaDate, setSelectedAgendaDate] = useState(null);

    const homeAgendaList = selectedAgendaDate
        ? allAgendaData.filter((item) => item.date === selectedAgendaDate)
        : allAgendaData.slice(0, 4);

    const goApps = (type = "Semua") => {
        setActiveType(type);
        setActiveCategory("Semua Aplikasi");
        navigate("apps");
    };

    return (
        <PageShell>
            <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50">
                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10"
                    >
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-sm">
                            <Star className="h-4 w-4 fill-amber-300 text-amber-400" />
                            Portal satu pintu layanan digital Kota Kediri
                        </div>
                        <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
                            Semua Aplikasi Pemerintah Kota Kediri Dalam Satu
                            Portal
                        </h1>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                            PECUT menghubungkan layanan ASN Digital dan Public
                            Digital agar masyarakat, ASN, dan perangkat daerah
                            dapat menemukan aplikasi, layanan, berita, serta
                            agenda kota dengan cepat.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={() => goApps("Semua")}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-sky-200 hover:bg-sky-700"
                            >
                                Jelajahi Aplikasi
                                <ArrowRight className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => navigate("guide")}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-6 py-3 text-sm font-black text-sky-700 hover:bg-sky-50"
                            >
                                Panduan Pengguna
                            </button>
                        </div>

                        <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                            {[
                                [
                                    appsLoading
                                        ? "..."
                                        : `${activeApps.length}+`,
                                    "Aplikasi Terdata",
                                ],
                                ["2", "Ruang Portal"],
                                ["24/7", "Akses Digital"],
                            ].map(([value, label]) => (
                                <div
                                    key={label}
                                    className="rounded-3xl border border-white bg-white/80 p-4 text-center shadow-sm shadow-sky-100 backdrop-blur"
                                >
                                    <p className="text-2xl font-black text-sky-700">
                                        {value}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-500">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                        className="relative z-10"
                    >
                        <div className="relative mx-auto max-w-xl rounded-[2rem] border border-sky-100 bg-white p-4 shadow-2xl shadow-sky-100">
                            <div className="rounded-[1.5rem] bg-gradient-to-br from-sky-600 via-cyan-500 to-blue-700 p-5 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-sky-100">
                                            Dashboard PECUT
                                        </p>
                                        <h3 className="mt-1 text-2xl font-black">
                                            Kota Kediri Digital Hub
                                        </h3>
                                    </div>
                                    <CloudSun className="h-10 w-10 text-amber-200" />
                                </div>
                                <div className="mt-7 grid grid-cols-2 gap-3">
                                    {[
                                        {
                                            title: "ASN Digital",
                                            icon: Building2,
                                            value: appsLoading
                                                ? "..."
                                                : `${asnCount} Apps`,
                                            action: () => goApps("ASN Digital"),
                                        },
                                        {
                                            title: "Public Digital",
                                            icon: Users,
                                            value: appsLoading
                                                ? "..."
                                                : `${publicCount} Apps`,
                                            action: () =>
                                                goApps("Public Digital"),
                                        },
                                        {
                                            title: "SSO Ready",
                                            icon: LockKeyhole,
                                            value: appsLoading
                                                ? "..."
                                                : `${ssoCount} Apps`,
                                            action: () => goApps("Semua"),
                                        },
                                        {
                                            title: "Web Link",
                                            icon: LinkIcon,
                                            value: appsLoading
                                                ? "..."
                                                : `${linkCount} Apps`,
                                            action: () => goApps("Semua"),
                                        },
                                    ].map((item) => (
                                        <button
                                            key={item.title}
                                            onClick={item.action}
                                            className="rounded-3xl bg-white/15 p-4 text-left backdrop-blur transition hover:bg-white/25"
                                        >
                                            <item.icon className="h-7 w-7 text-amber-200" />
                                            <p className="mt-4 text-xl font-black">
                                                {item.value}
                                            </p>
                                            <p className="text-xs font-semibold text-sky-100">
                                                {item.title}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute -bottom-7 -left-4 hidden rounded-3xl border border-sky-100 bg-white p-4 shadow-xl shadow-sky-100 sm:block">
                                <p className="text-xs font-bold text-slate-400">
                                    Layanan Populer
                                </p>
                                <div className="mt-2 flex -space-x-2">
                                    {popularApps
                                        .slice(0, 5)
                                        .map((app, index) => {
                                            const Icon = app.icon;
                                            const palette =
                                                appPalettes[
                                                    index % appPalettes.length
                                                ];
                                            return (
                                                <button
                                                    key={app.name}
                                                    onClick={() =>
                                                        navigate(
                                                            `app/${app.slug}`,
                                                        )
                                                    }
                                                    className={classNames(
                                                        "flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br text-white",
                                                        palette.bg,
                                                    )}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <SectionHeader
                    eyebrow="Ruang Portal"
                    title="Pilih Kebutuhan Layanan"
                    subtitle="Halaman awal dibagi jelas antara aplikasi untuk aparatur pemerintah dan aplikasi untuk masyarakat umum."
                />
                <div className="grid gap-5 lg:grid-cols-2">
                    {[
                        {
                            title: "ASN Digital",
                            desc: "Kumpulan aplikasi internal untuk ASN, OPD, kelurahan, kecamatan, administrasi, laporan, dan layanan pemerintahan.",
                            icon: Building2,
                            count: appsLoading ? "..." : `${asnCount} aplikasi`,
                            gradient: "from-sky-600 to-blue-700",
                        },
                        {
                            title: "Public Digital",
                            desc: "Kumpulan aplikasi layanan masyarakat seperti pengaduan, surat, pajak, kesehatan, pendidikan, data, dan informasi publik.",
                            icon: Users,
                            count: appsLoading
                                ? "..."
                                : `${publicCount} aplikasi`,
                            gradient: "from-cyan-500 to-sky-600",
                        },
                    ].map((item) => (
                        <motion.div
                            key={item.title}
                            whileHover={{ y: -4 }}
                            className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100"
                        >
                            <div
                                className={classNames(
                                    "absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-gradient-to-br opacity-10",
                                    item.gradient,
                                )}
                            />
                            <div className="relative flex items-start gap-5">
                                <div
                                    className={classNames(
                                        "flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br text-white shadow-lg",
                                        item.gradient,
                                    )}
                                >
                                    <item.icon className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-black uppercase tracking-wide text-amber-500">
                                        {item.count}
                                    </p>
                                    <h3 className="mt-1 text-2xl font-black text-slate-900">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        {item.desc}
                                    </p>
                                    <button
                                        onClick={() => goApps(item.title)}
                                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-black text-white hover:bg-sky-700"
                                    >
                                        Lihat {item.title}
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="bg-slate-50/70 py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Populer"
                        title="Aplikasi Paling Banyak Dicari"
                        subtitle="Tampilan carousel untuk layanan prioritas dan aplikasi yang sering digunakan."
                        action="Lihat semua aplikasi"
                        onAction={() => goApps("Semua")}
                    />
                    <div className="no-scrollbar flex gap-5 overflow-x-auto pb-4">
                        {popularApps.map((app, index) => (
                            <div
                                key={app.name}
                                className="min-w-[280px] max-w-[280px]"
                            >
                                <AppCard
                                    app={app}
                                    compact
                                    index={index}
                                    onOpen={() => navigate(`app/${app.slug}`)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <SectionHeader
                    eyebrow="Informasi Kota"
                    title="Berita Terkini Kota Kediri"
                    subtitle="Berita ditampilkan sebagai kanal informasi pendukung portal PECUT."
                    action="Lihat seluruh berita"
                    onAction={() => navigate("news")}
                />
                <div className="grid gap-6 lg:grid-cols-3">
                    {newsData.slice(0, 3).map((news) => (
                        <NewsCard
                            key={news.slug}
                            news={news}
                            onOpen={() => navigate(`news/${news.slug}`)}
                        />
                    ))}
                </div>
            </section>

            <section className="bg-slate-50/70 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeader
                        eyebrow="Kalender Kota"
                        title="Agenda Terdekat"
                        subtitle="Agenda pemerintah dan agenda publik ditampilkan agar masyarakat dan ASN mudah mengikuti kegiatan kota."
                        action="Lihat kalender lengkap"
                        onAction={() => navigate("agenda")}
                    />

                    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="grid gap-6">
                            <MiniCalendar
                                title="Agenda Pemerintah"
                                month="Mei"
                                year="2026"
                                eventDates={agendaGovernmentData.map(
                                    (item) => item.date,
                                )}
                                color="sky"
                                selectedDate={selectedAgendaDate}
                                onDateClick={setSelectedAgendaDate}
                            />

                            <MiniCalendar
                                title="Agenda Publik"
                                month="Mei"
                                year="2026"
                                eventDates={agendaPublicData.map(
                                    (item) => item.date,
                                )}
                                color="amber"
                                selectedDate={selectedAgendaDate}
                                onDateClick={setSelectedAgendaDate}
                            />
                        </div>

                        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100">
                            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">
                                        Daftar Agenda
                                    </p>
                                    <h3 className="mt-1 text-2xl font-black text-slate-900">
                                        {selectedAgendaDate
                                            ? `Agenda Tanggal ${selectedAgendaDate} Mei 2026`
                                            : "Agenda Terbaru"}
                                    </h3>
                                </div>

                                {selectedAgendaDate && (
                                    <button
                                        onClick={() =>
                                            setSelectedAgendaDate(null)
                                        }
                                        className="w-fit rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                                    >
                                        Tampilkan Semua
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {homeAgendaList.map((agenda) => (
                                    <button
                                        key={agenda.slug}
                                        onClick={() =>
                                            navigate(`agenda/${agenda.slug}`)
                                        }
                                        className="group grid w-full gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:border-sky-200 hover:bg-sky-50 sm:grid-cols-[120px_1fr]"
                                    >
                                        <img
                                            src={agenda.image}
                                            alt={agenda.title}
                                            className="h-28 w-full rounded-2xl object-cover sm:h-full"
                                        />

                                        <div className="p-1">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <span
                                                    className={classNames(
                                                        "rounded-full px-3 py-1 text-xs font-black",
                                                        agenda.type ===
                                                            "Agenda Pemerintah"
                                                            ? "bg-sky-100 text-sky-700"
                                                            : "bg-amber-100 text-amber-700",
                                                    )}
                                                >
                                                    {agenda.type ===
                                                    "Agenda Pemerintah"
                                                        ? "Pemerintah"
                                                        : "Publik"}
                                                </span>

                                                <span className="text-xs font-bold text-slate-400">
                                                    {agenda.fullDate} •{" "}
                                                    {agenda.time}
                                                </span>
                                            </div>

                                            <h4 className="line-clamp-2 text-base font-black text-slate-900 group-hover:text-sky-700">
                                                {agenda.title}
                                            </h4>

                                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                                                {agenda.description}
                                            </p>

                                            <p className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-400">
                                                <MapPin className="h-4 w-4 text-sky-600" />
                                                {agenda.location}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageShell>
    );
}

function AppsPage({
    navigate,
    activeType,
    setActiveType,
    activeCategory,
    setActiveCategory,
    apps = appData,
    appsLoading = false,
    appsError = "",
}) {
    const [query, setQuery] = useState("");
    const activeApps = apps.length ? apps : appData;

    const filteredApps = useMemo(() => {
        return activeApps.filter((app) => {
            const matchCategory =
                activeCategory === "Semua Aplikasi" ||
                app.category === activeCategory;
            const matchType = activeType === "Semua" || app.type === activeType;
            const normalizedQuery = query.toLowerCase().trim();
            const matchQuery =
                !normalizedQuery ||
                [app.name, app.desc, app.category, app.type, app.mode]
                    .join(" ")
                    .toLowerCase()
                    .includes(normalizedQuery);
            return matchCategory && matchType && matchQuery;
        });
    }, [activeApps, activeCategory, activeType, query]);

    return (
        <PageShell>
            <PageHero
                eyebrow="Explorer Aplikasi"
                title="Semua Aplikasi dan Layanan"
                subtitle="Filter kategori berada di kiri seperti explorer, sementara aplikasi ditampilkan dalam grid yang mudah dicari."
                icon={Layers3}
            />

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-6 rounded-[2rem] border border-sky-100 bg-white p-4 shadow-sm shadow-sky-100">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari aplikasi, kategori, SSO, layanan publik..."
                                className="h-14 w-full rounded-2xl border border-sky-100 bg-sky-50/50 py-4 pl-12 pr-4 text-sm font-semibold outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {["Semua", "ASN Digital", "Public Digital"].map(
                                (type) => (
                                    <button
                                        key={type}
                                        onClick={() => setActiveType(type)}
                                        className={classNames(
                                            "rounded-full px-4 py-2 text-sm font-black transition",
                                            activeType === type
                                                ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                                                : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700",
                                        )}
                                    >
                                        {type}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[310px_1fr]">
                    <aside className="h-fit rounded-[2rem] border border-sky-100 bg-white p-3 shadow-sm shadow-sky-100 lg:sticky lg:top-24">
                        <div className="mb-3 flex items-center justify-between px-3 pt-2">
                            <p className="flex items-center gap-2 text-sm font-black text-slate-900">
                                <Filter className="h-4 w-4" /> Kategori Layanan
                            </p>
                            <span className="rounded-full bg-sky-50 px-2 py-1 text-xs font-black text-sky-700">
                                {categories.length}
                            </span>
                        </div>
                        <div className="max-h-[640px] space-y-1 overflow-y-auto pr-1">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={classNames(
                                        "flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition",
                                        activeCategory === category
                                            ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                                            : "text-slate-600 hover:bg-sky-50 hover:text-sky-700",
                                    )}
                                >
                                    <span className="line-clamp-2">
                                        {category}
                                    </span>
                                    {activeCategory === category && (
                                        <ChevronRight className="h-4 w-4 shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </aside>

                    <div>
                        <div className="mb-5 flex flex-col gap-2 rounded-3xl bg-gradient-to-r from-sky-600 to-cyan-500 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-sky-100">
                                    Hasil pencarian
                                </p>
                                <h3 className="text-2xl font-black">
                                    {filteredApps.length} aplikasi ditemukan
                                </h3>
                            </div>
                            <p className="max-w-xl text-sm leading-6 text-sky-50">
                                Status akses ditandai dengan SSO, Non SSO, atau
                                Link Web agar pengelola mudah memetakan
                                integrasi berikutnya.
                            </p>
                        </div>

                        {appsLoading && (
                            <div className="mb-5 rounded-3xl bg-sky-50 px-5 py-4">
                                <p className="text-sm font-bold text-sky-800">
                                    Memuat data aplikasi dari backend...
                                </p>
                            </div>
                        )}

                        {appsError && (
                            <div className="mb-5 rounded-3xl bg-amber-50 px-5 py-4">
                                <p className="text-sm font-bold text-amber-800">
                                    Data backend belum berhasil dimuat.
                                    Sementara memakai data dummy.
                                </p>
                            </div>
                        )}

                        {filteredApps.length > 0 ? (
                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {filteredApps.map((app, index) => (
                                    <AppCard
                                        key={app.slug}
                                        app={app}
                                        index={index}
                                        onOpen={() =>
                                            navigate(`app/${app.slug}`)
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/50 p-10 text-center">
                                <Search className="mx-auto h-10 w-10 text-sky-400" />
                                <h3 className="mt-4 text-xl font-black text-slate-900">
                                    Aplikasi tidak ditemukan
                                </h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Coba ubah kata kunci, kategori, atau tipe
                                    portal.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PageShell>
    );
}

function AppDetailPage({ slug, navigate, apps = appData }) {
    const activeApps = apps.length ? apps : appData;
    const app =
        activeApps.find((item) => item.slug === slug) ||
        activeApps[0] ||
        appData[0];
    const Icon = app.icon;
    const related = activeApps
        .filter(
            (item) => item.category === app.category && item.slug !== app.slug,
        )
        .slice(0, 3);

    return (
        <PageShell>
            <PageHero
                eyebrow="Detail Layanan"
                title={app.name}
                subtitle={app.desc}
                icon={Icon}
                gradient="from-sky-600 to-blue-700"
            />
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate("apps")}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-black text-sky-700 hover:bg-sky-50"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali ke daftar aplikasi
                </button>

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.7rem] bg-gradient-to-br from-sky-600 to-cyan-500 text-white shadow-xl shadow-sky-100">
                                <Icon className="h-10 w-10" />
                            </div>
                            <div>
                                <div className="flex flex-wrap gap-2">
                                    <ModeBadge mode={app.mode} />
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                                        {app.type}
                                    </span>
                                </div>
                                <h2 className="mt-4 text-3xl font-black text-slate-900">
                                    {app.name}
                                </h2>
                                <p className="mt-3 leading-8 text-slate-600">
                                    {app.detail}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            {[
                                {
                                    label: "Kategori",
                                    value: app.category,
                                    icon: Grid3X3,
                                },
                                {
                                    label: "Tipe Portal",
                                    value: app.type,
                                    icon: Users,
                                },
                                {
                                    label: "Akses",
                                    value: app.mode,
                                    icon: LockKeyhole,
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-3xl bg-slate-50 p-5"
                                >
                                    <item.icon className="h-6 w-6 text-sky-700" />
                                    <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                                        {item.label}
                                    </p>
                                    <p className="mt-1 text-sm font-black text-slate-900">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 rounded-[2rem] bg-gradient-to-br from-sky-50 to-cyan-50 p-6">
                            <h3 className="text-xl font-black text-slate-900">
                                Aksi Layanan
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Bagian ini sudah aktif sebagai interface. Nanti
                                tombol dapat dihubungkan ke route backend, SSO,
                                atau alamat aplikasi existing sesuai kebutuhan
                                sistem PECUT.
                            </p>
                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={() => {
                                        if (app.redirectUrl) {
                                            window.location.href =
                                                app.redirectUrl;
                                            return;
                                        }

                                        navigate("login");
                                    }}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                                >
                                    Masuk / Buka Layanan
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => navigate("help")}
                                    className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-5 py-3 text-sm font-black text-sky-700 hover:bg-sky-50"
                                >
                                    Butuh Bantuan
                                </button>
                            </div>
                        </div>
                    </div>

                    <aside className="space-y-5">
                        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100">
                            <h3 className="text-lg font-black text-slate-900">
                                Informasi Integrasi
                            </h3>
                            <div className="mt-4 space-y-3 text-sm text-slate-600">
                                <p className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />{" "}
                                    Halaman detail sudah tersedia.
                                </p>
                                <p className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />{" "}
                                    Tombol sudah aktif menuju interface
                                    internal.
                                </p>
                                <p className="flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-sky-600" />{" "}
                                    Endpoint backend dapat ditambahkan kemudian.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100">
                            <h3 className="text-lg font-black text-slate-900">
                                Layanan Terkait
                            </h3>
                            <div className="mt-4 space-y-3">
                                {(related.length
                                    ? related
                                    : activeApps.slice(0, 3)
                                ).map((item) => (
                                    <button
                                        key={item.slug}
                                        onClick={() =>
                                            navigate(`app/${item.slug}`)
                                        }
                                        className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left hover:bg-sky-50"
                                    >
                                        <item.icon className="h-5 w-5 text-sky-700" />
                                        <span className="text-sm font-bold text-slate-700">
                                            {item.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </PageShell>
    );
}

function NewsPage({ navigate }) {
    const [query, setQuery] = useState("");
    const [tag, setTag] = useState("Semua");
    const tags = [
        "Semua",
        ...Array.from(new Set(newsData.map((item) => item.tag))),
    ];

    const filtered = newsData.filter((news) => {
        const matchTag = tag === "Semua" || news.tag === tag;
        const matchQuery =
            !query.trim() ||
            [news.title, news.excerpt, news.tag]
                .join(" ")
                .toLowerCase()
                .includes(query.toLowerCase());
        return matchTag && matchQuery;
    });

    return (
        <PageShell>
            <PageHero
                eyebrow="Berita"
                title="Berita Terkini Kota Kediri"
                subtitle="Halaman daftar berita PECUT. Pada backend asli, data dapat diambil dari CMS, website resmi, atau API berita OPD."
                icon={Newspaper}
            />
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8 rounded-[2rem] border border-sky-100 bg-white p-4 shadow-sm shadow-sky-100">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari berita..."
                                className="h-14 w-full rounded-2xl border border-sky-100 bg-sky-50/50 py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                            />
                        </div>
                        <select
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            className="h-14 rounded-2xl border border-sky-100 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                        >
                            {tags.map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {filtered.map((news, index) => (
                        <NewsCard
                            key={news.slug}
                            news={news}
                            large={index === 0}
                            onOpen={() => navigate(`news/${news.slug}`)}
                        />
                    ))}
                </div>
            </section>
        </PageShell>
    );
}

function NewsDetailPage({ slug, navigate }) {
    const news = newsData.find((item) => item.slug === slug) || newsData[0];
    const related = newsData
        .filter((item) => item.slug !== news.slug)
        .slice(0, 3);

    return (
        <PageShell>
            <section className="relative overflow-hidden bg-slate-950 text-white">
                <img
                    src={news.image}
                    alt={news.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-sky-950/70" />
                <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate("news")}
                        className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur hover:bg-white/20"
                    >
                        <ArrowLeft className="h-4 w-4" /> Kembali ke berita
                    </button>
                    <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">
                        {news.tag}
                    </span>
                    <h1 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
                        {news.title}
                    </h1>
                    <p className="mt-4 text-sm font-bold text-sky-100">
                        {news.date}
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
                <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-9">
                    <p className="text-xl font-semibold leading-9 text-slate-700">
                        {news.excerpt}
                    </p>
                    <div className="mt-8 space-y-6 text-base leading-8 text-slate-600">
                        {news.content.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                </article>

                <aside className="h-fit rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100 lg:sticky lg:top-24">
                    <h3 className="text-lg font-black text-slate-900">
                        Berita Terkait
                    </h3>
                    <div className="mt-4 space-y-4">
                        {related.map((item) => (
                            <button
                                key={item.slug}
                                onClick={() => navigate(`news/${item.slug}`)}
                                className="flex gap-3 text-left"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-16 w-20 rounded-2xl object-cover"
                                />
                                <div>
                                    <p className="line-clamp-2 text-sm font-black text-slate-800 hover:text-sky-700">
                                        {item.title}
                                    </p>
                                    <p className="mt-1 text-xs font-bold text-slate-400">
                                        {item.date}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>
            </section>
        </PageShell>
    );
}

function AgendaPage({ navigate }) {
    const [filter, setFilter] = useState("Semua");
    const [selectedDate, setSelectedDate] = useState(null);

    const filtered = allAgendaData.filter((item) => {
        const matchType = filter === "Semua" || item.type === filter;
        const matchDate = !selectedDate || item.date === selectedDate;

        return matchType && matchDate;
    });

    return (
        <PageShell>
            <PageHero
                eyebrow="Kalender Kota"
                title="Agenda Pemerintah dan Agenda Publik"
                subtitle="Agenda dipisah jelas agar pengguna lebih mudah membedakan kegiatan internal pemerintahan dan kegiatan yang terbuka untuk masyarakat."
                icon={CalendarCheck2}
            />

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-2">
                    <MiniCalendar
                        title="Agenda Pemerintah"
                        month="Mei"
                        year="2026"
                        eventDates={agendaGovernmentData.map(
                            (item) => item.date,
                        )}
                        color="sky"
                        selectedDate={selectedDate}
                        onDateClick={setSelectedDate}
                    />

                    <MiniCalendar
                        title="Agenda Publik"
                        month="Mei"
                        year="2026"
                        eventDates={agendaPublicData.map((item) => item.date)}
                        color="amber"
                        selectedDate={selectedDate}
                        onDateClick={setSelectedDate}
                    />
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-2">
                    {["Semua", "Agenda Pemerintah", "Agenda Publik"].map(
                        (item) => (
                            <button
                                key={item}
                                onClick={() => setFilter(item)}
                                className={classNames(
                                    "rounded-full px-4 py-2 text-sm font-black transition",
                                    filter === item
                                        ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                                        : "bg-white text-slate-600 ring-1 ring-slate-100 hover:bg-sky-50 hover:text-sky-700",
                                )}
                            >
                                {item}
                            </button>
                        ),
                    )}

                    {selectedDate && (
                        <button
                            onClick={() => setSelectedDate(null)}
                            className="rounded-full bg-rose-50 px-4 py-2 text-sm font-black text-rose-700 ring-1 ring-rose-100 hover:bg-rose-100"
                        >
                            Reset Tanggal {selectedDate} Mei
                        </button>
                    )}
                </div>

                <div className="mt-5 rounded-3xl bg-sky-50 px-5 py-4">
                    <p className="text-sm font-bold text-sky-800">
                        {selectedDate
                            ? `Menampilkan agenda pada tanggal ${selectedDate} Mei 2026`
                            : "Menampilkan semua agenda bulan Mei 2026"}
                    </p>
                </div>

                {filtered.length > 0 ? (
                    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((agenda) => (
                            <AgendaCard
                                key={agenda.slug}
                                agenda={agenda}
                                variant={
                                    agenda.type === "Agenda Pemerintah"
                                        ? "government"
                                        : "public"
                                }
                                onOpen={() => navigate(`agenda/${agenda.slug}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-8 rounded-[2rem] border border-dashed border-sky-200 bg-sky-50/50 p-10 text-center">
                        <CalendarDays className="mx-auto h-10 w-10 text-sky-400" />
                        <h3 className="mt-4 text-xl font-black text-slate-900">
                            Tidak ada agenda ditemukan
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Coba ubah filter agenda atau reset tanggal yang
                            dipilih.
                        </p>

                        <button
                            onClick={() => {
                                setFilter("Semua");
                                setSelectedDate(null);
                            }}
                            className="mt-5 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                        >
                            Tampilkan Semua Agenda
                        </button>
                    </div>
                )}
            </section>
        </PageShell>
    );
}

function AgendaDetailPage({ slug, navigate }) {
    const agenda =
        allAgendaData.find((item) => item.slug === slug) || allAgendaData[0];
    const isGovernment = agenda.type === "Agenda Pemerintah";

    return (
        <PageShell>
            <section className="relative overflow-hidden bg-slate-950 text-white">
                <img
                    src={agenda.image}
                    alt={agenda.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-sky-950/70" />
                <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate("agenda")}
                        className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur hover:bg-white/20"
                    >
                        <ArrowLeft className="h-4 w-4" /> Kembali ke agenda
                    </button>
                    <span
                        className={classNames(
                            "rounded-full px-3 py-1 text-xs font-black",
                            isGovernment
                                ? "bg-sky-200 text-sky-900"
                                : "bg-amber-300 text-slate-950",
                        )}
                    >
                        {agenda.type}
                    </span>
                    <h1 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
                        {agenda.title}
                    </h1>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-9">
                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            {
                                label: "Tanggal",
                                value: agenda.fullDate,
                                icon: CalendarDays,
                            },
                            {
                                label: "Waktu",
                                value: agenda.time,
                                icon: Clock3,
                            },
                            {
                                label: "Lokasi",
                                value: agenda.location,
                                icon: MapPin,
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-3xl bg-slate-50 p-5"
                            >
                                <item.icon className="h-6 w-6 text-sky-700" />
                                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                                    {item.label}
                                </p>
                                <p className="mt-1 text-sm font-black text-slate-900">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                    <h2 className="mt-8 text-2xl font-black text-slate-900">
                        Deskripsi Agenda
                    </h2>
                    <p className="mt-3 leading-8 text-slate-600">
                        {agenda.description}
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <button
                            onClick={() => navigate("help")}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                        >
                            Tanya Informasi Agenda{" "}
                            <MessageCircle className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => navigate("agenda")}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-5 py-3 text-sm font-black text-sky-700 hover:bg-sky-50"
                        >
                            Lihat Agenda Lainnya
                        </button>
                    </div>
                </div>
            </section>
        </PageShell>
    );
}

function LoginPage({ navigate }) {
    return (
        <PageShell>
            <PageHero
                eyebrow="SSO PECUT"
                title="Masuk ke Portal PECUT"
                subtitle="Halaman antarmuka login sudah disiapkan. Integrasi autentikasi dan backend SSO dapat disambungkan kemudian."
                icon={KeyRound}
                gradient="from-amber-400 to-yellow-300"
            />
            <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                <div className="rounded-[2rem] bg-gradient-to-br from-sky-600 to-blue-700 p-8 text-white shadow-xl shadow-sky-100">
                    <Sparkles className="h-12 w-12 text-amber-200" />
                    <h2 className="mt-5 text-3xl font-black">
                        Akses Cepat, Aman, Terpadu
                    </h2>
                    <p className="mt-4 leading-8 text-sky-50">
                        Login ini hanya interface. Nanti bisa dihubungkan ke
                        sistem SSO Kota Kediri, akun ASN, akun masyarakat, atau
                        integrasi Super App sesuai kebutuhan.
                    </p>
                    <div className="mt-8 space-y-3">
                        {[
                            "Satu akun untuk banyak layanan",
                            "Role ASN dan masyarakat dapat dipisahkan",
                            "Siap dihubungkan ke backend Laravel",
                        ].map((item) => (
                            <p
                                key={item}
                                className="flex items-center gap-2 text-sm font-semibold text-sky-50"
                            >
                                <CheckCircle2 className="h-4 w-4 text-amber-200" />{" "}
                                {item}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-8">
                    <h2 className="text-2xl font-black text-slate-900">
                        Form Login
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Belum terhubung backend. Tampilan ini untuk kebutuhan
                        front-end awal.
                    </p>
                    <div className="mt-6 space-y-4">
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700">
                                Username / NIK / Email
                            </span>
                            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50/50 px-4 py-3 focus-within:ring-4 focus-within:ring-sky-100">
                                <User className="h-5 w-5 text-sky-600" />
                                <input
                                    className="w-full bg-transparent text-sm font-semibold outline-none"
                                    placeholder="Masukkan akun"
                                />
                            </div>
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700">
                                Password
                            </span>
                            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50/50 px-4 py-3 focus-within:ring-4 focus-within:ring-sky-100">
                                <LockKeyhole className="h-5 w-5 text-sky-600" />
                                <input
                                    type="password"
                                    className="w-full bg-transparent text-sm font-semibold outline-none"
                                    placeholder="Masukkan password"
                                />
                            </div>
                        </label>
                        <button
                            onClick={() => navigate("apps")}
                            className="w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                        >
                            Masuk Dashboard
                        </button>
                        <button
                            onClick={() => navigate("help")}
                            className="w-full rounded-full border border-sky-200 bg-white px-5 py-3 text-sm font-black text-sky-700 hover:bg-sky-50"
                        >
                            Bantuan Login
                        </button>
                    </div>
                </div>
            </section>
        </PageShell>
    );
}

function InfoPage({ navigate }) {
    return (
        <SimpleContentPage
            eyebrow="Info Layanan"
            title="Informasi Layanan PECUT"
            subtitle="Halaman ini disiapkan untuk menampilkan pengumuman, status layanan, dan informasi penting terkait aplikasi pemerintah Kota Kediri."
            icon={Info}
            navigate={navigate}
            cards={[
                {
                    title: "Status Layanan",
                    desc: "Menampilkan status layanan aktif, pemeliharaan, atau gangguan sementara.",
                    icon: ShieldCheck,
                },
                {
                    title: "Pengumuman",
                    desc: "Informasi resmi terkait update aplikasi, integrasi, dan perubahan layanan.",
                    icon: Bell,
                },
                {
                    title: "Integrasi Aplikasi",
                    desc: "Pemetaan aplikasi SSO, Non SSO, dan Link Web untuk pengembangan berikutnya.",
                    icon: Database,
                },
            ]}
        />
    );
}

function GuidePage({ navigate }) {
    return (
        <SimpleContentPage
            eyebrow="Panduan"
            title="Panduan Pengguna PECUT"
            subtitle="Panduan singkat untuk masyarakat, ASN, dan admin dalam menggunakan portal satu pintu layanan digital Kota Kediri."
            icon={FileQuestion}
            navigate={navigate}
            cards={[
                {
                    title: "Cari Aplikasi",
                    desc: "Gunakan kolom pencarian atau kategori layanan untuk menemukan aplikasi yang dibutuhkan.",
                    icon: Search,
                },
                {
                    title: "Pilih Tipe Portal",
                    desc: "Gunakan filter ASN Digital atau Public Digital sesuai kebutuhan pengguna.",
                    icon: Layers3,
                },
                {
                    title: "Buka Detail Layanan",
                    desc: "Klik kartu aplikasi untuk melihat informasi, kategori, status akses, dan tombol layanan.",
                    icon: Eye,
                },
            ]}
        />
    );
}

function HelpPage({ navigate }) {
    return (
        <PageShell>
            <PageHero
                eyebrow="Bantuan"
                title="Pusat Bantuan PECUT"
                subtitle="Halaman bantuan untuk kontak, pertanyaan umum, dan informasi dukungan pengguna portal PECUT."
                icon={HelpCircle}
            />
            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
                <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-8">
                    <h2 className="text-2xl font-black text-slate-900">
                        Pertanyaan Umum
                    </h2>
                    <div className="mt-6 space-y-4">
                        {[
                            [
                                "Apa itu PECUT?",
                                "PECUT adalah portal satu pintu layanan digital Pemerintah Kota Kediri untuk memudahkan akses aplikasi ASN dan masyarakat.",
                            ],
                            [
                                "Apakah semua aplikasi sudah SSO?",
                                "Belum. Pada interface ini status aplikasi dibedakan menjadi SSO, Non SSO, dan Link Web agar integrasi dapat dilakukan bertahap.",
                            ],
                            [
                                "Apakah tombol layanan sudah terhubung backend?",
                                "Belum. Halaman ini adalah front-end siap integrasi. Backend Laravel, SSO, dan API dapat disambungkan pada tahap berikutnya.",
                            ],
                        ].map(([q, a]) => (
                            <details
                                key={q}
                                className="group rounded-3xl bg-slate-50 p-5"
                            >
                                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-black text-slate-900">
                                    {q}
                                    <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                                </summary>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2rem] bg-gradient-to-br from-sky-600 to-blue-700 p-6 text-white shadow-xl shadow-sky-100 md:p-8">
                    <h2 className="text-2xl font-black">Kontak Bantuan</h2>
                    <p className="mt-3 text-sm leading-7 text-sky-50">
                        Kontak dummy untuk tampilan awal. Nanti dapat
                        disesuaikan dengan kontak resmi Diskominfo atau helpdesk
                        aplikasi.
                    </p>
                    <div className="mt-6 space-y-4">
                        {[
                            {
                                label: "Email",
                                value: "bantuan@pecut.kedirikota.go.id",
                                icon: Mail,
                            },
                            {
                                label: "Telepon",
                                value: "(0354) 000000",
                                icon: Phone,
                            },
                            {
                                label: "Lokasi",
                                value: "Command Center Kota Kediri",
                                icon: MapPinned,
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="flex items-start gap-3 rounded-3xl bg-white/15 p-4 backdrop-blur"
                            >
                                <item.icon className="h-5 w-5 text-amber-200" />
                                <div>
                                    <p className="text-xs font-bold text-sky-100">
                                        {item.label}
                                    </p>
                                    <p className="text-sm font-black">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate("apps")}
                        className="mt-7 w-full rounded-full bg-white px-5 py-3 text-sm font-black text-sky-700 hover:bg-sky-50"
                    >
                        Kembali ke Aplikasi
                    </button>
                </div>
            </section>
        </PageShell>
    );
}

function SimpleContentPage({
    eyebrow,
    title,
    subtitle,
    icon: Icon,
    cards,
    navigate,
}) {
    return (
        <PageShell>
            <PageHero
                eyebrow={eyebrow}
                title={title}
                subtitle={subtitle}
                icon={Icon}
            />
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-5 md:grid-cols-3">
                    {cards.map((card, index) => {
                        const palette = appPalettes[index % appPalettes.length];
                        return (
                            <div
                                key={card.title}
                                className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100"
                            >
                                <div
                                    className={classNames(
                                        "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                                        palette.bg,
                                        palette.shadow,
                                    )}
                                >
                                    <card.icon className="h-7 w-7" />
                                </div>
                                <h3 className="mt-5 text-xl font-black text-slate-900">
                                    {card.title}
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                    {card.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-8 rounded-[2rem] bg-slate-50 p-6 text-center">
                    <h3 className="text-xl font-black text-slate-900">
                        Lanjut Jelajahi PECUT
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Semua tombol navigasi sudah diarahkan ke halaman
                        interface masing-masing.
                    </p>
                    <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                            onClick={() => navigate("apps")}
                            className="rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                        >
                            Lihat Aplikasi
                        </button>
                        <button
                            onClick={() => navigate("help")}
                            className="rounded-full border border-sky-200 bg-white px-5 py-3 text-sm font-black text-sky-700 hover:bg-sky-50"
                        >
                            Pusat Bantuan
                        </button>
                    </div>
                </div>
            </section>
        </PageShell>
    );
}

function Footer({ navigate }) {
    return (
        <footer id="bantuan" className="bg-slate-950 text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
                <div>
                    <button
                        onClick={() => navigate("home")}
                        className="flex items-center gap-3 text-left"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white">
                            <Sparkles className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-xl font-black leading-none">
                                PECUT Kota Kediri
                            </p>
                            <p className="text-xs font-semibold text-sky-200">
                                Portal Efisien Cepat Mudah Terpadu
                            </p>
                        </div>
                    </button>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
                        Konsep portal satu pintu untuk memusatkan akses aplikasi
                        pemerintah, memudahkan pencarian layanan, dan
                        mempercepat integrasi digital Pemerintah Kota Kediri.
                    </p>
                </div>
                <div>
                    <h4 className="font-black">Navigasi</h4>
                    <div className="mt-4 grid gap-2 text-sm text-slate-300">
                        <button
                            onClick={() => navigate("home")}
                            className="w-fit hover:text-white"
                        >
                            Beranda
                        </button>
                        <button
                            onClick={() => navigate("apps")}
                            className="w-fit hover:text-white"
                        >
                            Semua Aplikasi
                        </button>
                        <button
                            onClick={() => navigate("news")}
                            className="w-fit hover:text-white"
                        >
                            Berita Kota
                        </button>
                        <button
                            onClick={() => navigate("agenda")}
                            className="w-fit hover:text-white"
                        >
                            Agenda
                        </button>
                    </div>
                </div>
                <div>
                    <h4 className="font-black">Kontak Bantuan</h4>
                    <div className="mt-4 grid gap-2 text-sm text-slate-300">
                        <p>Diskominfo Kota Kediri</p>
                        <p>Command Center Kota Kediri</p>
                        <p>Email: bantuan@pecut.kedirikota.go.id</p>
                    </div>
                </div>
            </div>
            <div className="border-t border-white/10 py-5 text-center text-xs font-semibold text-slate-400">
                © 2026 PECUT Kota Kediri. Prototype UI untuk portal layanan
                digital satu pintu.
            </div>
        </footer>
    );
}

export default function App() {
    const [route, navigate] = useHashRoute();
    const [activeType, setActiveType] = useState("Semua");
    const [activeCategory, setActiveCategory] = useState("Semua Aplikasi");

    const [backendApps, setBackendApps] = useState([]);
    const [appsLoading, setAppsLoading] = useState(true);
    const [appsError, setAppsError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadApps() {
            try {
                setAppsLoading(true);
                setAppsError("");

                const result = await fetchAllAppsFromApi();

                if (!isMounted) return;

                const mappedApps = result.data.map((item, index) =>
                    mapApiApp(item, index),
                );

                setBackendApps(mappedApps);

                console.log("PECUT apps backend loaded:", {
                    total_api: result?.meta?.total,
                    public_total: result?.meta?.public_total,
                    asn_total: result?.meta?.asn_total,
                    total_loaded: mappedApps.length,
                    sample: mappedApps.slice(0, 3),
                });
            } catch (error) {
                if (!isMounted) return;

                console.error("PECUT apps backend error:", error);
                setAppsError(error.message || "Gagal memuat aplikasi.");
                setBackendApps([]);
            } finally {
                if (isMounted) {
                    setAppsLoading(false);
                }
            }
        }

        loadApps();

        return () => {
            isMounted = false;
        };
    }, []);

    const appsForView = backendApps.length ? backendApps : appData;

    const [page, slug] = route.split("/");

    const renderPage = () => {
        if (page === "apps")
            return (
                <AppsPage
                    navigate={navigate}
                    activeType={activeType}
                    setActiveType={setActiveType}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    apps={appsForView}
                    appsLoading={appsLoading}
                    appsError={appsError}
                />
            );
        if (page === "app")
            return (
                <AppDetailPage
                    slug={slug}
                    navigate={navigate}
                    apps={appsForView}
                />
            );
        if (page === "news" && slug)
            return <NewsDetailPage slug={slug} navigate={navigate} />;
        if (page === "news") return <NewsPage navigate={navigate} />;
        if (page === "agenda" && slug)
            return <AgendaDetailPage slug={slug} navigate={navigate} />;
        if (page === "agenda") return <AgendaPage navigate={navigate} />;
        if (page === "login") return <LoginPage navigate={navigate} />;
        if (page === "info") return <InfoPage navigate={navigate} />;
        if (page === "guide") return <GuidePage navigate={navigate} />;
        if (page === "help") return <HelpPage navigate={navigate} />;
        return (
            <HomePage
                navigate={navigate}
                setActiveType={setActiveType}
                setActiveCategory={setActiveCategory}
                apps={appsForView}
                appsLoading={appsLoading}
            />
        );
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Header navigate={navigate} route={route} />
            {renderPage()}
            <Footer navigate={navigate} />
            <button
                onClick={() => navigate("help")}
                className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-2xl shadow-sky-200 hover:bg-sky-700"
            >
                <Bell className="h-4 w-4" /> Bantuan PECUT
            </button>
        </div>
    );
}
