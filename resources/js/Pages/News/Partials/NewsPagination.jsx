import { router } from "@inertiajs/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { classNames } from "../../../Utils/helpers";

export default function NewsPagination({ meta = {}, filter = {} }) {
    const currentPage = Number(meta?.current_page || 1);
    const lastPage = Number(meta?.last_page || 1);

    if (lastPage <= 1) return null;

    const goToPage = (page) => {
        if (page < 1 || page > lastPage) return;

        router.get(
            "/news",
            {
                search: filter?.search || undefined,
                tag: filter?.tag || undefined,
                page,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const pages = Array.from({ length: lastPage }, (_, index) => index + 1).filter(
        (page) => page === 1 || page === lastPage || Math.abs(page - currentPage) <= 1,
    );

    return (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row">
            <p className="text-sm font-bold text-slate-500">
                Halaman {currentPage} dari {lastPage} • {meta?.total || 0} berita
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-sky-50 hover:text-sky-700"
                >
                    <ArrowLeft className="h-4 w-4" /> Sebelumnya
                </button>

                {pages.map((page, index) => {
                    const previous = pages[index - 1];
                    const showDots = previous && page - previous > 1;

                    return (
                        <span key={page} className="inline-flex items-center gap-2">
                            {showDots && <span className="px-1 text-sm font-black text-slate-400">...</span>}
                            <button
                                type="button"
                                onClick={() => goToPage(page)}
                                className={classNames(
                                    "h-10 w-10 rounded-full text-sm font-black transition",
                                    page === currentPage
                                        ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                                        : "bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700",
                                )}
                            >
                                {page}
                            </button>
                        </span>
                    );
                })}

                <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= lastPage}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-sky-50 hover:text-sky-700"
                >
                    Berikutnya <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
