import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Grid3X3,
    LockKeyhole,
    Settings,
    Users,
} from "lucide-react";

import PageShell from "../components/layout/PageShell";
import PageHero from "../components/layout/PageHero";
import ModeBadge from "../components/apps/ModeBadge";

import { appData } from "../data/staticData";

export default function AppDetailPage({ slug, navigate, apps = appData }) {
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
