import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, ExternalLink, Newspaper } from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";

export default function Show({ meta = {}, data = {} }) {
    const news = data?.news || null;
    const related = Array.isArray(data?.related) ? data.related : [];
    const error = data?.errors?.news || "";

    if (!news) {
        return (
            <>
                <Head title={meta?.title || "Detail Berita"} />

                <PublicLayout currentRoute="news">
                    <PageShell>
                        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                            <Link
                                href="/news"
                                className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-black text-sky-700 hover:bg-sky-100"
                            >
                                <ArrowLeft className="h-4 w-4" /> Kembali ke berita
                            </Link>

                            <div className="rounded-[2rem] border border-amber-100 bg-amber-50 p-8 text-amber-800">
                                <h1 className="text-2xl font-black">Berita tidak ditemukan</h1>
                                <p className="mt-3 text-sm font-bold">{error || "Data berita tidak tersedia."}</p>
                            </div>
                        </div>
                    </PageShell>
                </PublicLayout>
            </>
        );
    }

    const contentItems = Array.isArray(news.content)
        ? news.content
        : [news.excerpt || "Informasi berita resmi Pemerintah Kota Kediri."];

    return (
        <>
            <Head title={meta?.title || news.title} />

            <PublicLayout currentRoute="news">
                <PageShell>
                    <section className="relative overflow-hidden bg-slate-950 text-white">
                        <img
                            src={news.image}
                            alt={news.title}
                            className="absolute inset-0 h-full w-full object-cover opacity-35"
                        />

                        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-sky-950/70" />

                        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
                            <Link
                                href="/news"
                                className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 me-5 text-sm font-black text-white backdrop-blur hover:bg-white/20"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke berita
                            </Link>

                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-black text-slate-950">
                                    <Newspaper className="h-3.5 w-3.5" /> {news.tag}
                                </span>

                                <h1 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
                                    {news.title}
                                </h1>
                                
                                <p className="mt-4 text-sm font-bold text-sky-100">
                                    {news.date}
                                </p>
                            </div>

                        </div>
                    </section>

                    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
                        <article className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-9">
                            <p className="text-xl font-semibold leading-9 text-slate-700">
                                {news.excerpt}
                            </p>

                            <div className="mt-8 space-y-6 text-base leading-8 text-slate-600">
                                {contentItems.map((paragraph, index) => (
                                    <p key={`${news.slug}-paragraph-${index}`}>{paragraph}</p>
                                ))}
                            </div>

                            {news.url && (
                                <button
                                    type="button"
                                    onClick={() => window.open(news.url, "_blank", "noopener,noreferrer")}
                                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700"
                                >
                                    Baca di Website Resmi Kota Kediri
                                    <ExternalLink className="h-4 w-4" />
                                </button>
                            )}
                        </article>

                        <aside className="h-fit rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100 lg:sticky lg:top-24">
                            <h3 className="text-lg font-black text-slate-900">
                                Berita Terkait
                            </h3>

                            <div className="mt-4 space-y-4">
                                {related.map((item) => (
                                    <button
                                        key={item.slug || item.id}
                                        type="button"
                                        onClick={() => router.visit(`/news/${item.slug}`)}
                                        className="flex gap-3 text-left"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-16 w-20 rounded-2xl object-cover"
                                        />

                                        <div>
                                            <p className="line-clamp-2 text-sm font-black text-slate-800 hover:text-sky-700">
                                                {item.title}
                                            </p>

                                            <p className="mt-1 text-xs font-bold text-slate-400">
                                                {item.date}
                                            </p>
                                        </div>
                                    </button>
                                ))}

                                {!related.length && (
                                    <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-500">
                                        Belum ada berita terkait.
                                    </p>
                                )}
                            </div>
                        </aside>
                    </section>
                </PageShell>
            </PublicLayout>
        </>
    );
}
