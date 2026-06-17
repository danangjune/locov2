import React, { useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowRight,
    BookOpenText,
    Building2,
    ChevronRight,
    Compass,
    Landmark,
    MapPinned,
    Route,
    Sparkles,
    Waves,
} from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";

const fallbackStats = [
    { label: "Kecamatan", value: "3" },
    { label: "Kelurahan", value: "46" },
    { label: "Luas Wilayah", value: "67,2 km²" },
];

const fallbackSections = [
    {
        title: "Profil Wilayah Kota Kediri",
        subtitle: "Letak, posisi geografis, dan pembagian wilayah administratif Kota Kediri.",
        image: "/assets/img/kediri/harmoni.jpeg",
        description: [
            "Profil Wilayah — Kota Kediri merupakan salah satu pusat pelayanan, perdagangan, pendidikan, dan aktivitas masyarakat di wilayah Kediri Raya.",
            "Posisi Geografis — Kota Kediri memiliki posisi strategis dan menjadi bagian penting dari kawasan Kediri Raya.",
            "Luas Kota — Wilayah Kota Kediri terbagi dalam tiga kecamatan, yaitu Mojoroto, Kota, dan Pesantren.",
        ],
    },
    {
        title: "Sejarah Singkat Kota Kediri",
        subtitle: "Jejak panjang Kediri dari masa kerajaan, kolonial, hingga perkembangan kota otonom.",
        image: "/assets/img/kediri/gunung-klotok.jpg",
        description: [
            "Kediri memiliki sejarah panjang yang menjadi bagian penting dari identitas dan perkembangan wilayahnya.",
        ],
    },
    {
        title: "Kediri, KEDIRI NGANGENI",
        subtitle: "Penguatan pelayanan publik, investasi, dan kemudahan akses layanan masyarakat.",
        image: "/assets/img/kediri/taman-sekartaji.jpg",
        description: [
            "Kota Kediri terus memperkuat layanan publik yang mudah, cepat, responsif, dan terintegrasi.",
        ],
    },
];

const sectionIcons = [MapPinned, BookOpenText, Building2, Landmark, Sparkles];

function normalizeArray(value, fallback = []) {
    return Array.isArray(value) && value.length ? value : fallback;
}

function normalizeDescription(description) {
    if (Array.isArray(description)) {
        return description.filter(Boolean);
    }

    if (!description) {
        return [];
    }

    return [description];
}

function getSectionImage(section, index) {
    if (section?.image) {
        return section.image;
    }

    return fallbackSections[index % fallbackSections.length]?.image || null;
}

function getParagraphParts(text) {
    const value = String(text || "").trim();
    const separator = " — ";

    if (!value.includes(separator)) {
        return {
            label: null,
            body: value,
        };
    }

    const [label, ...body] = value.split(separator);

    return {
        label,
        body: body.join(separator),
    };
}

function StatCard({ item, index }) {
    const icons = [MapPinned, Building2, Compass];
    const Icon = icons[index % icons.length];

    return (
        <div className="group rounded-[1.5rem] border border-sky-100 bg-white p-5 shadow-sm shadow-sky-50 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-100">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 transition group-hover:bg-sky-600 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-3xl font-black tracking-tight text-slate-950">
                        {item.value}
                    </p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                        {item.label}
                    </p>
                </div>
            </div>
        </div>
    );
}

