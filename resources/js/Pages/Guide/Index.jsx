import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Download, Eye, FileQuestion, FileText, HelpCircle, Layers3, Search } from "lucide-react";

import PublicLayout from "../../Layouts/PublicLayout";
import PageShell from "../../Components/UI/PageShell";
import PageHero from "../../Components/UI/PageHero";
import { appPalettes } from "../../Data/staticData";
import { classNames } from "../../Utils/helpers";

const iconMap = {
    Search,
    Layers3,
    Eye,
    HelpCircle,
};

export default function Index({ meta = {}, filter = {}, data = {} }) {
    const steps = Array.isArray(data?.steps) ? data.steps : [];
    const files = Array.isArray(data?.files?.items) ? data.files.items : [];

    const submitSearch = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        router.get("/guide", { search: formData.get("search") || "" }, { preserveScroll: true });
    };

    return (
        <>
            <Head title={meta?.title || "Panduan Pengguna"} />

            <PublicLayout currentRoute="guide">
                <PageShell>
                    <PageHero
                        eyebrow="Panduan"
                        title="Panduan Pengguna PECUT"
                        subtitle="Panduan singkat untuk masyarakat, ASN, dan admin dalam menggunakan portal satu pintu layanan digital Kota Kediri."
                        icon={FileQuestion}
                    />

                    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            {steps.map((item, index) => {
                                const Icon = iconMap[item.icon] || FileQuestion;
                                const palette = appPalettes[index % appPalettes.length];

                                return (
                                    <div key={item.title} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100">
                                        <div className={classNames("flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", palette.bg, palette.shadow)}>
                                            <Icon className="h-7 w-7" />
                                        </div>

                                        <h3 className="mt-5 text-xl font-black text-slate-900">{item.title}</h3>
                                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-10 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100 md:p-8">
                            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-600">Dokumen</p>
                                    <h2 className="mt-2 text-3xl font-black text-slate-950">File Panduan</h2>
                                    <p className="mt-2 text-sm leading-7 text-slate-500">Unduh dokumen panduan yang tersedia dari admin PECUT.</p>
                                </div>

                                <form onSubmit={submitSearch} className="flex w-full gap-2 md:w-[360px]">
                                    <input
                                        name="search"
                                        defaultValue={filter?.search || ""}
                                        placeholder="Cari file panduan..."
                                        className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                                    />
                                    <button type="submit" className="rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white hover:bg-sky-700">
                                        Cari
                                    </button>
                                </form>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {files.length ? (
                                    files.map((file) => (
                                        <a key={file.id} href={file.url} target="_blank" rel="noreferrer" className="group rounded-3xl border border-slate-100 bg-slate-50 p-5 transition hover:border-sky-200 hover:bg-sky-50">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-black text-slate-900 group-hover:text-sky-700">{file.name}</h3>
                                                    <p className="mt-1 text-sm leading-6 text-slate-500">{file.description}</p>
                                                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-sky-700">
                                                        <Download className="h-3.5 w-3.5" />
                                                        {file.type || "file"}
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <div className="rounded-3xl bg-slate-50 p-6 text-sm font-semibold text-slate-500 md:col-span-2 xl:col-span-3">
                                        Belum ada file panduan yang sesuai.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 rounded-[2rem] bg-slate-50 p-6 text-center">
                            <h3 className="text-xl font-black text-slate-900">Lanjut Jelajahi PECUT</h3>
                            <p className="mt-2 text-sm text-slate-500">Mulai dari daftar aplikasi atau hubungi pusat bantuan apabila membutuhkan informasi lebih lanjut.</p>

                            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link href="/apps" className="rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700">
                                    Lihat Aplikasi
                                </Link>
                                <Link href="/help" className="rounded-full border border-sky-200 bg-white px-5 py-3 text-sm font-black text-sky-700 hover:bg-sky-50">
                                    Pusat Bantuan
                                </Link>
                            </div>
                        </div>
                    </section>
                </PageShell>
            </PublicLayout>
        </>
    );
}
