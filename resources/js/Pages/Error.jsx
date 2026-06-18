import React from "react";
import { Link, Head } from "@inertiajs/react";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

const titles = {
    503: "Layanan Sedang Pemeliharaan",
    500: "Terjadi Kesalahan Server",
    404: "Halaman Tidak Ditemukan",
    403: "Akses Tidak Diizinkan",
    419: "Sesi Telah Berakhir",
};

const descriptions = {
    503: "Sistem sedang dalam pemeliharaan. Silakan coba beberapa saat lagi.",
    500: "Terjadi kendala pada server. Tim teknis dapat memeriksa log aplikasi untuk detailnya.",
    404: "Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.",
    403: "Anda tidak memiliki hak akses untuk membuka halaman ini.",
    419: "Sesi Anda telah berakhir. Silakan muat ulang halaman atau masuk kembali.",
};

export default function Error({ status }) {
    const code = status || 500;
    const title = titles[code] || "Terjadi Kesalahan";
    const description = descriptions[code] || "Terjadi kendala saat membuka halaman ini.";

    return (
        <>
            <Head title={`${code} - ${title}`} />

            <main className="min-h-screen bg-slate-950 text-white">
                <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
                    <div className="grid h-20 w-20 place-items-center rounded-[2rem] bg-rose-500/10 text-rose-300 ring-1 ring-rose-300/20">
                        <AlertTriangle className="h-9 w-9" />
                    </div>

                    <p className="mt-8 text-sm font-black uppercase tracking-[0.4em] text-sky-300">
                        Error {code}
                    </p>

                    <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                        {title}
                    </h1>

                    <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
                        {description}
                    </p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
                        >
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </button>

                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-sky-950/30 transition hover:bg-sky-400"
                        >
                            <Home className="h-4 w-4" /> Ke Beranda
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