function NarrativeCard({ section, index }) {
    const Icon = sectionIcons[index % sectionIcons.length];
    const descriptions = normalizeDescription(section.description);
    const image = getSectionImage(section, index);
    const anchorId = `kediri-section-${index + 1}`;
    const imagePosition = index % 2 === 0 ? "md:float-left md:mr-8" : "md:float-right md:ml-8";

    return (
        <article
            id={anchorId}
            className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-100 transition hover:shadow-xl hover:shadow-sky-100/70"
        >
            <div className="relative p-5 md:p-8 lg:p-9">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-sky-50" />

                <div className="relative mb-6 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-100">
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-700">
                            Bagian {String(index + 1).padStart(2, "0")}
                        </p>
                        <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                            {section.title}
                        </h2>
                        {section.subtitle ? (
                            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">
                                {section.subtitle}
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="relative text-[15px] leading-8 text-slate-700 md:text-base md:leading-8">
                    {image ? (
                        <a
                            href={image}
                            target="_blank"
                            rel="noreferrer"
                            className={`group mb-5 block w-full overflow-hidden rounded-[1.5rem] border border-white bg-slate-100 shadow-xl shadow-slate-200/80 md:mb-4 md:w-[360px] lg:w-[410px] ${imagePosition}`}
                            title="Buka gambar"
                        >
                            <div className="relative h-56 md:h-72 lg:h-80">
                                <img
                                    src={image}
                                    alt={section.title}
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    loading="lazy"
                                    onError={(event) => {
                                        event.currentTarget.style.display = "none";
                                    }}
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/55 to-transparent p-4 text-white opacity-95">
                                    <p className="text-xs font-black uppercase tracking-[0.18em]">
                                        Kota Kediri
                                    </p>
                                    <p className="mt-1 line-clamp-1 text-sm font-bold">
                                        {section.title}
                                    </p>
                                </div>
                            </div>
                        </a>
                    ) : null}

                    <div className="space-y-4">
                        {descriptions.length ? (
                            descriptions.map((paragraph, paragraphIndex) => {
                                const parts = getParagraphParts(paragraph);

                                return (
                                    <p key={`${section.title}-${paragraphIndex}`}>
                                        {parts.label ? (
                                            <span className="mr-1 font-black text-sky-800">
                                                {parts.label} —
                                            </span>
                                        ) : null}
                                        {parts.body}
                                    </p>
                                );
                            })
                        ) : (
                            <p>Informasi belum tersedia.</p>
                        )}
                    </div>

                    <div className="clear-both" />
                </div>
            </div>
        </article>
    );
}

function TableOfContents({ sections }) {
    return (
        <aside className="lg:sticky lg:top-24">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                        <Route className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                            Daftar Isi
                        </p>
                        <p className="text-sm font-black text-slate-950">
                            Profil Kota
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    {sections.map((section, index) => (
                        <a
                            key={`${section.title}-${index}`}
                            href={`#kediri-section-${index + 1}`}
                            className="group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
                        >
                            <span className="line-clamp-2">{section.title}</span>
                            <ChevronRight className="h-4 w-4 shrink-0 opacity-50 transition group-hover:translate-x-1 group-hover:opacity-100" />
                        </a>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default function Index({ meta = {}, data = {} }) {
    const sections = useMemo(
        () => normalizeArray(data?.sections, fallbackSections),
        [data?.sections]
    );

    const stats = useMemo(
        () => normalizeArray(data?.stats, fallbackStats),
        [data?.stats]
    );

    const page = data?.page || {};
    const pageTitle = page?.title || meta?.title || "Selayang Pandang Kota Kediri";
    const pageSubtitle = page?.subtitle || "Kota Kediri dalam satu pandang";
    const pageDescription = page?.description || "Ringkasan profil Kota Kediri yang memuat wilayah, posisi geografis, luas kota, sejarah singkat, dan arah penguatan pelayanan publik sebagai KEDIRI NGANGENI.";

    const heroImage = page?.hero_image || getSectionImage(sections[0], 0);
    const secondaryImage = getSectionImage(sections[1], 1);
    const thirdImage = getSectionImage(sections[2], 2);

    return (
        <>
            <Head title={pageTitle} />

            <PublicLayout currentRoute="kediri">
                <PageShell>
                    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-amber-50">
                        <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" />
                        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-amber-200/70 blur-3xl" />
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent" />

                        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/85 px-4 py-2 text-sm font-black text-sky-700 shadow-sm backdrop-blur">
                                    <MapPinned className="h-4 w-4" />
                                    {pageSubtitle}
                                </div>

                                <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl md:leading-[1.05]">
                                    {pageTitle}
                                </h1>

                                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                                    {pageDescription}
                                </p>

                                <div className="mt-7 flex flex-wrap gap-3">
                                    <a
                                        href="#profil-kota-kediri"
                                        className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700"
                                    >
                                        Baca Profil Kota
                                        <ArrowRight className="h-4 w-4" />
                                    </a>

                                    <Link
                                        href="/apps"
                                        className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-6 py-3 text-sm font-black text-sky-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-50"
                                    >
                                        Layanan Digital
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="rounded-[2rem] border border-white/80 bg-white/80 p-4 shadow-2xl shadow-sky-100 backdrop-blur">
                                    <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
                                        <div className="relative h-72 overflow-hidden rounded-[1.5rem] bg-slate-100 sm:h-80">
                                            {heroImage ? (
                                                <img
                                                    src={heroImage}
                                                    alt="Kota Kediri"
                                                    className="h-full w-full object-cover"
                                                    onError={(event) => {
                                                        event.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : null}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/40 p-4 backdrop-blur">
                                                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">
                                                    KEDIRI NGANGENI
                                                </p>
                                                <p className="mt-1 text-XS font-black text-slate-950">
                                                    {pageSubtitle}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid gap-3">
                                            {[secondaryImage, thirdImage].map((image, index) => (
                                                <div
                                                    key={`hero-side-${index}`}
                                                    className="relative h-[9.5rem] overflow-hidden rounded-[1.5rem] bg-slate-100 sm:h-full"
                                                >
                                                    {image ? (
                                                        <img
                                                            src={image}
                                                            alt={`Kota Kediri ${index + 2}`}
                                                            className="h-full w-full object-cover"
                                                            onError={(event) => {
                                                                event.currentTarget.style.display = "none";
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="relative mx-auto -mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-4 md:grid-cols-3">
                            {stats.map((item, index) => (
                                <StatCard key={`${item.label}-${index}`} item={item} index={index} />
                            ))}
                        </div>
                    </section>

                    <section id="profil-kota-kediri" className="bg-slate-50/80 py-12 md:py-16">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <div className="max-w-3xl">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-black text-sky-700">
                                        <Landmark className="h-4 w-4" />
                                        Profil Kota
                                    </div>
                                    <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
                                        Mengenal Kediri dari wilayah, sejarah, dan pelayanan
                                    </h2>
                                    <p className="mt-4 text-base leading-8 text-slate-600">
                                        Konten disusun menjadi tiga bagian utama agar seluruh narasi tetap lengkap, mudah dibaca, dan tidak terlalu penuh gambar.
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-slate-100 bg-white px-5 py-4 text-sm font-extrabold text-slate-600 shadow-sm shadow-slate-100">
                                    {sections.length} Bagian Utama
                                </div>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
                                <TableOfContents sections={sections} />

                                <div className="space-y-6">
                                    {sections.map((section, index) => (
                                        <NarrativeCard
                                            key={`${section.title}-${index}`}
                                            section={section}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-500 p-7 text-white shadow-2xl shadow-sky-200 md:p-9">
                            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
                            <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />

                            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                                <div className="max-w-3xl">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur">
                                        <Waves className="h-4 w-4" />
                                        PECUT Portal Layanan
                                    </div>
                                    <h2 className="mt-5 text-3xl font-black tracking-tight md:text-4xl">
                                        Layanan digital Kota Kediri dalam satu portal
                                    </h2>
                                    <p className="mt-4 text-sm leading-7 text-sky-50 md:text-base md:leading-8">
                                        Setelah mengenal profil Kota Kediri, masyarakat dapat menjelajahi aplikasi layanan Pemerintah Kota Kediri melalui portal PECUT.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href="/apps"
                                        className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-sky-700 shadow-lg shadow-sky-900/10 transition hover:-translate-y-0.5 hover:bg-sky-50"
                                    >
                                        Buka Daftar Aplikasi
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                    <Link
                                        href="/help"
                                        className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                                    >
                                        Pusat Bantuan
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </PageShell>
            </PublicLayout>
        </>
    );
}
