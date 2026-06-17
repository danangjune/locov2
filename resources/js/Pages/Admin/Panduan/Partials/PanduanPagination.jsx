import React from "react";
import { Link } from "@inertiajs/react";

export default function PanduanPagination({ meta = {} }) {
    const links = Array.isArray(meta?.links) ? meta.links : [];

    if (!links.length || Number(meta?.last_page || 1) <= 1) return null;

    return (
        <div className="flex flex-col gap-4 rounded-3xl border border-white bg-white p-5 shadow-sm shadow-slate-200 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-slate-500">
                Menampilkan {meta.from || 0} - {meta.to || 0} dari {meta.total || 0} file panduan
            </p>

            <div className="flex flex-wrap gap-2">
                {links.map((link, index) => {
                    const label = String(link.label || "")
                        .replace("&laquo; Previous", "‹")
                        .replace("Next &raquo;", "›");

                    if (!link.url) {
                        return (
                            <span key={index} className="grid h-10 min-w-10 place-items-center rounded-xl bg-slate-100 px-3 text-sm font-black text-slate-400">
                                {label}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`grid h-10 min-w-10 place-items-center rounded-xl px-3 text-sm font-black ${link.active ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
