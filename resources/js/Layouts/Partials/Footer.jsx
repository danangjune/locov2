import { Link } from "@inertiajs/react";

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_0.7fr_0.7fr] lg:px-8">
                <div>
                    <img
                        src="/images/logo-pecut-full.png"
                        alt="PECUT Kota Kediri"
                        className="h-12 max-w-[260px] rounded-xl bg-white object-contain px-3 py-2"
                    />

                    <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
                        PECUT adalah portal layanan digital Pemerintah Kota Kediri untuk memudahkan masyarakat, ASN, dan perangkat daerah menemukan layanan digital dalam satu pintu.
                    </p>
                </div>

                <div>
                    <h4 className="font-black">Navigasi</h4>

                    <div className="mt-4 grid gap-2 text-sm text-slate-300">
                        <Link href="/" className="w-fit hover:text-white">Beranda</Link>
                        <Link href="/kediri" className="w-fit hover:text-white">Selayang Pandang</Link>
                        <Link href="/apps" className="w-fit hover:text-white">Aplikasi</Link>
                        <Link href="/complaints" className="w-fit hover:text-white">Aduan Warga</Link>
                        <Link href="/news" className="w-fit hover:text-white">Berita</Link>
                        <Link href="/agenda" className="w-fit hover:text-white">Agenda</Link>
                        <Link href="/guide" className="w-fit hover:text-white">Panduan</Link>
                        <Link href="/help" className="w-fit hover:text-white">Bantuan</Link>
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
                © 2026 PECUT Kota Kediri. Portal layanan digital satu pintu Pemerintah Kota Kediri.
            </div>
        </footer>
    );
}
