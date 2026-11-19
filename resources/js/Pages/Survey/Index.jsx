import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    ClipboardCheck,
    ExternalLink,
    MessageSquareText,
    ShieldCheck,
    Sparkles,
    Star,
} from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import HomeSatisfaction from "../Home/Partials/HomeSatisfaction";

const defaultEmbedUrl =
    "https://surveidigital.spbe.go.id/embed/survey/eyJzdXJ2ZXlfaWQiOjIsInNlcnZpY2VfaWQiOjM5NSwiaG9zdCI6Imh0dHBzOi8vcGVjdXQua2VkaXJpa290YS5nby5pZCIsImtleSI6IllFbDBVWHRaIn0=/embed/view/?jenis_layanan=PECUT";

function InfoPoint({ icon: Icon, title, description }) {
    return (
        <div className="flex gap-3 rounded-3xl bg-white p-4 ring-1 ring-slate-100">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-600">
                <Icon className="h-5 w-5" />
            </span>
            <div>
                <h3 className="text-sm font-black text-slate-950">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
            </div>
        </div>
    );
}

function SurveyEmbed({ embedUrl }) {
    if (!embedUrl) {
        return (
            <div className="flex min-h-[420px] items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <div>
                    <ClipboardCheck className="mx-auto h-10 w-10 text-sky-500" />
                    <h3 className="mt-4 text-lg font-black text-slate-950">Embed survey belum tersedia</h3>
                    <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
                        Isi konfigurasi <span className="font-black text-slate-700">SURVEY_DIGITAL_EMBED_URL</span> di file .env,
                        lalu jalankan ulang cache config Laravel.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/60">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">Form Survey</p>
                    <h2 className="mt-1 text-lg font-black text-slate-950">Survey Kepuasan PECUT</h2>
                </div>
            </div>

            <div className="bg-slate-50 p-2 sm:p-3">
                <iframe
                    src={embedUrl}
                    title="Form Survey Kepuasan PECUT"
                    className="h-[720px] w-full rounded-[1.5rem] bg-white"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            </div>
        </div>
    );
}

export default function Index({ meta = {}, data = {} }) {
    const embedUrl = data?.embed_url || defaultEmbedUrl;
    const satisfaction = data?.satisfaction || null;

    return (
        <>
            <Head title={meta?.title || "Survey Kepuasan PECUT"} />

            <PublicLayout currentRoute="survey">
                <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">
                    <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
                    <div className="absolute -right-24 top-40 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />

                    <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
                        <Link
                            href="/"
                            className="mb-8 inline-flex items-center gap-2 text-sm font-black text-slate-500 transition hover:text-sky-600"
                        >
                            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
                        </Link>

                        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
                            <aside className="lg:sticky lg:top-24">
                                <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-black text-sky-700 shadow-sm">
                                    <Sparkles className="h-4 w-4" /> Survey Digital SPBE
                                </div>

                                <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                                    Bantu Kami Meningkatkan Layanan PECUT
                                </h1>

                                <p className="mt-4 text-base leading-8 text-slate-600">
                                    Isi survey kepuasan pengguna untuk membantu Pemerintah Kota Kediri meningkatkan kualitas layanan digital PECUT.
                                </p>

                                <div className="mt-7 grid gap-3">
                                    <InfoPoint
                                        icon={Star}
                                        title="Nilai pengalaman layanan"
                                        description="Berikan rating sesuai pengalaman Anda saat menggunakan PECUT."
                                    />
                                    <InfoPoint
                                        icon={MessageSquareText}
                                        title="Tambahkan komentar"
                                        description="Masukan Anda akan menjadi bahan evaluasi peningkatan layanan."
                                    />
                                    <InfoPoint
                                        icon={ShieldCheck}
                                        title="Terhubung ke Survey Digital SPBE"
                                        description="Form survey ditampilkan melalui embed resmi dari Survey Digital SPBE."
                                    />
                                </div>
                            </aside>

                            <SurveyEmbed embedUrl={embedUrl} />
                        </div>
                    </div>
                </section>

                <HomeSatisfaction satisfaction={satisfaction} />
            </PublicLayout>
        </>
    );
}
