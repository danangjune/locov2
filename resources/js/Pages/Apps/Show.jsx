import { Head, Link, router } from "@inertiajs/react";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    ExternalLink,
    Grid3X3,
    LockKeyhole,
    Settings,
    Users,
    Landmark,
} from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";
import AppCard from "../../Components/Apps/AppCard";
import ModeBadge from "../../Components/Apps/ModeBadge";
import AppFromBadge from "../../Components/Apps/AppFromBadge";
import { appPalettes } from "../../Data/staticData";
import { classNames, mapApiApp } from "../../Utils/helpers";

export default function Show({ meta = {}, data = {} }) {
    const app = data?.app ? mapApiApp(data.app, 0) : null;
    const related = Array.isArray(data?.related)
        ? data.related.map((item, index) => mapApiApp(item, index + 1))
        : [];

    if (!app) {
        return (
            <PublicLayout currentRoute="apps">
                <PageShell>
                    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                        <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-red-700">
                            Data aplikasi tidak ditemukan.
                        </div>
                    </div>
                </PageShell>
            </PublicLayout>
        );
    }

    const Icon = app.icon;
    const palette = appPalettes[0];
    const logoUrl = app.logo || app.image || null;

    const openService = () => {
        if (app.url) {
            window.open(app.url, "_blank", "noopener,noreferrer");
            return;
        }

        router.visit("/help");
    };

    return (
        <>
            <Head title={meta?.title || app.name} />

            <PublicLayout currentRoute="apps">
                <PageShell>
                    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50">
                        <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
                        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

                        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                            <Link
                                href="/apps"
                                className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-black text-sky-700 shadow-sm"
                            >
                                <ArrowLeft className="h-4 w-4" /> Kembali ke daftar aplikasi
                            </Link>

                            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
                                <div>
                                    <div className="mb-5 flex flex-wrap gap-2">
                                        {app.mode === "SSO" && <ModeBadge mode={app.mode} />}
                                        <AppFromBadge app_from={app.app_from} />
                                        <span className="rounded-full px-3 py-1 text-xs ring-1 font-bold bg-sky-50 text-sky-700 ring-sky-100">
                                            {app.type}
                                        </span>
                                        <span className="rounded-full px-3 py-1 text-xs ring-1 font-bold bg-sky-50 text-sky-700 ring-sky-100">
                                            {app.category}
                                        </span>
                                    </div>

                                    <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-slate-950">
                                        {app.name}
                                    </h1>

                                    <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                                        {app.desc}
                                    </p>
                                </div>

                                <div className="rounded-[2rem] border border-sky-100 bg-white/90 p-5 shadow-sm shadow-sky-100 backdrop-blur">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={classNames(
                                                "flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.7rem] shadow-xl",
                                                logoUrl ? "bg-white p-3" : `bg-gradient-to-br ${palette.bg}`,
                                            )}
                                        >
                                            {logoUrl ? (
                                                <img src={logoUrl} alt={app.name} className="h-full w-full object-contain" />
                                            ) : (
                                                <Icon className="h-10 w-10 text-white" />
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-sm font-bold text-slate-600">Status Akses</p>
                                            <p className="mt-1 text-2xl font-black text-slate">{app.mode}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100">
                                <h2 className="text-2xl font-black text-slate-900">Detail Layanan</h2>
                                <p className="mt-4 leading-8 text-slate-600">{app.detail}</p>

                                <div className="mt-8 grid gap-4 md:grid-cols-4">
                                    {[
                                        { label: "Urusan / OPD", value: app.category, icon: Grid3X3 },
                                        { label: "Tipe Portal", value: app.type, icon: Users },
                                        { label: "Akses", value: app.mode, icon: LockKeyhole },
                                        { label: "Asal Aplikasi", value: app.app_from, icon: Landmark },
                                    ].map((item) => (
                                        <div key={item.label} className="rounded-3xl bg-slate-50 p-5">
                                            <item.icon className="h-6 w-6 text-sky-700" />
                                            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                                                {item.label}
                                            </p>
                                            <p className="mt-1 text-sm font-black text-slate-900">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 rounded-[2rem] bg-gradient-to-br from-sky-50 to-cyan-50 p-6">
                                    <h3 className="text-xl font-black text-slate-900">Aksi Layanan</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Gunakan tombol berikut untuk membuka aplikasi. Jika aplikasi menggunakan SSO, pastikan akun sudah sesuai dengan hak akses layanan.
                                    </p>

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={openService}
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                                        >
                                            Buka Layanan
                                            <ArrowRight className="h-4 w-4" />
                                        </button>

                                        {app.url && (
                                            <a
                                                href={app.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-5 py-3 text-sm font-black text-sky-700 hover:bg-sky-50"
                                            >
                                                Buka di Tab Baru
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <aside className="space-y-5">
                                <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100">
                                    <h3 className="text-lg font-black text-slate-900">Informasi Integrasi</h3>

                                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                                        <p className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Halaman detail sudah menggunakan Inertia.
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Data berasal dari Laravel Service.
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Settings className="h-4 w-4 text-sky-600" /> Route bersih.
                                        </p>
                                    </div>
                                </div>

                                {related.length > 0 && (
                                    <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100">
                                        <h3 className="text-lg font-black text-slate-900">Layanan Terkait</h3>
                                        <div className="mt-4 grid gap-3">
                                            {related.map((item, index) => (
                                                <AppCard
                                                    key={item.slug}
                                                    app={item}
                                                    index={index}
                                                    compact
                                                    onOpen={() => router.visit(`/apps/${item.slug}`)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </aside>
                        </div>
                    </section>
                </PageShell>
            </PublicLayout>
        </>
    );
}
