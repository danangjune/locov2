import React from "react";
import { Head, Link } from "@inertiajs/react";
import { AlertTriangle, ArrowLeft, Home, Search } from "lucide-react";

import PublicLayout from "../Layouts/PublicLayout";
import PageShell from "../Components/UI/PageShell";

const messages = {
    503: {
        title: "Layanan Sedang Pemeliharaan",
        description: "PECUT sedang dalam proses pemeliharaan. Silakan coba beberapa saat lagi.",
    },
    500: {
        title: "Terjadi Kesalahan Server",
        description: "Ada kendala pada server. Tim pengelola dapat mengecek log aplikasi untuk detailnya.",
    },
    404: {
        title: "Halaman Tidak Ditemukan",
        description: "Halaman yang kamu tuju tidak tersedia atau sudah dipindahkan ke alamat baru.",
    },
    403: {
        title: "Akses Tidak Diizinkan",
        description: "Kamu tidak memiliki hak akses untuk membuka halaman ini.",
    },
};

export default function Error({ status = 404 }) {
    const content = messages[status] || messages[500];

    return (
        <>
            <Head title={`${status} - ${content.title}`} />

            <PublicLayout route="error">
                <PageShell>
                    <section className="relative overflow-hidden py-16 lg:py-24">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.16),transparent_30%)]" />

                        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white/90 p-8 text-center shadow-2xl shadow-slate-200/70 backdrop-blur lg:p-12">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                                <AlertTriangle className="h-10 w-10" />
                            </div>

                            <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-600">
                                Error {status}
                            </p>

                            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 lg:text-5xl">
                                {content.title}
                            </h1>

                            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
                                {content.description}
                            </p>

                            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Kembali
                                </button>

                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-sky-100 transition hover:bg-sky-700"
                                >
                                    <Home className="h-4 w-4" />
                                    Ke Beranda
                                </Link>

                                <Link
                                    href="/apps"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white shadow-xl shadow-slate-200 transition hover:bg-slate-800"
                                >
                                    <Search className="h-4 w-4" />
                                    Cari Aplikasi
                                </Link>
                            </div>
                        </div>
                    </section>
                </PageShell>
            </PublicLayout>
        </>
    );
}
