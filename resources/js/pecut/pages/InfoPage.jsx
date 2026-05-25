import { Bell, Database, Info, ShieldCheck } from "lucide-react";
import SimpleContentPage from "./SimpleContentPage";

export default function InfoPage({ navigate }) {
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
