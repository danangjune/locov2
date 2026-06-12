import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Bell, Database, Info, ShieldCheck } from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";
import PageHero from "../../Components/UI/PageHero";
import { appPalettes } from "../../Data/staticData";
import { classNames } from "../../Utils/helpers";

const iconMap = {
    Bell,
    Database,
    ShieldCheck,
};

export default function Index({ meta = {}, data = {} }) {
    const items = Array.isArray(data?.items) ? data.items : [];
    const timeline = Array.isArray(data?.timeline) ? data.timeline : [];

    return (
        <>
            <Head title={meta?.title || "Info Layanan"} />

            <PublicLayout currentRoute="info">
                <PageShell>
                    <PageHero
                        eyebrow="Info Layanan"
                        title="Informasi Layanan PECUT"
                        subtitle="Halaman ini menampilkan pengumuman, status layanan, dan informasi penting terkait aplikasi pemerintah Kota Kediri."
                        icon={Info}
                    />

                    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid gap-5 md:grid-cols-3">
                            {items.map((item, index) => {
                                const Icon = iconMap[item.icon] || Info;
                                const palette = appPalettes[index % appPalettes.length];

                                return (
                                    <div key={item.title} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className={classNames("flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", palette.bg, palette.shadow)}>
                                                <Icon className="h-7 w-7" />
                                            </div>
                                            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">{item.status}</span>
                                        </div>
                                        <h3 className="mt-5 text-xl font-black text-slate-900">{item.title}</h3>
                                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-10 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-8">
                            <h2 className="text-2xl font-black text-slate-950">Timeline Informasi</h2>
                            <p className="mt-2 text-sm leading-7 text-slate-500">Ringkasan tahapan pengembangan dan informasi layanan PECUT.</p>

                            <div className="mt-7 space-y-0">
                                {timeline.map((item, index) => (
                                    <div key={item.title} className="relative grid gap-4 pb-8 pl-10 last:pb-0">
                                        {index !== timeline.length - 1 && <div className="absolute left-[11px] top-7 h-full w-px bg-slate-200" />}
                                        <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 ring-4 ring-sky-100">
                                            <div className="h-2 w-2 rounded-full bg-white" />
                                        </div>
                                        <div className="rounded-3xl bg-slate-50 p-5">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <h3 className="font-black text-slate-950">{item.title}</h3>
                                                <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-sky-700">{item.status}</span>
                                            </div>
                                            <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 rounded-[2rem] bg-slate-50 p-6 text-center">
                            <h3 className="text-xl font-black text-slate-900">Butuh layanan digital?</h3>
                            <p className="mt-2 text-sm text-slate-500">Lihat daftar aplikasi atau buka pusat bantuan untuk informasi lebih lanjut.</p>
                            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link href="/apps" className="rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700">Lihat Aplikasi</Link>
                                <Link href="/help" className="rounded-full border border-sky-200 bg-white px-5 py-3 text-sm font-black text-sky-700 hover:bg-sky-50">Pusat Bantuan</Link>
                            </div>
                        </div>
                    </section>
                </PageShell>
            </PublicLayout>
        </>
    );
}
