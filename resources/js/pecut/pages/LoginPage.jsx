import {
    CheckCircle2,
    KeyRound,
    LockKeyhole,
    Sparkles,
    User,
} from "lucide-react";

import PageShell from "../components/layout/PageShell";
import PageHero from "../components/layout/PageHero";

export default function LoginPage({ navigate }) {
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
                                <CheckCircle2 className="h-4 w-4 text-amber-200" />
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
