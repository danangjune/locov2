import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowRight,
    Building2,
    CheckCircle2,
    ChevronDown,
    FileText,
    HelpCircle,
    Info,
    Layers3,
    Search,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";

const pageConfig = {
    help: {
        currentRoute: "help",
        eyebrow: "Bantuan",
        fallbackTitle: "Pusat Bantuan PECUT",
        icon: HelpCircle,
        gradient: "from-sky-600 to-blue-700",
        accent: "text-sky-700",
        soft: "bg-sky-50 text-sky-700",
    },
    info: {
        currentRoute: "info",
        eyebrow: "Info Layanan",
        fallbackTitle: "Info Layanan PECUT",
        icon: Info,
        gradient: "from-cyan-600 to-sky-700",
        accent: "text-cyan-700",
        soft: "bg-cyan-50 text-cyan-700",
    },
    about: {
        currentRoute: "about",
        eyebrow: "Tentang PECUT",
        fallbackTitle: "Tentang PECUT",
        icon: Building2,
        gradient: "from-blue-600 to-sky-700",
        accent: "text-blue-700",
        soft: "bg-blue-50 text-blue-700",
    },
    "privasi-data": {
        currentRoute: "privacy",
        eyebrow: "Privasi Data",
        fallbackTitle: "Privasi Data",
        icon: ShieldCheck,
        gradient: "from-emerald-600 to-teal-700",
        accent: "text-emerald-700",
        soft: "bg-emerald-50 text-emerald-700",
    },
    "syarat-ketentuan": {
        currentRoute: "terms",
        eyebrow: "Syarat & Ketentuan",
        fallbackTitle: "Syarat & Ketentuan",
        icon: FileText,
        gradient: "from-slate-700 to-slate-950",
        accent: "text-slate-700",
        soft: "bg-slate-100 text-slate-700",
    },
};

const quickLinks = [
    {
        label: "Cari Aplikasi",
        description: "Temukan layanan digital yang tersedia di portal PECUT.",
        href: "/apps",
        icon: Search,
    },
    {
        label: "Panduan Pengguna",
        description: "Lihat file panduan dan cara penggunaan portal.",
        href: "/guide",
        icon: Layers3,
    },
    {
        label: "Info Layanan",
        description: "Lihat informasi umum layanan digital Kota Kediri.",
        href: "/info",
        icon: Info,
    },
];

function getConfig(slug = "") {
    return pageConfig[slug] || {
        currentRoute: slug || "page",
        eyebrow: "Halaman Portal",
        fallbackTitle: "Halaman Portal",
        icon: FileText,
        gradient: "from-sky-600 to-blue-700",
        accent: "text-sky-700",
        soft: "bg-sky-50 text-sky-700",
    };
}

function getParagraphs(section) {
    if (Array.isArray(section?.description)) return section.description.filter(Boolean);
    if (typeof section?.description === "string" && section.description.trim()) return [section.description];
    return [];
}

