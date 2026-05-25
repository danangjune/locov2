import { Eye, FileQuestion, Layers3, Search } from "lucide-react";
import SimpleContentPage from "./SimpleContentPage";

export default function GuidePage({ navigate }) {
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
