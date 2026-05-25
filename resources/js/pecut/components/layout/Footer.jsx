import { Sparkles } from "lucide-react";

export default function Footer({ navigate }) {
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