function StaticHero({ page, config }) {
    const Icon = config.icon || FileText;
    const title = page?.title || config.fallbackTitle;
    const description = page?.description || "Informasi layanan digital Pemerintah Kota Kediri.";

    return (
        <section className="relative overflow-hidden border-b border-sky-100 bg-gradient-to-br from-sky-50 via-white to-amber-50">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="absolute -bottom-28 left-10 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
                <div className="max-w-3xl">
                    <div className="inline-flex rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-sm font-black text-sky-700 shadow-sm">
                        {config.eyebrow || page?.subtitle || "Halaman Portal"}
                    </div>

                    <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                        {title}
                    </h1>

                    {page?.subtitle ? (
                        <p className="mt-3 text-sm font-black uppercase tracking-[0.24em] text-sky-600">
                            {page.subtitle}
                        </p>
                    ) : null}

                    <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                        {description}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/apps"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700"
                        >
                            Lihat Aplikasi <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/guide"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-white px-5 py-3 text-sm font-black text-sky-700 transition hover:bg-sky-50"
                        >
                            Panduan Pengguna
                        </Link>
                    </div>
                </div>

                <div className="relative hidden lg:block">
                    {page?.hero_image ? (
                        <div className="relative mx-auto max-w-md">
                            <div className="absolute inset-x-10 bottom-2 h-20 rounded-full bg-sky-900/20 blur-3xl" />
                            <img
                                src={page.hero_image}
                                alt={title}
                                className="relative max-h-[360px] w-full object-contain drop-shadow-2xl"
                                loading="eager"
                            />
                        </div>
                    ) : (
                        <div className="mx-auto grid h-56 w-56 place-items-center rounded-[2.5rem] bg-white/80 shadow-2xl shadow-sky-100 ring-1 ring-sky-100">
                            <div className={`grid h-32 w-32 place-items-center rounded-[2rem] bg-gradient-to-br ${config.gradient} text-white shadow-2xl`}>
                                <Icon className="h-16 w-16" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function EmptyState() {
    return (
        <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm shadow-slate-100">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-400">
                <FileText className="h-7 w-7" />
            </div>
            <p className="mt-4 font-black text-slate-700">Konten belum tersedia.</p>
            <p className="mt-2 text-sm text-slate-500">Silakan tambahkan section dari halaman admin.</p>
        </div>
    );
}

function HelpPageContent({ sections, config }) {
    return (
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_390px] lg:px-8">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-8">
                <div className="flex items-start gap-4">
                    <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${config.soft}`}>
                        <HelpCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-950">Pertanyaan & Bantuan</h2>
                        <p className="mt-2 text-sm leading-7 text-slate-500">
                            Buka setiap bagian untuk melihat panduan dan penjelasan bantuan pengguna.
                        </p>
                    </div>
                </div>

                <div className="mt-7 space-y-4">
                    {sections.map((section, index) => {
                        const paragraphs = getParagraphs(section);

                        return (
                            <details
                                key={section.id || index}
                                open={index === 0}
                                className="group rounded-3xl border border-slate-100 bg-slate-50 p-5 transition open:bg-white open:shadow-sm open:shadow-slate-100"
                            >
                                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                                    <div>
                                        <h3 className="mt-1 text-base font-black text-slate-950 md:text-md">
                                            {section?.title || "Bantuan"}
                                        </h3>
                                        {section?.subtitle ? (
                                            <p className="mt-1 text-xs tracking-[0.22em] text-slate-400">
                                                {section.subtitle}
                                            </p>
                                        ) : null}
                                    </div>
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-slate-500 shadow-sm transition group-open:rotate-180 group-open:text-sky-600">
                                        <ChevronDown className="h-4 w-4" />
                                    </span>
                                </summary>

                                <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
                                    <div className="space-y-3 text-sm leading-8 text-slate-600 md:text-base">
                                        {paragraphs.length ? (
                                            paragraphs.map((paragraph, paragraphIndex) => (
                                                <p key={paragraphIndex}>{paragraph}</p>
                                            ))
                                        ) : (
                                            <p>Konten bantuan belum tersedia.</p>
                                        )}
                                    </div>

                                    {section?.image ? (
                                        <img
                                            src={section.image}
                                            alt={section?.title || "Bantuan"}
                                            className="max-h-44 w-full rounded-3xl object-contain drop-shadow-xl lg:w-56"
                                            loading="lazy"
                                        />
                                    ) : null}
                                </div>
                            </details>
                        );
                    })}
                </div>
            </div>

            <aside className="space-y-6">
                <div className="rounded-[2rem] bg-gradient-to-br from-cyan-600 to-sky-700 p-6 text-white shadow-xl shadow-sky-100 md:p-8">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-amber-200 backdrop-blur">
                        <Sparkles className="h-7 w-7" />
                    </div>
                    <h2 className="mt-5 text-2xl font-black">Butuh bantuan cepat?</h2>
                    <p className="mt-3 text-sm leading-7 text-sky-50">
                        Gunakan akses cepat untuk mencari aplikasi, membaca panduan, atau melihat informasi layanan.
                    </p>

                    <div className="mt-6 grid gap-3">
                        {quickLinks.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group rounded-3xl bg-white/15 p-4 backdrop-blur transition hover:bg-white/20"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-sky-700">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <span>
                                            <span className="block text-sm font-black text-white">{item.label}</span>
                                            <span className="mt-1 block text-xs leading-5 text-sky-50/90">
                                                {item.description}
                                            </span>
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </aside>
        </section>
    );
}

function InfoPageContent({ sections, config }) {
    const firstItems = sections.slice(0, 3);
    const timelineItems = sections.slice(3);
    const timeline = timelineItems.length ? timelineItems : sections;

    return (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mt-10 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-8">
                <h2 className="text-2xl font-black text-slate-950">Detail Informasi Layanan</h2>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                    Ringkasan informasi dan penjelasan layanan digital yang dikelola melalui PECUT.
                </p>

                <div className="mt-8 space-y-0">
                    {timeline.map((section, index) => {
                        const paragraphs = getParagraphs(section);

                        return (
                            <div key={section.id || index} className="relative grid gap-4 pb-8 pl-10 last:pb-0">
                                {index !== timeline.length - 1 ? (
                                    <div className="absolute left-[11px] top-7 h-full w-px bg-slate-200" />
                                ) : null}
                                <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 ring-4 ring-sky-100">
                                    <div className="h-2 w-2 rounded-full bg-white" />
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-5">
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <h3 className="font-black text-slate-950">{section?.title || "Informasi"}</h3>
                                        {section?.subtitle ? (
                                            <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-sky-700">
                                                {section.subtitle}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                                        {paragraphs.length ? paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>) : <p>Konten belum tersedia.</p>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ArticlePageContent({ sections, config }) {
    return (
        <main className="mx-auto max-w-7xl space-y-7 px-4 py-12 sm:px-6 lg:px-8">
            {sections.map((section, index) => {
                const paragraphs = getParagraphs(section);
                const reverse = index % 2 === 1;

                return (
                    <section key={section.id || index} className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm shadow-slate-100">
                        <div className={["grid gap-0 lg:grid-cols-[0.9fr_1.1fr]", reverse ? "lg:[&>*:first-child]:order-2" : ""].join(" ")}>
                            <div className="bg-gradient-to-br from-slate-50 to-sky-50 p-6 lg:p-8">
                                {section?.image ? (
                                    <img
                                        src={section.image}
                                        alt={section?.title || "Section"}
                                        className="h-72 w-full rounded-[1.5rem] object-contain drop-shadow-xl"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="grid h-72 place-items-center rounded-[1.5rem] bg-white text-sky-600 shadow-sm shadow-slate-100">
                                        <FileText className="h-16 w-16" />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 md:p-8 lg:p-10">
                                {section?.subtitle ? (
                                    <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-600">{section.subtitle}</p>
                                ) : null}
                                <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950 md:text-3xl">
                                    {section?.title || "Section"}
                                </h2>
                                <div className="mt-5 space-y-4 text-sm leading-8 text-slate-600 md:text-base">
                                    {paragraphs.length ? paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>) : <p>Konten section belum tersedia.</p>}
                                </div>
                            </div>
                        </div>
                    </section>
                );
            })}
        </main>
    );
}

export default function Show({ meta = {}, data = {} }) {
    const page = data?.page || {};
    const slug = page?.slug || "";
    const sections = Array.isArray(data?.sections) ? data.sections : [];
    const config = getConfig(slug);
    const title = meta?.title || page?.title || config.fallbackTitle;

    return (
        <>
            <Head title={title} />

            <PublicLayout currentRoute={config.currentRoute} withFloatingHelp={slug !== "help"}>
                <PageShell>
                    <StaticHero page={page} config={config} />

                    <div className="bg-slate-50">
                        {!sections.length ? <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><EmptyState /></main> : null}

                        {sections.length && slug === "help" ? <HelpPageContent sections={sections} config={config} /> : null}
                        {sections.length && slug === "info" ? <InfoPageContent sections={sections} config={config} /> : null}
                        {sections.length && slug !== "help" && slug !== "info" ? <ArticlePageContent sections={sections} config={config} /> : null}
                    </div>
                </PageShell>
            </PublicLayout>
        </>
    );
}
