import React from "react";
import { Link } from "@inertiajs/react";
import PublicLayout from "../../Layouts/PublicLayout";
import { ArrowLeft, FileText } from "lucide-react";

function SectionBlock({ section, index }) {
    const paragraphs = Array.isArray(section?.description) ? section.description : [];
    const reverse = index % 2 === 1;

    return (
        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100 md:p-7">
            <div className={["grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start", reverse ? "lg:[&>*:first-child]:order-2" : ""].join(" ")}>
                <div className="overflow-hidden rounded-[1.5rem] bg-slate-100">
                    {section?.image ? (
                        <img src={section.image} alt={section.title} className="h-72 w-full object-cover" loading="lazy" />
                    ) : (
                        <div className="grid h-72 place-items-center bg-gradient-to-br from-sky-50 to-slate-100 text-sky-600">
                            <FileText className="h-16 w-16" />
                        </div>
                    )}
                </div>

                <div>
                    {section?.subtitle ? (
                        <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-600">{section.subtitle}</p>
                    ) : null}
                    <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950 md:text-3xl">{section?.title}</h2>
                    <div className="mt-5 space-y-4 text-sm leading-8 text-slate-600 md:text-base">
                        {paragraphs.length ? (
                            paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)
                        ) : (
                            <p>Konten section belum tersedia.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function Show({ meta, data }) {
    const page = data?.page || {};
    const sections = Array.isArray(data?.sections) ? data.sections : [];

    return (
        <PublicLayout title={meta?.title || page?.title || "Halaman Portal"}>
            <div className="bg-slate-50">
                <section className="relative overflow-hidden bg-slate-950 text-white">
                    {page?.hero_image ? (
                        <img src={page.hero_image} alt={page.title} className="absolute inset-0 h-full w-full object-cover opacity-30" />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-sky-950/80" />
                    <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/15 hover:text-white">
                            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
                        </Link>
                        <div className="mt-10 max-w-3xl">
                            {page?.subtitle ? (
                                <p className="text-xs font-black uppercase tracking-[0.32em] text-sky-300">{page.subtitle}</p>
                            ) : null}
                            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{page?.title}</h1>
                            {page?.description ? (
                                <p className="mt-6 text-base leading-8 text-slate-300 md:text-lg">{page.description}</p>
                            ) : null}
                        </div>
                    </div>
                </section>

                <main className="mx-auto max-w-7xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
                    {sections.length ? (
                        sections.map((section, index) => <SectionBlock key={section.id || index} section={section} index={index} />)
                    ) : (
                        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
                            <p className="font-black text-slate-700">Konten belum tersedia.</p>
                        </div>
                    )}
                </main>
            </div>
        </PublicLayout>
    );
}
