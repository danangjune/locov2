import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ComplaintPagination({ meta = {}, filter = {} }) {
    const currentPage = Number(meta?.current_page || 1);
    const lastPage = Number(meta?.last_page || 1);

    if (lastPage <= 1) return null;

    const goToPage = (page) => {
        router.get(
            "/complaints",
            {
                search: filter?.search || undefined,
                status: filter?.status || undefined,
                page,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <div className="mt-10 flex flex-col gap-4 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-100 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-slate-500">
                Menampilkan {meta?.from || 0} - {meta?.to || 0} dari {meta?.total || 0} aduan
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" /> Sebelumnya
                </button>

                <span className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
                    {currentPage} / {lastPage}
                </span>

                <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= lastPage}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Berikutnya <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
