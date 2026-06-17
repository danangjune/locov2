import React from "react";
import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AppPagination({ meta = {}, filter = {} }) {
    const current = Number(meta?.current_page || 1);
    const last = Number(meta?.last_page || 1);

    if (last <= 1) return null;

    const goTo = (page) => {
        if (page < 1 || page > last || page === current) return;
        router.get(
            "/admin/apps",
            { ...filter, page },
            { preserveState: true, replace: true }
        );
    };

    const pages = Array.from({ length: last }, (_, index) => index + 1)
        .filter((page) => page === 1 || page === last || Math.abs(page - current) <= 2);

    return (
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-slate-500">
                Menampilkan {meta?.from || 0} - {meta?.to || 0} dari {meta?.total || 0} root aplikasi
            </p>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    disabled={current <= 1}
                    onClick={() => goTo(current - 1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {pages.map((page, index) => {
                    const previous = pages[index - 1];
                    const showDots = previous && page - previous > 1;

                    return (
                        <React.Fragment key={page}>
                            {showDots && (
                                <span className="px-2 text-sm font-black text-slate-300">...</span>
                            )}
                            <button
                                type="button"
                                onClick={() => goTo(page)}
                                className={`h-10 min-w-10 rounded-xl px-3 text-sm font-black ${
                                    current === page
                                        ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {page}
                            </button>
                        </React.Fragment>
                    );
                })}

                <button
                    type="button"
                    disabled={current >= last}
                    onClick={() => goTo(current + 1)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
