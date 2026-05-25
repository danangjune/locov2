import { ChevronDown, HelpCircle, Mail, MapPinned, Phone } from "lucide-react";

import PageShell from "../components/layout/PageShell";
import PageHero from "../components/layout/PageHero";

export default function HelpPage({ navigate }) {
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
